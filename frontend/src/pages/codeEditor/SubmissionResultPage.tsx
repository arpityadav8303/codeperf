import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import './SubmissionResultPage.css';

type BenchmarkPoint = {
  inputSize: number;
  executionTimeMs: number;
};

const mockResults: BenchmarkPoint[] = [
  { inputSize: 10, executionTimeMs: 2 },
  { inputSize: 100, executionTimeMs: 8 },
  { inputSize: 1000, executionTimeMs: 24 },
  { inputSize: 10000, executionTimeMs: 96 },
  { inputSize: 100000, executionTimeMs: 320 },
];

export function SubmissionResultPage() {
  const { id } = useParams();

  const summary = useMemo(() => {
    const lastPoint = mockResults[mockResults.length - 1];

    return {
      complexity: 'O(n log n)',
      confidence: 87,
      totalSamples: mockResults.length,
      lastRuntimeMs: lastPoint.executionTimeMs,
      maxInputSize: lastPoint.inputSize,
    };
  }, []);

  return (
    <div className="submission-result-page">
      <div className="submission-result-shell">
        <header className="submission-result-header">
          <div>
            <p className="eyebrow">Submission result</p>
            <h1>Analysis for {id ?? 'unknown-submission'}</h1>
            <p className="subtitle">
              This is the starter view for the completed benchmark experience.
            </p>
          </div>

          <div className="status-pill">Completed</div>
        </header>

        <section className="summary-grid">
          <article className="summary-card">
            <span className="card-label">Detected complexity</span>
            <strong>{summary.complexity}</strong>
          </article>

          <article className="summary-card">
            <span className="card-label">Confidence</span>
            <strong>{summary.confidence}%</strong>
          </article>

          <article className="summary-card">
            <span className="card-label">Samples</span>
            <strong>{summary.totalSamples}</strong>
          </article>
        </section>

        <section className="result-content-grid">
          <article className="panel chart-panel">
            <div className="panel-header">
              <h2>Benchmark curve</h2>
              <span className="badge">Preview</span>
            </div>

            <div className="chart-placeholder" aria-label="Benchmark chart placeholder">
              <svg viewBox="0 0 320 180" role="img">
                <line x1="20" y1="150" x2="300" y2="150" className="axis" />
                <line x1="20" y1="20" x2="20" y2="150" className="axis" />
                <polyline
                  points="20,140 70,120 120,110 180,80 250,50 300,30"
                  className="curve"
                />
              </svg>
            </div>
          </article>

          <article className="panel details-panel">
            <div className="panel-header">
              <h2>Result details</h2>
              <span className="badge badge-accent">Ready</span>
            </div>

            <ul className="detail-list">
              <li>
                <span>Last runtime</span>
                <strong>{summary.lastRuntimeMs} ms</strong>
              </li>
              <li>
                <span>Max input size</span>
                <strong>{summary.maxInputSize}</strong>
              </li>
              <li>
                <span>Complexity badge</span>
                <strong className="complexity-badge">{summary.complexity}</strong>
              </li>
            </ul>
          </article>
        </section>
      </div>
    </div>
  );
}
