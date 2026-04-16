import React, { useEffect, useState, useCallback } from "react";
import axiosInstance from "../helper/axiosInstance";
import { getRole } from "../helper/auth";
import { toast } from "react-hot-toast";
import StarRating from "./StarRating";

/* ─────────────────────────────────────────────
   Decode the JWT payload to read `id` / `_id`
   without any extra dependency.
   ───────────────────────────────────────────── */
function getLoggedInUserId() {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) return null;
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.id || payload._id || payload.sub || null;
  } catch {
    return null;
  }
}

/* ─────────────────────────────────────────────
   Average rating bar (5 → 1 breakdown)
   ───────────────────────────────────────────── */
const RatingBreakdown = ({ reviews }) => {
  const total = reviews.length;
  const avg =
    total === 0 ? 0 : reviews.reduce((s, r) => s + r.rating, 0) / total;

  const counts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));

  return (
    <div className="rs-summary">
      {/* Big number */}
      <div className="rs-summary__score">
        <span className="rs-summary__avg">{avg.toFixed(1)}</span>
        <StarRating value={avg} readonly size="1.2rem" />
        <span className="rs-summary__count">
          {total} {total === 1 ? "review" : "reviews"}
        </span>
      </div>

      {/* Bar breakdown */}
      <div className="rs-summary__bars">
        {counts.map(({ star, count }) => {
          const pct = total === 0 ? 0 : Math.round((count / total) * 100);
          return (
            <div key={star} className="rs-bar-row">
              <span className="rs-bar-row__label">{star}★</span>
              <div className="rs-bar-row__track">
                <div
                  className="rs-bar-row__fill"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="rs-bar-row__pct">{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Single review card
   ───────────────────────────────────────────── */
const ReviewCard = ({ review, currentUserId, onDelete }) => {
  const isOwn = currentUserId && review.user?._id === currentUserId;
  const date = new Date(review.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className={`rs-card ${isOwn ? "rs-card--own" : ""}`}>
      <div className="rs-card__top">
        {/* Avatar */}
        <div className="rs-card__avatar">
          {review.user?.name?.[0]?.toUpperCase() || "?"}
        </div>
        <div className="rs-card__meta">
          <span className="rs-card__name">
            {review.user?.name || "Anonymous"}
            {isOwn && <span className="rs-card__you-badge">You</span>}
          </span>
          <span className="rs-card__date">{date}</span>
        </div>
        <div className="rs-card__stars">
          <StarRating value={review.rating} readonly size="1rem" />
        </div>
      </div>

      {review.comment && (
        <p className="rs-card__comment">{review.comment}</p>
      )}

      {isOwn && (
        <button
          className="rs-card__delete"
          onClick={() => onDelete(review._id)}
          aria-label="Delete your review"
        >
          🗑️ Delete my review
        </button>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────
   Write-review form
   ───────────────────────────────────────────── */
const WriteReviewForm = ({ productId, onSuccess }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please select a star rating");
      return;
    }
    if (!comment.trim()) {
      toast.error("Please write a short comment");
      return;
    }
    setSubmitting(true);
    try {
      await axiosInstance.post("/reviews", {
        productId,
        rating,
        comment: comment.trim(),
      });
      toast.success("Review submitted ✨");
      setRating(0);
      setComment("");
      onSuccess();
    } catch (err) {
      const msg =
        err?.response?.data?.error || "Failed to submit review. Try again.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="rs-form" onSubmit={handleSubmit} noValidate>
      <h3 className="rs-form__title">Write a Review</h3>

      <div className="rs-form__row">
        <label className="rs-form__label">Your Rating</label>
        <StarRating value={rating} onChange={setRating} size="2rem" />
        {rating > 0 && (
          <span className="rs-form__rating-hint">
            {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][rating]}
          </span>
        )}
      </div>

      <div className="rs-form__row">
        <label className="rs-form__label" htmlFor="rs-comment">
          Your Comment
        </label>
        <textarea
          id="rs-comment"
          className="rs-form__textarea"
          placeholder="Share your experience with this jewellery…"
          value={comment}
          maxLength={1000}
          rows={4}
          onChange={(e) => setComment(e.target.value)}
        />
        <span className="rs-form__char-count">{comment.length}/1000</span>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className={`rs-form__submit ${submitting ? "rs-form__submit--loading" : ""}`}
      >
        {submitting ? "Submitting…" : "⭐ Submit Review"}
      </button>
    </form>
  );
};

/* ─────────────────────────────────────────────
   Main exported component
   ───────────────────────────────────────────── */
const ReviewSection = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const isLoggedInUser =
    !!localStorage.getItem("authToken") && getRole() === "user";
  const currentUserId = getLoggedInUserId();

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/reviews/${productId}`);
      setReviews(res.data?.reviews ?? []);
    } catch {
      toast.error("Could not load reviews");
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleDelete = async (reviewId) => {
    try {
      await axiosInstance.delete(`/reviews/${reviewId}`);
      toast.success("Review deleted");
      setReviews((prev) => prev.filter((r) => r._id !== reviewId));
    } catch {
      toast.error("Failed to delete review");
    }
  };

  /* Has the current user already submitted one? */
  const hasOwnReview =
    currentUserId && reviews.some((r) => r.user?._id === currentUserId);

  return (
    <>
      <style>{styles}</style>
      <section className="rs-section" aria-label="Product reviews">
        <h2 className="rs-section__heading">Customer Reviews</h2>

        {/* ── Summary ── */}
        {!loading && <RatingBreakdown reviews={reviews} />}

        <hr className="rs-divider" />

        {/* ── Loading skeleton ── */}
        {loading && (
          <div className="rs-skeleton-list">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rs-skeleton-card" />
            ))}
          </div>
        )}

        {/* ── Review list ── */}
        {!loading && reviews.length === 0 && (
          <div className="rs-empty">
            <span className="rs-empty__icon">💬</span>
            <p>No reviews yet. Be the first to share your experience!</p>
          </div>
        )}

        {!loading && reviews.length > 0 && (
          <div className="rs-list">
            {reviews.map((r) => (
              <ReviewCard
                key={r._id}
                review={r}
                currentUserId={currentUserId}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {/* ── Write-review form (auth-gated) ── */}
        {isLoggedInUser && !hasOwnReview && (
          <>
            <hr className="rs-divider" />
            <WriteReviewForm productId={productId} onSuccess={fetchReviews} />
          </>
        )}

        {isLoggedInUser && hasOwnReview && (
          <p className="rs-already-reviewed">
            ✅ You&apos;ve already reviewed this product. Delete your review above to submit a new one.
          </p>
        )}

        {!isLoggedInUser && (
          <p className="rs-login-prompt">
            <a href="/login" className="rs-login-prompt__link">
              Log in
            </a>{" "}
            to write a review.
          </p>
        )}
      </section>
    </>
  );
};

export default ReviewSection;

/* ─────────────────────────────────────────────
   Scoped styles
   ───────────────────────────────────────────── */
const styles = `
  /* ── Section wrapper ── */
  .rs-section {
    background: #fff;
    border-radius: 1.25rem;
    box-shadow: 0 2px 16px rgba(180,83,9,0.07);
    border: 1px solid #fde68a;
    padding: 2rem 1.5rem 2.5rem;
    margin-top: 2rem;
    max-width: 860px;
  }
  .rs-section__heading {
    font-size: 1.35rem;
    font-weight: 800;
    color: #78350f;
    margin: 0 0 1.25rem;
    letter-spacing: -0.3px;
  }
  .rs-divider {
    border: none;
    border-top: 1.5px solid #fef3c7;
    margin: 1.5rem 0;
  }

  /* ── Rating summary ── */
  .rs-summary {
    display: flex;
    gap: 2rem;
    align-items: center;
    flex-wrap: wrap;
  }
  .rs-summary__score {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.3rem;
    min-width: 80px;
  }
  .rs-summary__avg {
    font-size: 2.8rem;
    font-weight: 900;
    color: #b45309;
    line-height: 1;
  }
  .rs-summary__count {
    font-size: 0.8rem;
    color: #6b7280;
    font-weight: 500;
    white-space: nowrap;
  }
  .rs-summary__bars {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    min-width: 180px;
  }
  .rs-bar-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.8rem;
    color: #6b7280;
  }
  .rs-bar-row__label {
    width: 2rem;
    text-align: right;
    color: #92400e;
    font-weight: 600;
    flex-shrink: 0;
  }
  .rs-bar-row__track {
    flex: 1;
    height: 7px;
    border-radius: 999px;
    background: #f3f4f6;
    overflow: hidden;
  }
  .rs-bar-row__fill {
    height: 100%;
    background: linear-gradient(90deg, #f59e0b, #d97706);
    border-radius: 999px;
    transition: width 0.5s ease;
  }
  .rs-bar-row__pct {
    width: 1.5rem;
    text-align: left;
  }

  /* ── Review card ── */
  .rs-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .rs-card {
    background: #fffbeb;
    border: 1px solid #fde68a;
    border-radius: 1rem;
    padding: 1rem 1.1rem;
    transition: box-shadow 0.2s;
  }
  .rs-card--own {
    border-color: #fcd34d;
    background: #fefce8;
    box-shadow: 0 2px 8px rgba(251,191,36,0.15);
  }
  .rs-card:hover {
    box-shadow: 0 4px 16px rgba(180,83,9,0.1);
  }
  .rs-card__top {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.6rem;
    flex-wrap: wrap;
  }
  .rs-card__avatar {
    width: 2.2rem;
    height: 2.2rem;
    border-radius: 50%;
    background: linear-gradient(135deg, #f59e0b, #b45309);
    color: #fff;
    font-weight: 800;
    font-size: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    box-shadow: 0 1px 4px rgba(180,83,9,0.2);
  }
  .rs-card__meta {
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
    flex: 1;
  }
  .rs-card__name {
    font-weight: 700;
    color: #1c1917;
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }
  .rs-card__you-badge {
    background: #fbbf24;
    color: #78350f;
    font-size: 0.65rem;
    font-weight: 800;
    padding: 0.1rem 0.4rem;
    border-radius: 999px;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }
  .rs-card__date {
    font-size: 0.75rem;
    color: #9ca3af;
  }
  .rs-card__stars {
    margin-left: auto;
  }
  .rs-card__comment {
    color: #374151;
    font-size: 0.9rem;
    line-height: 1.6;
    margin: 0 0 0.6rem;
  }
  .rs-card__delete {
    background: none;
    border: 1px solid #fca5a5;
    color: #ef4444;
    font-size: 0.8rem;
    font-weight: 600;
    padding: 0.3rem 0.7rem;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: background 0.2s;
  }
  .rs-card__delete:hover {
    background: #fef2f2;
  }

  /* ── Empty / loading ── */
  .rs-empty {
    text-align: center;
    color: #9ca3af;
    padding: 2rem 0;
    font-size: 0.95rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }
  .rs-empty__icon {
    font-size: 2.5rem;
  }
  .rs-skeleton-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  .rs-skeleton-card {
    height: 90px;
    border-radius: 1rem;
    background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
    background-size: 200% 100%;
    animation: rs-shimmer 1.4s infinite;
  }
  @keyframes rs-shimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  /* ── Write-review form ── */
  .rs-form {
    display: flex;
    flex-direction: column;
    gap: 1.1rem;
  }
  .rs-form__title {
    font-size: 1.05rem;
    font-weight: 800;
    color: #78350f;
    margin: 0;
  }
  .rs-form__row {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }
  .rs-form__label {
    font-size: 0.8rem;
    font-weight: 700;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.6px;
  }
  .rs-form__rating-hint {
    font-size: 0.82rem;
    color: #d97706;
    font-weight: 600;
    margin-left: 0.25rem;
  }
  .rs-form__textarea {
    border: 1.5px solid #e5e7eb;
    border-radius: 0.75rem;
    padding: 0.75rem 1rem;
    font-size: 0.9rem;
    resize: vertical;
    color: #1c1917;
    font-family: inherit;
    transition: border-color 0.2s, box-shadow 0.2s;
    line-height: 1.6;
  }
  .rs-form__textarea:focus {
    outline: none;
    border-color: #f59e0b;
    box-shadow: 0 0 0 3px rgba(245,158,11,0.15);
  }
  .rs-form__char-count {
    font-size: 0.72rem;
    color: #9ca3af;
    align-self: flex-end;
  }
  .rs-form__submit {
    align-self: flex-start;
    background: linear-gradient(135deg, #f59e0b, #d97706);
    color: #fff;
    border: none;
    padding: 0.65rem 1.6rem;
    border-radius: 999px;
    font-weight: 700;
    font-size: 0.9rem;
    cursor: pointer;
    box-shadow: 0 3px 14px rgba(217,119,6,0.3);
    transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;
    letter-spacing: 0.3px;
  }
  .rs-form__submit:hover:not(.rs-form__submit--loading) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(217,119,6,0.38);
  }
  .rs-form__submit--loading {
    opacity: 0.7;
    cursor: not-allowed;
  }

  /* ── Footer prompts ── */
  .rs-already-reviewed {
    font-size: 0.85rem;
    color: #92400e;
    background: #fef3c7;
    border: 1px solid #fde68a;
    border-radius: 0.6rem;
    padding: 0.6rem 1rem;
    margin-top: 1rem;
  }
  .rs-login-prompt {
    font-size: 0.9rem;
    color: #6b7280;
    margin-top: 1.25rem;
    text-align: center;
  }
  .rs-login-prompt__link {
    color: #d97706;
    font-weight: 700;
    text-decoration: underline;
  }

  /* ── Responsive ── */
  @media (max-width: 600px) {
    .rs-section { padding: 1.25rem 1rem 1.75rem; }
    .rs-summary { flex-direction: column; gap: 1rem; align-items: flex-start; }
    .rs-summary__score { flex-direction: row; gap: 0.75rem; align-items: center; }
    .rs-summary__avg { font-size: 2.2rem; }
    .rs-form__submit { width: 100%; justify-content: center; }
  }
`;
