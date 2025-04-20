import React from "react";
import { useLocation } from "react-router-dom";

const ProductCard = ({ product, onDelete, onViewProduct }) => {
  const location = useLocation();

  return (
    <div className="border-4 border-yellow-500 rounded-3xl shadow-xl p-4 transition-transform transform hover:scale-105 hover:shadow-2xl bg-white hover:bg-yellow-100 duration-300 w-64 hover:ring-4 hover:ring-yellow-300 hover:ring-opacity-50">
      <img
        src={product.image}
        alt={product.title}
        className="w-full h-40 object-cover rounded-2xl"
      />
      <h2 className="text-xl font-semibold mt-2 text-gray-800">
        {product.title}
      </h2>
      <p className="text-gray-600 text-base">Weight: {product.weight}g</p>
      <p className="text-gray-800 font-bold text-lg">Price: ₹{product.price}</p>

      <button
        onClick={() => onViewProduct(product._id)}
        className="mt-4 w-full bg-yellow-500 text-white py-2 rounded-full hover:bg-yellow-700 transition shadow-md hover:shadow-yellow-400 hover:shadow-lg"
      >
        View Product
      </button>

      {location.pathname === "/admin" && (
        <button
          onClick={() => onDelete(product._id)}
          className="mt-4 w-full bg-yellow-500 text-white py-2 rounded-full hover:bg-red-600 transition shadow-md hover:shadow-yellow-400 hover:shadow-lg"
        >
          {/* {products.map((product) => (
  <div key={product._id} className="product-card">
    <h2>{product.title}</h2>
    <p>Weight: {product.weight}</p>
    <p>Price: ₹{product.price}</p>
    <img src={product.image} alt={product.title} />

    <button onClick={() => deleteProduct(product._id)}>
      Delete
    </button>
  </div>
))} */}

          Delete
        </button>
      )}
    </div>
  );
};

export default ProductCard;
