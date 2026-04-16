/**
 * Formats a number as Indian Rupee currency.
 * Returns "—" for invalid or zero values.
 *
 * @param {number|string} value - The price to format
 * @returns {string} Formatted price string (e.g. "₹1,23,456")
 */
export const formatPrice = (value) => {
  const num = Number(value);
  if (!Number.isFinite(num) || num <= 0) return "—";
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(num);
  } catch {
    return `₹${num}`;
  }
};
