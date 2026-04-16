import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import SignOutButton from "./SignOutButton";
import axiosInstance from "../helper/axiosInstance";
import { getRole } from "../helper/auth";
import { formatPrice } from "../utils/formatPrice";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [goldPrice, setGoldPrice] = useState(null);
  const [user, setUser] = useState(null);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const role = getRole();

  const fetchUserProfile = async () => {
    if (!localStorage.getItem("authToken")) {
      setUser(null);
      return;
    }
    try {
      if (getRole() === "admin") {
        const res = await axiosInstance.get("/admin/");
        setUser(res.data.admin);
      } else {
        const response = await axiosInstance.get("/user");
        setUser(response.data.user);
      }
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    fetchUserProfile();
    const handler = () => fetchUserProfile();
    window.addEventListener("auth-changed", handler);
    return () => window.removeEventListener("auth-changed", handler);
  }, []);

  const fetchCartCount = async () => {
    if (!localStorage.getItem("authToken") || role === "admin") {
      setCartItemCount(0);
      return;
    }
    try {
      const res = await axiosInstance.get("/cart");
      const totalItems = res.data.cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
      setCartItemCount(totalItems);
    } catch {
      setCartItemCount(0);
    }
  };

  useEffect(() => {
    fetchCartCount();
    const handler = () => fetchCartCount();
    window.addEventListener("cart-updated", handler);
    return () => window.removeEventListener("cart-updated", handler);
  }, [role]);

  useEffect(() => {
    const fetchGoldPrice = async () => {
      try {
        const res = await axiosInstance.get("/prices");
        const gold = res.data.find((p) => p.metal === "gold");
        setGoldPrice(gold ? Number(gold.pricePerGram).toFixed(2) : null);
      } catch (error) {
        console.error("Error fetching gold price:", error);
      }
    };
    fetchGoldPrice();
  }, []);

  useEffect(() => {
    const searchTimer = setTimeout(() => {
      if (location.pathname === "/") {
        if (searchQuery.trim() !== "") {
          navigate(`/?search=${encodeURIComponent(searchQuery)}`);
        } else {
          navigate("/");
        }
      }
    }, 300);

    return () => clearTimeout(searchTimer);
  }, [searchQuery, navigate, location.pathname]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <header className="sticky top-0 z-40 bg-gradient-to-r from-yellow-500 to-yellow-700 py-3 px-4 md:px-6 text-white shadow-md">
        <nav className="flex justify-between items-center max-w-[1800px] mx-auto w-full">
          {/* Left - Logo */}
          <div className="flex items-center gap-4 text-base font-semibold">
            <Link to="/" className="flex items-center text-white no-underline">
              <img
                src="/logo.png"
                alt="Amit Jewellers Logo"
                className="w-8 h-8 mr-2 rounded-full ring-2 ring-white/70 bg-white object-cover"
              />
              <span className="hidden sm:inline">Amit Jewellers</span>
              <span className="sm:hidden text-lg">Amit</span>
            </Link>
          </div>

          {/* Center - Desktop Search */}
          <div className="hidden md:flex items-center bg-white rounded-full px-3 py-1 shadow-inner mx-4 flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3 py-1 outline-none text-black bg-transparent w-full text-sm"
            />
            <span className="text-gray-500 px-2 text-sm">🔍</span>
          </div>

          {/* Right - Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            {role === "admin" && (
              <Link
                to="/create-product"
                className="bg-white text-yellow-700 font-medium px-3 py-1.5 rounded-full hover:bg-yellow-100 transition shadow-sm text-sm"
              >
                ➕ Add Product
              </Link>
            )}

            <div className="text-sm font-medium text-white px-2">
              {goldPrice
                ? `💰 Gold 24K: ${formatPrice(goldPrice)}/g`
                : "Fetching price..."}
            </div>

            {localStorage.getItem("authToken") && role === "user" && (
              <>
                <Link
                  to="/cart"
                  className="relative bg-white text-yellow-700 font-medium px-3 py-1.5 rounded-full hover:bg-yellow-100 transition shadow-sm text-sm flex items-center gap-1"
                >
                  🛒 Cart
                  {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {cartItemCount > 9 ? "9+" : cartItemCount}
                    </span>
                  )}
                </Link>
                <Link
                  to="/wishlist"
                  className="bg-white text-yellow-700 font-medium px-3 py-1.5 rounded-full hover:bg-yellow-100 transition shadow-sm text-sm flex items-center gap-1"
                >
                  ❤️ Wishlist
                </Link>
              </>
            )}

            {localStorage.getItem("authToken") ? (
              <div className="flex items-center gap-3">
                {user && user.profile && (
                  <img
                    src={user.profile}
                    alt="Profile"
                    className="w-8 h-8 rounded-full border-2 border-white object-cover"
                  />
                )}
                <span className="text-sm font-medium hidden lg:block">
                  {user?.name || (role === "admin" ? "Admin" : "User")}
                </span>
                <SignOutButton />
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-white text-yellow-700 font-medium px-4 py-1.5 rounded-full hover:bg-yellow-100 transition shadow-sm text-sm"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Right - Icons & Hamburger */}
          <div className="flex md:hidden items-center gap-4">
            {localStorage.getItem("authToken") && role === "user" && (
              <Link to="/cart" className="relative text-white flex items-center">
                <span className="text-2xl">🛒</span>
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-yellow-600">
                    {cartItemCount > 9 ? "9+" : cartItemCount}
                  </span>
                )}
              </Link>
            )}
            
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="text-white hover:text-yellow-100 focus:outline-none transition-colors"
              aria-label="Open Mobile Menu"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 z-50 transform ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out md:hidden`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
            isMobileMenuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>

        {/* Drawer Content */}
        <div className="absolute top-0 left-0 h-full w-[80%] max-w-sm bg-gray-50 flex flex-col shadow-2xl overflow-y-auto">
          {/* Drawer Header */}
          <div className="bg-gradient-to-r from-yellow-500 to-yellow-700 py-4 px-4 text-white flex justify-between items-center shadow-md">
            <div className="flex items-center gap-3 font-semibold text-lg">
              <img
                src="/logo.png"
                alt="Logo"
                className="w-8 h-8 rounded-full ring-2 ring-white/70 bg-white object-cover"
              />
              <span>Amit Jewellers</span>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-white hover:text-gray-200 transition-colors bg-black/10 rounded-full p-1"
              aria-label="Close Menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 p-5 flex flex-col gap-6">
            {/* User Profile Summary */}
            {localStorage.getItem("authToken") && (
              <div className="flex items-center gap-4 pb-5 border-b border-gray-200">
                {user && user.profile ? (
                  <img
                    src={user.profile}
                    alt="Profile"
                    className="w-14 h-14 rounded-full border-2 border-yellow-500 object-cover shadow-sm"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-700 text-2xl font-bold border-2 border-yellow-500 shadow-sm">
                    {user?.name?.[0]?.toUpperCase() || (role === "admin" ? "A" : "U")}
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="font-bold text-gray-800 text-xl tracking-tight">
                    {user?.name || (role === "admin" ? "Admin" : "User")}
                  </span>
                  <span className="text-sm text-yellow-600 font-medium uppercase tracking-wider">{role}</span>
                </div>
              </div>
            )}

            {/* Mobile Search */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-500 uppercase tracking-widest">Search</label>
              <div className="flex bg-white rounded-xl border border-gray-300 overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-yellow-400 focus-within:border-transparent transition-all">
                <input
                  type="text"
                  placeholder="Find jewellery..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 outline-none text-gray-700"
                />
                <div className="bg-gray-50 flex items-center justify-center px-4 text-gray-500 border-l border-gray-200">
                  🔍
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-500 uppercase tracking-widest">Today's Rate</label>
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-4 border border-yellow-200 shadow-sm flex items-center gap-3">
                <span className="bg-yellow-200 p-2 rounded-full text-lg">📈</span>
                <div className="flex flex-col">
                  <span className="text-xs text-yellow-700 font-semibold uppercase">Gold 24K</span>
                  <span className="text-yellow-900 font-bold text-lg">
                    {goldPrice ? `${formatPrice(goldPrice)}/g` : "Fetching..."}
                  </span>
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="flex flex-col gap-2 mt-2">
              <label className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-1">Menu</label>
              {role === "admin" && (
                <Link
                  to="/create-product"
                  className="flex items-center gap-3 bg-white p-3.5 rounded-xl border border-gray-100 text-gray-700 hover:bg-yellow-50 hover:border-yellow-200 hover:text-yellow-700 transition font-medium shadow-sm"
                >
                  <span className="text-xl">➕</span> Add New Product
                </Link>
              )}
              
              {localStorage.getItem("authToken") && role === "user" && (
                <>
                  <Link
                    to="/cart"
                    className="flex items-center justify-between bg-white p-3.5 rounded-xl border border-gray-100 text-gray-700 hover:bg-yellow-50 hover:border-yellow-200 hover:text-yellow-700 transition font-medium shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">🛒</span> Shopping Cart
                    </div>
                    {cartItemCount > 0 && (
                      <span className="bg-red-500 text-white text-xs font-bold rounded-full px-3 py-1 shadow-sm">
                        {cartItemCount} items
                      </span>
                    )}
                  </Link>
                  <Link
                    to="/wishlist"
                    className="flex items-center gap-3 bg-white p-3.5 rounded-xl border border-gray-100 text-gray-700 hover:bg-yellow-50 hover:border-yellow-200 hover:text-yellow-700 transition font-medium shadow-sm"
                  >
                    <span className="text-xl">❤️</span> My Wishlist
                  </Link>
                </>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="mt-auto pt-6 border-t border-gray-200 pb-4">
              {localStorage.getItem("authToken") ? (
                <div onClick={() => setIsMobileMenuOpen(false)} className="w-full">
                  {/* SignOutButton needs to take full width or be styled appropriately. 
                      Since it's an external component, we wrap it. */}
                  <div className="flex justify-center w-full *:w-full *:justify-center *:py-3 *:rounded-xl *:text-base *:font-semibold">
                    <SignOutButton />
                  </div>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center justify-center w-full bg-yellow-600 text-white font-semibold py-3.5 rounded-xl hover:bg-yellow-700 transition shadow-md"
                >
                  Login to Account
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
