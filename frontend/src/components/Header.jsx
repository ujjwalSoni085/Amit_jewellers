import React, { useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (event) => {
    event.preventDefault();
    console.log("Search Query:", searchQuery);
  };

  return (
    <header className="bg-gradient-to-r from-yellow-500 to-yellow-700 p-6 text-white text-center text-2xl font-extrabold shadow-md">
      <nav className="flex justify-between items-center max-w-4xl mx-auto">
        <div className="flex gap-6">
          <Link to="/" className="hover:underline">🏠 Home</Link>
          <Link to="/create-product" className="hover:underline">➕ Add Product</Link>
        </div>
        <form onSubmit={handleSearch} className="flex items-center bg-white rounded-full p-2 shadow-md">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-1 outline-none text-black rounded-l-full w-40 md:w-60"
          />
          <button
            type="submit"
            className="bg-yellow-500 text-white px-4 py-1 rounded-r-full hover:bg-yellow-700 transition"
          >
            🔍
          </button>
        </form>
      </nav>
      <h1 className="tracking-wide mt-3">✨ Amit Jewellers ✨</h1>
    </header>
  );
};

export default Header;
