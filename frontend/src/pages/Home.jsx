import React, { useEffect, useState, useCallback } from "react";
import axiosInstance from "../helper/axiosInstance";
import { useNavigate, useLocation } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import ProductSkeleton from "../components/ProductSkeleton";
import FilterSidebar from "../components/FilterSidebar";
import "../App.css";

/* ─── Helpers ─────────────────────────────────────── */
const buildParams = (query, filters, page) => {
  const params = new URLSearchParams();
  if (query) params.append("search", query);
  if (filters.category) params.append("category", filters.category);
  if (filters.purity) params.append("purity", filters.purity);
  if (filters.minPrice) params.append("minPrice", filters.minPrice);
  if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);
  if (filters.inStock) params.append("inStock", "true");
  params.append("page", page);
  params.append("limit", 12);
  return params.toString();
};

/**
 * Returns an array like: [1, '…', 4, 5, 6, '…', 12]
 * Always shows first, last, current ±1 pages.
 */
const buildPageRange = (current, total) => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages = new Set([1, total, current]);
  if (current > 1) pages.add(current - 1);
  if (current < total) pages.add(current + 1);

  const sorted = [...pages].sort((a, b) => a - b);
  const result = [];
  let prev = 0;
  for (const p of sorted) {
    if (p - prev > 1) result.push("…");
    result.push(p);
    prev = p;
  }
  return result;
};

/* ─── Active Filter Chips ─────────────────────────── */
const FilterChips = ({ filters, query, setFilters }) => {
  const chips = [];
  if (query) chips.push({ label: `"${query}"`, type: "query" });
  if (filters.category) chips.push({ label: filters.category, type: "category" });
  if (filters.purity) chips.push({ label: filters.purity, type: "purity" });
  if (filters.minPrice || filters.maxPrice) {
    const from = filters.minPrice ? `₹${filters.minPrice}` : "any";
    const to = filters.maxPrice ? `₹${filters.maxPrice}` : "any";
    chips.push({ label: `${from} – ${to}`, type: "price" });
  }
  if (filters.inStock) chips.push({ label: "In Stock", type: "inStock" });

  if (chips.length === 0) return null;

  const remove = (type) => {
    if (type === "query") return; // query comes from URL – not clearable here
    if (type === "price") return setFilters(prev => ({ ...prev, minPrice: "", maxPrice: "" }));
    if (type === "inStock") return setFilters(prev => ({ ...prev, inStock: false }));
    setFilters(prev => ({ ...prev, [type]: "" }));
  };

  return (
    <div className="flex flex-wrap items-center gap-2 mb-5">
      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Active:</span>
      {chips.map((chip) => (
        <span
          key={chip.type}
          className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-50 border border-yellow-200 text-yellow-800 text-xs font-semibold rounded-full"
        >
          {chip.label}
          {chip.type !== "query" && (
            <button
              onClick={() => remove(chip.type)}
              className="hover:text-yellow-600 transition"
              aria-label={`Remove ${chip.label} filter`}
            >
              ✕
            </button>
          )}
        </span>
      ))}
    </div>
  );
};

