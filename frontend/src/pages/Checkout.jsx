import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../helpers/axiosInstance";
import { getRole } from "../helpers/auth";
import { formatPrice } from "../utils/formatPrice";
import { toast } from "react-hot-toast";

const Checkout = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    street: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
    phoneNumber: "",
  });

  useEffect(() => {
    const role = getRole();
    const token = localStorage.getItem("authToken");
    if (!token || role !== "user") {
      navigate("/login");
      return;
    }

    fetchCart();
    fetchUserData();
  }, [navigate]);

  const fetchCart = async () => {
    try {
      const res = await axiosInstance.get("/cart");
      setCart(res.data.cart);
      if (!res.data.cart || !res.data.cart.items || res.data.cart.items.length === 0) {
        navigate("/cart");
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      navigate("/cart");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserData = async () => {
    try {
      const res = await axiosInstance.get("/user");
      if (res.data.user) {
        setFormData((prev) => ({
          ...prev,
          phoneNumber: res.data.user.phoneNumber || "",
        }));
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (orderId, amount) => {
    const res = await loadRazorpayScript();
    if (!res) {
      toast.error("Razorpay SDK failed to load. Check your connection!");
      return;
    }

    try {
      const { data: { key } } = await axiosInstance.get("/payment/get-key");

      const rpRes = await axiosInstance.post("/payment/create-order", {
        amount: amount,
        currency: "INR",
        initialOrderId: orderId
      });

      const { id: razorpay_order_id, amount: rpAmount, currency } = rpRes.data;

      const options = {
        key: key,
        amount: rpAmount,
        currency: currency,
        name: "Amit Jewellers",
        description: "Secure Checkout",
        order_id: razorpay_order_id,
        handler: async function (response) {
          try {
            const verifyRes = await axiosInstance.post("/payment/verify", {
               razorpay_order_id: response.razorpay_order_id,
               razorpay_payment_id: response.razorpay_payment_id,
               razorpay_signature: response.razorpay_signature,
               local_order_id: orderId
            });

            if (verifyRes.data.success) {
               toast.success("Payment Received!");
               window.dispatchEvent(new Event("cart-updated")); // Safe to clear cart/badges
               navigate(`/order-success/${orderId}`);
            }
          } catch(err) {
             toast.error("Verification failed. Contact support.");
          }
        },
        prefill: {
          name: "Customer",
          contact: formData.phoneNumber
        },
        theme: {
          color: "#EAB308"
        }
      };

      const razor = new window.Razorpay(options);
      razor.on("payment.failed", function (response) {
         toast.error("Payment failed: " + response.error.description);
      });
      razor.open();
    } catch (err) {
       toast.error("Could not initiate payment.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const orderData = {
        shippingAddress: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          country: formData.country,
        },
        phoneNumber: formData.phoneNumber,
      };

      // 1. Create native Order via normal Crud (Status = pending)
      const res = await axiosInstance.post("/orders/create", orderData);
      
      // 2. Trigger Razorpay
      await handlePayment(res.data.order._id, res.data.order.totalAmount);
      
    } catch (error) {
      console.error("Error processing checkout:", error);
      toast.error("Failed to checkout. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };


  const calculateTotal = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((sum, item) => {
      const itemPrice = item.product?.price || 0;
      return sum + itemPrice * item.quantity;
    }, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
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
          <Link to="/cart" className="hover:text-yellow-700">
            Cart
          </Link>
          <span>/</span>
          <span className="text-gray-700">Checkout</span>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-6">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Shipping Address Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-sm shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Shipping Address
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    placeholder="House/Flat No., Street, Area"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      required
                      pattern="[0-9]{6}"
                      maxLength="6"
                      className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country *
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    placeholder="+91 1234567890"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <Link
                    to="/cart"
                    className="px-6 py-2 border border-gray-300 rounded-sm hover:bg-gray-50 transition"
                  >
                    Back to Cart
                  </Link>
                  <button
                    type="submit"
                    disabled={submitting}
                    className={`flex-1 px-6 py-2 rounded-sm font-medium transition ${
                      submitting
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-yellow-500 hover:bg-yellow-600 text-white"
                    }`}
                  >
                    {submitting ? "Placing Order..." : "Place Order"}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-sm shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Order Summary
              </h2>
              <div className="space-y-3 mb-4">
                {cart?.items?.map((item) => (
                  <div key={item._id} className="flex justify-between text-sm">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {item.product.title}
                      </p>
                      <p className="text-gray-600">
                        Qty: {item.quantity} x {formatPrice(item.product.price)}
                      </p>
                    </div>
                    <p className="font-medium text-gray-900">
                      {formatPrice((item.product.price || 0) * item.quantity)}
                    </p>
                  </div>
                ))}
                <div className="border-t pt-3 space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>{formatPrice(calculateTotal())}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between text-xl font-bold text-gray-900">
                    <span>Total</span>
                    <span>{formatPrice(calculateTotal())}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

