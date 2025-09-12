import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CreateProduct from "./pages/CreateProduct";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Product from "./pages/Product";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import axiosInstance from "./helper/axiosInstance"; // Import Axios instance
import Admin from "./pages/Admin";
import "./App.css"; // import CSS for scroll animation
import AdminLogin from "./pages/AdminLogin";
import Adminsignup from "./pages/Adminsignup";
import RequireAdmin from "./components/RequireAdmin";

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    axiosInstance
      .get("/admin/access")
      .then((response) => {
        if (response.status === 200) setIsAdmin(true);
      })
      .catch(() => setIsAdmin(false));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Router>
        <Header />
        <main className="flex-grow overflow-hidden">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create-product" element={<RequireAdmin><CreateProduct /></RequireAdmin>} />
            <Route path="/product/:id" element={<Product />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/signup" element={<Adminsignup />} />
            <Route path="/admin" element={<RequireAdmin><Admin /></RequireAdmin>} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </div>
  );
}
