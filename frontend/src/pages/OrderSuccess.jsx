import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axiosInstance from "../helpers/axiosInstance";
import { getRole } from "../helpers/auth";
import { formatPrice } from "../utils/formatPrice";
import OrderTimeline from "../components/OrderTimeline";

const OrderSuccess = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const role = getRole();
    const token = localStorage.getItem("authToken");
    if (!token || role !== "user") {
      navigate("/login");
      return;
    }

    fetchOrder();
  }, [id, navigate]);

  const fetchOrder = async () => {
    try {
      const res = await axiosInstance.get(`/orders/${id}`);
      setOrder(res.data.order);
    } catch (error) {
      console.error("Error fetching order:", error);
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Order not found</h2>
          <Link to="/" className="text-yellow-600 hover:text-yellow-700">
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-sm shadow-md p-8 text-center">
          <div className="text-6xl mb-4">âœ…</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Order Placed Successfully!
          </h1>
          <p className="text-gray-600 mb-6">
            Thank you for your order. We'll process it soon.
          </p>

          <div className="bg-gray-50 rounded-sm p-6 mb-6 text-left">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">Order ID</p>
                <p className="font-semibold text-gray-900">{order._id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className="font-semibold text-yellow-700 capitalize">
                  {order.status}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="font-semibold text-gray-900 text-xl">
                  {formatPrice(order.totalAmount)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Order Date</p>
                <p className="font-semibold text-gray-900">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="mb-6 overflow-x-auto pb-2">
               <OrderTimeline status={order.status} />
            </div>

            <div className="border-t pt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Shipping Address:
              </p>
              <p className="text-gray-900">
                {order.shippingAddress.street}
                <br />
                {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                {order.shippingAddress.pincode}
                <br />
                {order.shippingAddress.country}
              </p>
              <p className="text-gray-900 mt-2">
                Phone: {order.phoneNumber}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <Link
              to="/"
              className="inline-block bg-yellow-500 text-white px-6 py-3 rounded-sm hover:bg-yellow-600 transition font-medium"
            >
              Continue Shopping
            </Link>
            <br />
            <Link
              to="/orders"
              className="inline-block text-yellow-600 hover:text-yellow-700 font-medium"
            >
              View All Orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;

