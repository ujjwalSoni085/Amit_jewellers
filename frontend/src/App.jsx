import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Product from "./pages/Product";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Cart from "./pages/Cart";
import OrderSuccess from "./pages/OrderSuccess";
import Orders from "./pages/Orders";
import Wishlist from "./pages/Wishlist";
import "./App.css"; // import CSS for scroll animation
import RequireAdmin from "./components/RequireAdmin";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Contact from "./pages/Contact";

const CreateProduct = lazy(() => import("./pages/CreateProduct"));
const Admin = lazy(() => import("./pages/Admin"));
const Checkout = lazy(() => import("./pages/Checkout"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const Adminsignup = lazy(() => import("./pages/Adminsignup"));

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Router>
        <Header />
        <main className="flex-grow overflow-hidden">
          <Suspense fallback={
            <div className="flex items-center justify-center min-h-[50vh]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-600"></div>
            </div>
          }>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/create-product" element={<RequireAdmin><CreateProduct /></RequireAdmin>} />
              <Route path="/product/:id" element={<Product />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/signup" element={<Adminsignup />} />
              <Route path="/admin" element={<RequireAdmin><Admin /></RequireAdmin>} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-success/:id" element={<OrderSuccess />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </Router>
    </div>
  );
}
