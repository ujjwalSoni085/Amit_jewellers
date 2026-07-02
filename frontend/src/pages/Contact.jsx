import React, { useState } from "react";
import toast from "react-hot-toast";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate an API call
    setTimeout(() => {
      toast.success("Message sent successfully! We will get back to you soon.");
      setFormData({ name: "", email: "", subject: "", message: "" });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
            Contact Us
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
            Have a question about our collections or a custom order? We'd love to hear from you.
          </p>
        </div>

        <div className="bg-white rounded-sm shadow-md overflow-hidden flex flex-col md:flex-row">

          {/* Contact Information */}
          <div className="bg-yellow-600 text-white p-10 md:w-2/5 flex flex-col justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
              <p className="text-yellow-100 mb-8 leading-relaxed">
                Fill out the form and our team will get back to you within 24 hours.
                For urgent inquiries, please call or visit our store.
              </p>

              <div className="space-y-6">


                <div className="flex items-start gap-4">
                  <span className="text-2xl">📞</span>
                  <div>
                    <h3 className="font-semibold text-lg">Phone Number</h3>
                    <p className="text-yellow-100 mt-1">+91 7225039254</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <span className="text-2xl">✉️</span>
                  <div>
                    <h3 className="font-semibold text-lg">Email Address</h3>
                    <p className="text-yellow-100 mt-1">Ujjwalsoni085@gmail.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-yellow-500">
              <h3 className="font-semibold text-lg mb-4">Store Hours</h3>
              <p className="text-yellow-100 flex justify-between"><span>Mon - Sat:</span> <span>10:00 AM - 8:00 PM</span></p>
              <p className="text-yellow-100 flex justify-between mt-2"><span>Sunday:</span> <span>Closed</span></p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="p-10 md:w-3/5">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition"
                  placeholder="How can we help you?"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition resize-none"
                  placeholder="Write your message here..."
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 rounded-sm font-bold text-white transition-all shadow-md ${isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-yellow-600 hover:bg-yellow-700 hover:shadow-md transform hover:-translate-y-0.5"
                  }`}
              >
                {isSubmitting ? "Sending Message..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
