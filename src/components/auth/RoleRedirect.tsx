import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const normalizeRole = (role?: string) =>
  (role || "").toLowerCase().replace("role_", "");

export default function RoleRedirect() {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) return null;
  if (!isAuthenticated) return <Navigate to="/" replace />;

  const role = normalizeRole(user?.role);

  if (role === "admin") return <Navigate to="/admin" replace />;


  return <Navigate to="/profile" replace />;
}
