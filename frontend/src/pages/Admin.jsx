import React, { useEffect, useState } from "react";
import axiosInstance from "../helper/axiosInstance";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";


const Admin = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [prices, setPrices] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
  });

 const productDelete = (id) => {
     if (!confirm("Delete this product ")) return;//show popup to confirm delete
     axiosInstance
       .delete(`/products/delete/${id}`)//if user conforms then call delete api
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

  const fetchPrices = async () => {
    const res = await axiosInstance.get("/prices");
    setPrices(res.data || []);
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
    fetchPrices();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axiosInstance.post("/carousel/add", formData);
    setFormData({ title: "", description: "", image: "" });
    fetchCarousel();
  };

  const handleDelete = async (id) => {
    if (!confirm("Remove this carousel item?")) return;
    await axiosInstance.delete(`/carousel/delete/${id}`);
    fetchCarousel();
  };

  const gold = prices.find(p => p.metal === 'gold');
  const silver = prices.find(p => p.metal === 'silver');

  const refreshPrices = async () => {
    try {
      await axiosInstance.post('/prices/refresh');
      fetchPrices();
    } catch (e) {}
  };

  return (
    <div className="p-4 max-w-7xl mx-auto space-y-8">
      {/* Top KPI bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-yellow-200 bg-white p-4">
          <div className="text-sm text-gray-500">Gold price/g</div>
          <div className="text-2xl font-semibold text-yellow-700">{gold ? gold.pricePerGram : '—'}</div>
        </div>
        <div className="rounded-xl border border-yellow-200 bg-white p-4">
          <div className="text-sm text-gray-500">Silver price/g</div>
          <div className="text-2xl font-semibold text-yellow-700">{silver ? silver.pricePerGram : '—'}</div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-500">Products</div>
            <div className="text-2xl font-semibold text-gray-900">{products.length}</div>
          </div>
          <button onClick={refreshPrices} className="text-sm px-3 py-1.5 rounded-md border border-yellow-300 text-yellow-700 hover:bg-yellow-50">Refresh prices</button>
        </div>
      </div>

      {/* Carousel Manager */}
      <section className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b">
          <h2 className="text-lg font-semibold">Carousel Manager</h2>
        </div>
        <div className="p-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
          <form onSubmit={handleSubmit} className="space-y-2 order-last lg:order-first">
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
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
              type="submit"
            >
              Add
            </button>
          </form>

          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item._id} className="border p-3 rounded-lg shadow-sm bg-white flex gap-3">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-40 h-24 object-cover rounded"
                />
                <div className="flex-1 text-left">
                  <h3 className="text-base font-semibold">{item.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="mt-2 border border-red-200 text-red-600 px-3 py-1 rounded hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Manager */}
      <section className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b">
          <h2 className="text-lg font-semibold">Product Manager</h2>
        </div>
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onDelete={productDelete}
              onViewProduct={handleViewProduct}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Admin;


