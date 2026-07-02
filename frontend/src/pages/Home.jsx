import React, { useEffect, useState, useCallback } from "react";
import axiosInstance from "../helpers/axiosInstance";
import { useNavigate, Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import ProductSkeleton from "../components/ProductSkeleton";
import "../App.css";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [carousel, setCarousel] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance
      .get("/carousel")
      .then((res) => setCarousel(res.data))
      .catch((err) => console.error("Carousel error:", err));
  }, []);

  useEffect(() => {
    if (!carousel || carousel.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === carousel.length - 1 ? 0 : prev + 1));
    }, 3000);
    return () => clearInterval(interval);
  }, [carousel]);

  const fetchProducts = useCallback(() => {
    setProductsLoading(true);
    axiosInstance
      .get(`/products?limit=8`)
      .then((res) => {
        if (res.data && res.data.products) {
          setProducts(res.data.products);
        } else {
          setProducts(Array.isArray(res.data) ? res.data : []);
        }
      })
      .catch((err) => console.error("Products error:", err))
      .finally(() => setProductsLoading(false));
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleViewProduct = (id) => navigate(`/product/${id}`);

  return (
    <div>
      <main className="p-4 md:p-6 text-center">

        <div className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden rounded-sm shadow-md group mt-2">
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
                    <h2 className="text-3xl md:text-6xl font-serif font-bold text-white mb-4 leading-tight drop-shadow-md">
                      {slide.title || "Elegant Jewellery Collection"}
                    </h2>
                    <p className="text-gray-200 text-sm md:text-lg mb-8 max-w-xl drop-shadow-md hidden md:block leading-relaxed">
                      Discover our latest premium designs crafted with precision and passion. Shine brighter with every beautifully crafted piece.
                    </p>
                    <button 
                      onClick={() => document.getElementById('product-grid-top')?.scrollIntoView({ behavior: "smooth" })} 
                      className="px-8 py-3.5 bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-white font-semibold rounded-sm shadow-[0_0_20px_rgba(202,138,4,0.4)] hover:shadow-[0_0_25px_rgba(202,138,4,0.6)] transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-2"
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
                className="absolute top-1/2 left-4 md:left-8 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-black/20 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white rounded-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 shadow-md"
                aria-label="Previous Slide"
              >
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
              </button>
              <button
                onClick={() => setCurrentIndex((prev) => (prev === carousel.length - 1 ? 0 : prev + 1))}
                className="absolute top-1/2 right-4 md:right-8 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-black/20 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white rounded-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 shadow-md"
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
                  className={`h-1.5 rounded-sm transition-all duration-500 ease-in-out ${
                    i === currentIndex ? "w-10 bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.8)]" : "w-3 bg-white/40 hover:bg-white/70"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        <div id="product-grid-top" className="flex flex-col gap-6 p-4 md:p-6 items-center text-center mt-10 scroll-mt-4 max-w-7xl mx-auto">
          
          <h3 className="text-3xl font-serif font-bold text-gray-800 tracking-tight mb-2">Featured Collection</h3>
          <p className="text-gray-500 mb-6 max-w-2xl">Discover our handpicked selection of premium jewellery designed to make you shine on every occasion.</p>

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
              <div className="w-full py-16 flex flex-col items-center gap-3 text-gray-400 col-span-full">
                <svg className="w-12 h-12 text-gray-200" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                </svg>
                <p className="text-base font-semibold">No featured products found</p>
              </div>
            )}
          </div>

          <div className="mt-8">
            <Link 
              to="/products"
              className="inline-block px-8 py-3 bg-white border-2 border-yellow-500 text-yellow-600 font-bold rounded-sm hover:bg-yellow-500 hover:text-white transition-all duration-300"
            >
              View All Products
            </Link>
          </div>
        </div>

        <div className="py-8 md:py-12 px-4 flex justify-center w-full">
          <div className="w-full max-w-[1000px]">
            <video
              className="w-full aspect-video object-cover rounded-2xl shadow-lg"
              controls
              autoPlay
              muted
              loop
              playsInline
            >
              <source src="/video/amit-jewellers.mp4?v=5" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>

      </main>
    </div>
  );
};

export default Home;
