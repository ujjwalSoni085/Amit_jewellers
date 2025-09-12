import React, { use, useState } from "react";
import axiosInstance from "../helper/axiosInstance";
import { useNavigate } from "react-router-dom";



const CreateProduct = () => {
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    title: "",
    weight: "",
    metalType: "gold",
    image: "",
    description: "",
  });

  const [message, setMessage] = useState("");
  const [preview, setPreview] = useState("");
  const [prices, setPrices] = useState([]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
    if (name === 'image') setPreview(value);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Product data:", product);
      const response = await axiosInstance.post("/products/add", product);
      if (response.status === 201) {
        setMessage("Product added successfully!");
        setProduct({ title: "", weight: "", metalType: "gold", image: "", description: "" });
        setPreview("");
        navigate("/");
      } else {
        setMessage("Failed to add product. Try again.");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      setMessage("Something went wrong. Please try again.");
    }
  }

  React.useEffect(() => {
    axiosInstance.get('/prices').then(res => setPrices(res.data || [])).catch(() => {});
  }, []);

  const currentRate = prices.find(p => p.metal === product.metalType);
  const computed = Number(product.weight || 0) * Number(currentRate?.pricePerGram || 0);

  return (
    <div>
      <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
        <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6 space-y-4">
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
              <label className="block text-gray-700 font-medium">Metal</label>
              <select
                name="metalType"
                value={product.metalType}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-yellow-300"
              >
                <option value="gold">Gold</option>
                <option value="silver">Silver</option>
              </select>
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
              {preview ? (
                <img src={preview} alt="Preview" className="mt-2 w-full h-40 object-cover rounded" />
              ) : null}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-medium">Description</label>
              <input
                type="text"
                name="description"
                value={product.description}
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
            <div className="text-sm text-gray-600 mt-2">
              Estimated price: {computed ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(computed) : '—'}
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateProduct;
