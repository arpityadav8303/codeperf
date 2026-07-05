import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { tokenStorage } from "../../core/lib/tokenStorage";
import { useAuthStore } from "../../features/auth/store/authStore";

export const LoginSuccess: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const setAuth = useAuthStore((state) => state.setAuth);

    useEffect(() => {
        const accessToken = searchParams.get("accessToken");
        const refreshToken = searchParams.get("refreshToken");

        if (accessToken && refreshToken) {
            tokenStorage.setTokens(accessToken, refreshToken);
            setAuth(accessToken);
            navigate("/dashboard", { replace: true });
        } else {
            tokenStorage.clearTokens();
            navigate("/login", { replace: true });
        }
    }, [searchParams, navigate, setAuth]);

    return (
        <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            background: "#020617",
            color: "#94a3b8",
        }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
                <div style={{
                    width: "32px",
                    height: "32px",
                    border: "2px solid rgba(255,255,255,0.2)",
                    borderTopColor: "#ffffff",
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite",
                }} />
                <p style={{ fontSize: "14px" }}>Signing you in with GitHub...</p>
            </div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
};
