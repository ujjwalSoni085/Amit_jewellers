import React, { Profiler, useState } from "react";
import axiosInstance from "../helpers/axiosInstance"; // Adjust the path as needed
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";

function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await axiosInstance.post("/user/signup", formData);
      toast.success("Signup successful! Please login to continue.");
      navigate("/login");
    } catch (error) {
      if (error.response?.status === 422) {
        // Validation errors
        const backendErrors = error.response.data.errors || [];
        const formattedErrors = {};
        backendErrors.forEach((err) => {
          formattedErrors[err.path] = err.msg;
        });
        setErrors(formattedErrors);
        toast.error("Please fix the errors in the form.");
      } else if (error.response?.status === 400 || error.response?.status === 409) {
        // Business logic errors (e.g. email already exists)
        toast.error(error.response.data.message || "User already exists.");
      } else {
        toast.error("Signup failed. Please try again.");
      }
      console.error("signup failed:", error.response?.data || error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-sm p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          signup
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
              className={`mt-1 block w-full px-4 py-2 border rounded-sm shadow-sm focus:ring-yellow-500 focus:border-yellow-500 ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
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
              className={`mt-1 block w-full px-4 py-2 border rounded-sm shadow-sm focus:ring-yellow-500 focus:border-yellow-500 ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
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
              className={`mt-1 block w-full px-4 py-2 border rounded-sm shadow-sm focus:ring-yellow-500 focus:border-yellow-500 ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
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
              className={`mt-1 block w-full px-4 py-2 border rounded-sm shadow-sm focus:ring-yellow-500 focus:border-yellow-500 ${
                errors.phoneNumber ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
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
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-yellow-600 hover:text-yellow-700 font-medium"
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
