import React, { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { NavBar } from "../../shared/components/NavBar";
import { SubmissionService } from "../../features/Submission";
import websocket from "../../core/lib/WebSocket";
import './MonacoEditor.css';

type Language = "javascript" | "python" | "cpp";
type InputSize = "n=10" | "100" | "1K" | "10K" | "100K" | "1M";

const inputSizeValues: Record<InputSize, number> = {
  "n=10": 10,
  "100": 100,
  "1K": 1_000,
  "10K": 10_000,
  "100K": 100_000,
  "1M": 1_000_000,
};

export const MonacoEditorPage: React.FC = () => {
  const submissionService = SubmissionService.getInstance();
  // const navigate = useNavigate();

  // Code state (initialized from localStorage)
  const [code, setCode] = useState<string>(() => {
    return localStorage.getItem("codeperf_code") || "#include <iostream>\n\nint main() {\n    return 0;\n}";
  });
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem("codeperf_language") as Language) || "cpp";
  });
  const [inputSize, setInputSize] = useState<InputSize>(() => {
    return (localStorage.getItem("codeperf_inputSize") as InputSize) || "n=10";
  });

  // WebSocket / Job state orchestration (initialized from localStorage)
  const [activeSubmissionId, setActiveSubmissionId] = useState<string | null>(() => {
    return localStorage.getItem("codeperf_activeSubmissionId") || null;
  });
  const [status, setStatus] = useState<"idle" | "processing" | "completed" | "failed">(() => {
    return (localStorage.getItem("codeperf_status") as any) || "idle";
  });
  const [progress, setProgress] = useState<number>(() => {
    const val = localStorage.getItem("codeperf_progress");
    return val ? parseInt(val, 10) : 0;
  });
  const [benchmark, setBenchmark] = useState<any>(() => {
    const data = localStorage.getItem("codeperf_benchmark");
    return data ? JSON.parse(data) : null;
  });

  const activeSubmissionIdRef = useRef<string | null>(
    localStorage.getItem("codeperf_activeSubmissionId") || null
  );
  const fallbackTimerRef = useRef<number | null>(null);

  const snippets = {
    javascript: `console.log("Hello");`,
    python: `print("Hello")`,
    cpp: `#include <iostream>\n\nint main() {\n    std::cout << "Hello";\n    return 0;\n}`,
  };

  function changeLanguage(lang: Language) {
    setLanguage(lang);
    setCode(snippets[lang]);
  }

  // Sync state changes to localStorage
  useEffect(() => {
    localStorage.setItem("codeperf_code", code);
  }, [code]);

  useEffect(() => {
    localStorage.setItem("codeperf_language", language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem("codeperf_inputSize", inputSize);
  }, [inputSize]);

  useEffect(() => {
    activeSubmissionIdRef.current = activeSubmissionId;
    if (activeSubmissionId) {
      localStorage.setItem("codeperf_activeSubmissionId", activeSubmissionId);
    } else {
      localStorage.removeItem("codeperf_activeSubmissionId");
    }
  }, [activeSubmissionId]);

  useEffect(() => {
    localStorage.setItem("codeperf_status", status);
  }, [status]);

  useEffect(() => {
    localStorage.setItem("codeperf_progress", String(progress));
  }, [progress]);

  useEffect(() => {
    if (benchmark) {
      localStorage.setItem("codeperf_benchmark", JSON.stringify(benchmark));
    } else {
      localStorage.removeItem("codeperf_benchmark");
    }
  }, [benchmark]);

  const pollForBenchmark = async (submissionId: string, attempt = 0) => {
    if (activeSubmissionIdRef.current !== submissionId) {
      return;
    }

    try {
      const result: any = await submissionService.getBenchmark(submissionId);
      const submissionData = result?.data;

      if (submissionData?.benchmarks?.length) {
        setBenchmark(submissionData);
        setStatus("completed");
        setProgress(100);
        return;
      }
    } catch (error) {
      console.error("Failed to fetch benchmark data:", error);
    }

    if (attempt < 8) {
      fallbackTimerRef.current = window.setTimeout(() => {
        void pollForBenchmark(submissionId, attempt + 1);
      }, 2000);
    } else {
      setStatus("failed");
    }
  };

  // Handle active execution streams cleanly
  useEffect(() => {
    websocket.connect();

    const savedSubmissionId = localStorage.getItem("codeperf_activeSubmissionId");
    const savedStatus = localStorage.getItem("codeperf_status");

    // Resume WebSocket subscription and polling loop if we refreshed during active execution
    if (savedSubmissionId && savedStatus === "processing") {
      websocket.subscribe(savedSubmissionId);
      void pollForBenchmark(savedSubmissionId);
    }

    websocket.onMessage((message: { type: string; submissionId?: string; progress?: number; error?: string; detectedComplexity?: string; confidence?: number }) => {
      console.log("[WS Frame Incoming]:", message);

      const currentSubmissionId = activeSubmissionIdRef.current;

      // Verify that this frame belongs to the currently executing code submission
      if (!message.submissionId || message.submissionId !== currentSubmissionId) {
        return;
      }

      switch (message.type) {
        case "subscribed":
          setStatus("processing");
          break;

        case "progress":
          setProgress(message.progress || 0);
          break;

        case "completed":
        case "already_completed":
          setBenchmark((prev: any) => ({
            ...prev,
            ...message,
            benchmarks: prev?.benchmarks || []
          }));
          setStatus("completed");
          setProgress(100);
          break;

        case "failed":
          setStatus("failed");
          console.error(message.error);
          break;
      }
    });

    return () => {
      if (fallbackTimerRef.current) {
        window.clearTimeout(fallbackTimerRef.current);
      }
      websocket.disconnect();
    };
  }, []);

  const benchmarkEntries = Array.isArray(benchmark?.benchmarks) ? benchmark.benchmarks : [];
  const currentBenchmark = benchmarkEntries.find(
    (b: any) => b.inputSize === inputSizeValues[inputSize]
  ) || benchmarkEntries[0];

  const handleSubmit = async () => {
    try {
      setStatus("processing");
      setProgress(0);
      setBenchmark(null);

      // Send execution context along with the chosen input size variations
      const response: any = await submissionService.createSubmission({
        code,
        language,
        inputSize: inputSizeValues[inputSize],
      });

      const id = response.data.id;
      activeSubmissionIdRef.current = id;
      setActiveSubmissionId(id);

      // Notify WebSocket server to stream updates for this ID
      websocket.subscribe(id);

      void pollForBenchmark(id);

    } catch (error) {
      setStatus("failed");
      console.error(error);
    }
  };

  return (
    <div className="editor-page">
      <NavBar />

      <div className="dashboard-layout">

        {/* LEFT COLUMN: IDE & Configuration Controls */}
        <main className="main-editor-pane">

          {/* Language Selector Header Tabs */}
          <div className="language-tabs">
            <button
              className={`tab-btn ${language === "javascript" ? "active" : ""}`}
              onClick={() => changeLanguage("javascript")}
            >
              JS JavaScript
            </button>
            <button
              className={`tab-btn ${language === "cpp" ? "active" : ""}`}
              onClick={() => changeLanguage("cpp")}
            >
              C++ C++
            </button>
            <button
              className={`tab-btn ${language === "python" ? "active" : ""}`}
              onClick={() => changeLanguage("python")}
            >
              🐍 Python
            </button>
          </div>

          {/* Core Monaco Viewport Wrapper */}
          <div className="editor-wrapper">
            <Editor
              height="100%"
              language={language === "cpp" ? "cpp" : language}
              theme="vs-dark"
              value={code}
              options={{
                minimap: { enabled: true },
                fontSize: 14,
                automaticLayout: true,
              }}
              onChange={(value) => setCode(value ?? "")}
            />
          </div>

          {/* Lower Tray Configuration: Inputs and Submit Trigger */}
          <div className="editor-footer-tray">
            <div className="input-size-selector">
              <span className="label-text">Input-size:</span>
              {(["n=10", "100", "1K", "10K", "100K", "1M"] as InputSize[]).map((size) => (
                <button
                  key={size}
                  className={`size-btn ${inputSize === size ? "active" : ""}`}
                  onClick={() => setInputSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>

            <button
              className="run-benchmark-btn"
              onClick={handleSubmit}
              disabled={status === "processing"}
            >
              {status === "processing" ? `Running (${progress}%)` : "▶ Run Benchmark"}
            </button>
          </div>
        </main>

        {/* RIGHT COLUMN: Asynchronous Benchmark Telemetry */}
        <aside className="benchmark-sidebar">
          <div className="sidebar-header">
            <h3>Current Analysis</h3>
            <button className="collapse-toggle-btn">▲</button>
          </div>

          <div className="card-body">
            <div className="current-function-card">
              <h4>Current Analysis</h4>

              {status === "idle" && (
                <p className="placeholder-text">Submit code to evaluate computational profile metrics.</p>
              )}

              {status === "processing" && (
                <div className="loading-state">
                  <div className="spinner"></div>
                  <p>Processing batch updates through telemetry queue...</p>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                  </div>
                </div>
              )}

              {status === "completed" && benchmark && (
                <div className="metric-results-view">
                  <div className="timestamp-row">{new Date().toLocaleString()}</div>
                  <div className="stat-entry">
                    <span className="stat-label">Complexity:</span>
                    <span className="stat-value highlight">{benchmark.detectedComplexity || "O(N)"}</span>
                  </div>
                  <div className="stat-entry">
                    <span className="stat-label">Confidence:</span>
                    <span className="stat-value">{((benchmark.confidence ?? 1) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="stat-entry">
                    <span className="stat-label">Selected Input Size:</span>
                    <span className="stat-value">{inputSize}</span>
                  </div>

                  {currentBenchmark ? (
                    <>
                      <div className="stat-entry">
                        <span className="stat-label">Time:</span>
                        <span className="stat-value">{currentBenchmark.executionTimeMs} ms</span>
                      </div>
                      <div className="stat-entry">
                        <span className="stat-label">Memory:</span>
                        <span className="stat-value">{currentBenchmark.memoryUsedKb} KB</span>
                      </div>
                    </>
                  ) : (
                    <div className="stat-entry">
                      <span className="stat-label">Metrics:</span>
                      <span className="stat-value">No metrics returned yet.</span>
                    </div>
                  )}

                </div>
              )}

              {status === "failed" && (
                <p className="error-text">❌ Failed to compute application profiles. Check code syntax structure.</p>
              )}
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
};
