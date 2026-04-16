import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import SignOutButton from "./SignOutButton";
import axiosInstance from "../helper/axiosInstance";
import { getRole } from "../helper/auth";
import { formatPrice } from "../utils/formatPrice";
// import Cookies from "js-cookie";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [goldPrice, setGoldPrice] = useState(null);
  const [user, setUser] = useState(null);
  const [cartItemCount, setCartItemCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  // Role and auth state
  const role = getRole();

  // Fetch user/admin profile based on role
  const fetchUserProfile = async () => {
    if (!localStorage.getItem("authToken")) {
      setUser(null);
      return;//both update the user or admin 
    }
    try {
      if (getRole() === "admin") {
        const res = await axiosInstance.get("/admin/");
        setUser(res.data.admin);
      } else {
        const response = await axiosInstance.get("/user");
        setUser(response.data.user);
      }
    } catch (error) {
      setUser(null);
    }
  };

  useEffect(() => {
    fetchUserProfile();
    const handler = () => fetchUserProfile();//for extra logic additoin other wise we can also directly call fetchUserProfile
    window.addEventListener("auth-changed", handler);
    return () => window.removeEventListener("auth-changed", handler);
  }, []);

  // Fetch cart count
  const fetchCartCount = async () => {
    if (!localStorage.getItem("authToken") || role === "admin") {
      setCartItemCount(0);
      return;
    }
    try {
      const res = await axiosInstance.get("/cart");
      const totalItems = res.data.cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
      setCartItemCount(totalItems);
    } catch (error) {
      setCartItemCount(0);
    }
  };

  useEffect(() => {
    fetchCartCount();
    const handler = () => fetchCartCount();
    window.addEventListener("cart-updated", handler);
    return () => window.removeEventListener("cart-updated", handler);
  }, [role]);

  // Fetch gold price from backend
  useEffect(() => {
    const fetchGoldPrice = async () => {
      try {
        const res = await axiosInstance.get("/prices");
        const gold = res.data.find((p) => p.metal === "gold");
        setGoldPrice(gold ? Number(gold.pricePerGram).toFixed(2) : null);//price per gram and round it to 2 decimal places
      } catch (error) {
        console.error("Error fetching gold price:", error);
      }
    };
    fetchGoldPrice();
  }, []);

  const handleSearch = (event) => {
    event.preventDefault(); // Prevent form submission
  };

  // Update search results as user types
  useEffect(() => {
    const searchTimer = setTimeout(() => {
      // Only drive navigation from header search when on the Home page
      if (location.pathname === "/") {
        if (searchQuery.trim() !== "") {
          navigate(`/?search=${encodeURIComponent(searchQuery)}`);
        } else {
          navigate("/"); // Clear search when query is empty
        }
      }
    }, 300);

    return () => clearTimeout(searchTimer);
  }, [searchQuery, navigate, location.pathname]);

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-yellow-500 to-yellow-700 py-3 px-6 text-white shadow-md">
      <nav className="flex flex-col md:flex-row justify-between items-center max-w-[1800px] mx-auto gap-3 md:gap-0 w-full">
        {/* Left - Logo & Add Product */}
        <div className="flex items-center gap-4 text-base font-semibold">
          <Link to="/" className="flex items-center text-white no-underline">
            <img
              src="/logo.png"
              alt="Amit Jewellers Logo"
              className="w-8 h-8 mr-2 rounded-full ring-2 ring-white/70 bg-white object-cover"
            />
            Amit Jewellers
          </Link>
          {/* Show Add Product only for admin (role from localStorage) */}
          {role === "admin" && (
            <Link
              to="/create-product"
              className="bg-white text-yellow-700 font-medium px-3 py-1 rounded-full hover:bg-yellow-100 transition shadow-sm text-sm"
            >
              ➕ Add Product
            </Link>
          )}
        </div>

        {/* Center - Search */}
        <div className="flex items-center bg-white rounded-full px-3 py-1 shadow-md">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-3 py-1 outline-none text-black rounded-l-full w-44 md:w-64 text-sm"
          />
          <span className="bg-yellow-500 text-white px-4 py-1 rounded-r-full text-sm">
            🔍
          </span>
        </div>

        {/* Right - Gold Price, Cart, and User Profile */}
        <div className="flex items-center gap-4">
          <div className="text-sm font-medium text-white">
            {goldPrice
              ? `💰 Gold 24K: ${formatPrice(goldPrice)}/g`
              : "Fetching gold price..."}
          </div>
          {/* Cart Icon - Only show for logged-in users (not admin) */}
          {localStorage.getItem("authToken") && role === "user" && (
            <Link
              to="/cart"
              className="relative bg-white text-yellow-700 font-medium px-3 py-1 rounded-full hover:bg-yellow-100 transition shadow-sm text-sm flex items-center gap-1"
            >
              🛒 Cart
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount > 9 ? "9+" : cartItemCount}
                </span>
              )}
            </Link>
          )}
          {localStorage.getItem("authToken") ? (
            <div className="flex items-center gap-2">
              {user && user.profile ? (
                <img
                  src={user.profile}
                  alt="Profile"
                  className="w-8 h-8 rounded-full border-2 border-white"
                />
              ) : null}
              <span className="text-sm font-medium">
                {user?.name || (role === "admin" ? "Admin" : "User")}
              </span>
              <SignOutButton />
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-white text-yellow-700 font-medium px-3 py-1 rounded-full hover:bg-yellow-100 transition shadow sm text-sm"
            >
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
