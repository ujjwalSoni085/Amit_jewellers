import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../helper/axiosInstance';

function Product() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    axiosInstance.get(`/products/${id}`)
      .then((response) => {
        console.log(response.data);
        setProduct(response.data);
      })
      .catch((error) => {
        console.error("Error fetching product:", error);
      });
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-xl rounded-lg max-w-4xl w-full p-6">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">Product Details</h1>

        {product ? (
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            {/* Left - Image */}
            <div className="w-full md:w-1/2 flex justify-center">
              <img 
                src={product.image} 
                alt={product.title} 
                className="w-72 h-72 object-cover rounded-md border" 
              />
            </div>

            {/* Right - Details */}
            <div className="w-full md:w-1/2 flex flex-col justify-between">
              <h2 className="text-2xl font-semibold text-gray-800">{product.title}</h2>
              <p className="mt-2 text-gray-700">{product.description}</p>

              <div className="flex justify-between items-center mt-4">
                <p className="text-gray-700">Weight: <span className="font-medium">{product.weight}g</span></p>
                <p className="text-yellow-600 font-bold text-lg">Price: ₹{product.price}</p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-600">Loading product...</p>
        )}
      </div>
    </div>
  );
}

export default Product;
