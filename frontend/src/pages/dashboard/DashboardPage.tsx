import React, { useEffect, useState } from "react";
import {
 ArcElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  LogarithmicScale,
  PointElement,
  Tooltip,
} from "chart.js";
import { Doughnut, Line } from "react-chartjs-2";
import { AlertTriangle, MoreHorizontal, Send, Share2 } from "lucide-react";
import { NavBar } from "../../shared/components/NavBar";
import { useMe } from "../../features/auth/hooks/useMe";
import { DashboardService } from "../../features/dashboard";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

ChartJS.register(
  ArcElement,
  CategoryScale,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  LogarithmicScale,
  PointElement,
  Tooltip,
);
import { FaJs, FaPython } from "react-icons/fa";
import { SiCplusplus } from "react-icons/si";

interface RecentSubmission {
  id: string;
  language: string;
  detectedComplexity: string;
  createdAt: string;
  row_num: string;
}
const languageIcons: Record<string, React.ReactNode> = {
  javascript: <FaJs color="#f7df1e" size={18} />,
  python: <FaPython color="#3776ab" size={18} />,
  cpp: <SiCplusplus color="#00599c" size={18} />,
};
// Chart-only mock data. Replace these arrays when benchmark API data is available.
const complexityDistribution = [
  { label: "O(1)", value: 45, color: "#ff6b00" },
  { label: "O(log n)", value: 25, color: "#ffba08" },
  { label: "O(n)", value: 15, color: "#58a762" },
  { label: "O(n log n)", value: 10, color: "#367be8" },
  { label: "O(n²) and above", value: 5, color: "#9349c7" },
];

const executionChartData = {
  labels: ["10¹", "10²", "10²", "10³", "10³", "10³", "10⁴", "10⁴", "10⁴", "10⁵", "10⁵", "10⁶"],
  datasets: [{
    data: [1, 1, 1, 1.1, 1.3, 2, 5, 11, 40, 190, 900, 10000],
    borderColor: "#ff6b00",
    backgroundColor: "rgba(255, 107, 0, .25)",
    fill: true,
    tension: .28,
    pointBackgroundColor: "#ff6b00",
    pointBorderColor: "#ff6b00",
    pointRadius: 4,
    pointHoverRadius: 5,
  }],
};

const doughnutChartData = {
  labels: complexityDistribution.map((item) => item.label),
  datasets: [{
    data: complexityDistribution.map((item) => item.value),
    backgroundColor: complexityDistribution.map((item) => item.color),
    borderColor: "#17191a",
    borderWidth: 2,
  }],
};

const doughnutOptions = {
  cutout: "50%",
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
};

const lineOptions = {
  responsive: true,
  maintainAspectRatio: false,
  layout: { padding: { top: 4, right: 8, bottom: 0, left: 0 } },
  scales: {
    x: {
      grid: { color: "rgba(130,135,138,.16)" },
      ticks: { color: "#d9dcde", maxTicksLimit: 7, font: { size: 11 } },
      title: { display: true, text: "Input Size (n)", color: "#d9dcde", font: { size: 12 } },
    },
    y: {
      type: "logarithmic" as const,
      min: 1,
      max: 10000,
      grid: { color: "rgba(130,135,138,.16)" },
      ticks: {
        color: "#d9dcde",
        maxTicksLimit: 5,
        font: { size: 11 },
        callback: (value: string | number) => Number(value) === 1 || Number(value) === 10 || Number(value) === 100 || Number(value) === 1000 || Number(value) === 10000 ? `10${Math.log10(Number(value)).toFixed(0)}` : "",
      },
      title: { display: true, text: "Time (ms)", color: "#d9dcde", font: { size: 12 } },
    },
  },
  plugins: { legend: { display: false }, tooltip: { displayColors: false } },
};

function DonutChart() {
  return (
    <div className="donut-wrap">
      <Doughnut data={doughnutChartData} options={doughnutOptions} />
    </div>
  );
}

