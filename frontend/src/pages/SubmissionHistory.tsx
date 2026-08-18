import React, { useState, useEffect } from "react";
import { SubmissionService } from "../features/Submission";
import type { SubmissionResponse } from "../features/Submission";
import { useNavigate } from "react-router-dom";
import './SubmissionHistory.css'
import { NavBar } from "../shared/components/NavBar";
import { useMe } from "../features/auth/hooks/useMe";
import { FaJava, FaJs, FaPython } from "react-icons/fa";
import { SiCplusplus, SiTypescript } from "react-icons/si";


const languageIcons: Record<string, React.ReactNode> = {
  javascript: (
    <span className="language-badge language-js">
      <FaJs />
      <span>JavaScript</span>
    </span>
  ),

  js: (
    <span className="language-badge language-js">
      <FaJs />
      <span>JavaScript</span>
    </span>
  ),

  typescript: (
    <span className="language-badge language-ts">
      <SiTypescript />
      <span>TypeScript</span>
    </span>
  ),

  ts: (
    <span className="language-badge language-ts">
      <SiTypescript />
      <span>TypeScript</span>
    </span>
  ),

  python: (
    <span className="language-badge language-python">
      <FaPython />
      <span>Python</span>
    </span>
  ),

  py: (
    <span className="language-badge language-python">
      <FaPython />
      <span>Python</span>
    </span>
  ),

  cpp: (
    <span className="language-badge language-cpp">
      <SiCplusplus />
      <span>C++</span>
    </span>
  ),

  "c++": (
    <span className="language-badge language-cpp">
      <SiCplusplus />
      <span>C++</span>
    </span>
  ),

  java: (
    <span className="language-badge language-java">
      <FaJava />
      <span>Java</span>
    </span>
  ),
};

export const SubmissionHistory: React.FC = () => {
  const navigate = useNavigate();
  const langaugeOptions: any = ["python", "cpp", "javascript", "typescript"]
  const complexity: string[] = ["O(1)", "O(log n)", "O(n)", "O(n log n)", "O(n^2)"];
  const submissionService = SubmissionService.getInstance();
  const [params, setParams] = useState({
    page: 1,
    limit: 10,
    language: "",
    complexity: "",
  });

  const [result, setResult] = useState<SubmissionResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");


  async function getSubmissionData() {
    try {
      setIsLoading(true);
      setError("");
      // const { page, limit, ...filter } = params;
      // const cleanFilters = Object.fromEntries(
      //   Object.entries(filterState).filter(([_, value]) => value !== "")
      // );
      const data: any = await submissionService.getAllSubmissions(params);
      console.log(params, 'params')
      setResult(data);
      console.log(result)
    } catch (err) {
      console.error(err);
      setError("Unable to load data");
    } finally {
      setIsLoading(false);
    }
  }
  function chooseLang(event: React.MouseEvent<HTMLButtonElement>) {
    const button = event.target as HTMLButtonElement;
    const value = button.value;

    if (value) {
      setParams(prev => ({
        ...prev,
        language: value
      }));
      button.closest("details")?.removeAttribute("open");
    }
  }

  function chooseComplexity(event: React.MouseEvent<HTMLButtonElement>) {
    const button = event.currentTarget;
    const value = button.value;

    if (value) {
      setParams(prev => ({
        ...prev,
        complexity: value
      }));
      button.closest("details")?.removeAttribute("open");
    }
  }

  function resetFilter() {
    setParams({
      page: 1,
      limit: 10,
      language: "",
      complexity: ""
    })
  }

  function prevPage() {
    setParams(prev => ({
      ...prev,
      page: prev.page - 1
    }))

  }
  function nextPage() {
    setParams(prev => ({
      ...prev,
      page: prev.page + 1
    }))

  }
  useEffect(() => {
    getSubmissionData();
  }, [params]);
  const { data } = useMe();
  const username = (data?.data as { name?: string } | undefined)?.name || (data as { name?: string } | undefined)?.name || "Developer";
  return (
    <div>
      <div>
        <NavBar username={username} />
      </div>
      {isLoading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <div className="filters">
        <div className="filter-dropdown">
          <span className="filter-label">Language</span>
          <details>
            <summary>
              <span>{params.language || "All languages"}</span>
            </summary>
            <div className="filter-menu languages">
              {langaugeOptions.map((item: any) => (
                <button key={item} value={item} onClick={chooseLang} className={`filter-option language-option ${item}`}>
                  <span className="filter-language-icon" aria-hidden="true" />
                  {item}
                </button>
              ))}
            </div>
          </details>
        </div>
        <div className="filter-dropdown">
          <span className="filter-label">Complexity</span>
          <details>
            <summary>
              <span>{params.complexity || "All complexities"}</span>
            </summary>
            <div className="filter-menu complexity">
              {complexity.map((item) => (
                <button key={item} onClick={chooseComplexity} value={item} className="filter-option complexity-option">
                  {item}
                </button>
              ))}
            </div>
          </details>
        </div>
        <div className="reset">
          <button onClick={resetFilter}>Reset</button>
        </div>
      </div>
      <div className="table">
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Language</th>
              <th>Submitted at</th>
              <th>Status</th>
              <th>Repo</th>
            </tr>
          </thead>
          <tbody>
            {result?.data.data.map((item: any, index: any) =>
              <tr key={item.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/submissions/${item.id}`)}>
                <td>{index + 1}</td>
                <td>
                  <span className="language-cell">
                    {languageIcons[item.language?.toLowerCase()] ?? item.language}
                  </span>
                </td>
                <td>
                  {new Date(item.createdAt).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td>{item.status}</td>
                <td>...Coming soon</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="pagination">
        <button disabled={params.page == 1} onClick={() => prevPage()}>Prev</button>
        <button>{params.page}</button>
        <button disabled={params.page == result?.data.totalPages} onClick={() => nextPage()}>next</button>
      </div>

    </div>
  );
};