/* ─── Pagination ──────────────────────────────────── */
const Pagination = ({ currentPage, totalPages, onChange }) => {
  if (totalPages <= 1) return null;
  const range = buildPageRange(currentPage, totalPages);

  return (
    <nav
      role="navigation"
      aria-label="Pagination"
      className="flex items-center justify-center gap-1.5 mt-10 flex-wrap"
    >
      {/* Previous */}
      <button
        id="pagination-prev"
        onClick={() => onChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 bg-white hover:bg-yellow-50 hover:border-yellow-300 disabled:opacity-40 disabled:cursor-not-allowed transition"
        aria-label="Previous page"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Prev
      </button>

      {/* Page numbers */}
      {range.map((item, idx) =>
        item === "…" ? (
          <span key={`ellipsis-${idx}`} className="px-2 py-2 text-gray-400 text-sm select-none">
            …
          </span>
        ) : (
          <button
            key={item}
            id={`pagination-page-${item}`}
            onClick={() => onChange(item)}
            aria-current={item === currentPage ? "page" : undefined}
            className={`min-w-[2.25rem] h-9 rounded-lg text-sm font-semibold border transition ${item === currentPage
                ? "bg-yellow-500 border-yellow-500 text-white shadow-sm"
                : "bg-white border-gray-200 text-gray-600 hover:bg-yellow-50 hover:border-yellow-300"
              }`}
          >
            {item}
          </button>
        )
      )}

      {/* Next */}
      <button
        id="pagination-next"
        onClick={() => onChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 bg-white hover:bg-yellow-50 hover:border-yellow-300 disabled:opacity-40 disabled:cursor-not-allowed transition"
        aria-label="Next page"
      >
        Next
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Jump indicator */}
      <span className="text-xs text-gray-400 ml-2">
        Page {currentPage} of {totalPages}
      </span>
    </nav>
  );
};

/* ─── Main Page ───────────────────────────────────── */
const Home = () => {
  const [products, setProducts] = useState([]);
  const [carousel, setCarousel] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);

  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search).get("search") || "";

  // Pagination & Filtering state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    category: "",
    purity: "",
    minPrice: "",
    maxPrice: "",
    inStock: false,
  });

  /* ── Carousel fetch ── */
  useEffect(() => {
    axiosInstance
      .get("/carousel")
      .then((res) => setCarousel(res.data))
      .catch((err) => console.error("Carousel error:", err));
  }, []);

  /* ── Auto-advance carousel ── */
  useEffect(() => {
    if (!carousel || carousel.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === carousel.length - 1 ? 0 : prev + 1));
    }, 3000);
    return () => clearInterval(interval);
  }, [carousel]);

  /* ── Reset to page 1 whenever filters/query change ── */
  useEffect(() => {
    setCurrentPage(1);
  }, [query, filters]);

  /* ── Fetch products ── */
  const fetchProducts = useCallback(() => {
    setProductsLoading(true);
    axiosInstance
      .get(`/products?${buildParams(query, filters, currentPage)}`)
      .then((res) => {
        if (res.data && res.data.products) {
          setProducts(res.data.products);
          setTotalPages(res.data.totalPages || 1);
          setCurrentPage(res.data.currentPage || 1);
          setTotalProducts(res.data.totalProducts || 0);
        } else {
          setProducts(Array.isArray(res.data) ? res.data : []);
          setTotalPages(1);
          setTotalProducts(0);
        }
      })
      .catch((err) => console.error("Products error:", err))
      .finally(() => setProductsLoading(false));
  }, [query, filters, currentPage]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleViewProduct = (id) => navigate(`/product/${id}`);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll back to top of product grid smoothly
    document.getElementById("product-grid-top")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div>
      <main className="p-4 md:p-6 text-center">

        {/* ── Premium Carousel Banner ── */}
        <div className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden rounded-2xl shadow-2xl group mt-2">
          <div
            className="flex transition-transform duration-1000 ease-out h-full"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {carousel.slice(0, 10).map((slide, index) => (
              <div
                key={slide._id}
                className="w-full flex-shrink-0 relative h-full bg-gray-900 overflow-hidden"
              >
                {/* Image with slight zoom effect when active */}
                <img
                  src={slide.image}
                  alt={slide.title}
                  className={`h-full w-full object-contain md:object-cover transition-transform duration-[3000ms] ease-in-out ${
                    index === currentIndex ? "scale-105" : "scale-100"
                  }`}
                />
                
                {/* Gradient Overlay for better text visibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none"></div>

                {/* Text Content Overlay */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-16 text-left">
                  <div className="max-w-3xl transform transition-all duration-700 translate-y-0 opacity-100">
                    <span className="inline-block text-yellow-400 font-bold uppercase tracking-[0.2em] text-xs md:text-sm mb-3 drop-shadow-md">
                      Exclusive Collection
                    </span>
                    <h2 className="text-3xl md:text-6xl font-serif font-bold text-white mb-4 leading-tight drop-shadow-lg">
                      {slide.title || "Elegant Jewellery Collection"}
                    </h2>
                    <p className="text-gray-200 text-sm md:text-lg mb-8 max-w-xl drop-shadow-md hidden md:block leading-relaxed">
                      Discover our latest premium designs crafted with precision and passion. Shine brighter with every beautifully crafted piece.
                    </p>
                    <button 
                      onClick={() => document.getElementById('product-grid-top')?.scrollIntoView({ behavior: "smooth" })} 
                      className="px-8 py-3.5 bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-white font-semibold rounded-full shadow-[0_0_20px_rgba(202,138,4,0.4)] hover:shadow-[0_0_25px_rgba(202,138,4,0.6)] transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-2"
                    >
                      Shop Collection
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          {carousel.length > 1 && (
            <>
              <button
                onClick={() => setCurrentIndex((prev) => (prev === 0 ? carousel.length - 1 : prev - 1))}
                className="absolute top-1/2 left-4 md:left-8 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-black/20 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 shadow-lg"
                aria-label="Previous Slide"
              >
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
              </button>
              <button
                onClick={() => setCurrentIndex((prev) => (prev === carousel.length - 1 ? 0 : prev + 1))}
                className="absolute top-1/2 right-4 md:right-8 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-black/20 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 shadow-lg"
                aria-label="Next Slide"
              >
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
              </button>
            </>
          )}

          {/* Modern Progress Dash Indicators */}
          {carousel.length > 1 && (
            <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex gap-2.5 z-10">
              {carousel.slice(0, 10).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`h-1.5 rounded-full transition-all duration-500 ease-in-out ${
                    i === currentIndex ? "w-10 bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.8)]" : "w-3 bg-white/40 hover:bg-white/70"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── Collection Section ── */}
        <div id="product-grid-top" className="flex flex-col md:flex-row gap-6 p-4 md:p-6 items-start text-left mt-10 scroll-mt-4">

          {/* Sidebar */}
          <FilterSidebar filters={filters} setFilters={setFilters} />

          {/* Product Grid */}
          <div className="w-full min-w-0">

            {/* Section header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
              <p className="text-xl font-bold text-gray-800 tracking-tight">Our Collection</p>
              {!productsLoading && (
                <p className="text-sm text-gray-400">
                  {totalProducts > 0
                    ? `${totalProducts} item${totalProducts !== 1 ? "s" : ""} found`
                    : ""}
                </p>
              )}
            </div>

            {/* Active filter chips */}
            <FilterChips filters={filters} query={query} setFilters={setFilters} />

            {/* Grid */}
            <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-5 w-full">
              {productsLoading ? (
                Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)
              ) : products.length > 0 ? (
                products.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onViewProduct={handleViewProduct}
                  />
                ))
              ) : (
                <div className="w-full py-16 flex flex-col items-center gap-3 text-gray-400">
                  <svg className="w-12 h-12 text-gray-200" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                  </svg>
                  <p className="text-base font-semibold">No products found</p>
                  <p className="text-sm">Try adjusting your filters or search query.</p>
                </div>
              )}
            </div>

            {/* ── Pagination ── */}
            {!productsLoading && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onChange={handlePageChange}
              />
            )}

          </div>
        </div>

        {/* ── Promo Video ── */}
        <div className="mt-12 px-4 md:px-6">
          <video
            className="w-full rounded-2xl shadow-lg"
            controls
            autoPlay
            muted
            loop
          >
            <source src="/video/amit-jewellers.mp4?v=5" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

      </main>
    </div>
  );
};

export default Home;
