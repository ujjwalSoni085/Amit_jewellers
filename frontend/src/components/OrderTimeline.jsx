import React from "react";

const OrderTimeline = ({ status }) => {
  const steps = ["pending", "confirmed", "processing", "shipped", "delivered"];
  let currentIndex = steps.indexOf(status);
  const isCancelled = status === "cancelled" || status === "failed";
  
  if (isCancelled) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-sm font-bold flex items-center justify-center gap-3 shadow-sm">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        Order {status.charAt(0).toUpperCase() + status.slice(1)}
      </div>
    );
  }

  return (
    <div className="w-full relative px-2 sm:px-6">
      <div className="flex justify-between items-center relative z-10">
        {steps.map((step, i) => {
          const isActive = i <= currentIndex;
          const isLast = i === steps.length - 1;
          const isCurrent = i === currentIndex;
          
          return (
            <React.Fragment key={step}>
              {/* Step Circle & Text */}
              <div className="flex flex-col items-center relative z-20 bg-white">
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-sm flex items-center justify-center text-sm font-bold transition-all duration-500 shadow-sm
                    ${isActive ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white ring-4 ring-yellow-50" : "bg-gray-100 text-gray-400 border border-gray-200"}
                    ${isCurrent ? "scale-110 shadow-md shadow-yellow-200" : ""}
                  `}
                >
                  {i < currentIndex ? (
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                  ) : (
                    i + 1
                  )}
                </div>
                <span className={`absolute top-14 text-[10px] sm:text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors duration-300 ${
                  isActive ? "text-yellow-700" : "text-gray-400"
                }`}>
                  {step}
                </span>
              </div>
              
              {/* Connector Line */}
              {!isLast && (
                <div className="flex-1 mx-2 sm:mx-4 h-1.5 rounded-sm relative overflow-hidden bg-gray-100 z-0">
                  <div 
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-yellow-500 to-yellow-600 transition-all duration-1000 ease-out"
                    style={{ width: i < currentIndex ? "100%" : "0%" }}
                  ></div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
      {/* Spacer to account for absolute text */}
      <div className="h-6 mt-4"></div>
    </div>
  );
};

export default OrderTimeline;
