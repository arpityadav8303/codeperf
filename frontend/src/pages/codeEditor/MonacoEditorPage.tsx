import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { NavBar } from "../../shared/components/NavBar";
import { SubmissionService } from "../../features/Submission";
import './MonacoEditor.css'

export const MonacoEditorPage: React.FC = () => {
  const submissionService = SubmissionService.getInstance();
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState<Language>("cpp");
  type Language = "javascript" | "python" | "cpp";
  // let id: any;
  let benchmark;
  const snippets = {
    javascript: `console.log("Hello");`,
    python: `print("Hello")`,
    cpp: `#include <iostream>`,
  };
  function changeLanguage(lang: Language) {
    setLanguage(lang);
    setCode(snippets[lang]);
  }

  const handleSubmit = async () => {
    try {
      const response: any = await submissionService.createSubmission({ code, language, });
      const id = response.data.id
     benchmark = await submissionService.getBenchmark(id)
     console.log(benchmark,'benchmark')
      console.log(id);
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="editor-page">
      <NavBar />

      <div className="editor-container">
        <section className="editor-panel">

          <div className="editor-header">
            <div>
              <h1>Code Editor</h1>
              <p>Write your solution and submit it for benchmarking.</p>
            </div>

            <button
              className="back-btn"
              onClick={() => navigate("/dashboard")}
            >
              Dashboard
            </button>
          </div>
          <div>
            <button onClick={() => changeLanguage("javascript")}>JavaScript</button>
            <button onClick={() => changeLanguage("cpp")}>CPP</button>
            <button onClick={() => changeLanguage("python")}>Python</button>
          </div>
          <div className="editor-wrapper">
            <Editor
              height="100%"
              language={language}
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value ?? "")}
            />
          </div>

          <div className="editor-footer">
            <button
              className="submit-btn"
              onClick={handleSubmit}
            >
              Submit Solution
            </button>
          </div>

        </section>

      </div>
    </div>
  );
};
