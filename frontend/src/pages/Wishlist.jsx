import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../helpers/axiosInstance";
import { formatPrice } from "../utils/formatPrice";
import { toast } from "react-hot-toast";
import { getRole } from "../helpers/auth";

// Wishlist-specific card (has the Remove button)
const WishlistCard = ({ product, onRemove, onView }) => (
  <div className="wishlist-card">
    <button
      className="wishlist-card__remove"
      onClick={() => onRemove(product._id)}
      aria-label="Remove from wishlist"
      title="Remove from wishlist"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
    </button>

    <div className="wishlist-card__img-wrap" onClick={() => onView(product._id)}>
      <img
        src={product.image}
        alt={product.title}
        loading="lazy"
        className="wishlist-card__img"
      />
      <div className="wishlist-card__img-overlay">
        <span>View Details</span>
      </div>
    </div>

    <div className="wishlist-card__body">
      <h3 className="wishlist-card__title">{product.title}</h3>
      <div className="wishlist-card__meta">
        <span className="wishlist-card__badge">
          {product.weight}g Â· {product.metalType}
        </span>
        <span className="wishlist-card__price">{formatPrice(product.price)}</span>
      </div>

      <div className="wishlist-card__actions">
        <button
          className="wishlist-card__btn wishlist-card__btn--primary flex items-center justify-center"
          onClick={() => onView(product._id)}
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
          View
        </button>
        <button
          className="wishlist-card__btn wishlist-card__btn--danger flex items-center justify-center"
          onClick={() => onRemove(product._id)}
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
          Remove
        </button>
      </div>
    </div>
  </div>
);

// Empty-state illustration
const EmptyWishlist = ({ onBrowse }) => (
  <div className="wishlist-empty">
    <div className="wishlist-empty__icon flex justify-center">
      <svg className="w-16 h-16 text-yellow-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
    </div>
    <h2 className="wishlist-empty__heading">Your wishlist is empty</h2>
    <p className="wishlist-empty__sub">
      Save your favourite jewellery pieces here - heart any product to get started.
    </p>
    <button className="wishlist-empty__btn flex items-center justify-center" onClick={onBrowse}>
      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>
      Browse Collections
    </button>
  </div>
);

