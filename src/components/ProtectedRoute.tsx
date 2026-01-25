import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type Props = {
  children: React.ReactNode;
  allowedRoles?: string[];
};

const normalizeRole = (role?: string) =>
  (role || "").toLowerCase().replace("role_", ""); 

export default function ProtectedRoute({ children, allowedRoles = [] }: Props) {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const role = normalizeRole(user?.role);

  if (allowedRoles.length > 0 && !allowedRoles.map(normalizeRole).includes(role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
