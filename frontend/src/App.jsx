import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CreateProduct from "./pages/CreateProduct";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Product from "./pages/Product";
import "./App.css"; // ✅ import CSS for scroll animation

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
          </Routes>
        </main>
        <Footer />
      </Router>
    </div>
  );
}