// Main page
export default function Wishlist() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  /* Auth guard */
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const role = getRole();
    if (!token || role !== "user") {
      toast.error("Please login to view your wishlist");
      navigate("/login");
    }
  }, [navigate]);

  /* Fetch wishlist */
  const fetchWishlist = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/wishlist");
      /* The API returns { wishlist: { products: [...] } } */
      setItems(res.data?.wishlist?.products ?? []);
    } catch {
      toast.error("Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  /* Remove item */
  const handleRemove = async (productId) => {
    try {
      await axiosInstance.delete(`/wishlist/remove/${productId}`);
      setItems((prev) => prev.filter((p) => p._id !== productId));
      toast.success("Removed from wishlist");
    } catch {
      toast.error("Failed to remove item");
    }
  };

  /* Navigate to product */
  const handleView = (productId) => navigate(`/product/${productId}`);

  if (loading) {
    return (
      <div className="wishlist-page">
        <div className="wishlist-header">
          <h1 className="wishlist-header__title flex items-center gap-2">
            <svg className="w-8 h-8 text-red-500 fill-current" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
            My Wishlist
          </h1>
        </div>
        <div className="wishlist-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="wishlist-skeleton" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="wishlist-page">
        <div className="wishlist-header">
          <div>
            <h1 className="wishlist-header__title flex items-center gap-2">
              <svg className="w-8 h-8 text-red-500 fill-current" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
              My Wishlist
            </h1>
            <p className="wishlist-header__sub">
              {items.length} {items.length === 1 ? "item" : "items"} saved
            </p>
          </div>
          {items.length > 0 && (
            <button
              className="wishlist-header__browse"
              onClick={() => navigate("/")}
            >
              + Add More
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <EmptyWishlist onBrowse={() => navigate("/")} />
        ) : (
          <div className="wishlist-grid">
            {items.map((product) => (
              <WishlistCard
                key={product._id}
                product={product}
                onRemove={handleRemove}
                onView={handleView}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

// Scoped styles (no external CSS file needed)
const styles = `
  .wishlist-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 40%, #fff 100%);
    padding: 2rem 1rem 4rem;
  }

  .wishlist-header {
    max-width: 1200px;
    margin: 0 auto 2rem;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 1rem;
    padding-bottom: 1.25rem;
    border-bottom: 2px solid #fde68a;
  }
  .wishlist-header__title {
    font-size: 2rem;
    font-weight: 800;
    color: #78350f;
    margin: 0;
    letter-spacing: -0.5px;
  }
  .wishlist-header__sub {
    margin: 0.25rem 0 0;
    color: #92400e;
    font-size: 0.95rem;
    font-weight: 500;
  }
  .wishlist-header__browse {
    background: #d97706;
    color: #fff;
    border: none;
    padding: 0.55rem 1.25rem;
    border-radius: 999px;
    font-weight: 700;
    font-size: 0.9rem;
    cursor: pointer;
    transition: background 0.2s, transform 0.15s;
    letter-spacing: 0.3px;
  }
  .wishlist-header__browse:hover {
    background: #b45309;
    transform: translateY(-1px);
  }

  .wishlist-grid {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 1.5rem;
  }

  .wishlist-card {
    position: relative;
    background: #fff;
    border-radius: 1.25rem;
    border: 1px solid #fde68a;
    box-shadow: 0 2px 12px rgba(180,83,9,0.07);
    overflow: hidden;
    transition: box-shadow 0.25s, transform 0.2s;
    display: flex;
    flex-direction: column;
  }
  .wishlist-card:hover {
    box-shadow: 0 8px 32px rgba(180,83,9,0.14);
    transform: translateY(-4px);
  }
  .wishlist-card__remove {
    position: absolute;
    top: 0.6rem;
    right: 0.6rem;
    z-index: 10;
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    border: none;
    background: rgba(255,255,255,0.92);
    color: #ef4444;
    font-size: 0.85rem;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 1px 6px rgba(0,0,0,0.12);
    transition: background 0.2s, transform 0.15s;
    backdrop-filter: blur(4px);
  }
  .wishlist-card__remove:hover {
    background: #fef2f2;
    transform: scale(1.15);
  }

  /* Image */
  .wishlist-card__img-wrap {
    position: relative;
    overflow: hidden;
    cursor: pointer;
    aspect-ratio: 1 / 1;
  }
  .wishlist-card__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.35s ease;
  }
  .wishlist-card:hover .wishlist-card__img {
    transform: scale(1.06);
  }
  .wishlist-card__img-overlay {
    position: absolute;
    inset: 0;
    background: rgba(120,53,15,0.35);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.25s;
    color: #fff;
    font-weight: 700;
    font-size: 0.95rem;
    letter-spacing: 0.5px;
  }
  .wishlist-card__img-wrap:hover .wishlist-card__img-overlay {
    opacity: 1;
  }

  /* Body */
  .wishlist-card__body {
    padding: 0.9rem 1rem 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.45rem;
    flex: 1;
  }
  .wishlist-card__title {
    font-size: 1rem;
    font-weight: 700;
    color: #1c1917;
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .wishlist-card__meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
  }
  .wishlist-card__badge {
    background: #fef3c7;
    color: #92400e;
    font-size: 0.75rem;
    font-weight: 600;
    padding: 0.2rem 0.55rem;
    border-radius: 999px;
    white-space: nowrap;
  }
  .wishlist-card__price {
    font-weight: 800;
    color: #b45309;
    font-size: 1rem;
    white-space: nowrap;
  }

  /* Action buttons */
  .wishlist-card__actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
    margin-top: 0.35rem;
  }
  .wishlist-card__btn {
    border: none;
    padding: 0.5rem 0;
    border-radius: 0.6rem;
    font-size: 0.8rem;
    font-weight: 600;
    cursor: pointer;
    transition: filter 0.2s, transform 0.15s;
  }
  .wishlist-card__btn:hover {
    filter: brightness(0.9);
    transform: translateY(-1px);
  }
  .wishlist-card__btn--primary {
    background: #fbbf24;
    color: #78350f;
  }
  .wishlist-card__btn--danger {
    background: #fef2f2;
    color: #dc2626;
    border: 1px solid #fecaca;
  }

  .wishlist-skeleton {
    border-radius: 1.25rem;
    background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite;
    height: 340px;
  }
  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  .wishlist-empty {
    max-width: 460px;
    margin: 5rem auto;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
  .wishlist-empty__icon {
    font-size: 5rem;
    animation: pulse-heart 1.8s ease-in-out infinite;
  }
  @keyframes pulse-heart {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.12); }
  }
  .wishlist-empty__heading {
    font-size: 1.6rem;
    font-weight: 800;
    color: #78350f;
    margin: 0;
  }
  .wishlist-empty__sub {
    color: #6b7280;
    font-size: 0.95rem;
    line-height: 1.6;
    margin: 0;
  }
  .wishlist-empty__btn {
    margin-top: 0.5rem;
    background: linear-gradient(135deg, #f59e0b, #d97706);
    color: #fff;
    border: none;
    padding: 0.75rem 2rem;
    border-radius: 999px;
    font-weight: 700;
    font-size: 1rem;
    cursor: pointer;
    box-shadow: 0 4px 18px rgba(217,119,6,0.35);
    transition: transform 0.2s, box-shadow 0.2s;
    letter-spacing: 0.3px;
  }
  .wishlist-empty__btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(217,119,6,0.4);
  }

  @media (max-width: 600px) {
    .wishlist-header__title { font-size: 1.5rem; }
    .wishlist-grid { grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 1rem; }
  }
`;
