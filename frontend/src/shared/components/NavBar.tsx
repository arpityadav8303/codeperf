import { useMe } from "../../features/auth/hooks/useMe";
import { NavLink } from "react-router-dom";

export const NavBar = () => {
  const { data, isLoading, error } = useMe();

  if (isLoading) return <div className="mb-4 text-sm text-[#A6A6A6]">Loading...</div>;
  if (error) return <div className="mb-4 text-sm text-[#FFB199]">Unable to load profile</div>;

  const user = data?.data || data;
  const linkClass = ({ isActive }: { isActive: boolean }) => `rounded px-3 py-2 text-sm transition ${isActive ? "bg-[#2A2A2A] text-white" : "text-[#A6A6A6] hover:bg-[#2A2A2A] hover:text-white"}`;

  return (
    <nav className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded border border-[#2A2A2A] bg-[#1A1A1A] px-4 py-3" aria-label="Primary navigation">
      <div>
        <h1 className="text-lg font-semibold text-white">CodePerf</h1>
        <p className="text-sm text-[#A6A6A6]">Welcome, {user?.name || "Developer"}</p>
      </div>
      <div className="flex flex-wrap items-center gap-1">
        <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
        <NavLink to="/editor" className={linkClass}>Editor</NavLink>
        <NavLink to="/changePassword" className={linkClass}>Security</NavLink>
      </div>
    </nav>
  );
};
