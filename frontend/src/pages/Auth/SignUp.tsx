import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, ShieldCheck, Sun } from "lucide-react";
import { AuthInput } from '../../shared/components/AuthInput';
import { AuthButton } from '../../shared/components/AuthButton';
import { CodePerfLogo } from './component/CodePerfLogo';
import { MockDashboard } from './component/MockDashboard';
import { AuthService } from '../../features/auth/api/auth.api';
import "../../styles/signup.css";

export const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const authService = AuthService.getInstance();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }

    if (apiError) {
      setApiError(null);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Work email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setApiError(null);

    try {
      const response = await authService.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      if (response.success) {
        if (response.token) {
          localStorage.setItem("token", String(response.token));
        }
        navigate("/dashboard");
      } else {
        setApiError("Registration encountered a problem. Please try again.");
      }
    } catch (error: any) {
      setApiError(error?.response?.data?.message || error?.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-container antialiased">
      <div className="signup-marketing-panel select-none">
        <div className="signup-glow-top" />
        <div className="signup-glow-bottom" />

        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <CodePerfLogo size={28} />
            <span className="text-lg font-bold tracking-tight text-white">CodePerf</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="#" className="nav-link">Features</a>
            <a href="#" className="nav-link">How it works</a>
            <a href="#" className="nav-link">Pricing</a>
            <a href="#" className="nav-link">Docs</a>
            <a href="#" className="nav-link">Blog</a>
          </div>
        </div>

        <div className="relative z-10 my-auto flex flex-col gap-6 text-left max-w-[85%] mt-12 mb-8">
          <div>
            <div className="profiler-badge mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
              Algorithmic Complexity Profiler
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white leading-tight">
              Detect. Analyze.<br />
              Prevent Performance<br />
              <span className="gradient-text">Regressions.</span>
            </h1>
          </div>

          <p className="text-[15px] text-slate-400 leading-relaxed max-w-[500px]">
            CodePerf helps engineering teams catch algorithmic bottlenecks before they hit production.
          </p>

          <div className="grid grid-cols-3 gap-4 mt-4 w-full">
            <div className="flex items-start gap-3">
              <div className="feature-badge-container feature-badge-blue">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.952 11.952 0 01-7.618 3.0167L3 9v4c0 5.523 4.477 10 10 10s10-4.477 10-10V9l-1.382-.572z" />
                </svg>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-slate-100 mb-0.5">PR Checks</h4>
                <p className="text-[10px] text-slate-400 leading-tight">Block performance regressions</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="feature-badge-container feature-badge-green">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-slate-100 mb-0.5">Full Repo Scan</h4>
                <p className="text-[10px] text-slate-400 leading-tight">Analyze entire codebase complexity</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="feature-badge-container feature-badge-purple">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-slate-100 mb-0.5">AI Insights</h4>
                <p className="text-[10px] text-slate-400 leading-tight">Get smart suggestions to optimize</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 w-full flex items-center justify-center">
          <MockDashboard />
        </div>
      </div>

      <div className="signup-form-panel">
        <div className="top-nav-utility">
          <button className="theme-toggle-btn" aria-label="Toggle Theme">
            <Sun size={18} />
          </button>
          <div className="text-sm font-medium text-slate-400">
            Already registered?{' '}
            <Link to="/login" className="font-semibold text-blue-400 hover:text-blue-300 transition-colors">
              Sign in
            </Link>
          </div>
        </div>

        <div className="auth-panel-card flex flex-col gap-6">
          <div className="flex flex-col gap-2 text-center">
            <div className="flex justify-center mb-1">
              <CodePerfLogo size={42} />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white">Create your account</h2>
            <p className="text-xs text-slate-400">Start optimizing your distributed systems codebase complexity today.</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {apiError && <div className="signup-alert-error">{apiError}</div>}

            <AuthInput
              label="Full name"
              name="name"
              type="text"
              icon={User}
              placeholder="Arpit Yadav"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              disabled={isLoading}
              required
            />

            <AuthInput
              label="Work email"
              name="email"
              type="email"
              icon={Mail}
              placeholder="you@company.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              disabled={isLoading}
              required
            />

            <AuthInput
              label="Password"
              name="password"
              type="password"
              icon={Lock}
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              disabled={isLoading}
              required
            />

            <AuthInput
              label="Confirm password"
              name="confirmPassword"
              type="password"
              icon={Lock}
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              disabled={isLoading}
              required
            />

            <AuthButton type="submit" isLoading={isLoading} className="auth-btn-submit mt-2">
              Create developer account
            </AuthButton>
          </form>

          <div className="w-full flex flex-col gap-4">
            <div className="relative flex items-center">
              <div className="flex-grow border-t border-slate-800" />
              <span className="flex-shrink mx-4 text-[10px] uppercase tracking-wider font-semibold text-slate-500">Or continue with</span>
              <div className="flex-grow border-t border-slate-800" />
            </div>

            <AuthButton
              type="button"
              variant="social"
              className="auth-btn-social"
              onClick={() => window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/github`}
              disabled={isLoading}
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
              <span>Continue with GitHub</span>
            </AuthButton>
          </div>

          <div className="flex justify-center">
            <div className="security-badge">
              <ShieldCheck size={14} className="text-emerald-500" />
              <span>Enterprise grade security. Your data is safe with us.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};