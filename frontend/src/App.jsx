import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CreateProduct from "./pages/CreateProduct";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Product from "./pages/Product";
import Admin from "./pages/admin";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import axiosInstance from "./helper/axiosInstance"; // Import Axios instance
import "./App.css"; // import CSS for scroll animation
import AdminLogin from "./pages/AdminLogin";
import Adminsignup from "./pages/Adminsignup";

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false); // State to track admin access

  useEffect(() => {
    // Check if admin has access
    const authToken = localStorage.getItem("authToken");
    axiosInstance
      .get("/admin/access", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setIsAdmin(true); // Access granted
        }
      })
      .catch((error) => {
        console.error("Access denied:", error);
        setIsAdmin(false); // Access denied
      });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Router>
        <Header />
        <main className="flex-grow overflow-hidden">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create-product" element={<CreateProduct />} />
            <Route path="/product/:id" element={<Product />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/signup" element={<Adminsignup />} />
            {/* Conditionally render admin routes */}
            {isAdmin && (
              <>
                <Route path="/admin" element={<Admin />} />
              </>
            )}
          </Routes>
        </main>
        <Footer />
      </Router>
    </div>
  );
}