function ExecutionChart() {
  return (
    <div className="line-wrap">
      <Line data={executionChartData} options={lineOptions} height={240} />
    </div>
  );
}

export const DashboardPage: React.FC = () => {
  const dashboardService = DashboardService.getInstance();
  const [totalSub, setTotalSub] = useState(0);
  const [connectedRepos, setConnectedRepos] = useState(0);
  const [regressionCountThisWeek, setRegressionCountThisWeek] = useState(0);
  const [recentSubmissions, setRecentSubmissions] = useState<RecentSubmission[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    async function getData() {
      try {
        setLoading(true);
        setLoadError("");
        const response = await dashboardService.getDashboardData();

        setConnectedRepos(response.data.connectedReposCount);
        setRecentSubmissions(response.data.recentSubmissions);
        setRegressionCountThisWeek(response.data.regressionCountThisWeek);
        setTotalSub(response.data.totalSubmissions);
      } catch (error) {
        console.error(error);
        setLoadError("Unable to load data.");
      } finally {
        setLoading(false);
      }
    }

    getData();
  }, []);
   
  const formatDate = (iso: string) => new Date(iso).toLocaleString();

  const { data } = useMe();
  const username = (data?.data as { name?: string } | undefined)?.name || (data as { name?: string } | undefined)?.name || "Developer";

  return (
    <div className="dashboard-page">
      <NavBar username={username} />

      <div className="overview">
        <h1>Overview</h1>
        <h3>Welcome back! Here's your code performance summary.</h3>
      </div>

      <div className="cards">
        <div className="stat-card">
          <div><p className="stat-label">Total Submissions</p><p className="stat-value">{totalSub.toLocaleString()}</p></div>
          <div className="stat-icon"><Send size={37} strokeWidth={1.8} /></div>
        </div>
        <div className="stat-card">
          <div><p className="stat-label">Connected Repos</p><p className="stat-value">{connectedRepos}</p></div>
          <div className="stat-icon"><Share2 size={37} strokeWidth={1.8} /></div>
        </div>
        <div className="stat-card">
          <div><p className="stat-label">Regressions This Week</p><p className="stat-value">{regressionCountThisWeek}</p></div>
          <div className="stat-icon"><AlertTriangle size={37} strokeWidth={1.8} /></div>
        </div>
      </div>

      <div className="charts">
        <div className="chart-card">
          <div className="chart-header"><h2>Algorithmic Complexity Distribution</h2><MoreHorizontal size={20} /></div>
          <div className="donut-content">
            <DonutChart />
            <ul className="donut-legend">
              {complexityDistribution.map((item) => <li key={item.label}><span><i style={{ backgroundColor: item.color }} />{item.label}</span><b>{item.value}%</b></li>)}
            </ul>
          </div>
        </div>
        <div className="chart-card">
          <div className="chart-header"><h2>Execution Time vs Input Size</h2><MoreHorizontal size={20} /></div>
          <ExecutionChart />
        </div>
      </div>

      <div className="submission-table">
        <h2>Recent Submissions</h2>
        {loading && <p className="status-text">Loading...</p>}
        {loadError && <p className="status-text error-text">{loadError}</p>}
        {!loading && !loadError && <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Language</th>
                <th>Complexity</th>
                <th>Submitted At</th>
              </tr>
            </thead>
            <tbody>
              {recentSubmissions.map((submission) => <tr style={{ cursor: 'pointer' }} onClick={() => navigate(`/submissions/${submission.id}`)} key={submission.id}>
                <td>{submission.row_num}</td>
                <td style={{ display: "flex", alignItems: "center", gap: "6px" }}>{languageIcons[submission.language.toLowerCase()] || null}{submission.language}</td>
                <td><span className="complexity-badge">{submission.detectedComplexity}</span></td>
                <td>{formatDate(submission.createdAt)}</td>
              </tr>)}
            </tbody>
          </table>
        </div>}
      </div>
    </div>
  );
};
