import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

function PublicOnlyRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) return null;
    if (user) return <Navigate to="/" replace />;

    return children;
}

export default PublicOnlyRoute;