import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from '../helper/axiosInstance';

function Product() {
  const { id } = useParams();
  //single product state inner
  const [product, setProduct] = useState(null);

  useEffect(() => {
    axiosInstance.get(`/products/${id}`)
      .then((response) => {
        setProduct(response.data);
      })
      .catch((error) => {
        console.error("Error fetching product:", error);
      });
  }, [id]);

  const formatPrice = (value) => {
    try {
      return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(value || 0));
    } catch {
      return `₹${value}`;
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

                <div className="mt-6">
                  {(() => {
                    const phone = import.meta.env.VITE_WHATSAPP_NUMBER || "919999999999"; // E.g., country code + number
                    const msg = `Hello! I'm interested in ${product.title} (${product._id}). Weight: ${product.weight}g, metal: ${product.metalType}.`;
                    const href = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
                    return (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex w-full justify-center items-center rounded-lg bg-green-500 text-white px-4 py-2.5 font-medium hover:bg-green-600 transition"
                      >
                        Get queries on WhatsApp
                      </a>
                    );
                  })()}
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
