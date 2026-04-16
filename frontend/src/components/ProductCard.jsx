import React from "react";
import { useLocation } from "react-router-dom";
import { formatPrice } from "../utils/formatPrice";

const ProductCard = ({ product, onDelete, onViewProduct }) => {//insted of passing id we can also pass the whole product object
  const location = useLocation();


  return (
    <div className="rounded-2xl border border-yellow-200 bg-white p-4 w-64 shadow-sm hover:shadow-md transition">
      <div className="relative overflow-hidden rounded-xl">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-40 object-cover"
        />
      </div>
      <h2 className="text-lg font-semibold mt-3 text-gray-900 line-clamp-1">
        {product.title}
      </h2>
      <div className="mt-1 flex items-center justify-between text-sm">
        <span className="text-gray-600">{product.weight}g · {product.metalType}</span>
        <span className="font-bold text-yellow-700">{formatPrice(product.price)}</span>
      </div>

      <button
        onClick={() => onViewProduct(product._id)}
        className="mt-3 w-full bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 transition"
      >
        View Product
      </button>

      {location.pathname === "/admin" && (
        <button
          onClick={() => onDelete(product._id)}
          className="mt-2 w-full border border-red-200 text-red-600 py-2 rounded-lg hover:bg-red-50 transition"
        >
          Delete
        </button>
      )}
    </div>
  );
};

export default ProductCard;
