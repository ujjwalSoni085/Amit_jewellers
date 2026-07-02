import React from "react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-sm shadow-md overflow-hidden">
        {/* Hero Section */}
        <div className="bg-yellow-600 px-8 py-16 text-center text-white relative">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight relative z-10">
            About Amit Jewellers
          </h1>
          <p className="mt-4 text-xl sm:text-2xl text-yellow-100 font-medium relative z-10 max-w-2xl mx-auto">
            Crafting elegance and trust since 1955.
          </p>
        </div>

        {/* Content Section */}
        <div className="p-8 sm:p-12 text-gray-700 leading-relaxed space-y-8 text-lg">
          <p>
            Welcome to <strong className="text-yellow-700">Amit Jewellers</strong>, your premier destination for exquisite, handcrafted gold and silver jewellery. For nearly Seven decades, we have been dedicated to providing our customers with timeless pieces that celebrate life's most precious moments.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-10">
            <div className="bg-yellow-50 p-6 rounded-sm border border-yellow-100 shadow-sm">
              <h3 className="text-2xl font-bold text-yellow-800 mb-3">Our Heritage</h3>
              <p className="text-base text-gray-600">
                Founded by visionary artisans, Amit Jewellers began as a humble workshop and has grown into a trusted household name. Our legacy is built on the unwavering pillars of purity, quality, and exceptional customer service.
              </p>
            </div>
            <div className="bg-yellow-50 p-6 rounded-sm border border-yellow-100 shadow-sm">
              <h3 className="text-2xl font-bold text-yellow-800 mb-3">Our Promise</h3>
              <p className="text-base text-gray-600">
                We believe that every piece of jewellery tells a story. That's why we source only the finest materials and employ master craftsmen to ensure that every ring, necklace, and bangle is a masterpiece of perfection.
              </p>
            </div>
          </div>

          <p>
            We take pride in our transparent pricing, guided by live, real-time gold market rates, ensuring you always get the fairest value. Whether you are looking for a bespoke bridal set or an elegant everyday accessory, Amit Jewellers is committed to bringing your vision to life.
          </p>

          {/* Trust Badges */}
          <div className="mt-12 py-8 border-y border-gray-100">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">Why Choose Us</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
              <div className="flex flex-col items-center group">
                <div className="w-16 h-16 bg-yellow-100 rounded-sm flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  🏅
                </div>
                <h4 className="text-lg font-bold text-gray-800">Certified Gold</h4>
                <p className="text-sm text-gray-500 mt-2">100% genuine and verified purity.</p>
              </div>
              <div className="flex flex-col items-center group">
                <div className="w-16 h-16 bg-yellow-100 rounded-sm flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  💎
                </div>
                <h4 className="text-lg font-bold text-gray-800">BIS Hallmark</h4>
                <p className="text-sm text-gray-500 mt-2">Authenticity guaranteed on every piece.</p>
              </div>
              <div className="flex flex-col items-center group">
                <div className="w-16 h-16 bg-yellow-100 rounded-sm flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  🤝
                </div>
                <h4 className="text-lg font-bold text-gray-800">Trusted by Customers</h4>
                <p className="text-sm text-gray-500 mt-2">Over 10,000+ happy customers since 1955.</p>
              </div>
            </div>
          </div>

          <div className="text-center mt-12 pt-8 border-t border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to find your perfect piece?</h2>
            <Link
              to="/"
              className="inline-block bg-yellow-600 text-white font-semibold px-8 py-4 rounded-sm hover:bg-yellow-700 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
            >
              Explore Our Collection
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
