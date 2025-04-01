import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";

const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/products/")
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  return (
    <div>
      <main className="p-6 text-center">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome to Amit Jewellers
        </h1>
        <p className="mt-3 text-lg text-gray-700">
          Discover the finest collection of handcrafted jewellery.
        </p>
        <div className="flex flex-wrap justify-center gap-6 p-6">
          {products.map((product) => (
            <div className="flex justify-center w-full sm:w-1/2 md:w-1/3 lg:w-1/4" key={product._id}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Home;
