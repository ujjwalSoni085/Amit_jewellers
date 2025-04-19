import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CreateProduct from "./pages/CreateProduct";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Product from "./pages/Product";
import Admin from "./pages/admin";
import Signup from "./pages/Signup";
import "./App.css"; // ✅ import CSS for scroll animation
import Login from "./pages/Login";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Router>
        <Header />
        <main className="flex-grow overflow-hidden">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create-product" element={<CreateProduct />} />
            <Route path="/product/:id" element={<Product />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/signup" element={<Signup />}/> 
            <Route path="/login" element={<Login />}/>
            <Route path="/admin/login" element={<Login />}/>
            <Route path="/admin/signup" element={<Signup />}/>
            {/* Add more routes as needed */}
          </Routes>
        </main>
        <Footer />
      </Router>
    </div>
  );
}
