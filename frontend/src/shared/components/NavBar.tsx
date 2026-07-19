import { useMe } from "../../features/auth/hooks/useMe";
import { useNavigate } from "react-router-dom";

export const NavBar = () => {
  const navigate = useNavigate();
  const { data, isLoading, error } = useMe();

  if (isLoading) {
    return <div className="mb-4 text-sm text-[#A6A6A6]">Loading...</div>;
  }

  const user = data?.data || data;

  if (error) {
    return <div className="mb-4 text-sm text-[#FFB199]">Unable to load profile</div>;
  }

  return (
    <div className="mb-6 flex items-center justify-between rounded border border-[#2A2A2A] bg-[#1A1A1A] px-4 py-3">
      <div>
        <h1 className="text-lg font-semibold text-white">CodePerf</h1>
        <p className="text-sm text-[#A6A6A6]">Welcome, {user?.name || "Developer"}</p>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/dashboard")}
          className="rounded px-3 py-2 text-sm text-[#A6A6A6] transition hover:bg-[#2A2A2A] hover:text-white"
        >
          Dashboard
        </button>
        <button
          onClick={() => navigate("/editor")}
          className="rounded px-3 py-2 text-sm text-[#A6A6A6] transition hover:bg-[#2A2A2A] hover:text-white"
        >
          Editor
        </button>
      </div>
    </div>
  );
};