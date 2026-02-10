import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import { getCookie } from '../middelwaie/cookie';
import Footer from './futer'; 
import Navbar from './navbar';
import backend_Url from '../backend_url_return_function/backendUrl';

const AddFoodPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    price: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [useradminpassword, setUseradminpassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const adminpassword = '55555@arnab';

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
      setImageFile(file);
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

    if (!formData.title || !formData.price) {
      toast.error('Please fill all fields');
      setLoading(false);
      return;
    }

    if (!imageFile) {
      toast.error('Please upload an image');
      setLoading(false);
      return;
    }

    try {
      const token = getCookie('authToken');
      if (!token) {
        toast.error('Please login to add food items');
        navigate('/login');
        return;
      }

      if (useradminpassword !== adminpassword) {
        toast.error('Invalid Admin Password');
        setLoading(false);
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('pic_url_file', imageFile);

      const response = await axios.post(
        `${backend_Url}/production/addfood`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.status) {
        toast.success('Food item added successfully!');
        setTimeout(() => {
          navigate('/'); 
        }, 1500);
      } else {
        toast.error(response.data.message || 'Failed to add food item');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred');
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" w-screen bg-gray-50 flex flex-col font-sans">
      <Toaster position="top-center" reverseOrder={false} />
      <Navbar/>
      
      <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-lg"
        >
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            {/* Header */}
            <div className="bg-emerald-600 px-8 py-6 relative overflow-hidden">
              <div className="relative z-10">
                <h1 className="text-3xl font-bold text-white tracking-tight">Add New Item</h1>
                <p className="text-emerald-100 mt-1 text-sm">Curate your restaurant's menu</p>
                
                {/* Subtle Password Hint Badge */}
                <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full bg-emerald-800/50 border border-emerald-500/30 text-xs text-emerald-100">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Admin Key: 55555@arnab
                </div>
              </div>
              
              {/* Decorative Circle */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
            </div>

            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Image Upload */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Food Image</label>
                  <div className="relative group">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden" 
                      id="image-upload"
                    />
                    <label 
                      htmlFor="image-upload"
                      className={`relative flex flex-col items-center justify-center w-full h-56 rounded-xl border-2 border-dashed transition-all cursor-pointer overflow-hidden
                        ${preview ? 'border-emerald-500' : 'border-gray-300 hover:border-emerald-400 hover:bg-emerald-50'}`}
                    >
                      {preview ? (
                        <>
                          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-white font-medium flex items-center gap-2">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                              </svg>
                              Change Image
                            </span>
                          </div>
                        </>
                      ) : (
                        <div className="text-center p-4">
                          <div className="mx-auto h-12 w-12 text-gray-400 mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <p className="text-sm text-gray-500 font-medium">Click to upload image</p>
                          <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
                        </div>
                      )}
                    </label>
                  </div>
                </motion.div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {/* Title Input */}
                  <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                    <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">Item Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none"
                        placeholder="e.g. Butter Chicken"
                      />
                    </div>
                  </motion.div>

                  {/* Price Input */}
                  <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                    <label htmlFor="price" className="block text-sm font-semibold text-gray-700 mb-2">Price</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 font-semibold">
                        ₹
                      </div>
                      <input
                        type="number"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        min="0"
                        className="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none"
                        placeholder="0.00"
                      />
                    </div>
                  </motion.div>
                </div>

                {/* Admin Password */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                  <label htmlFor="adminpassword" className="block text-sm font-semibold text-gray-700 mb-2">Admin Authorization</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="adminpassword"
                      name="adminpassword"
                      value={useradminpassword}
                      onChange={(e) => setUseradminpassword(e.target.value)}
                      className="w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none"
                      placeholder="Enter Admin Password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                          <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.742L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.064 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  </div>
                </motion.div>

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className={`w-full flex items-center justify-center py-3.5 px-4 rounded-xl shadow-lg text-sm font-bold text-white transition-all
                    ${loading 
                      ? 'bg-emerald-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-emerald-500/30'
                    }`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    "Publish Item"
                  )}
                </motion.button>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
      <Footer/>
    </div>
  );
};

export default AddFoodPage;