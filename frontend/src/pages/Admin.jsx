import React, { useEffect, useState } from "react";
import axiosInstance from "../helper/axiosInstance";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import Cookies from "js-cookie"; // Import js-cookie to manage cookies


const Admin = () => {
  const [items, setItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
  });

 const productDelete = (id) => {
     axiosInstance
       .delete(`/products/delete/${id}`, {
          headers: {
            Authorization: `Bearer ${Cookies.get("authToken")}`, // Include the token in the request headers
          },
       })
       .then(() => {
         setProducts((prevProducts) =>
           prevProducts.filter((product) => product._id !== id)
         );
       })
       .catch((error) => console.error("Error deleting product:", error));
   };

  const fetchCarousel = async () => {
    const res = await axiosInstance.get("/carousel");
    setItems(res.data);
  };

  const handleViewProduct = (id) => {
    navigate(`/product/${id}`); 
  }

  const fetchProducts = async () => {
    const res = await axiosInstance.get("/products");
    setProducts(res.data);
  }


  useEffect(() => {
    fetchCarousel();
    fetchProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axiosInstance.post("/carousel/add", formData);
    setFormData({ title: "", description: "", image: "" });
    fetchCarousel();
  };

  const handleDelete = async (id) => {
    await axiosInstance.delete(`/carousel/delete/${id}`);
    fetchCarousel();
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Carousel Manager</h2>
      <form onSubmit={handleSubmit} className="mb-6 space-y-2">
        <input
          className="w-full p-2 border rounded"
          type="text"
          placeholder="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
        <input
          className="w-full p-2 border rounded"
          type="text"
          placeholder="Image URL"
          value={formData.image}
          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
        />
        <textarea
          className="w-full p-2 border rounded"
          placeholder="Description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          type="submit"
        >
          Add
        </button>
      </form>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item._id} className="border p-4 rounded shadow">
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-48 object-cover rounded"
            />
            <h3 className="text-lg font-bold mt-2">{item.title}</h3>
            <p>{item.description}</p>
            <button
              onClick={() => handleDelete(item._id)}
              className="mt-2 bg-red-500 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
      <div>
        <h2 className="text-xl font-bold mb-4">Product Manager</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onDelete={productDelete}
              onViewProduct={handleViewProduct}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Admin;
