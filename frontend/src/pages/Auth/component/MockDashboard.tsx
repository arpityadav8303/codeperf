import React from "react";
import {Lock, LayoutDashboard, ShieldCheck, FileText, Layers,Sparkles, Settings,TrendingUp,} from "lucide-react";

export const MockDashboard: React.FC = () => {
  return (
    <div className="mock-dashboard w-full max-w-155 mx-auto select-none overflow-hidden">
      {/* Header bar of Dashboard */}
      <div className="dashboard-header flex items-center justify-between px-4 py-3 text-slate-300">
        <div className="flex items-center gap-2">
          <svg className="w-3.75 h-3.75 fill-current text-slate-400" viewBox="0 0 24 24">
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
          </svg>
          <span className="font-semibold text-xs text-slate-200">acme/fintech-platform</span>
          <span className="flex items-center gap-1 dashboard-badge dashboard-badge-passed py-0.5 text-[10px] scale-90 origin-left">
            <Lock size={9} /> Private
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-[10px] text-slate-500 font-medium">Synced</span>
        </div>
      </div>

      <div className="grid grid-cols-12 min-h-73.75">
        {/* Sidebar Nav */}
        <div className="dashboard-sidebar col-span-3 p-2 flex flex-col gap-1 text-[11px]">
          <div className="sidebar-item active">
            <LayoutDashboard size={13} />
            <span>Overview</span>
          </div>
          <div className="sidebar-item">
            <ShieldCheck size={13} />
            <span>PR Checks</span>
          </div>
          <div className="sidebar-item">
            <FileText size={13} />
            <span>Reports</span>
          </div>
          <div className="sidebar-item">
            <Layers size={13} />
            <span>Repositories</span>
          </div>
          <div className="sidebar-item">
            <Sparkles size={13} />
            <span>Insights</span>
          </div>
          <div className="sidebar-item">
            <Settings size={13} />
            <span>Settings</span>
          </div>
        </div>

        {/* Content Pane */}
        <div className="col-span-9 p-3 flex flex-col gap-3 text-left">
          <div>
            <h4 className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
              Performance Overview
            </h4>
          </div>

          {/* Metric Cards Grid */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="metric-card">
              <span className="text-[10px] text-slate-400 font-medium">PR Checks</span>
              <span className="text-base font-bold text-blue-400 leading-tight">128</span>
              <span className="text-[9px] text-emerald-400 font-semibold">+12% this week</span>
            </div>

            <div className="metric-card">
              <span className="text-[10px] text-slate-400 font-medium">Regressions Blocked</span>
              <span className="text-base font-bold text-rose-500 leading-tight">23</span>
              <span className="text-[9px] text-emerald-400 font-semibold">+4% this week</span>
            </div>

            <div className="metric-card relative overflow-hidden">
              <span className="text-[10px] text-slate-400 font-medium">Performance Score</span>
              <div className="flex items-baseline gap-0.5">
                <span className="text-base font-bold text-emerald-400 leading-tight">78</span>
                <span className="text-[10px] text-slate-500">/100</span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[9px] text-emerald-400 font-semibold leading-none">+8%</span>
                {/* Mini chart Sparkline */}
                <svg width="32" height="12" className="sparkline-svg">
                  <path
                    d="M2 10 Q 8 6, 14 8 T 26 2 T 30 4"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Graphical Section & Table List */}
          <div className="grid grid-cols-2 gap-2.5">
            {/* Complexity Trend Chart */}
            <div className="metric-card">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[10px] text-slate-300 font-semibold">Complexity Trend</span>
                <div className="flex gap-2 scale-75 origin-right">
                  <span className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500 inline-block"></span> Prev
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-500 inline-block"></span> Curr
                  </span>
                </div>
              </div>

              {/* Chart Plot Area */}
              <div className="relative h-16.25 w-full flex items-end">
                {/* Y-Axis scale labels */}
                <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-[8px] text-slate-600 font-mono pr-1 select-none pointer-events-none text-right">
                  <span>100</span>
                  <span>10</span>
                  <span>1</span>
                  <span>0.1</span>
                </div>

                <div className="w-full h-full pl-5 pb-3 relative">
                  {/* Grid Lines */}
                  <svg width="100%" height="100%" className="absolute inset-0">
                    <line x1="0" y1="0" x2="100%" y2="0" className="trend-grid-line" />
                    <line x1="0" y1="18" x2="100%" y2="18" className="trend-grid-line" />
                    <line x1="0" y1="36" x2="100%" y2="36" className="trend-grid-line" />
                    <line x1="0" y1="54" x2="100%" y2="54" className="trend-grid-line" />

                    {/* Previous Trend Line (Blue) */}
                    <path
                      d="M 5 50 C 30 45, 60 42, 90 38 C 110 35, 130 30, 160 22"
                      className="trend-line-prev"
                    />

                    {/* Current Trend Line (Red) */}
                    <path
                      d="M 5 50 C 30 42, 60 38, 90 28 C 110 24, 130 16, 160 8"
                      className="trend-line-curr"
                    />
                  </svg>
                </div>

                {/* X-Axis labels */}
                <div className="absolute bottom-0 left-5 right-0 flex justify-between text-[8px] text-slate-600 font-mono select-none pointer-events-none">
                  <span>10</span>
                  <span>100</span>
                  <span>1K</span>
                  <span>10K</span>
                  <span>100K</span>
                  <span>1M</span>
                </div>
              </div>
              <div className="text-[8px] text-slate-500 font-semibold text-center mt-1">
                Input Size (n)
              </div>
            </div>

            {/* Recent PR Checks */}
            <div className="metric-card flex flex-col justify-between">
              <div className="mb-1.5">
                <span className="text-[10px] text-slate-300 font-semibold">Recent PR Checks</span>
              </div>

              {/* Checks Rows */}
              <div className="flex flex-col gap-1.5 text-[9px]">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-medium">#732 payment-service</span>
                  <span className="dashboard-badge dashboard-badge-blocked scale-90">Blocked</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-medium">#731 risk-engine</span>
                  <span className="dashboard-badge dashboard-badge-passed scale-90">Passed</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-medium">#730 order-service</span>
                  <span className="dashboard-badge dashboard-badge-passed scale-90">Passed</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-medium">#729 user-service</span>
                  <span className="dashboard-badge dashboard-badge-passed scale-90">Passed</span>
                </div>
              </div>

              {/* View all checks links */}
              <div className="mt-1.5 flex justify-end">
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="text-[9px] font-bold text-blue-400 hover:text-blue-300 flex items-center gap-0.5"
                >
                  View all checks <TrendingUp size={10} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
