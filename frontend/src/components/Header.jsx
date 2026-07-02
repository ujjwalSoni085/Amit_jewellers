import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import SignOutButton from "./SignOutButton";
import axiosInstance from "../helpers/axiosInstance";
import { getRole } from "../helpers/auth";
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
      if (searchQuery.trim() !== "") {
        if (location.pathname !== "/products" || !location.search.includes(`search=${encodeURIComponent(searchQuery)}`)) {
          navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
        }
      } else if (location.pathname === "/products" && location.search.includes("search=")) {
        navigate("/products");
      }
    }, 300);

    return () => clearTimeout(searchTimer);
  }, [searchQuery, navigate, location.pathname, location.search]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <header className="sticky top-0 z-50 bg-gradient-to-r from-yellow-500 to-yellow-700 py-3 px-4 md:px-8 text-white shadow-md transition-all duration-300">
        <nav className="flex justify-between items-center max-w-[1800px] mx-auto w-full">
          {/* Left - Logo */}
          <Link to="/" className="flex items-center gap-3 no-underline group">
            <img
              src="/logo.png"
              alt="Amit Jewellers Logo"
              className="w-9 h-9 rounded-sm ring-2 ring-white/30 group-hover:ring-white transition-all duration-300 object-cover shadow-sm"
            />
            <span className="text-xl md:text-2xl font-serif font-bold text-white tracking-tight drop-shadow-sm">
              Amit Jewellers
            </span>
          </Link>

          {/* Center - Desktop Search */}
          {location.pathname !== "/" ? (
            <div className="hidden md:flex items-center bg-white/20 hover:bg-white/30 focus-within:bg-white rounded-sm px-4 py-2 flex-1 max-w-lg mx-8 transition-all duration-300 border border-white/30 focus-within:border-white shadow-inner group">
              <svg className="w-5 h-5 text-white group-focus-within:text-yellow-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              <input
                type="text"
                placeholder="Search for jewellery..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-3 outline-none text-white group-focus-within:text-gray-800 bg-transparent w-full text-sm font-medium placeholder-white/70 group-focus-within:placeholder-gray-400"
              />
            </div>
          ) : (
            <div className="hidden md:flex flex-1 max-w-lg mx-8"></div>
          )}

          {/* Right - Desktop Actions */}
          <div className="hidden md:flex items-center gap-6">
            {/* Gold Rate Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-sm text-xs font-semibold text-white shadow-sm">
              <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zM8 7h4v2H8V7zm0 4h4v2H8v-2z"></path></svg>
              {goldPrice ? `24K: ${formatPrice(goldPrice)}/g` : "Fetching..."}
            </div>

            <Link to="/products" className="text-white hover:text-yellow-200 transition-colors flex items-center gap-1 font-medium text-sm">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
              Shop
            </Link>

            {role === "admin" && (
              <Link to="/create-product" className="text-white hover:text-yellow-200 transition-colors flex items-center gap-1 font-medium text-sm">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v16m8-8H4"></path></svg>
                Add Product
              </Link>
            )}

            {localStorage.getItem("authToken") && role === "user" && (
              <div className="flex items-center gap-5">
                <Link to="/wishlist" className="text-white hover:text-yellow-200 transition-colors flex flex-col items-center gap-0.5 group">
                  <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                </Link>
                <Link to="/cart" className="relative text-white hover:text-yellow-200 transition-colors flex flex-col items-center gap-0.5 group">
                  <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-sm min-w-[18px] h-[18px] flex items-center justify-center border border-yellow-600 px-1 shadow-sm">
                      {cartItemCount > 9 ? "9+" : cartItemCount}
                    </span>
                  )}
                </Link>
              </div>
            )}

            {/* Profile Dropdown */}
            {localStorage.getItem("authToken") ? (
              <div className="relative flex items-center gap-2 group pb-2 pt-2 cursor-pointer ml-2">
                <div className="w-9 h-9 rounded-sm bg-white/20 flex items-center justify-center border-2 border-white/50 group-hover:border-white transition-all overflow-hidden shadow-sm">
                  {user && user.profile ? (
                    <img src={user.profile} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="font-bold text-white text-sm">{user?.name?.[0]?.toUpperCase() || (role === "admin" ? "A" : "U")}</span>
                  )}
                </div>
                
                {/* Dropdown Menu */}
                <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-sm shadow-md overflow-hidden hidden group-hover:flex flex-col z-50 border border-gray-100 transition-all duration-300 transform origin-top-right text-gray-800">
                  <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-800">{user?.name || (role === "admin" ? "Admin User" : "Customer")}</p>
                    <p className="text-xs text-gray-500">{role === "admin" ? "Administrator" : "Member"}</p>
                  </div>
                  <Link to={role === "admin" ? "/admin" : "/profile"} className="px-4 py-3 text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-700 font-medium flex items-center gap-3 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                    {role === "admin" ? "Dashboard" : "My Profile"}
                  </Link>
                  {role === "user" && (
                    <Link to="/orders" className="px-4 py-3 text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-700 font-medium flex items-center gap-3 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                      My Orders
                    </Link>
                  )}
                  <div className="border-t border-gray-100">
                    <SignOutButton className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 font-medium cursor-pointer flex items-center gap-3 transition-colors" />
                  </div>
                </div>
              </div>
            ) : (
              <Link to="/login" className="bg-white text-yellow-700 font-bold px-5 py-2 rounded-sm hover:bg-yellow-50 hover:shadow-md transition-all duration-300 shadow-md text-sm">
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Right - Icons & Hamburger */}
          <div className="flex md:hidden items-center gap-4">
            {localStorage.getItem("authToken") && role === "user" && (
              <Link to="/cart" className="relative text-white flex items-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                {cartItemCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-sm min-w-[18px] h-[18px] flex items-center justify-center border border-yellow-600">
                    {cartItemCount > 9 ? "9+" : cartItemCount}
                  </span>
                )}
              </Link>
            )}
            
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="text-white hover:text-yellow-200 focus:outline-none transition-colors"
              aria-label="Open Mobile Menu"
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 z-[60] transform ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out md:hidden`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity duration-300 ${
            isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>

        {/* Drawer Content */}
        <div className="absolute top-0 left-0 h-full w-[85%] max-w-sm bg-white flex flex-col shadow-md overflow-y-auto">
          {/* Drawer Header */}
          <div className="bg-gradient-to-r from-yellow-500 to-yellow-700 py-5 px-5 flex justify-between items-center shadow-sm text-white">
            <div className="flex items-center gap-3 font-semibold text-lg">
              <img src="/logo.png" alt="Logo" className="w-8 h-8 rounded-sm object-cover ring-2 ring-white/50" />
              <span className="font-serif font-bold drop-shadow-sm">Amit Jewellers</span>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-white hover:text-yellow-200 transition-colors bg-white/20 rounded-sm p-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 p-5 flex flex-col gap-6">
            {/* User Profile Summary */}
            {localStorage.getItem("authToken") && (
              <div className="flex items-center gap-4 pb-5 border-b border-gray-100">
                <div className="w-14 h-14 rounded-sm bg-yellow-50 flex items-center justify-center border border-yellow-200 shadow-sm overflow-hidden text-yellow-700">
                  {user && user.profile ? (
                    <img src={user.profile} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xl font-bold">{user?.name?.[0]?.toUpperCase() || (role === "admin" ? "A" : "U")}</span>
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-gray-900 text-lg tracking-tight">
                    {user?.name || (role === "admin" ? "Admin" : "User")}
                  </span>
                  <span className="text-xs text-yellow-600 font-semibold uppercase tracking-wider">{role}</span>
                </div>
              </div>
            )}

            {/* Mobile Search */}
            {location.pathname !== "/" && (
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Search</label>
                <div className="flex bg-gray-50 rounded-sm border border-gray-200 overflow-hidden shadow-inner focus-within:bg-white focus-within:ring-2 focus-within:ring-yellow-400 focus-within:border-transparent transition-all">
                  <input
                    type="text"
                    placeholder="Find jewellery..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-3 outline-none text-gray-700 text-sm bg-transparent"
                  />
                  <div className="flex items-center justify-center px-4 text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Stats */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Today's Rate</label>
              <div className="bg-yellow-50 rounded-sm p-4 border border-yellow-100 flex items-center gap-3">
                <div className="bg-yellow-100 p-2 rounded-sm text-yellow-600">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd"></path></svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-yellow-700 font-medium">Gold 24K</span>
                  <span className="text-yellow-900 font-bold text-base">
                    {goldPrice ? `${formatPrice(goldPrice)}/g` : "Fetching..."}
                  </span>
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="flex flex-col gap-1.5 mt-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Menu</label>
              
              <Link to="/products" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-sm text-gray-700 hover:bg-gray-50 hover:text-yellow-600 transition font-medium">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg> Shop All
              </Link>

              {role === "admin" && (
                <Link to="/create-product" className="flex items-center gap-3 p-3 rounded-sm text-gray-700 hover:bg-gray-50 hover:text-yellow-600 transition font-medium">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg> Add New Product
                </Link>
              )}
              
              {localStorage.getItem("authToken") && role === "user" && (
                <>
                  <Link to="/cart" className="flex items-center justify-between p-3 rounded-sm text-gray-700 hover:bg-gray-50 hover:text-yellow-600 transition font-medium">
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg> Shopping Cart
                    </div>
                    {cartItemCount > 0 && (
                      <span className="bg-red-500 text-white text-[10px] font-bold rounded-sm px-2 py-0.5">
                        {cartItemCount}
                      </span>
                    )}
                  </Link>
                  <Link to="/wishlist" className="flex items-center gap-3 p-3 rounded-sm text-gray-700 hover:bg-gray-50 hover:text-yellow-600 transition font-medium">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg> My Wishlist
                  </Link>
                  <Link to="/profile" className="flex items-center gap-3 p-3 rounded-sm text-gray-700 hover:bg-gray-50 hover:text-yellow-600 transition font-medium">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg> My Profile
                  </Link>
                  <Link to="/orders" className="flex items-center gap-3 p-3 rounded-sm text-gray-700 hover:bg-gray-50 hover:text-yellow-600 transition font-medium">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg> My Orders
                  </Link>
                </>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="mt-auto pt-6 border-t border-gray-100 pb-4">
              {localStorage.getItem("authToken") ? (
                <div onClick={() => setIsMobileMenuOpen(false)} className="w-full">
                  <SignOutButton className="flex items-center justify-center w-full bg-red-50 text-red-600 font-semibold py-3 rounded-sm hover:bg-red-100 transition border border-red-100" />
                </div>
              ) : (
                <Link to="/login" className="flex items-center justify-center w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-semibold py-3 rounded-sm hover:from-yellow-600 hover:to-yellow-700 transition shadow-md">
                  Sign In
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
