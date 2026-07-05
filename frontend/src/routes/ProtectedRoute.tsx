import React from "react";
import { Navigate } from "react-router-dom";
import { tokenStorage } from "../core/lib/tokenStorage";
import { useAuthStore } from "../features/auth/store/authStore";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const isAuthenticatedInStore = useAuthStore((state) => state.isAuthenticated);
    const hasStoredTokens = tokenStorage.isAuthenticated();
    const isAuthenticated = isAuthenticatedInStore || hasStoredTokens;

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    return <>{children}</>;
};