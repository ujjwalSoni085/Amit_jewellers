import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../helper/axiosInstance';
import { getRole } from '../helper/auth';
import { formatPrice } from '../utils/formatPrice';

function Product() {
  const { id } = useParams();
  const navigate = useNavigate();
  //single product state inner
  const [product, setProduct] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartMessage, setCartMessage] = useState('');

  useEffect(() => {
    axiosInstance.get(`/products/${id}`)
      .then((response) => {
        setProduct(response.data);
      })
      .catch((error) => {
        console.error("Error fetching product:", error);
      });
  }, [id]);


  const handleAddToCart = async () => {
    const token = localStorage.getItem("authToken");
    const role = getRole();

    if (!token || role !== "user") {
      if (confirm("Please login to add items to cart. Go to login page?")) {
        navigate("/login");
      }
      return;
    }

    setAddingToCart(true);
    setCartMessage("");
    try {
      await axiosInstance.post("/cart/add", { productId: id, quantity: 1 });
      setCartMessage("Added to cart!");
      window.dispatchEvent(new Event("cart-updated"));
      setTimeout(() => setCartMessage(""), 3000);
    } catch (error) {
      console.error("Error adding to cart:", error);
      setCartMessage("Failed to add to cart. Please try again.");
      setTimeout(() => setCartMessage(""), 3000);
    } finally {
      setAddingToCart(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <Link to="/" className="hover:text-yellow-700">Home</Link>
          <span>/</span>
          <span className="text-gray-700">Product</span>
        </div>

        <div className="bg-white shadow-lg rounded-2xl p-6 md:p-8">
          {product ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-center justify-center">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full max-w-sm aspect-square object-cover rounded-xl ring-1 ring-gray-100"
                />
              </div>

              <div className="flex flex-col">
                <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">{product.title}</h1>
                <p className="mt-3 text-gray-600 leading-relaxed">{product.description}</p>

                <div className="mt-5 flex items-center gap-4">
                  <span className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800">
                    {product.weight}g · {product.metalType}
                  </span>
                  <span className="text-2xl font-bold text-yellow-700">{formatPrice(product.price)}</span>
                </div>

                <div className="mt-6 space-y-3">
                  {cartMessage && (
                    <div className={`p-3 rounded-lg text-center ${
                      cartMessage.includes("Added") 
                        ? "bg-green-100 text-green-700" 
                        : "bg-red-100 text-red-700"
                    }`}>
                      {cartMessage}
                    </div>
                  )}
                  <div className="flex gap-3">
                    <button
                      onClick={handleAddToCart}
                      disabled={addingToCart}
                      className={`flex-1 inline-flex justify-center items-center rounded-lg px-4 py-2.5 font-medium transition ${
                        addingToCart
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-yellow-500 hover:bg-yellow-600 text-white"
                      }`}
                    >
                      {addingToCart ? "Adding..." : "🛒 Add to Cart"}
                    </button>
                    {(() => {
                      const phone = import.meta.env.VITE_WHATSAPP_NUMBER || "919999999999";
                      const msg = `Hello! I'm interested in ${product.title} (${product._id}). Weight: ${product.weight}g, metal: ${product.metalType}.`;
                      const href = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
                      return (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 inline-flex justify-center items-center rounded-lg bg-green-500 text-white px-4 py-2.5 font-medium hover:bg-green-600 transition"
                        >
                          💬 WhatsApp
                        </a>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-pulse">
              <div className="w-full max-w-sm aspect-square bg-gray-200 rounded-xl" />
              <div>
                <div className="h-7 w-2/3 bg-gray-200 rounded" />
                <div className="mt-3 h-4 w-full bg-gray-200 rounded" />
                <div className="mt-2 h-4 w-5/6 bg-gray-200 rounded" />
                <div className="mt-5 h-8 w-40 bg-gray-200 rounded" />
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="h-10 bg-gray-200 rounded" />
                  <div className="h-10 bg-gray-200 rounded" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Product;
