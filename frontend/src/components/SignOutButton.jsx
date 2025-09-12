import React from "react";
import axiosInstance from "../helper/axiosInstance";

export default function SignOutButton() {
  const handleLogout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
    } catch {}
    localStorage.removeItem("authToken");
    localStorage.removeItem("role");
    window.dispatchEvent(new Event("auth-changed"));
    window.location.href = "/";
  };

  return (
    <button onClick={handleLogout} className="bg-white text-yellow-700 font-medium px-3 py-1 rounded-full hover:bg-yellow-100 transition shadow-sm text-sm">
      Sign out
    </button>
  );
}
