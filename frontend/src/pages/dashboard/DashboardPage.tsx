import React from "react";
import { useMe } from "../../features/auth/hooks/useMe";
import { tokenStorage } from "../../core/lib/tokenStorage";
import { useAuthStore } from "../../features/auth/store/authStore";
import { useNavigate } from "react-router-dom";
import { NavBar } from "../../shared/components/NavBar";

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { data, isLoading, error } = useMe();
  console.log(data,'data');
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const handleLogout = () => {
    tokenStorage.clearTokens();
    clearAuth();  
    navigate("/login");
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#121212] text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#FF6C37] border-t-transparent"></div>
          <p className="text-sm text-[#A6A6A6]">Syncing active developer session...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#121212] text-white">
        <div className="auth-panel-card p-6 rounded border border-[#3A3A3A] max-w-sm text-center flex flex-col gap-4">
          <p className="text-[#FFB199] text-sm">Session Expired or Invalid</p>
          <button onClick={() => navigate("/login")} className="auth-btn-submit py-2 text-xs">
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  // Handle nested backend object responses safely depending on your envelope strategy
  const user = data?.data || data;

  return (
    <div className="min-h-screen bg-[#121212] text-white p-8">
      <NavBar/>
      <div className="max-w-6xl mx-auto flex items-center justify-between border-b border-[#2A2A2A] pb-6 mb-8">
        <div className="text-left">
          <h1 className="text-2xl font-bold tracking-tight">CodePerf Dashboard</h1>
          <p className="text-xs text-[#A6A6A6]">Welcome, <span className="text-white font-semibold">{user?.name || "Developer"}</span></p>
        </div>
        <button onClick={handleLogout} className="px-4 py-2 text-xs font-semibold text-[#A6A6A6] hover:text-white border border-[#3A3A3A] hover:border-[#FF6C37] rounded transition-colors bg-transparent cursor-pointer">
          Logout
        </button>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
        <div className="auth-panel-card p-6">
          <h3 className="text-xs font-bold text-[#8F8F8F] uppercase tracking-wider mb-3">Live Cache Credentials</h3>
          <div className="bg-[#1A1A1A] p-4 rounded border border-[#2A2A2A] font-mono text-xs text-[#A6A6A6] space-y-1">
            <p><span className="text-[#FF6C37]">ID:</span> {user?.id}</p>
            <p><span className="text-[#FF6C37]">Email:</span> {user?.email}</p>
          </div>
        </div>

        <div className="auth-panel-card p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-[#8F8F8F] uppercase tracking-wider mb-2">Devtools Verification</h3>
            <p className="text-xs text-[#A6A6A6] leading-relaxed">
              Click the TanStack icon visible in the corner to view status changes for query key <code className="bg-[#1A1A1A] px-1 rounded text-[#FFB199]">["auth", "me"]</code>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};