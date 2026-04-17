import React, { useEffect, useState } from "react";
import axiosInstance from "../helper/axiosInstance";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import AdminCustomerList from "../components/AdminCustomerList";
import { toast } from "react-hot-toast";
import { formatPrice } from "../utils/formatPrice";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Admin = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [prices, setPrices] = useState([]);
  const [orders, setOrders] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
  });
  const [revenueData, setRevenueData] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [uploadingCarousel, setUploadingCarousel] = useState(false);

  const productDelete = (id) => {
    axiosInstance
      .delete(`/products/delete/${id}`)
      .then(() => {
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product._id !== id)
        );
        toast.success("Product deleted successfully");
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

  const fetchOrders = async () => {
    try {
      const res = await axiosInstance.get("/orders/admin/all");
      const fetchedOrders = res.data.orders || [];
      setOrders(fetchedOrders);
      
      // Calculate revenue data
      let rev = 0;
      const revByDate = {};
      fetchedOrders.forEach(order => {
        if (order.paymentStatus === "completed" || order.status !== "cancelled") {
           rev += order.totalAmount;
           const dateStr = new Date(order.createdAt).toLocaleDateString();
           revByDate[dateStr] = (revByDate[dateStr] || 0) + order.totalAmount;
        }
      });
      setTotalRevenue(rev);
      
      const chartData = Object.keys(revByDate).slice(-7).map(date => ({
        date,
        revenue: revByDate[date]
      }));
      setRevenueData(chartData);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      await axiosInstance.put(`/orders/admin/update/${id}`, { status });
      toast.success("Order status updated!");
      fetchOrders();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const handleViewProduct = (id) => {
    navigate(`/product/${id}`); 
  }

  const fetchProducts = async () => {
    const res = await axiosInstance.get("/products");
    // Handle both new paginated response ({ products: [...] }) and old array response
    setProducts(res.data.products || (Array.isArray(res.data) ? res.data : []));
  }

  const handleCarouselUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingCarousel(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append("image", file);

      const res = await axiosInstance.post("/products/upload-image", formDataUpload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setFormData({ ...formData, image: res.data.url });
      toast.success("Carousel image uploaded!");
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to upload carousel image");
    } finally {
      setUploadingCarousel(false);
    }
  };

  useEffect(() => {
    fetchCarousel();
    fetchProducts();
    fetchPrices();
    fetchOrders();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.image) {
      toast.error("Please provide a title and upload an image first.");
      return;
    }
    try {
      await axiosInstance.post("/carousel/add", formData);
      setFormData({ title: "", description: "", image: "" });
      fetchCarousel();
      toast.success("Slide added successfully!");
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Your Admin session has expired. Please log out and log back in at /admin/login.");
      } else {
        toast.error(error.response?.data?.error || "Failed to add carousel slide.");
      }
      console.error("Carousel Add Error:", error);
    }
  };

  const handleDelete = async (id) => {
    await axiosInstance.delete(`/carousel/delete/${id}`);
    toast.success("Carousel item removed");
    fetchCarousel();
  };

  const gold = prices.find(p => p.metal === 'gold');
  const silver = prices.find(p => p.metal === 'silver');

  const refreshPrices = async () => {
    try {
      await axiosInstance.post('/prices/refresh');
      fetchPrices();
      toast.success("Prices refreshed from API!");
    } catch (e) {
      toast.error("Failed to refresh prices.");
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      processing: "bg-purple-100 text-purple-800",
      shipped: "bg-indigo-100 text-indigo-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto space-y-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Admin Dashboard</h1>
      </div>

      {/* Top KPI bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="rounded-2xl border border-yellow-200 bg-white p-6 shadow-sm flex flex-col justify-center">
          <div className="text-sm font-medium text-gray-500 mb-1 uppercase tracking-wider">Gold Price (24K)</div>
          <div className="text-3xl font-bold text-yellow-600">{gold ? formatPrice(gold.pricePerGram) : '—'}</div>
          <button onClick={refreshPrices} className="mt-4 text-sm px-4 py-2 rounded-lg border border-yellow-300 text-yellow-700 hover:bg-yellow-50 font-medium self-start transition-colors">
            🔄 Refresh API
          </button>
        </div>
        
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm flex flex-col justify-center">
          <div className="text-sm font-medium text-gray-500 mb-1 uppercase tracking-wider">Total Revenue</div>
          <div className="text-3xl font-bold text-green-600">{formatPrice(totalRevenue)}</div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm flex flex-col justify-center">
          <div className="text-sm font-medium text-gray-500 mb-1 uppercase tracking-wider">Total Orders</div>
          <div className="text-3xl font-bold text-gray-900">{orders.length}</div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm flex flex-col justify-center">
          <div className="text-sm font-medium text-gray-500 mb-1 uppercase tracking-wider">Total Products</div>
          <div className="text-3xl font-bold text-gray-900">{products.length}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <section className="lg:col-span-2 rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Revenue Over Time (Last 7 Days)</h2>
          <div className="h-72 w-full">
            {revenueData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value / 1000}k`} />
                  <Tooltip formatter={(value) => formatPrice(value)} cursor={{fill: 'transparent'}}/>
                  <Bar dataKey="revenue" fill="#EAB308" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">No revenue data available</div>
            )}
          </div>
        </section>

        {/* Carousel Manager */}
        <section className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm flex flex-col">
          <div className="px-6 py-4 bg-gray-50 border-b">
            <h2 className="text-lg font-bold text-gray-900">Carousel Manager</h2>
          </div>
          <div className="p-6 flex-1 flex flex-col overflow-y-auto max-h-96">
            <form onSubmit={handleSubmit} className="space-y-3 mb-6 shrink-0">
              <input
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none text-sm"
                type="text"
                placeholder="Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase">Slide Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCarouselUpload}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none text-sm"
                />
                {uploadingCarousel && <p className="text-yellow-600 text-xs">Uploading...</p>}
                {formData.image && (
                  <img src={formData.image} alt="Preview" className="w-full h-32 object-cover rounded-lg mt-2" />
                )}
              </div>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none text-sm resize-none"
                placeholder="Description"
                rows="2"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
              <button
                className="w-full bg-yellow-500 text-white font-bold px-4 py-3 rounded-lg hover:bg-yellow-600 transition"
                type="submit"
              >
                Add Slide
              </button>
            </form>

            <div className="space-y-4">
              {items.map((item) => (
                <div key={item._id} className="border border-gray-100 p-3 rounded-xl bg-gray-50 flex gap-3 items-center">
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    className="w-20 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold truncate">{item.title}</h3>
                  </div>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition"
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Customer & Order Management Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Management */}
        <section className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm flex flex-col">
          <div className="px-6 py-4 bg-gray-50 border-b flex justify-between items-center shrink-0">
            <h2 className="text-lg font-bold text-gray-900">Order Management</h2>
          </div>
          <div className="overflow-x-auto overflow-y-auto max-h-96">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-gray-700 uppercase font-semibold text-xs sticky top-0 shadow-sm">
                <tr>
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Payment</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.length > 0 ? orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-mono text-xs text-gray-500">{order._id.slice(-8)}</td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{order.shippingAddress?.street || "No address"}</div>
                      <div className="text-xs text-gray-500">{order.phoneNumber}</div>
                    </td>
                    <td className="px-6 py-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 font-semibold text-gray-900">{formatPrice(order.totalAmount)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 rounded-md text-xs font-semibold ${
                        order.paymentStatus === 'completed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {order.paymentStatus || "pending"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-yellow-500 focus:border-yellow-500 p-2 outline-none"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-gray-500">No orders found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Customer List */}
        <AdminCustomerList orders={orders} />
      </div>

      {/* Product Manager */}
      <section className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-b">
          <h2 className="text-lg font-bold text-gray-900">Product Manager ({products.length})</h2>
        </div>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
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
