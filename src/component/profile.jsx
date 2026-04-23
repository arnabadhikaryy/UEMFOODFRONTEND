import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import { getCookie } from '../middelwaie/cookie';
import Navbar from './navbar';
import backend_Url from '../backend_url_return_function/backendUrl';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = getCookie('authToken');
      
      if (!token) {
        toast.error('Please login to view profile');
        navigate('/login');
        return;
      }

      try {
        const response = await axios.post(
          `${backend_Url}/user/profile`,
          { token },
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.data.status) {
          setUserData(response.data.data);
        } else {
          setError(response.data.message || 'Failed to fetch profile');
          toast.error(response.data.message || 'Failed to fetch profile');
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        toast.error(err.response?.data?.message || 'An error occurred');
        if (err.response?.status === 401) {
          // Token expired or invalid
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    // Clear the auth token cookie
    document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    toast.success('Logged out successfully');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen w-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 dark:border-blue-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 flex items-center justify-center">
        <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-800/30 text-red-700 dark:text-red-400 px-4 py-3 rounded">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 py-8 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-center" />
      <Navbar />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden border border-transparent dark:border-gray-700 transition-colors duration-300">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-600 dark:from-blue-600 dark:to-cyan-700 h-32"></div>
          
          <div className="px-6 pb-6">
            <div className="flex flex-col items-center -mt-16">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative"
              >
                <img
                  className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 object-cover shadow-md transition-colors duration-300"
                  src={userData?.imageURL || 'https://www.gravatar.com/avatar/default?s=200'}
                  alt="Profile"
                />
              </motion.div>
              
              <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
                {userData?.name}
              </h1>
              
              <div className="mt-2 flex space-x-4">
                <button
                  onClick={() => navigate('/profile/edit')}
                  className="px-4 py-2 text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                >
                  Edit Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 rounded-md hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>

            {/* Profile Details */}
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-gray-800 p-4 shadow rounded-lg border border-transparent dark:border-gray-700 transition-colors duration-300"
              >
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Personal Information</h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Phone Number</p>
                    <p className="text-gray-900 dark:text-gray-200">{userData?.phone_number}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Address</p>
                    <p className="text-gray-900 dark:text-gray-200">{userData?.address}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white dark:bg-gray-800 p-4 shadow rounded-lg border border-transparent dark:border-gray-700 transition-colors duration-300"
              >
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Account Information</h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Member Since</p>
                    <p className="text-gray-900 dark:text-gray-200">
                      {new Date(userData?._id?.toString()?.substring(0, 8) * 1000).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">User ID</p>
                    <p className="text-gray-900 dark:text-gray-200 font-mono text-sm">{userData?._id}</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Orders Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-8 bg-white dark:bg-gray-800 p-4 shadow rounded-lg border border-transparent dark:border-gray-700 transition-colors duration-300"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">Your Orders</h2>
                <button
                  onClick={() => navigate('/orderhistory')}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                >
                  View All
                </button>
              </div>
              
              {userData?.orders?.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {userData.orders.slice(0, 2).map(order => (
                    <div key={order} className="border dark:border-gray-700 rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Order ID</p>
                      <p className="text-gray-900 dark:text-gray-200 font-mono text-sm">{order}</p>
                    </div>
                  ))}
                </div> 
              ) : (
                <div className="text-center py-8">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No orders yet</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Get started by placing your first order.
                  </p>
                  <div className="mt-6">
                    <button
                      onClick={() => navigate('/')}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                      Browse Menu
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;