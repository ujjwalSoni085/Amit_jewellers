import React, { useEffect, useState } from "react";
import axiosInstance from "../helper/axiosInstance";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import "../App.css"; // Optional for extra styling

const Home = () => {
  const [products, setProducts] = useState([]);
  const [carousel, setCarousel] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance
      .get("/products")
      .then((response) => setProducts(response.data)) //p1, p2, p3, p4, p5, p6, p7, p8, p9, p10
      //p->product - details, name , title, price, weight, image
      .catch((error) => console.error("Error fetching products:", error));
  }, []);
  axiosInstance
    .get("/carousel")
    .then((response) => setCarousel(response.data))
    .catch((error) => console.error("Error fetching carousel:", error));

  const handleViewProduct = (id) => {
    navigate(`/product/${id}`);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === products.slice(0, 10).length - 1 ? 0 : prevIndex + 1
      );
    }, 3000); // change every 3 seconds

    return () => clearInterval(interval);
  }, [products]);

  return (
    <div>
      <main className="p-6 text-center">
        {/* 🟡 Carousel Banner */}
        <p className="text-lg text-gray-700 font-semibold mb-4">
          Latest Designs
        </p>

        <div className="relative w-full h-[90vh] overflow-hidden">
          <div
            className="flex transition-transform duration-700 ease-in-out h-full"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
              width: `${carousel.slice(0, 10).length * 100}%`,
            }}
          >
            {carousel.slice(0, 10).map((carousel) => (
              <div
                key={carousel._id}
                className="w-full flex-shrink-0 flex justify-center items-center h-full"
              >
                <img
                  src={carousel.image}
                  alt={carousel.title}
                  className="h-full w-full object-fill rounded-md shadow-md"
                />
              </div>
            ))}
          </div>
        </div>

        {/* 🔲 Below section for all products */}
        <p className="mt-8 text-lg text-gray-700 font-semibold">All Products</p>
        <div className="flex flex-wrap justify-center gap-6 p-6">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onViewProduct={handleViewProduct}
            />
          ))}
        </div>
        <video
          className="w-full rounded-xl shadow-lg"
          controls
          autoPlay
          muted
          loop
        >
          <source src="/video/amit-jewellers.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </main>
    </div>
  );
};

export default Home;
