import React, { use, useState } from "react";
import axiosInstance from "../helper/axiosInstance";
import { useNavigate } from "react-router-dom";
import { formatPrice } from "../utils/formatPrice";



const CreateProduct = () => {
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    title: "",
    weight: "",
    metalType: "gold",
    description: "",
    category: "Rings",
    purity: "22K",
    image1: "",
    image2: "",
    image3: "",
    tags: "",
    inStock: true,
  });

  const [message, setMessage] = useState("");
  const [preview, setPreview] = useState("");
  const [prices, setPrices] = useState([]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct({ ...product, [name]: type === 'checkbox' ? checked : value });
    if (name === 'image1') setPreview(value);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: product.title,
        weight: product.weight,
        metalType: product.metalType,
        description: product.description,
        category: product.category,
        purity: product.purity,
        image: product.image1,
        images: [product.image1, product.image2, product.image3].filter(Boolean),
        tags: product.tags ? product.tags.split(",").map(t => t.trim()).filter(Boolean) : [],
        inStock: product.inStock
      };
      
      console.log("Product data:", payload);
      const response = await axiosInstance.post("/products/add", payload);
      if (response.status === 201) {
        setMessage("Product added successfully!");
        setProduct({ 
          title: "", weight: "", metalType: "gold", description: "", 
          category: "Rings", purity: "22K", image1: "", image2: "", image3: "", 
          tags: "", inStock: true 
        });
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
              <label className="block text-gray-700 font-medium">Category</label>
              <select
                name="category"
                value={product.category}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-yellow-300"
              >
                <option value="Rings">Rings</option>
                <option value="Necklaces">Necklaces</option>
                <option value="Earrings">Earrings</option>
                <option value="Bracelets">Bracelets</option>
                <option value="Pendants">Pendants</option>
                <option value="Chains">Chains</option>
                <option value="Bangles">Bangles</option>
                <option value="Mangalsutras">Mangalsutras</option>
                <option value="Coins">Coins</option>
                <option value="Sets">Sets</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-medium">Purity</label>
              <select
                name="purity"
                value={product.purity}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-yellow-300"
              >
                <option value="24K">24K</option>
                <option value="22K">22K</option>
                <option value="18K">18K</option>
                <option value="14K">14K</option>
                <option value="925 Sterling (Silver)">925 Sterling (Silver)</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-medium">Image 1 URL (Primary)</label>
              <input
                type="text"
                name="image1"
                value={product.image1}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-yellow-300"
                required
              />
              {preview ? (
                <img src={preview} alt="Preview" className="mt-2 w-full h-40 object-cover rounded" />
              ) : null}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-medium">Image 2 URL (Optional)</label>
              <input
                type="text"
                name="image2"
                value={product.image2}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-yellow-300"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-medium">Image 3 URL (Optional)</label>
              <input
                type="text"
                name="image3"
                value={product.image3}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-yellow-300"
              />
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

            <div className="mb-4">
              <label className="block text-gray-700 font-medium">Tags (comma separated)</label>
              <input
                type="text"
                name="tags"
                value={product.tags}
                onChange={handleChange}
                placeholder="e.g. bestseller, wedding, new arrival"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-yellow-300"
              />
            </div>

            <div className="mb-4 flex items-center">
              <input
                type="checkbox"
                name="inStock"
                checked={product.inStock}
                onChange={handleChange}
                className="w-5 h-5 text-yellow-500 border-gray-300 rounded focus:ring-yellow-400"
              />
              <label className="ml-2 block text-gray-700 font-medium">In Stock</label>
            </div>

            <button
              type="submit"
              className="w-full bg-yellow-500 text-white font-bold py-3 rounded-lg hover:bg-yellow-600 transition"
            >
              Add Product
            </button>
            <div className="text-sm text-gray-600 mt-2">
              Estimated price: {computed ? formatPrice(computed) : '—'}
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateProduct;
