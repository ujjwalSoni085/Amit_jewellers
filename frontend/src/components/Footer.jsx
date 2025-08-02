import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 py-16 px-6 text-white mt-6 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start justify-between gap-10">

        {/* Left Side - Papa Image and Name */}
        <div className="flex items-start">
          <img 
            src="/papa.jpg" 
            alt="Papa" 
            className="w-24 h-28 rounded-lg border-2 border-yellow-400 mr-4 object-cover"
          />
          <div className="hidden md:block mt-2">
            <span className="text-base text-gray-300 font-semibold">Pro Nirmal Soni</span>
            <p className="text-sm text-gray-500">Founder & Inspiration</p>
          </div>
        </div>

        {/* Middle Section - Contact Info */}
        <div>
          <h3 className="text-lg font-semibold text-yellow-400 mb-3">Contact Us</h3>
          <ul className="text-sm text-gray-300 space-y-2">
            <li>
              📞 <a href="tel:+919685845532" className="hover:text-yellow-400">+91 9685845532</a>
            </li>
            <li>
              📧 <a href="mailto:ujjwalsoni085@gmail.com" className="hover:text-yellow-400">ujjwalsoni085@gmail.com</a>
            </li>
            <li>
              📍 Katra Bazar, Magroni , MP
            </li>
          </ul>
        </div>

        {/* Right Side - Social + Copyright */}
        <div className="text-center md:text-right w-full md:w-auto">
          <p className="text-xl font-semibold">&copy; 2025 Amit Jewellers. All rights reserved.</p>
          
          <p className="text-md mt-5">
            Follow us on 
            <a href="https://www.instagram.com/ujjwal_soni_68/" target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:underline ml-1">Instagram</a> | 
            <a href="https://www.facebook.com/your_facebook_page" target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:underline ml-1">Facebook</a>
          </p>

          <div className="mt-6 flex justify-center md:justify-end">
            <div className="px-5 py-3 rounded-xl">
              <p className="text-2xl md:text-3xl font-bold text-white text-center">
                70 Years of Trust <span className="text-lg font-medium italic text-gray-300">(Since 1955)</span>
              </p>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
