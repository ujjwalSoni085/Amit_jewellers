import React, { useState } from "react";
import axiosInstance from "../helpers/axiosInstance"; // Adjust the path as needed

function SignupAdmin() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await axiosInstance.post("/admin/signup", formData);
      console.log("Admin signup successful:", response.data);
      // Handle successful signup (e.g., save token, redirect, etc.)
    } catch (error) {
      console.error(
        "Admin signup failed:",
        error.response?.data || error.message
      );
      // Handle signup error
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-sm p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Admin Signup
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-sm shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
              required
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-sm shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-sm shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
              required
            />
          </div>
          <div>
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-medium text-gray-700"
            >
              Phone Number
            </label>
            <input
              type="text"
              name="phoneNumber"
              id="phoneNumber"
              placeholder="Enter your phone number"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-sm shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-yellow-500 text-white py-2 px-4 rounded-sm transition duration-300 ${
              isSubmitting
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-yellow-600"
            }`}
          >
            {isSubmitting ? "Signing up..." : "Sign up"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignupAdmin;
