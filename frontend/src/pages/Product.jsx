import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../helper/axiosInstance';
import { getRole } from '../helper/auth';
import { formatPrice } from '../utils/formatPrice';
import { toast } from 'react-hot-toast';
import ReviewSection from '../components/ReviewSection';

function Product() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartMessage, setCartMessage] = useState('');
  const [inWishlist, setInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  useEffect(() => {
    axiosInstance.get(`/products/${id}`)
      .then((response) => {
        setProduct(response.data);
        setSelectedImage(response.data.image);
      })
      .catch((error) => {
        console.error("Error fetching product:", error);
      });
  }, [id]);

  /* ── Wishlist: check if this product is already saved ── */
  const checkWishlist = useCallback(async () => {
    const token = localStorage.getItem('authToken');
    if (!token || getRole() !== 'user') return;
    try {
      const res = await axiosInstance.get('/wishlist');
      const products = res.data?.wishlist?.products ?? [];
      setInWishlist(products.some((p) => p._id === id));
    } catch { /* silent */ }
  }, [id]);

  useEffect(() => { checkWishlist(); }, [checkWishlist]);

  /* ── Wishlist toggle ── */
  const handleWishlistToggle = async () => {
    const token = localStorage.getItem('authToken');
    if (!token || getRole() !== 'user') {
      toast.error('Please login to use the wishlist');
      navigate('/login');
      return;
    }
    setWishlistLoading(true);
    try {
      if (inWishlist) {
        await axiosInstance.delete(`/wishlist/remove/${id}`);
        setInWishlist(false);
        toast.success('Removed from wishlist');
      } else {
        await axiosInstance.post('/wishlist/add', { productId: id });
        setInWishlist(true);
        toast.success('Added to wishlist ❤️');
      }
    } catch {
      toast.error('Something went wrong. Try again.');
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleAddToCart = async () => {
    const token = localStorage.getItem("authToken");
    const role = getRole();

    if (!token || role !== "user") {
      toast.error("Please login to add items to cart");
      navigate("/login");
      return;
    }

    setAddingToCart(true);
    setCartMessage("");
    try {
      await axiosInstance.post("/cart/add", { productId: id, quantity: 1 });
      setCartMessage("Added to cart!");
      window.dispatchEvent(new Event("cart-updated"));
      setTimeout(() => setCartMessage(""), 3000);
    } catch (error) {
      console.error("Error adding to cart:", error);
      setCartMessage("Failed to add to cart. Please try again.");
      setTimeout(() => setCartMessage(""), 3000);
    } finally {
      setAddingToCart(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <Link to="/" className="hover:text-yellow-700">Home</Link>
          <span>/</span>
          <span className="text-gray-700">Product</span>
        </div>

        <div className="bg-white shadow-lg rounded-2xl p-6 md:p-8">
          {product ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Product Image Section */}
              <div className="flex flex-col items-center justify-start gap-6 bg-gray-50/50 p-6 rounded-3xl border border-gray-100">
                <div className="w-full max-w-[320px] aspect-square bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center p-4 overflow-hidden">
                  <img
                    src={selectedImage || product.image}
                    alt={product.title}
                    loading="lazy"
                    className="w-full h-full object-contain transition-transform duration-500 hover:scale-105"
                  />
                </div>
                
                {product.images?.length > 1 && (
                  <div className="flex gap-3 flex-wrap justify-center w-full">
                    {product.images.map((img, i) => (
                      <div 
                        key={i}
                        onClick={() => setSelectedImage(img)}
                        className={`w-16 h-16 rounded-xl bg-white flex items-center justify-center p-1.5 cursor-pointer transition-all duration-200 ${
                          selectedImage === img
                            ? "border-2 border-yellow-500 shadow-md ring-2 ring-yellow-500/20 scale-105"
                            : "border border-gray-200 hover:border-yellow-400 shadow-sm"
                        }`}
                      >
                        <img
                          src={img}
                          alt={`${product.title} view ${i + 1}`}
                          loading="lazy"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-col">
                <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">{product.title}</h1>
                <p className="mt-3 text-gray-600 leading-relaxed">{product.description}</p>

                <div className="mt-5 flex items-center gap-4">
                  <span className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800">
                    {product.weight}g · {product.metalType}
                  </span>
                  <span className="text-2xl font-bold text-yellow-700">{formatPrice(product.price)}</span>
                </div>

                <div className="mt-6 space-y-3">
                  {cartMessage && (
                    <div className={`p-3 rounded-lg text-center ${
                      cartMessage.includes("Added") 
                        ? "bg-green-100 text-green-700" 
                        : "bg-red-100 text-red-700"
                    }`}>
                      {cartMessage}
                    </div>
                  )}
                  <div className="flex gap-3 flex-wrap">
                    <button
                      onClick={handleAddToCart}
                      disabled={addingToCart}
                      className={`flex-1 inline-flex justify-center items-center rounded-lg px-4 py-2.5 font-medium transition ${
                        addingToCart
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-yellow-500 hover:bg-yellow-600 text-white"
                      }`}
                    >
                      {addingToCart ? "Adding..." : "🛒 Add to Cart"}
                    </button>

                    {/* ── Wishlist heart button ── */}
                    <button
                      onClick={handleWishlistToggle}
                      disabled={wishlistLoading}
                      title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                      className={`inline-flex justify-center items-center gap-1.5 rounded-lg px-4 py-2.5 font-medium border transition ${
                        wishlistLoading
                          ? 'opacity-60 cursor-not-allowed border-gray-200 bg-gray-50 text-gray-400'
                          : inWishlist
                          ? 'border-red-300 bg-red-50 text-red-600 hover:bg-red-100'
                          : 'border-gray-200 bg-white text-gray-500 hover:border-red-300 hover:text-red-500 hover:bg-red-50'
                      }`}
                    >
                      <span
                        className="text-lg transition-transform duration-150"
                        style={{ transform: inWishlist ? 'scale(1.2)' : 'scale(1)' }}
                      >
                        {inWishlist ? '❤️' : '🤍'}
                      </span>
                      <span className="text-sm">
                        {wishlistLoading ? '...' : inWishlist ? 'Saved' : 'Wishlist'}
                      </span>
                    </button>

                    {getRole() !== 'admin' && (() => {
                      const phone = import.meta.env.VITE_WHATSAPP_NUMBER || "919999999999";
                      const msg = `Hello! I'm interested in ${product.title} (${product._id}). Weight: ${product.weight}g, metal: ${product.metalType}.`;
                      const href = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
                      return (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 inline-flex justify-center items-center rounded-lg bg-green-500 text-white px-4 py-2.5 font-medium hover:bg-green-600 transition"
                        >
                          💬 WhatsApp
                        </a>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-pulse">
              <div className="w-full max-w-sm aspect-square bg-gray-200 rounded-xl" />
              <div>
                <div className="h-7 w-2/3 bg-gray-200 rounded" />
                <div className="mt-3 h-4 w-full bg-gray-200 rounded" />
                <div className="mt-2 h-4 w-5/6 bg-gray-200 rounded" />
                <div className="mt-5 h-8 w-40 bg-gray-200 rounded" />
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="h-10 bg-gray-200 rounded" />
                  <div className="h-10 bg-gray-200 rounded" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Reviews ── */}
        <ReviewSection productId={id} />
      </div>
    </div>
  );
}

export default Product;
