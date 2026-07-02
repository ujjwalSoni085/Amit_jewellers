import React, { useState } from 'react';

const CATEGORIES = [
  "Rings", "Necklaces", "Earrings", "Bracelets",
  "Pendants", "Chains", "Bangles", "Mangalsutras", "Coins", "Sets"
];

const PURITIES = ["24K", "22K", "18K", "14K", "925 Sterling (Silver)"];

const FilterSidebar = ({ filters, setFilters }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleCategoryToggle = (cat) => {
    setFilters(prev => ({ ...prev, category: prev.category === cat ? "" : cat }));
  };

  const handlePurityToggle = (pur) => {
    setFilters(prev => ({ ...prev, purity: prev.purity === pur ? "" : pur }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const clearAll = () => {
    setFilters({ category: "", purity: "", minPrice: "", maxPrice: "", inStock: false });
  };

  // Count active filters for badge
  const activeCount = [
    filters.category,
    filters.purity,
    filters.minPrice,
    filters.maxPrice,
    filters.inStock,
  ].filter(Boolean).length;

  const SidebarContent = () => (
    <div className="flex flex-col gap-6">

      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-gray-800 tracking-tight">Filters</span>
          {activeCount > 0 && (
            <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-yellow-500 rounded-sm">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            onClick={clearAll}
            className="text-xs font-semibold text-yellow-600 hover:text-yellow-800 underline underline-offset-2 transition"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Divider */}
      <hr className="border-gray-100" />

      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Category</p>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => {
            const active = filters.category === cat;
            return (
              <button
                key={cat}
                onClick={() => handleCategoryToggle(cat)}
                className={`px-3 py-1.5 rounded-sm text-sm font-medium border transition-all duration-200 ${
                  active
                    ? "bg-yellow-500 border-yellow-500 text-white shadow-sm"
                    : "bg-white border-gray-200 text-gray-600 hover:border-yellow-400 hover:text-yellow-600"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Divider */}
      <hr className="border-gray-100" />

      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Purity</p>
        <div className="flex flex-wrap gap-2">
          {PURITIES.map((pur) => {
            const active = filters.purity === pur;
            return (
              <button
                key={pur}
                onClick={() => handlePurityToggle(pur)}
                className={`px-3 py-1.5 rounded-sm text-sm font-medium border transition-all duration-200 ${
                  active
                    ? "bg-yellow-500 border-yellow-500 text-white shadow-sm"
                    : "bg-white border-gray-200 text-gray-600 hover:border-yellow-400 hover:text-yellow-600"
                }`}
              >
                {pur}
              </button>
            );
          })}
        </div>
      </div>

      {/* Divider */}
      <hr className="border-gray-100" />

      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Price Range (₹)</p>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
            <input
              type="number"
              name="minPrice"
              placeholder="Min"
              value={filters.minPrice}
              onChange={handleChange}
              min="0"
              className="w-full pl-7 pr-3 py-2 border border-gray-200 rounded-sm text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
            />
          </div>
          <span className="text-gray-300 font-bold">—</span>
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
            <input
              type="number"
              name="maxPrice"
              placeholder="Max"
              value={filters.maxPrice}
              onChange={handleChange}
              min="0"
              className="w-full pl-7 pr-3 py-2 border border-gray-200 rounded-sm text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
            />
          </div>
        </div>
      </div>

      {/* Divider */}
      <hr className="border-gray-100" />

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-700">In Stock Only</p>
          <p className="text-xs text-gray-400 mt-0.5">Show available items</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            name="inStock"
            checked={filters.inStock}
            onChange={handleChange}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 rounded-sm peer peer-checked:bg-yellow-500 transition-colors duration-300 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-sm after:h-5 after:w-5 after:transition-all after:duration-300 peer-checked:after:translate-x-5 shadow-inner" />
        </label>
      </div>

    </div>
  );

  return (
    <>
      <div className="md:hidden mb-4">
        <button
          onClick={() => setMobileOpen(prev => !prev)}
          className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-sm shadow-sm text-gray-700 font-semibold"
        >
          <span className="flex items-center gap-2">
            {/* funnel icon */}
            <svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M7 9h10M11 14h2" />
            </svg>
            Filters
            {activeCount > 0 && (
              <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-yellow-500 rounded-sm">
                {activeCount}
              </span>
            )}
          </span>
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${mobileOpen ? 'rotate-180' : ''}`}
            fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Mobile Drawer */}
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${mobileOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="mt-2 bg-white border border-gray-100 rounded-sm shadow-md p-5">
            <SidebarContent />
          </div>
        </div>
      </div>

      <aside className="hidden md:block w-64 shrink-0 self-start sticky top-4">
        <div className="bg-white border border-gray-100 rounded-sm shadow-md p-5">
          <SidebarContent />
        </div>
      </aside>
    </>
  );
};

export default FilterSidebar;
