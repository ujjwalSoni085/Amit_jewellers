import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [goldPrice, setGoldPrice] = useState(null);

  useEffect(() => {
    const fetchGoldPrice = async () => {
      try {
        const response = await fetch("https://www.goldapi.io/api/XAU/INR", {
          method: "GET",
          headers: {
            "x-access-token": "goldapi-3l15hsm9ekjy1g-io",
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        setGoldPrice(data.price_gram_24k.toFixed(2));
      } catch (error) {
        console.error("Error fetching gold price:", error);
      }
    };

    fetchGoldPrice();
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();
    console.log("Search Query:", searchQuery);
  };

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-yellow-500 to-yellow-700 py-3 px-6 text-white shadow-md">
      <nav className="flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto gap-3 md:gap-0">

        {/* Left - Logo & Add Product */}
        <div className="flex items-center gap-4 text-base font-semibold">
          <Link to="/" className="flex items-center text-white no-underline">
            <img
              src="/logo.png"  // <-- Place your image in /public/logo.png
              alt="Amit Jewellers Logo"
              className="w-7 h-7 mr-2"
            />
            Amit Jewellers
          </Link>
          <Link
            to="/create-product"
            className="bg-white text-yellow-700 font-medium px-3 py-1 rounded-full hover:bg-yellow-100 transition shadow-sm text-sm"
          >
            ➕ Add Product
          </Link>
        </div>

        {/* Center - Search */}
        <form
          onSubmit={handleSearch}
          className="flex items-center bg-white rounded-full px-3 py-1 shadow-md"
        >
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-3 py-1 outline-none text-black rounded-l-full w-36 md:w-52 text-sm"
          />
          <button
            type="submit"
            className="bg-yellow-500 text-white px-4 py-1 rounded-r-full hover:bg-yellow-700 transition text-sm"
          >
            🔍
          </button>
        </form>

        {/* Right - Gold Price */}
        <div className="text-sm font-medium text-white">
          {goldPrice ? `💰 Gold 24K: ₹${goldPrice}/g` : "Fetching gold price..."}
        </div>
      </nav>
    </header>
  );
};

export default Header;
