import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../helper/axiosInstance";
import { getRole } from "../helper/auth";
import { formatPrice } from "../utils/formatPrice";
import { toast } from "react-hot-toast";

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if not logged in or is admin
    const role = getRole();
    const token = localStorage.getItem("authToken");
    if (!token || role !== "user") {
      navigate("/login");
      return;
    }

    fetchCart();
  }, [navigate]);

  const fetchCart = async () => {
    try {
      const res = await axiosInstance.get("/cart");
      setCart(res.data.cart);
    } catch (error) {
      console.error("Error fetching cart:", error);
      setCart({ items: [] });
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await axiosInstance.put(`/cart/update/${itemId}`, { quantity: newQuantity });
      fetchCart();
      window.dispatchEvent(new Event("cart-updated"));
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  const removeItem = async (itemId) => {
    try {
      await axiosInstance.delete(`/cart/remove/${itemId}`);
      toast.success("Item removed from cart");
      fetchCart();
      window.dispatchEvent(new Event("cart-updated"));
    } catch (error) {
      console.error("Error removing item:", error);
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
        <div className="text-xl">Loading cart...</div>
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
          <span className="text-gray-700">Cart</span>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-6">Shopping Cart</h1>

        {!cart || !cart.items || cart.items.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-6">
              Add some beautiful jewelry to your cart!
            </p>
            <Link
              to="/"
              className="inline-block bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600 transition font-medium"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.items.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-xl shadow-md p-4 flex flex-col md:flex-row gap-4"
                >
                  <Link to={`/product/${item.product._id}`}>
                    <img
                      src={item.product.image}
                      alt={item.product.title}
                      loading="lazy"
                      className="w-full md:w-32 h-32 object-cover rounded-lg"
                    />
                  </Link>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <Link
                        to={`/product/${item.product._id}`}
                        className="text-lg font-semibold text-gray-900 hover:text-yellow-700"
                      >
                        {item.product.title}
                      </Link>
                      <p className="text-sm text-gray-600 mt-1">
                        {item.product.weight}g · {item.product.metalType}
                      </p>
                      <p className="text-lg font-bold text-yellow-700 mt-2">
                        {formatPrice(item.product.price)}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 mt-4">
                      <div className="flex items-center gap-2 border rounded-lg">
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          className="px-3 py-1 hover:bg-gray-100 rounded-l-lg"
                          disabled={item.quantity <= 1}
                        >
                          −
                        </button>
                        <span className="px-4 py-1 min-w-[3rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          className="px-3 py-1 hover:bg-gray-100 rounded-r-lg"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item._id)}
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-gray-900">
                      {formatPrice((item.product.price || 0) * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Order Summary
                </h2>
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>{formatPrice(calculateTotal())}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between text-xl font-bold text-gray-900">
                    <span>Total</span>
                    <span>{formatPrice(calculateTotal())}</span>
                  </div>
                </div>
                <button
                  onClick={() => navigate("/checkout")}
                  className="w-full bg-yellow-500 text-white py-3 rounded-lg hover:bg-yellow-600 transition font-medium text-lg"
                >
                  Proceed to Checkout
                </button>
                <Link
                  to="/"
                  className="block text-center mt-4 text-yellow-600 hover:text-yellow-700 text-sm"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;

