import React from "react";

const ProductSkeleton = () => {
  return (
    <div className="rounded-sm border border-gray-100 bg-white p-4 w-64 shadow-sm animate-pulse">
      {/* Image Skeleton */}
      <div className="relative overflow-hidden rounded-sm bg-gray-200 w-full h-40"></div>
      
      {/* Title Skeleton */}
      <div className="mt-4 h-5 w-3/4 bg-gray-200 rounded-sm"></div>
      
      {/* Meta / Price Skeleton */}
      <div className="mt-3 flex items-center justify-between">
        <div className="h-4 w-1/2 bg-gray-200 rounded-sm"></div>
        <div className="h-5 w-1/4 bg-gray-200 rounded-sm"></div>
      </div>

      {/* Button Skeleton */}
      <div className="mt-4 w-full h-10 bg-gray-200 rounded-sm"></div>
    </div>
  );
};

export default ProductSkeleton;
