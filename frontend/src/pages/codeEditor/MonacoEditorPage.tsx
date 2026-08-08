import { useCallback, useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import { useNavigate } from "react-router-dom";
import { NavBar } from "../../shared/components/NavBar";
import { SubmissionService } from "../../features/Submission";
import websocket, { type SubmissionSocketMessage } from "../../core/lib/WebSocket";
import "./MonacoEditor.css";

type Language = "javascript" | "python" | "cpp";
type InputSize = "10" | "100" | "1K" | "10K" | "100K" | "1M";
type Status = "idle" | "processing" | "completed" | "failed";
type Benchmark = { inputSize: number; executionTimeMs: number; memoryUsedKb: number };
type Result = { status?: string; detectedComplexity?: string | null; confidence?: number | null; benchmarks?: Benchmark[] };

const templates: Record<Language, string> = {
  javascript: "function solve(input) {\n  // Write your algorithm here\n  return input;\n}\n\nconsole.log(solve([1, 2, 3]));",
  python: "def solve(items):\n    # Write your algorithm here\n    return items\n\nprint(solve([1, 2, 3]))",
  cpp: "#include <iostream>\n#include <vector>\n\nint main() {\n    // Write your algorithm here\n    std::vector<int> values{1, 2, 3};\n    return 0;\n}",
};
const sizes: Record<InputSize, number> = { "10": 10, "100": 100, "1K": 1_000, "10K": 10_000, "100K": 100_000, "1M": 1_000_000 };
const labels: Record<Language, string> = { javascript: "JavaScript", python: "Python", cpp: "C++" };
const storageKey = "codeperf.editor-draft";

function savedDraft(): { code?: string; language?: Language; inputSize?: InputSize } {
  try {
    return JSON.parse(localStorage.getItem(storageKey) ?? "{}");
  } catch {
    return {};
  }
}

export const MonacoEditorPage = () => {
  const draft = savedDraft();
  const [language, setLanguage] = useState<Language>(draft.language || "cpp");
  const [code, setCode] = useState(draft.code || templates.cpp);
  const [inputSize, setInputSize] = useState<InputSize>(draft.inputSize || "10K");
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");
  const [connected, setConnected] = useState(false);
  const [editorReady, setEditorReady] = useState(false);
  const activeId = useRef<string | null>(null);
  const navigate = useNavigate();
  const pollTimer = useRef<number | null>(null);
  const service = SubmissionService.getInstance();

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify({ code, language, inputSize }));
  }, [code, inputSize, language]);

  const stopPolling = useCallback(() => {
    if (pollTimer.current) {
      window.clearTimeout(pollTimer.current);
      pollTimer.current = null;
    }
  }, []);

  const getResult = useCallback(async (id: string, attempt = 0) => {
    try {
      const response: any = await service.getBenchmark(id);
      const payload = response?.data;
      if (payload?.benchmarks?.length || payload?.status === "completed") {
        setResult(payload);
        setStatus("completed");
        setProgress(100);
        stopPolling();
        return;
      }
      if (payload?.status === "failed") {
        setError("Analysis could not be completed. Please try again.");
        setStatus("failed");
        stopPolling();
        return;
      }
    } catch {
      // WebSocket remains the primary path; this is a late-subscriber fallback.
    }

    if (attempt < 12 && activeId.current === id) {
      pollTimer.current = window.setTimeout(() => void getResult(id, attempt + 1), 2000);
    }
  }, [service, stopPolling]);

  useEffect(() => {
    websocket.onConnectionChange(setConnected);
    websocket.onMessage((message: SubmissionSocketMessage) => {
      if (message.type === "connected") return;
      if ("submissionId" in message && message.submissionId !== activeId.current) return;
      if (message.type === "subscribed") setStatus("processing");
      if (message.type === "progress") setProgress(Math.min(100, Math.max(0, message.progress)));
      if (message.type === "completed" || message.type === "already_completed") {
        setResult((old) => ({ ...old, detectedComplexity: message.detectedComplexity, confidence: message.confidence }));
        setStatus("completed");
        setProgress(100);
        if ("submissionId" in message) {
          void getResult(message.submissionId);
        }
      }
      if (message.type === "failed") {
        setError(message.error || "Analysis failed. Please retry.");
        setStatus("failed");
        stopPolling();
      }
    });

    websocket.connect();
    return () => {
      stopPolling();
      websocket.disconnect();
    };
  }, [getResult, stopPolling]);

  const selectLanguage = (next: Language) => {
    if (next !== language) {
      setLanguage(next);
      setCode(templates[next]);
    }
  };

  const reset = () => {
    setCode(templates[language]);
    setResult(null);
    setError("");
    setStatus("idle");
    setProgress(0);
  };

  const submit = async () => {
    if (!code.trim()) {
      setError("Add some code before starting an analysis.");
      return;
    }

    stopPolling();
    setStatus("processing");
    setProgress(4);
    setResult(null);
    setError("");

    try {
      const response: any = await service.createSubmission({ code, language, inputSize: sizes[inputSize] });
      const id = response?.data?.id;
      if (!id) {
        throw new Error("Submission ID was not returned by the API.");
      }
      activeId.current = id;
      websocket.subscribe(id);
      void getResult(id);
    } catch {
      setError("Unable to start the benchmark. Confirm the API is running and try again.");
      setStatus("failed");
    }
  };

  const benchmark = result?.benchmarks?.find((item) => item.inputSize === sizes[inputSize]) ?? result?.benchmarks?.[0];

  return (
    <div className="editor-page">
      <NavBar />
      <div className="editor-shell">
        <main className="workspace-card">
          <header className="workspace-header">
            <div>
              <p className="eyebrow">New submission</p>
              <h1>Benchmark your algorithm</h1>
            </div>
            <div className={`connection-status ${connected ? "online" : "offline"}`}>
              {connected ? "Live updates on" : "Connecting live updates"}
            </div>
          </header>

          <div className="language-tabs" role="tablist" aria-label="Programming language">
            {(Object.keys(labels) as Language[]).map((item) => (
              <button
                key={item}
                type="button"
                role="tab"
                aria-selected={language === item}
                className={`tab-btn ${language === item ? "active" : ""}`}
                onClick={() => selectLanguage(item)}
              >
                {labels[item]}
              </button>
            ))}
            <button className="clear-button" type="button" onClick={reset}>
              Reset
            </button>
          </div>

          <section className="editor-wrapper" aria-label="Code editor">
            <Editor
              height="100%"
              language={language}
              theme="vs-dark"
              value={code}
              loading={<div className="editor-loading">Loading editor...</div>}
              onMount={() => setEditorReady(true)}
              onChange={(value) => setCode(value ?? "")}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineHeight: 22,
                automaticLayout: true,
                scrollBeyondLastLine: false,
                padding: { top: 16 },
                tabSize: language === "python" ? 4 : 2,
              }}
            />
          </section>

          <footer className="editor-footer-tray">
            <div className="input-size-selector">
              <span>Input size</span>
              <div className="size-buttons">
                {(Object.keys(sizes) as InputSize[]).map((size) => (
                  <button
                    type="button"
                    key={size}
                    className={inputSize === size ? "active" : ""}
                    onClick={() => setInputSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            <div className="footer-actions">
              <button className="secondary-action-btn" type="button" onClick={() => navigate("/submissions/demo")}>
                Open result page
              </button>
              <button className="run-benchmark-btn" type="button" onClick={submit} disabled={status === "processing" || !editorReady}>
                {status === "processing" ? `Analysing ${progress}%` : "Run benchmark"}
              </button>
            </div>
          </footer>
        </main>

        <aside className="benchmark-sidebar" aria-live="polite">
          <div className="sidebar-header">
            <div>
              <p className="eyebrow">Analysis</p>
              <h2>Current result</h2>
            </div>
            {status === "completed" && <span className="complete-icon">✓</span>}
          </div>

          <div className="analysis-card">
            {status === "idle" && (
              <div className="empty-state">
                <h3>Ready when you are</h3>
                <p>Choose an input size and run a benchmark to see time, memory, and complexity.</p>
              </div>
            )}

            {status === "processing" && (
              <div className="processing-state">
                <h3>Analysing your code</h3>
                <p>Streaming progress from the analysis worker.</p>
                <div className="progress-label">
                  <span>{progress}% complete</span>
                  <span>{connected ? "Live" : "Checking status"}</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${progress}%` }} />
                </div>
              </div>
            )}

            {status === "failed" && (
              <div className="error-state">
                <h3>Analysis unavailable</h3>
                <p>{error}</p>
                <button type="button" onClick={submit}>Try again</button>
              </div>
            )}

            {status === "completed" && (
              <div className="metric-results-view">
                <div className="result-pill">Analysis complete</div>
                <div className="primary-metric">
                  <span>Detected complexity</span>
                  <strong>{result?.detectedComplexity || "Calculating..."}</strong>
                  <small>{result?.confidence != null ? `${Math.round(result.confidence * 100)}% confidence` : "Waiting for final metrics"}</small>
                </div>
                <dl className="metrics-grid">
                  <div>
                    <dt>Input size</dt>
                    <dd>{inputSize}</dd>
                  </div>
                  <div>
                    <dt>Run time</dt>
                    <dd>{benchmark ? `${benchmark.executionTimeMs} ms` : "-"}</dd>
                  </div>
                  <div>
                    <dt>Memory</dt>
                    <dd>{benchmark ? `${benchmark.memoryUsedKb} KB` : "-"}</dd>
                  </div>
                  <div>
                    <dt>Language</dt>
                    <dd>{labels[language]}</dd>
                  </div>
                </dl>
              </div>
            )}
          </div>
          <div className="sidebar-note">Results are saved to your submission history once analysis completes.</div>
        </aside>
      </div>
    </div>
  );
};