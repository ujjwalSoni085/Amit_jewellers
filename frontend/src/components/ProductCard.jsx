import React from "react";
import { useLocation } from "react-router-dom";
import { formatPrice } from "../utils/formatPrice";

const ProductCard = ({ product, onDelete, onViewProduct }) => {
  const location = useLocation();

  return (
    <div className="flex flex-col h-full rounded-2xl border border-gray-100 bg-white p-4 w-full shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
      {/* Image Container (Fixed Height) */}
      <div className="relative overflow-hidden rounded-xl bg-gray-50 flex items-center justify-center p-2 h-48 md:h-56 shrink-0">
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          className="w-full h-full object-contain drop-shadow-sm group-hover:scale-105 transition-transform duration-500 ease-in-out"
        />
        {/* Optional: Add a subtle overlay on hover to make it feel premium */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 pointer-events-none rounded-xl"></div>
      </div>
      
      {/* Details & Actions Container */}
      <div className="flex flex-col flex-1 mt-4">
        {/* Product Details */}
        <h2 className="text-lg font-serif font-bold text-gray-900 line-clamp-1 tracking-tight" title={product.title}>
          {product.title}
        </h2>
        <div className="mt-1.5 flex items-center justify-between text-sm mb-4">
          <span className="text-gray-500 font-medium bg-gray-100 px-2 py-0.5 rounded-md text-xs shrink-0">{product.weight}g · {product.metalType}</span>
          <span className="font-bold text-yellow-700 text-lg whitespace-nowrap ml-2">{formatPrice(product.price)}</span>
        </div>

        {/* Buttons (pushed to the bottom) */}
        <div className="mt-auto flex flex-col gap-2">
          <button
            onClick={() => onViewProduct(product._id)}
            className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-semibold py-2.5 rounded-xl hover:from-yellow-600 hover:to-yellow-700 shadow-md hover:shadow-lg transition-all duration-300 flex justify-center items-center gap-2"
          >
            View Product
            <svg className="w-4 h-4 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
          </button>

          {location.pathname === "/admin" && (
            <button
              onClick={() => onDelete(product._id)}
              className="w-full border border-red-200 text-red-600 font-medium py-2 rounded-xl hover:bg-red-50 transition-colors"
            >
              Delete Item
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
