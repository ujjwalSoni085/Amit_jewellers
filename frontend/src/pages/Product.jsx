import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../helpers/axiosInstance';
import { getRole } from '../helpers/auth';
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
        toast.success('Added to wishlist!');
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

        <div className="bg-white shadow-md rounded-sm p-6 md:p-8">
          {product ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Product Image Section */}
              <div className="flex flex-col items-center justify-start gap-6 bg-gray-50/50 p-6 rounded-sm border border-gray-100">
                <div className="w-full max-w-[320px] aspect-square bg-white rounded-sm shadow-sm border border-gray-100 flex items-center justify-center p-4 overflow-hidden">
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
                        className={`w-16 h-16 rounded-sm bg-white flex items-center justify-center p-1.5 cursor-pointer transition-all duration-200 ${
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
                  <span className="inline-flex items-center rounded-sm bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800">
                    {product.weight}g · {product.metalType}
                  </span>
                  <span className="text-2xl font-bold text-yellow-700">{formatPrice(product.price)}</span>
                </div>

                <div className="mt-6 space-y-3">
                  {cartMessage && (
                    <div className={`p-3 rounded-sm text-center ${
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
                      className={`flex-1 inline-flex justify-center items-center rounded-sm px-4 py-2.5 font-medium transition ${
                        addingToCart
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-yellow-500 hover:bg-yellow-600 text-white"
                      }`}
                    >
                      {addingToCart ? "Adding..." : (
                        <span className="flex items-center">
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                          Add to Cart
                        </span>
                      )}
                    </button>

                    <button
                      onClick={handleWishlistToggle}
                      disabled={wishlistLoading}
                      title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                      className={`inline-flex justify-center items-center gap-1.5 rounded-sm px-4 py-2.5 font-medium border transition ${
                        wishlistLoading
                          ? 'opacity-60 cursor-not-allowed border-gray-200 bg-gray-50 text-gray-400'
                          : inWishlist
                          ? 'border-red-300 bg-red-50 text-red-600 hover:bg-red-100'
                          : 'border-gray-200 bg-white text-gray-500 hover:border-red-300 hover:text-red-500 hover:bg-red-50'
                      }`}
                    >
                      <span
                        className="text-lg transition-transform duration-150 flex items-center justify-center"
                        style={{ transform: inWishlist ? 'scale(1.2)' : 'scale(1)' }}
                      >
                        {inWishlist ? (
                          <svg className="w-5 h-5 text-red-500 fill-current" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                        )}
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
                          className="flex-1 inline-flex justify-center items-center rounded-sm bg-green-500 text-white px-4 py-2.5 font-medium hover:bg-green-600 transition"
                        >
                          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                          WhatsApp
                        </a>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-pulse">
              <div className="w-full max-w-sm aspect-square bg-gray-200 rounded-sm" />
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

        <ReviewSection productId={id} />
      </div>
    </div>
  );
}

export default Product;
