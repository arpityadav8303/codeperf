import { CheckCircle2, Code2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { SubmissionService } from '../../features/Submission';import { useMe } from '../../features/auth/hooks/useMe';import './SubmissionResultPage.css';
import { NavBar } from '../../shared/components/NavBar';
import { Chart as ChartJS,CategoryScale,LinearScale,PointElement,LineElement,Title,Tooltip,Legend,} from "chart.js";

import { Line } from "react-chartjs-2";
interface Benchmark {
  id: string;
  inputSize: number;
  executionTimeMs: number;
  memoryUsedKb: number;
}
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export function SubmissionResultPage() {
  const [detectedComplexity, setDetectedComplexity] = useState('Calculating...');
  const [benchmarks, setBenchmarks] = useState<Benchmark[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [confidence, setConfidence] = useState(0);
  const { id } = useParams();
  const submissionId = id ? `SUB-${id}` : 'SUB-00123';


  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index" as const, intersect: false },
    plugins: {
      legend: {
        position: "top" as const,
        labels: { color: "#d6d8dc", padding: 20, usePointStyle: true, pointStyle: "circle" as const },
      },
      tooltip: {
        backgroundColor: "#27292d",
        borderColor: "#484b50",
        borderWidth: 1,
        titleColor: "#ffffff",
        bodyColor: "#d6d8dc",
      },
    },
    scales: {
      x: {
        ticks: { color: "#aeb2b8" },
        grid: { color: "rgba(187, 191, 198, 0.12)" },
        border: { color: "#4b4e53" },
      },
      y: {
        position: "left" as const,
        ticks: { color: "#ff9a76" },
        grid: { color: "rgba(187, 191, 198, 0.12)" },
        border: { color: "#784331" },
      },
      yMemory: {
        position: "right" as const,
        ticks: { color: "#8ddcf3" },
        grid: { drawOnChartArea: false },
        border: { color: "#315866" },
      },
    },
  };
  useEffect(() => {
    let isCurrentRequest = true;

    async function getData() {
      setIsLoading(true);
      setLoadError('');
      try {
        const response = await SubmissionService.getInstance().getBenchmark(id!) as {
          data?: { detectedComplexity?: string; benchmarks?: Benchmark[]; confidence?: any };
        };
        if (isCurrentRequest) {
          setDetectedComplexity(response.data?.detectedComplexity ?? 'Not available');
          setBenchmarks(response.data?.benchmarks ?? []);
          setConfidence(response.data?.confidence);
        }

      } catch (error) {
        console.error('Unable to load submission benchmark:', error);
        if (isCurrentRequest) {
          setBenchmarks([]);
          setLoadError('Unable to load benchmark samples.');
        }
      } finally {
        if (isCurrentRequest) {
          setIsLoading(false);
        }
      }
    }

    if (id) {
      void getData();
    }

    return () => {
      isCurrentRequest = false;
    };
  }, [id]);
  const datas = useMemo(() => ({
    labels: benchmarks.map((benchmark) => benchmark.inputSize.toLocaleString()),
    datasets: [
      {
        label: "Execution Time",
        data: benchmarks.map((benchmark) => benchmark.executionTimeMs),
        borderColor: "#ff7138",
        backgroundColor: "rgba(255, 113, 56, 0.18)",
        pointBackgroundColor: "#ff8b60",
        pointBorderColor: "#1d1f21",
        pointRadius: 4,
        borderWidth: 3,
        tension: 0.32,
        yAxisID: "y",
      },
    ],
  }), [benchmarks]);

  const { data } = useMe();
  const username = (data?.data as { name?: string } | undefined)?.name || (data as { name?: string } | undefined)?.name || "Developer";

  return (
    <div className="submission-result-page">
      <header className="result-nav">
        <a className="result-brand" href="/dashboard" aria-label="CodePerf dashboard">
          <span className="result-brand-mark"><Code2 size={22} strokeWidth={2.25} /></span>
          <span>CodePerf</span>
        </a>
        <nav className="result-nav-links" aria-label="Primary navigation">
          <NavBar username={username} />
        </nav>
      </header>

      <main className="submission-result-shell">
        <section className="submission-result-heading">
          <div>
            <h1>Submission Result</h1>
            <p>Submission ID: <span>{submissionId}</span></p>
          </div>
          <div className="analysis-status"><CheckCircle2 size={22} /> Analysis Complete</div>
        </section>

        <section className="result-grid" aria-label="Submission analysis">
          <article className="result-card result-card--summary">
            <h2>Detected Complexity</h2>
            <strong className="complexity-value">{detectedComplexity}</strong>
            <p className="card-copy">The algorithm scales slightly worse than linearithmic.</p>
          </article>

          <article className="result-card result-card--summary">
            <h2>Confidence Score</h2>
            <strong className="confidence-value">{confidence * 100}%</strong>
            <div className="confidence-track" aria-label="92 percent confidence"><span /></div>
          </article>

          <article className="result-card result-card--summary resource-card">
            <h2>Resource Usage</h2>
            <p><b>Runtime:</b> 128ms (avg)</p>
            <p><b>Memory:</b> 4.2MB (peak)</p>
          </article>

          <article className="result-card result-card--chart">
            <h2>Benchmark Curve</h2>
            <div className="chart-placeholder">
              {/* <ChartNoAxesCombined size={46} strokeWidth={1.5} /> */}
              <Line data={data} options={chartOptions} />
            </div>
          </article>

          <article className="result-card result-card--table">
            <h2>Benchmark Samples</h2>
            <div className="samples-border">
              <table>
                <thead>
                  <tr>
                    <th>n</th>
                    <th>Time (ms)</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading && <tr><td colSpan={2}>Loading benchmark samples…</td></tr>}
                  {!isLoading && loadError && <tr><td colSpan={2}>{loadError}</td></tr>}
                  {!isLoading && !loadError && benchmarks.length === 0 && <tr><td colSpan={2}>No benchmark samples are available yet.</td></tr>}
                  {!isLoading && !loadError && benchmarks.map(({ id, inputSize, executionTimeMs }) => (
                    <tr key={id}>
                      <td>{inputSize.toLocaleString()}</td>
                      <td>{executionTimeMs.toFixed(1)} ms</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}
