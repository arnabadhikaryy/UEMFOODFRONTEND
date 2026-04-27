import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { getCookie } from '../middelwaie/cookie';
import { jwtDecode } from 'jwt-decode'; 
import toast, { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from './futer';
import Navbar from './navbar';
import backend_Url from '../backend_url_return_function/backendUrl';

function Product() {
  const location = useLocation();
  const navigate = useNavigate();
  // Safe destructuring with defaults
  const { url, title, price, id, description, originalPrice, discount } = location.state || {};
  
  const [userPhone, setUserPhone] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingCod, setLoadingCod] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [userToken, setUserToken] = useState('');
  
  // State for confirmation modal
  const [showConfirmModal, setShowConfirmModal] = useState(false);

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
            token: userToken 
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

  const handleCashOnDelivery = async () => {
    setShowConfirmModal(false); // Close modal when starting the process
    
    if (!userPhone) {
      toast.error('Please login to place an order');
      navigate('/login');
      return;
    }

    setLoadingCod(true);
    try {
      const response = await axios.post(
        `${backend_Url}/production/order`,
        {
          token: userToken,
          orderID: id,
          after_discount_final_price: price
        }
      );

      if (response.data.status) {
        toast.success(response.data.message || 'Order placed successfully.');
        navigate('/ordersuccess');
      } else {
        toast.error(response.data.message || 'User not found or order was not updated.');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error(error.response?.data?.message || 'Oops, something went wrong. Please try again later.');
    } finally {
      setLoadingCod(false);
    }
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  if (!location.state) return null; 

  return (
    <div className="h-full w-screen bg-gray-50 flex flex-col relative">
      <Navbar />
      <Toaster position="top-right" />
      
      {/* --- Confirmation Modal --- */}
      <AnimatePresence>
        {showConfirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl p-6 md:p-8 max-w-sm w-full shadow-2xl"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
              </div>
              <h3 className="text-2xl font-bold text-emerald-500 mb-2">Confirm Order</h3>
              <p className="text-gray-600 mb-6">
                You are about to place an order for <strong>{quantity}x {title}</strong>. <br/>
                Total amount to pay on delivery is <span className="font-bold text-gray-900">₹{price * quantity}</span>.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 py-3 px-4 rounded-xl border-2 border-gray-200 text-gray-700 font-bold hover:bg-gray-50 hover:border-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCashOnDelivery}
                  className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 text-emerald-400 font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200"
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* -------------------------- */}

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
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent lg:hidden"></div>
            </div>

            {/* Content Section */}
            <div className="p-8 lg:p-12 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 tracking-wide uppercase">
                    In Stock
                  </span>
                  {price > 200 && (
                    <span className="flex items-center text-sm font-semibold text-emerald-600">
                      <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                      Free Delivery
                    </span>
                  )}
                </div>

                <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight mb-3 capitalize">
                  {title}
                </h1>
                
                <p className="text-gray-500 text-base lg:text-lg mb-6 leading-relaxed">
                  {description}
                </p>

                {/* UPDATED PRICING DESIGN SECTION */}
                <div className="mb-8 flex flex-col gap-1">
                  {discount && discount > 0 ? (
                    <>
                      <div className="flex items-center gap-3">
                        <span className="text-xl text-gray-400 line-through font-medium">
                          ₹{originalPrice}
                        </span>
                        <span className="bg-red-100 text-red-600 text-2xl font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wide">
                          {discount}% OFF
                        </span>
                      </div>
                      <div className="flex items-end gap-2">
                        <span className="text-4xl font-black text-gray-900">₹{price}</span>
                        <span className="text-gray-400 text-lg mb-1 font-medium">/ plate</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-end gap-2">
                      <span className="text-4xl font-black text-gray-900">₹{price}</span>
                      <span className="text-gray-400 text-lg mb-1 font-medium">/ plate</span>
                    </div>
                  )}
                </div>
                {/* END OF UPDATED PRICING SECTION */}

                {/* Divider */}
                <div className="h-px bg-gray-100 w-full mb-8"></div>

                {/* Quantity & Controls */}
                <div className="flex flex-col sm:flex-row sm:items-center text-gray-800 justify-between gap-6 mb-8">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">Quantity</label>
                    <div className="flex items-center bg-gray-50 rounded-xl border border-gray-200 w-fit">
                      <button
                        onClick={()=>{
                        alert('function is in Tseting state, if you want to buy more then one, them plese order repeatedly. thankyou for your support')
                       }}
                        className="p-3 text-gray-500 hover:text-emerald-600 transition-colors disabled:opacity-30"
                        disabled={quantity <= 1 || loading || loadingCod}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path></svg>
                      </button>
                      <span className="w-12 text-center font-bold text-gray-900 text-xl select-none">{quantity}</span>
                      <button
                        onClick={()=>{
                        alert('function is in Tseting state, if you want to buy more then one, them plese order repeatedly. thankyou for your support')
                       }}
                        className="p-3 text-gray-500 hover:text-emerald-600 transition-colors disabled:opacity-30"
                        disabled={quantity >= 10 || loading || loadingCod}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                      </button>
                    </div>

                  </div>
                  
                  <div className="text-left sm:text-right">
                    <p className="text-sm font-bold text-gray-500 mb-1 uppercase tracking-wide">Total Amount</p>
                    <p className="text-3xl font-black text-emerald-600">₹{price * quantity}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons Section */}
              <div className="flex flex-col gap-3 mt-4 lg:mt-0">
                
                {/* Pay Now Button - CURRENTLY DISABLED */}
                <button
                  disabled={true}
                  className="w-full py-4 px-6 rounded-xl text-lg font-bold transition-all bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                >
                  <div className="flex justify-between items-center w-full px-2">
                    <span className="flex items-center gap-2">
                      <svg className="w-5 h-5 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                      Pay Now (Unavailable)
                    </span>
                    <span className="bg-gray-200 px-3 py-1 rounded-md text-sm sm:hidden">₹{price * quantity}</span>
                  </div>
                </button>

                {/* Cash on Delivery Button */}
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowConfirmModal(true)}
                  disabled={loading || loadingCod}
                  className={`w-full py-4 px-6 rounded-xl text-lg font-bold shadow-lg transition-all 
                    ${loading || loadingCod 
                      ? 'bg-emerald-400 cursor-not-allowed text-white shadow-none' 
                      : 'bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-emerald-200'
                    }`}
                >
                  {loadingCod || loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Processing Order...</span>
                    </div>
                  ) : (
                    <div className="flex justify-center items-center text-blue-800 w-full px-2">
                      <span>Order via Cash on Delivery [free]</span>
                    </div>
                  )}
                </motion.button>
              </div>
              
              <p className="mt-5 text-center text-sm font-medium text-gray-400">
                Online payments are temporarily paused. COD is available.
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