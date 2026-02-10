import React, { useState, useEffect } from 'react';
import Footer from './futer'; // Note: check file name spelling
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { motion } from "motion/react";
import { useNavigate } from 'react-router-dom';
import backend_Url from '../backend_url_return_function/backendUrl';
import Navbar from './navbar';

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

  const MenuItemSkeleton = () => (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
      <div className="h-48 bg-gray-200 animate-pulse"></div>
      <div className="p-5">
        <div className="h-6 bg-gray-200 rounded-full w-3/4 mb-4 animate-pulse"></div>
        <div className="flex justify-between items-center mt-4">
          <div className="h-6 bg-gray-200 rounded-full w-1/4 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded-xl w-24 animate-pulse"></div>
        </div>
      </div>
    </div>
  );

  const filteredItems = foodItems.filter(item =>
    item.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full w-screen bg-gray-50">
      <Navbar />
      <Toaster position="top-right" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-950 sm:text-5xl tracking-tight">
            Explore Our <span className="text-emerald-600">Menu</span>
          </h1>
          <p className="mt-4 max-w-xl mx-auto text-lg text-gray-600">
            Freshly prepared dishes made with passion.
          </p>
          
          {/* Developer Note (Hidden in production ideally) */}
          <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-900 max-w-2xl mx-auto">
            <p className='font-bold'>Test Credentials:</p>
            <p>Phone: <span className='font-mono'>7365075168</span> | Password: <span className='font-mono'>arnab</span></p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-12 max-w-lg mx-auto">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-full leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-500 text-sm shadow-inner"
              placeholder="Search for delicious dishes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Menu Grid / Loading / Error */}
        {loading ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, i) => <MenuItemSkeleton key={i} />)}
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-red-50 rounded-2xl border border-red-200">
            <h3 className="text-lg font-medium text-red-800">Oops!</h3>
            <p className="mt-2 text-red-600">{error}</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900">No items found</h3>
            <p className="mt-2 text-gray-500">Try a different search term or check back later.</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {filteredItems.map((item) => (
              <motion.div
                key={item._id}
                whileHover={{ y: -5 }}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col"
              >
                <div className="aspect-[4/3] w-full overflow-hidden">
                  <img
                    src={item.pic_url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="text-xl font-semibold text-gray-950 capitalize flex-grow">
                    {item.title}
                  </h3>
                  <div className="mt-5 flex justify-between items-center">
                    <p className="text-2xl font-extrabold text-emerald-600">
                      ₹{item.price}
                    </p>
                    <button 
                      onClick={() => {
                        navigate('/product', {
                          state: { id: item._id, url: item.pic_url, title: item.title, price: item.price },
                        });
                      }} 
                      className="px-5 py-2.5 bg-amber-300 text-black text-sm font-semibold rounded-xl hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors duration-300"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default MenuPage;