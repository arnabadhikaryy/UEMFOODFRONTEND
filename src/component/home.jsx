import React, { useState, useEffect } from 'react';
import Footer from './futer';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { motion } from "motion/react"
import { useNavigate } from 'react-router-dom';
const MenuPage = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        const response = await axios.get(
          'https://uemfoodbackend-production.up.railway.app/production/getallfood'
        );
        if (response.data.status) {
          setFoodItems(response.data.message);
          toast.success('Menu items fetched successfully');
        } else {
          throw new Error('Failed to fetch menu items');
        }
      } catch (err) {
        toast.error('Failed to fetch menu items');
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchFoodItems();
  }, []);

  const MenuItemSkeleton = () => (
    <div className="bg-white rounded-lg overflow-hidden shadow-md">
      <div className="h-48 bg-gray-200 animate-pulse"></div>
      <div className="p-4">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
        <div className="flex justify-between mt-4">
          <div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse"></div>
          <div className="h-8 bg-gray-200 rounded w-20 animate-pulse"></div>
        </div>
      </div>
    </div>
  );

  const filteredItems = foodItems.filter(item =>
    item.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="h-screen w-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {[...Array(8)].map((_, i) => (
              <MenuItemSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen w-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-screen bg-red-50 py-12 px-4 sm:px-6 lg:px-8">
      <Toaster />
      <div className="w-full mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Our Delicious Menu
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Freshly prepared with love and care [for fake login: phone:7365075168, password: arnab  (after successfully login, please refresh the page for see the menu items)]
          </p>
          <p className="mt-5 text-xl text-gray-500"> for fake payment: “card_number”: “4208585190116667”, “card_type”: “CREDIT_CARD”, “card_issuer”: “VISA”, “expiry_month”: 06, “expiry_year”: 2027, “cvv”: “508”, Note: The OTP to be used on the Bank Page: 123456 </p>
        </div>

        {/* Search Bar */}
        <div className="mb-10 max-w-md mx-auto">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              placeholder="Search for dishes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Menu Items */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-900">No items found</h3>
            <p className="mt-2 text-gray-500">Try a different search term</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8"
          >
            {filteredItems.map((item, index) => (
              <div
                key={item._id || index}
                className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="aspect-[3/2] w-full overflow-hidden">
                  <img
                    src={item.pic_url}
                    alt={item.title}
                    className="w-full h-48 object-cover object-center group-hover:opacity-90 transition-opacity duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 capitalize">
                    {item.title}
                  </h3>
                  <div className="mt-2 flex justify-between items-center">
                    <p className="text-lg font-bold text-orange-600">₹{item.price}</p>
                    <button onClick={()=>{
                      navigate('/product', {
                        state: { id: item._id, url: item.pic_url, title: item.title, price: item.price },
                      });
                    }} className="px-4 py-2 bg-orange-500 text-black text-sm font-medium rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors duration-300">
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </div>
      <Footer/>
    </div>
  );
};

export default MenuPage;
