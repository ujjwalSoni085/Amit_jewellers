import React, { useState } from "react";

/**
 * StarRating — interactive picker OR read-only display.
 *
 * Props
 * ─────
 * value      {number}   Current rating (1-5, decimals accepted for readonly avg)
 * onChange   {fn}       Called with new rating when user clicks a star (omit → readonly)
 * readonly   {boolean}  If true, no hover / click interaction
 * size       {string}   CSS font-size token, e.g. "1.4rem" (default "1.4rem")
 */
const StarRating = ({ value = 0, onChange, readonly = false, size = "1.4rem" }) => {
  const [hovered, setHovered] = useState(0);

  const effective = readonly ? value : (hovered || value);

  return (
    <span
      className="star-rating"
      style={{ fontSize: size, "--gap": readonly ? "1px" : "2px" }}
      onMouseLeave={() => !readonly && setHovered(0)}
      role={readonly ? "img" : "radiogroup"}
      aria-label={`Rating: ${value} out of 5`}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        /* For readonly averages: support half-star rendering */
        const filled = readonly
          ? effective >= star
          : effective >= star;
        const half = readonly && !filled && effective >= star - 0.5;

        return (
          <span
            key={star}
            className={`star-rating__star ${
              filled ? "star-rating__star--filled" : half ? "star-rating__star--half" : ""
            }`}
            style={{ cursor: readonly ? "default" : "pointer" }}
            onMouseEnter={() => !readonly && setHovered(star)}
            onClick={() => !readonly && onChange && onChange(star)}
            role={readonly ? undefined : "radio"}
            aria-checked={value === star}
            aria-label={`${star} star${star !== 1 ? "s" : ""}`}
            tabIndex={readonly ? -1 : 0}
            onKeyDown={(e) => {
              if (!readonly && (e.key === "Enter" || e.key === " ")) {
                onChange && onChange(star);
              }
            }}
          >
            {filled ? "★" : half ? "⯨" : "☆"}
          </span>
        );
      })}
      <style>{`
        .star-rating {
          display: inline-flex;
          gap: var(--gap, 2px);
          line-height: 1;
          user-select: none;
        }
        .star-rating__star {
          color: #d1d5db;
          transition: color 0.12s, transform 0.12s;
          display: inline-block;
        }
        .star-rating__star--filled {
          color: #f59e0b;
        }
        .star-rating__star--half {
          color: #f59e0b;
          opacity: 0.65;
        }
        .star-rating:not([aria-label]) .star-rating__star:hover,
        .star-rating__star:focus-visible {
          transform: scale(1.2);
          outline: none;
        }
      `}</style>
    </span>
  );
};

export default StarRating;
