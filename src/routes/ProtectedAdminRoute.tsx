import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import React from "react";

export default function ProtectedAdminRoute({ children }: { children: React.ReactElement }) {
  const { kullanici, loading } = useAuth();

  if (loading) {
    return <p>Yükleniyor...</p>;
  }

  if (!kullanici) {
    return <Navigate to="/login" replace />;
  }

  if (kullanici.rol !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}
