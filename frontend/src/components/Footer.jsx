import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 py-12 px-6 text-white mt-6 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left Side - Papa Image */}
        <div className="flex items-center">
          <img 
            src="/papa.jpg" 
            alt="Papa" 
            className="w-16 h-16 rounded-full border-2 border-yellow-400 mr-4"
          />
          <div className="hidden md:block">
            <span className="text-base text-gray-400">Pro Nirmal Soni</span>
            <p className="text-sm text-gray-500"></p>
          </div>
        </div>

        {/* Right Side - Text and Links */}
        <div className="text-center md:text-right">
          <p className="text-xl font-semibold">&copy; 2025 Amit Jewellers. All rights reserved.</p>
          <p className="text-sm mt-3">
            Follow us on 
            <a href="#" className="text-yellow-400 hover:underline ml-1">Instagram</a> | 
            <a href="#" className="text-yellow-400 hover:underline ml-1">Facebook</a>
          </p>
          <p className="text-xs mt-2 text-gray-500">Crafted with ❤️ in Gwalior</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
