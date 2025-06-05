import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { getCookie } from '../middelwaie/cookie';
import { jwtDecode } from 'jwt-decode'; // Browser-compatible JWT decoder
import toast, { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import Footer from './futer';

function Product() {
  const location = useLocation();
  const navigate = useNavigate();
  const { url, title, price, id } = location.state || {};
  const [userPhone, setUserPhone] = useState(null);
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [usertoken, setuserToken] = useState('');

  useEffect(() => {
    const token = getCookie('authToken');
    if (token) {
      try {
        // Decode the token (without verification)
        setuserToken(token);
        const decoded = jwtDecode(token);

        console.log(decoded)
        
        if (decoded && decoded.phone) {
          setUserPhone(decoded.phone);
        } else {
          toast.error('Invalid token format');
          navigate('/login');
        }
      } catch (error) {
        toast.error('Failed to decode token');
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handlePlaceOrder = async () => {
    if (!userPhone) {
      toast.error('Please login to place an order');
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        'https://uemfoodbackend-production.up.railway.app/api/v1/orders/payment',
        {
            name:title,
             amount:price * quantity,
              FOODorderID:id,
              token:usertoken
        }
      );

      console.log('my payment response is ',response.data)

      if (response.data.url) {
        setLoading(false);
        window.location.href = response.data.url;   
      } else {
        toast.error(response.data.message || 'Failed to place order');
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

  if (!location.state) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-gray-600">No product selected.</p>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-red-50 py-12 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-center" />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl"
      >
        <div className="md:flex">
          {/* Product Image */}
          <motion.div 
            className="md:flex-shrink-0"
            whileHover={{ scale: 1.02 }}
          >
            <img
              className="h-96 w-full object-cover md:w-96"
              src={url}
              alt={title}
            />
          </motion.div>
          
          {/* Product Details */}
          <div className="p-8">
            <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
              Food Item
            </div>
            <motion.h1 
              className="mt-2 text-2xl font-extrabold text-gray-900"
              initial={{ x: -20 }}
              animate={{ x: 0 }}
            >
              {title}
            </motion.h1>
            
            <div className="mt-4 flex items-center">
              <span className="text-3xl font-bold text-gray-900">₹{price}</span>
              {price > 200 && (
                <span className="ml-3 px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                  Free Delivery
                </span>
              )}
            </div>
            
            <p className="mt-4 text-gray-500">
              Enjoy this delicious meal prepared with the freshest ingredients and authentic spices.
            </p>
            
            {/* Quantity Selector */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700">Quantity</label>
              <div className="mt-1 flex items-center">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1 bg-gray-200 rounded-l-md hover:bg-gray-300"
                >
                  -
                </button>
                <span className="px-4 py-1 bg-gray-100">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1 bg-gray-200 rounded-r-md hover:bg-gray-300"
                >
                  +
                </button>
              </div>
            </div>
            
            {/* Order Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePlaceOrder}
              disabled={loading}
              className={`mt-8 w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <div>Placing Order...</div>
                </>
              ) : (
                <div className='flex items-center justify-center text-black' >
                  Place Order - ₹{price * quantity}
                </div>
              )}
            </motion.button>
            
            {/* Product ID (hidden by default, can be shown for debugging) */}
            <p className="mt-4 text-xs text-gray-400">Product ID: {id}</p>
          </div>
        </div>
      </motion.div>
      <Footer/>
    </div>
  );
}

export default Product;