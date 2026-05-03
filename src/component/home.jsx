import React, { useState, useEffect } from 'react';
import Footer from './futer'; 
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { motion } from "motion/react";
import { useNavigate } from 'react-router-dom';
import Navbar from "./navbar";
import { getCookie } from '../middelwaie/cookie';
import { jwtDecode } from 'jwt-decode';
import { adminphone, backend_Url } from '../backend_url_return_function/backendUrl';

const MenuPage = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [user, setUser] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  // --- New Data: Banners and Popular Food ---
  const banners = [
    "https://res.cloudinary.com/di4skdwzm/image/upload/v1777839903/Screenshot_1948-02-14_at_1.54.30_AM_unf4zi.png",
    "https://res.cloudinary.com/di4skdwzm/image/upload/v1777840589/food_web_banner_29_rsh8a0.jpg",
    "https://res.cloudinary.com/di4skdwzm/image/upload/v1777841256/4224777_zyqpv9.jpg",
    "https://res.cloudinary.com/di4skdwzm/image/upload/v1777842205/Brown_and_Yellow_Creative_Roasted_Chicken_Promotion_Banner_lekoa7.jpg"
  ];

  const popularFoods = [
    { name: "Biryani", image: "https://res.cloudinary.com/di4skdwzm/image/upload/v1776261908/uemfoods/bwomdmohj6djzcfl77g6.jpg" },
    { name: "Momo", image: "https://i.pinimg.com/474x/fe/c3/b3/fec3b34d5edb094554ed761c0d6f9d17.jpg" },
    { name: "Chicken Stick", image: "https://img.magnific.com/free-psd/four-delicious-grilled-chicken-skewers-garnished-with-fresh-parsley-stacked-against-black-background_84443-63587.jpg?semt=ais_hybrid&w=740&q=80" },
    {name: "cornetto", image:"https://instamart-media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/NI_CATALOG/IMAGES/CIW/2024/6/7/c2a3b500-c0b0-4008-9c08-993c2d48a427_icecream_0QPY96XCZ5_MN.png"}
  ];

  // Auto-sliding banner logic
  useEffect(() => {
    const slideTimer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 4000); // changes every 4 seconds
    return () => clearInterval(slideTimer);
  }, [banners.length]);

  // 1. Fetch Food Items
  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        const response = await axios.get(
          `${backend_Url}/production/getallfood`
        );
        if (response.data.status) {
          setFoodItems(response.data.message);
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

  // 2. Check Authentication
  useEffect(() => {
    const checkAuth = () => {
      const token = getCookie('authToken');
      if (token) {
        try {
          const decoded = jwtDecode(token);
          setUser({
            name: decoded.name,
            phone: decoded.phone,
            img_url: decoded.img_url
          });
        } catch (error) {
          console.error('Error decoding token:', error);
        }
      }
    };

    checkAuth();
  }, []);

  // --- Delete Function ---
  const handleDelete = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this food item?");
    if (!isConfirmed) return;

    const token = getCookie('authToken');

    if (!token) {
      toast.error("Authentication token not found. Please log in.");
      return;
    }

    try {
      const response = await axios.delete(`${backend_Url}/production/delete/product`, {
        data: {
          token: token,
          _id: id
        }
      });

      if (response.status === 200) {
        toast.success("Food item deleted successfully!");
        setFoodItems(prevItems => prevItems.filter(item => item._id !== id));
      } else {
        toast.error("Failed to delete the item.");
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error(error.response?.data?.message || "An error occurred while deleting.");
    }
  };

  const MenuItemSkeleton = () => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="h-32 sm:h-48 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
        <svg
          className="animate-spin h-6 w-6 sm:h-8 sm:w-8 text-emerald-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
      <div className="p-3 sm:p-5">
        <div className="h-4 sm:h-6 bg-gray-200 dark:bg-gray-600 rounded-full w-3/4 mb-4 animate-pulse"></div>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mt-2 sm:mt-4 gap-2 sm:gap-0">
          <div className="h-4 sm:h-6 bg-gray-200 dark:bg-gray-600 rounded-full w-1/4 animate-pulse"></div>
          <div className="h-8 sm:h-10 bg-gray-200 dark:bg-gray-600 rounded-xl w-full sm:w-24 animate-pulse"></div>
        </div>
      </div>
    </div>
  );

  const filteredItems = foodItems.filter(item =>
    item.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen w-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Navbar />
      <Toaster position="top-right" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Header Section */}
        <div className="text-center mb-12">
          <p className=' text-green-700 font-bold text-5xl '>Shop opening time 5PM to 10PM</p>
          <p className="mt-4 max-w-xl mx-auto text-lg text-gray-600 dark:text-gray-400">
            Freshly prepared dishes made with passion.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-10 max-w-lg mx-auto">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400 dark:text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full pl-11 pr-4 py-3.5 border border-gray-200 dark:border-gray-700 rounded-full leading-5 bg-white dark:bg-gray-800 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-300 dark:focus:ring-emerald-600 focus:border-emerald-500 dark:focus:border-emerald-500 text-sm shadow-inner transition-colors"
              placeholder="Search for delicious dishes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* --- Popular Food Section --- */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Popular Food</h2>
            
          </div>
          
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {popularFoods.map((food, idx) => (
              <div 
                key={idx} 
                className="flex items-center gap-3 bg-white dark:bg-gray-800 p-2 pr-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 min-w-max cursor-pointer hover:shadow-md transition-shadow"
              >
                <img 
                  src={food.image} 
                  alt={food.name} 
                  className="w-14 h-14 rounded-lg object-cover" 
                />
                <span className="font-bold text-lg text-gray-800 dark:text-gray-200">{food.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* --- Sliding Banner Section --- */}
        <div className="mb-12 relative w-full h-48 sm:h-64 md:h-80 overflow-hidden rounded-2xl shadow-lg">
          {banners.map((url, idx) => (
            <img
              key={idx}
              src={url}
              alt={`Banner ${idx + 1}`}
              className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${
                idx === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}
          {/* Banner Navigation Dots */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  idx === currentSlide ? 'bg-white w-6' : 'bg-white/60 hover:bg-white/80'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Menu Grid / Loading / Error */}
        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:gap-8 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, i) => <MenuItemSkeleton key={i} />)}
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-200 dark:border-red-800/30">
            <h3 className="text-lg font-medium text-red-800 dark:text-red-400">Oops!</h3>
            <p className="mt-2 text-red-600 dark:text-red-300">{error}</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">No items found</h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">Try a different search term or check back later.</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-2 gap-4 sm:gap-8 lg:grid-cols-3 xl:grid-cols-4"
          >
            {filteredItems.map((item) => {
              
              // NEW LOGIC: Calculate discount and final price
              const hasDiscount = item.discount && item.discount > 0;
              const finalPrice = hasDiscount 
                  ? Math.round(item.price - (item.price * (item.discount / 100))) 
                  : item.price;

              return (
              <motion.div
                key={item._id}
                whileHover={{ y: -5 }}
                className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl dark:hover:shadow-gray-900/50 transition-all duration-300 border border-gray-100 dark:border-gray-700 flex flex-col"
              >
                <div className="aspect-[4/3] w-full overflow-hidden">
                  <img
                    src={item.pic_url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-3 sm:p-5 flex flex-col flex-grow">
                  <h3 className="text-base sm:text-xl font-semibold text-gray-950 dark:text-white capitalize flex-grow line-clamp-2 transition-colors">
                    {item.title}
                  </h3>
                  
                  <div className="mt-3 sm:mt-5 flex flex-col sm:flex-row justify-between sm:items-center gap-2 sm:gap-0">
                    
                    {/* NEW UI: Conditional Rendering based on discount */}
                    <div>
                      {hasDiscount ? (
                        <div className="flex flex-col">
                           <div className="flex items-center gap-2 mb-1">
                             <p className="text-2xl font-bold sm:text-base text-gray-400 dark:text-gray-500 line-through">
                               ₹{item.price}
                             </p>
                             <span className="bg-red-100 text-red-600 text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-md dark:bg-red-900/30 dark:text-red-400">
                               {item.discount}% OFF
                             </span>
                           </div>
                           <p className="text-lg sm:text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                              ₹{finalPrice}
                           </p>
                        </div>
                      ) : (
                        <p className="text-lg sm:text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                          ₹{item.price}
                        </p>
                      )}
                    </div>

                    {item.availability === true ? (
                      <button
                        onClick={() => {
                          navigate('/product', {
                            state: { 
                              id: item._id, 
                              url: item.pic_url, 
                              title: item.title, 
                              originalPrice: item.price, 
                              price: finalPrice, 
                              discount: item.discount,
                              description: item.description 
                            },
                          });
                        }}
                        className="px-3 py-2 sm:px-5 sm:py-2.5 bg-emerald-400 dark:bg-emerald-500 text-green-800 dark:text-white text-xs sm:text-sm font-semibold rounded-xl hover:bg-emerald-600 dark:hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 focus:ring-emerald-500 transition-colors duration-300 w-full sm:w-auto text-center"
                      >
                        Buy now
                      </button>
                    ) : (
                      <div>
                        <button
                          onClick={() => { alert('This product is not available in the market right now'); }}
                          className='text-red-500 dark:text-red-400 text-sm sm:text-base font-semibold w-full sm:w-auto text-left sm:text-right'
                        > 
                          Unavailable
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Admin Controls: Edit & Delete */}
                  {user?.phone == adminphone && (
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 sm:mt-5 pt-4 sm:pt-5 border-t border-gray-100 dark:border-gray-700">
                      <button
                        onClick={() => {
                          navigate('/editfood', {
                            state: { 
                              id: item._id, 
                              url: item.pic_url, 
                              title: item.title, 
                              price: item.price,
                              discount: item.discount || 0
                            },
                          });
                        }}
                        className="flex-1 py-1.5 sm:py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs sm:text-sm font-semibold rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="flex-1 py-1.5 sm:py-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs sm:text-sm font-semibold rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  )}

                </div>
              </motion.div>
            )})}
          </motion.div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default MenuPage;