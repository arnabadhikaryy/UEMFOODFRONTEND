import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import backend_Url from '../backend_url_return_function/backendUrl';
import { getCookie } from '../middelwaie/cookie';
import Navbar from './navbar';

const EditProfile = () => {
  const navigate = useNavigate();
  const token = getCookie('authToken');

  const [formData, setFormData] = useState({
    _id: '',
    name: '',
    address: '',
    phone_number: '',
  });

  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.post(
          `${backend_Url}/user/profile`,
          { token: token }
        );
        console.log(response.data.data);
        const user = response.data.data;

        // FIX: Added phone_number to the initial state mapping
        setFormData({
          _id: user._id || '',
          name: user.name || '',
          address: user.address || '',
          phone_number: user.phone_number || ''
        });
        setPreview(user.imageURL);

      } catch (error) {
        console.error("Error fetching user data", error);
      }
    };

    fetchUserData();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = getCookie('authToken');

      if (!token) {
        toast.error("Authentication required. Please login again.");
        navigate('/login');
        return;
      }

      const formDataToSend = new FormData();
      if (formData.name) formDataToSend.append('name', formData.name);
      if (formData.address) formDataToSend.append('address', formData.address);
      if (formData.phone_number) formDataToSend.append('phone_number', formData.phone_number);
      if (avatar) formDataToSend.append('avatar', avatar);
      formDataToSend.append('token', token);

      const response = await axios.post(
        `${backend_Url}/user/editprofile`,
        formDataToSend,
      );

      if (response.status === 200) {
        toast.success('Profile updated successfully!');
        setTimeout(() => {
          navigate('/profile');
        }, 1500);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
   <div className="min-h-screen w-screen flex flex-col text-amber-950 dark:text-gray-100 bg-gray-50 dark:bg-gray-900 font-sans transition-colors duration-300">
      <Toaster position="top-center" />
      <Navbar />

      <div className="flex justify-center items-center flex-1 p-4 sm:p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-3xl shadow-xl dark:shadow-none border border-transparent dark:border-gray-700 overflow-hidden p-8 transition-colors duration-300"
        >
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Edit Profile</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Update your personal details</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Image Upload */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col items-center justify-center mb-6"
            >
              <div className="relative group w-32 h-32">
                {preview ? (
                  <img
                    src={preview}
                    alt="Profile preview"
                    className="w-full h-full rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-md transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-gray-50 dark:bg-gray-700/50 border-2 border-dashed border-gray-300 dark:border-gray-600 flex flex-col items-center justify-center transition-colors group-hover:bg-gray-100 dark:group-hover:bg-gray-600">
                    <svg className="w-8 h-8 text-gray-400 dark:text-gray-500 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">Change</span>
                  </div>
                )}
                <label
                  htmlFor="avatar"
                  className="absolute bottom-0 right-0 bg-orange-500 text-white rounded-full p-3 cursor-pointer hover:bg-orange-600 shadow-md transition-transform hover:scale-110"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  <input
                    id="avatar"
                    name="avatar"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
            </motion.div>

            {/* Account ID Field (Unchangeable) */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label htmlFor="accountId" className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2">
                Account ID
              </label>
              <input
                type="text"
                id="accountId"
                value={formData._id}
                readOnly
                disabled
                className="block w-full px-4 py-3 bg-gray-100 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-500 dark:text-gray-400 cursor-not-allowed transition-colors"
              />
            </motion.div>

            {/* Name Field */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label htmlFor="name" className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="block w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-orange-500 dark:focus:border-orange-400 transition-all"
                placeholder="Enter your name"
              />
            </motion.div>

            {/* Phone Number Field */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label htmlFor="phone_number" className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2">
                Phone Number
              </label>
              <input
                type="number"
                id="phone_number"
                name="phone_number" 
                value={formData.phone_number}
                onChange={handleChange}
                className="block w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-orange-500 dark:focus:border-orange-400 transition-all"
                placeholder="Enter your phone number"
              />
            </motion.div>

            {/* Address Field */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label htmlFor="address" className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2">
                Delivery Address
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="3"
                className="block w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-orange-500 dark:focus:border-orange-400 transition-all resize-none"
                placeholder="Update your delivery address..."
              ></textarea>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex gap-4 pt-4"
            >
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="w-1/3 py-3.5 px-4 border border-gray-300 dark:border-gray-600 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 focus:ring-orange-500 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`w-2/3 flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-blue-700 dark:text-blue-100 bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 focus:ring-orange-500 transition-all ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-700 dark:text-blue-100" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving Changes...
                  </>
                ) : 'Save Changes'}
              </button>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default EditProfile;