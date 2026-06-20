import React from "react";
import { Navigate } from "react-router-dom";
import { tokenStorage } from "../core/lib/tokenStorage";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    if (!tokenStorage.isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }
    return <>{children}</>;
};