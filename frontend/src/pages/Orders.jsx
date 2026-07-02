import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../helpers/axiosInstance";
import { getRole } from "../helpers/auth";
import { formatPrice } from "../utils/formatPrice";
import OrderTimeline from "../components/OrderTimeline";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const role = getRole();
    const token = localStorage.getItem("authToken");
    if (!token || role !== "user") {
      navigate("/login");
      return;
    }

    fetchOrders();
  }, [navigate]);

  const fetchOrders = async () => {
    try {
      const res = await axiosInstance.get("/orders");
      setOrders(res.data.orders || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-yellow-700">
            Home
          </Link>
          <span>/</span>
          <span className="text-gray-700">My Orders</span>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-6">My Orders</h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-sm shadow-md p-8 text-center">
            <div className="flex justify-center mb-4">
              <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              No orders yet
            </h2>
            <p className="text-gray-600 mb-6">
              Start shopping to see your orders here!
            </p>
            <Link
              to="/"
              className="inline-block bg-yellow-500 text-white px-6 py-3 rounded-sm hover:bg-yellow-600 transition font-medium"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-sm shadow-sm border border-gray-100 p-6 sm:p-8 hover:shadow-md transition-all duration-300"
              >
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-gray-100">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Order ID</span>
                    <span className="font-mono font-medium text-gray-900 bg-gray-50 px-2 py-1 rounded text-sm">{order._id}</span>
                  </div>
                  
                  <div className="flex flex-wrap md:flex-nowrap gap-6 md:gap-10 w-full md:w-auto">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Date Placed</span>
                      <span className="font-semibold text-gray-900">{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Amount</span>
                      <span className="font-bold text-lg text-yellow-700">{formatPrice(order.totalAmount)}</span>
                    </div>
                    <div className="flex flex-col gap-1 ml-auto md:ml-0 items-end md:items-start">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Status</span>
                      <span className={`inline-flex items-center px-3 py-1 rounded-sm text-xs font-bold uppercase tracking-wider ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Timeline Section */}
                <div className="py-8 border-b border-gray-100">
                  <OrderTimeline status={order.status} />
                </div>

                {/* Content Section: Products & Shipping */}
                <div className="flex flex-col lg:flex-row gap-8 pt-8">
                  {/* Products */}
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                      Order Items ({order.items.length})
                    </h3>
                    <div className="flex flex-col gap-4">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex gap-4 p-3 rounded-sm hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                          <div className="w-20 h-20 bg-white border border-gray-100 rounded-sm p-1 shrink-0 overflow-hidden shadow-sm">
                            <img
                              src={item.image}
                              alt={item.title}
                              loading="lazy"
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div className="flex flex-col justify-center flex-1">
                            <Link to={`/product/${item.product}`} className="font-serif font-bold text-gray-900 text-lg hover:text-yellow-600 transition-colors line-clamp-1">
                              {item.title}
                            </Link>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-sm text-gray-500 font-medium">Qty: <span className="text-gray-900">{item.quantity}</span></span>
                              <span className="w-1 h-1 bg-gray-300 rounded-sm"></span>
                              <span className="text-sm font-bold text-gray-900">{formatPrice(item.price)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div className="lg:w-1/3 shrink-0">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                      Shipping Details
                    </h3>
                    <div className="bg-yellow-50/50 border border-yellow-100 rounded-sm p-5 shadow-sm">
                      <p className="font-bold text-gray-900 mb-1">{order.user?.name || "Customer"}</p>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {order.shippingAddress.street}<br/>
                        {order.shippingAddress.city}, {order.shippingAddress.state} <br/>
                        <span className="font-medium text-gray-900 mt-1 inline-block">PIN: {order.shippingAddress.pincode}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;

