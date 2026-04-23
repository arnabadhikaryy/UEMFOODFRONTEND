import { useState, useEffect } from 'react';
import axios from 'axios';
import { getCookie } from '../middelwaie/cookie';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from './futer';
import toast, { Toaster } from 'react-hot-toast';
import Navbar from './navbar';
import backend_Url from '../backend_url_return_function/backendUrl';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      const token = getCookie('authToken');
      if (!token) {
        toast.error('Please login to view orders');
        navigate('/login');
        return;
      }

      try {
        const decoded = jwtDecode(token);
        if (!decoded?.phone) throw new Error('Invalid token');

        const response = await axios.post(
          `${backend_Url}/production/my/all/orders`,
          { token },
          { headers: { 'Content-Type': 'application/json' } }
        );

        if (response.data.status) {
          setOrders(response.data.orders || []);
        } else {
          setError(response.data.message || 'Failed to fetch orders');
        }
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message;
        setError(errorMessage);
        if (err.response?.status === 401) navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen w-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="h-12 w-12 border-4 border-indigo-200 dark:border-indigo-900 border-t-indigo-600 dark:border-t-indigo-400 rounded-full"
        />
        <p className="mt-4 text-slate-500 dark:text-slate-400 font-medium tracking-wide">Fetching your goodies...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen bg-[#F8FAFC] dark:bg-slate-900 flex flex-col transition-colors duration-300">
      <Navbar />
      <Toaster position="top-center" gutter={12} />
      
      <main className="flex-grow pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <header className="mb-12 text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Order <span className="text-indigo-600 dark:text-indigo-400">History</span>
              </h1>
              <p className="mt-2 text-slate-500 dark:text-slate-400 text-lg">
                Manage and track all your previous purchases.
              </p>
            </motion.div>
          </header>

          {orders.length === 0 ? (
            <EmptyState navigate={navigate} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence>
                {orders.map((order, index) => (
                  <OrderCard key={index} order={order} index={index} navigate={navigate} />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

// --- Sub-Components for Cleanliness ---

const OrderCard = ({ order, index, navigate }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1, duration: 0.5 }}
    whileHover={{ y: -8 }}
    className="group bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden flex flex-col transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-100 dark:hover:shadow-indigo-900/20"
  >
    <div className="relative h-48 overflow-hidden">
      <img 
        src={order.pic_url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"} 
        alt={order.title} 
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute top-4 left-4">
        <span className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md text-indigo-700 dark:text-indigo-400 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm uppercase tracking-wider">
          Pending
        </span>
      </div>
    </div>

    <div className="p-6 flex flex-col flex-grow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {order.title}
        </h3>
        <span className="text-xl font-black text-slate-900 dark:text-white">₹{order.price}</span>
      </div>

      <p className="text-sm text-slate-400 dark:text-slate-500 font-mono mb-6">
        ID: <span className="text-slate-600 dark:text-slate-300">{order._id.substring(0, 12)}...</span>
      </p>

      <div className="mt-auto pt-4 border-t border-slate-50 dark:border-slate-700 flex items-center justify-between">
        <button
           onClick={() => {
                          navigate('/product', {
                            state: { id: order._id, url: order.pic_url, title: order.title, price: order.price, description: order.description },
                          });
                        }}
          className="flex items-center text-sm font-bold text-indigo-600 dark:text-indigo-400 group/btn"
        >
          View Details
          <svg className="ml-1 w-4 h-4 transition-transform group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
        <div className="h-8 w-8 rounded-full bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-slate-300 dark:text-slate-400 transition-colors duration-300">
           <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"/></svg>
        </div>
      </div>
    </div>
  </motion.div>
);

const EmptyState = ({ navigate }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="flex flex-col items-center justify-center py-20 px-4 bg-white dark:bg-slate-800 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-slate-700 shadow-inner dark:shadow-none transition-colors duration-300"
  >
    <div className="bg-indigo-50 dark:bg-indigo-900/30 p-6 rounded-full mb-6 transition-colors duration-300">
        <svg className="h-16 w-16 text-indigo-500 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
    </div>
    <h3 className="text-2xl font-bold text-slate-800 dark:text-white">Your basket is empty</h3>
    <p className="mt-2 text-slate-500 dark:text-slate-400 text-center max-w-xs">
      Looks like you haven't discovered our delicious menu items yet.
    </p>
    <button
      onClick={() => navigate('/')}
      className="mt-8 px-8 py-3 bg-indigo-600 dark:bg-indigo-500 text-white font-bold rounded-2xl shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20 hover:bg-indigo-700 dark:hover:bg-indigo-600 hover:shadow-indigo-300 dark:hover:shadow-indigo-900/40 transition-all active:scale-95"
    >
      Explore Menu
    </button>
  </motion.div>
);

export default OrdersPage;