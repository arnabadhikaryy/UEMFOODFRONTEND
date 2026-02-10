import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { getCookie } from '../middelwaie/cookie';
import { jwtDecode } from 'jwt-decode'; 
import toast, { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import Footer from './futer';
import Navbar from './navbar';
import backend_Url from '../backend_url_return_function/backendUrl';

function Product() {
  const location = useLocation();
  const navigate = useNavigate();
  // Safe destructuring with defaults
  const { url, title, price, id } = location.state || {};
  
  const [userPhone, setUserPhone] = useState(null);
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [userToken, setUserToken] = useState('');

  useEffect(() => {
    // If no state exists (user navigated directly to URL), redirect back
    if (!location.state) {
      navigate('/menu'); 
      return;
    }

    const token = getCookie('authToken');
    if (token) {
      try {
        setUserToken(token);
        const decoded = jwtDecode(token);
        
        if (decoded && decoded.phone) {
          setUserPhone(decoded.phone);
        } else {
          toast.error('Session invalid. Please login again.');
          navigate('/login');
        }
      } catch (error) {
        console.error("Token decode error:", error);
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [navigate, location.state]);

  const handlePlaceOrder = async () => {
    if (!userPhone) {
      toast.error('Please login to place an order');
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${backend_Url}/api/v1/orders/payment`,
        {
            name: title,
            amount: price * quantity,
            FOODorderID: id,
            token: userToken // Fixed variable name case from original code
        }
      );

      if (response.data.url) {
        window.location.href = response.data.url;   
      } else {
        toast.error(response.data.message || 'Failed to place order');
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Payment initiation failed');
      if (error.response?.status === 401) {
        navigate('/login');
      }
      setLoading(false);
    }
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  if (!location.state) return null; // Handled in useEffect

  return (
    <div className="h-full w-screen bg-gray-50 flex flex-col">
      <Navbar />
      <Toaster position="top-right" />
      
      <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-5xl w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100"
        >
          <div className="lg:grid lg:grid-cols-2 lg:gap-0">
            
            {/* Image Section */}
            <div className="relative h-64 lg:h-auto bg-gray-100">
               <motion.img
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 w-full h-full object-cover"
                src={url}
                alt={title}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent lg:hidden"></div>
            </div>

            {/* Content Section */}
            <div className="p-8 lg:p-12 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                    In Stock
                  </span>
                  {price > 200 && (
                    <span className="flex items-center text-xs font-medium text-emerald-600">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                      Free Delivery
                    </span>
                  )}
                </div>

                <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight mb-2 capitalize">
                  {title}
                </h1>
                
                <p className="text-gray-500 text-lg mb-6 leading-relaxed">
                  Experience the authentic taste prepared with premium ingredients. Perfect for a delightful meal.
                </p>

                <div className="flex items-end gap-2 mb-8">
                  <span className="text-4xl font-bold text-gray-900">₹{price}</span>
                  <span className="text-gray-400 text-lg mb-1">/ plate</span>
                </div>

                {/* Divider */}
                <div className="h-px bg-gray-100 w-full mb-8"></div>

                {/* Quantity & Controls */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                    <div className="flex items-center bg-gray-50 rounded-xl border border-gray-200 w-fit">
                      <button
                        onClick={() => handleQuantityChange(-1)}
                        className="p-3 text-gray-500 hover:text-emerald-600 transition-colors disabled:opacity-50"
                        disabled={quantity <= 1}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path></svg>
                      </button>
                      <span className="w-12 text-center font-semibold text-gray-900 text-lg select-none">{quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(1)}
                        className="p-3 text-gray-500 hover:text-emerald-600 transition-colors disabled:opacity-50"
                        disabled={quantity >= 10}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                      </button>
                    </div>
                  </div>
                  
                  <div className="text-right hidden sm:block">
                    <p className="text-sm text-gray-500 mb-1">Total Amount</p>
                    <p className="text-2xl font-bold text-emerald-600">₹{price * quantity}</p>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePlaceOrder}
                disabled={loading}
                className={`w-full py-4 px-6 rounded-xl text-white text-lg font-bold shadow-lg transition-all 
                  ${loading 
                    ? 'bg-gray-800 cursor-not-allowed' 
                    : 'bg-gray-900 hover:bg-emerald-600 hover:shadow-emerald-200'
                  }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Processing...</span>
                  </div>
                ) : (
                  <div className="flex justify-between items-center w-full px-2">
                    <span className=' text-black font-bold'>Pay Now </span>
                    <span className="bg-white/20 px-2 py-1 rounded text-sm sm:hidden">₹{price * quantity}</span>
                  </div>
                )}
              </motion.button>
              
              <p className="mt-4 text-center text-xs text-gray-400">
                Secure payment powered by Phonepay
              </p>
            </div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}

export default Product;