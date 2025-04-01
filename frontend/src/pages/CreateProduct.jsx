import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const CreateProduct = () => {
  const [product, setProduct] = useState({
    title: "",
    weight: "",
    price: "",
    image: "",
  });

  const [message, setMessage] = useState("");

  // Handle input change
  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/products/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });

      if (response.ok) {
        setMessage("Product added successfully!");
        setProduct({ title: "", weight: "", price: "", image: "" }); // Reset form
      } else {
        setMessage("Failed to add product. Try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Something went wrong.");
    }
  };

  return (
    <div>
      <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
        <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 text-center">
            Add a New Product
          </h2>

          {message && <p className="text-center text-green-600 mt-2">{message}</p>}

          <form onSubmit={handleSubmit} className="mt-4">
            <div className="mb-4">
              <label className="block text-gray-700 font-medium">Title</label>
              <input
                type="text"
                name="title"
                value={product.title}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-yellow-300"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-medium">Weight (g)</label>
              <input
                type="number"
                name="weight"
                value={product.weight}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-yellow-300"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-medium">Price (₹)</label>
              <input
                type="number"
                name="price"
                value={product.price}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-yellow-300"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-medium">Image URL</label>
              <input
                type="text"
                name="image"
                value={product.image}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-yellow-300"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-yellow-500 text-white font-bold py-3 rounded-lg hover:bg-yellow-600 transition"
            >
              Add Product
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateProduct;
