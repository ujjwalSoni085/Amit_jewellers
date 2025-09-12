import React from "react";
import { Navigate } from "react-router-dom";

export default function RequireAdmin({ children }) {
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("authToken");
  if (role === "admin" && token) return children;
  return <Navigate to="/admin/login" replace />;
}


