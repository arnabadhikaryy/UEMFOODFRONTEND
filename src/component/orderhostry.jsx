import { useState, useEffect, useCallback } from 'react';
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
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null); // Store user info for reviews

  // Review Modal State
  const [reviewModal, setReviewModal] = useState({
    isOpen: false,
    foodId: null,
    foodTitle: ''
  });

  const navigate = useNavigate();

  const fetchOrders = useCallback(async (isRefresh = false) => {
    const token = getCookie('authToken');
    if (!token) {
      toast.error('Please login to view orders');
      navigate('/login');
      return;
    }

    if (isRefresh) setRefreshing(true);

    try {
      const decoded = jwtDecode(token);
      if (!decoded?.phone) throw new Error('Invalid token');

      // Save user info from token to pass to the review API
      // Adjust decoded._id and decoded.name based on your exact JWT payload
      console.log('data decode value is: ', decoded);
      setUser({
        id: decoded.userId,
        name: decoded.name || 'Customer'
      });

      const response = await axios.post(
        `${backend_Url}/production/my/all/orders`,
        { token },
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.data.status) {
        setOrders(response.data.orders || []);
        if (isRefresh) toast.success('Orders updated!');
      } else {
        setError(response.data.message || 'Failed to fetch orders');
        if (isRefresh) toast.error('Failed to update orders');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(errorMessage);
      if (err.response?.status === 401) navigate('/login');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchOrders(false);
  }, [fetchOrders]);

  const openReviewModal = (foodId, foodTitle) => {
    setReviewModal({ isOpen: true, foodId, foodTitle });
  };

  const closeReviewModal = () => {
    setReviewModal({ isOpen: false, foodId: null, foodTitle: '' });
  };

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
          <header className="mb-12 flex flex-col sm:flex-row sm:items-end justify-between text-center sm:text-left gap-6">
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

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => fetchOrders(true)}
              disabled={refreshing}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl shadow-sm hover:shadow-md transition-all disabled:opacity-70 disabled:cursor-not-allowed mx-auto sm:mx-0"
            >
              <svg className={`w-5 h-5 ${refreshing ? 'animate-spin text-indigo-500' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="font-semibold">{refreshing ? 'Refreshing...' : 'Refresh Status'}</span>
            </motion.button>
          </header>

          {orders.length === 0 ? (
            <EmptyState navigate={navigate} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence>
                {orders.map((order, index) => (
                  <OrderCard
                    key={index}
                    order={order}
                    index={index}
                    navigate={navigate}
                    onReviewOpen={openReviewModal}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Review Modal Integration */}
      <ReviewModal
        isOpen={reviewModal.isOpen}
        onClose={closeReviewModal}
        foodId={reviewModal.foodId}
        foodTitle={reviewModal.foodTitle}
        user={user}
      />
    </div>
  );
};

// --- Sub-Components ---

const OrderCard = ({ order, index, navigate, onReviewOpen }) => {
  const food = order.foodItem || {};
  const finalPrice = order.priceAtPurchase || Math.round(food.price - (food.discount / 100) * food.price);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'text-green-700 bg-green-100';
      case 'Cancelled': return 'text-red-700 bg-red-100';
      case 'Processing': return 'text-blue-700 bg-blue-100';
      case 'out of delivery': return 'text-orange-700 bg-orange-100';
      default: return 'text-indigo-700 bg-white/90 dark:bg-slate-800/90';
    }
  };

  const getPaymentColor = (status) => {
    switch (status) {
      case 'Success': return 'text-green-700 bg-green-100';
      case 'Failed': return 'text-red-700 bg-red-100';
      case 'Pending': return 'text-indigo-700 bg-white/90 dark:bg-slate-800/90';
      default: return 'text-indigo-700 bg-white/90 dark:bg-slate-800/90';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -8 }}
      className="group bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden flex flex-col transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-100 dark:hover:shadow-indigo-900/20"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={food.pic_url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"}
          alt={food.title || "Food Item"}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute flex flex-col top-4 left-4 gap-2">
          <span className={`${getStatusColor(order.status)} backdrop-blur-md text-[10px] font-bold px-3 py-1.5 rounded-full shadow-sm uppercase tracking-wider`}>
            DELIVERY: {order.status || 'Pending'}
          </span>
          <span className={`${getPaymentColor(order.paymentstatus)} backdrop-blur-md text-[10px] font-bold px-3 py-1.5 rounded-full shadow-sm uppercase tracking-wider`}>
            PAYMENT: {order.paymentstatus || 'Pending'}
          </span>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {food.title || "Item Unavailable"}
          </h3>
          <div className="text-right">
            <span className="text-xl font-black text-slate-900 dark:text-white">₹{finalPrice * (order.quantity || 1)}</span>
            <span className="block text-xs text-slate-400">Qty: {order.quantity || 1}</span>
          </div>
        </div>

        <p className="text-sm text-slate-400 dark:text-slate-500 font-mono mb-6">
          Order ID: <span className="text-slate-600 dark:text-slate-300">{order._id.substring(0, 12)}...</span>
        </p>

        <div className="mt-auto pt-4 border-t border-slate-50 dark:border-slate-700 flex items-center justify-between">
          <button
            onClick={() => {
              navigate('/product', {
                state: { id: food._id, url: food.pic_url, title: food.title, price: food.price, description: food.description },
              });
            }}
            className="flex items-center text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 transition-colors"
          >
            Buy Again
          </button>

          {/* NEW: Review Button only shows if order is delivered */}
          {order.status === 'Delivered' && (
            <button
              onClick={() => onReviewOpen(food._id, food.title)}
              className="flex items-center px-4 py-2 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 text-sm font-bold rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors"
            >
              Write Review
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

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
      className="mt-8 px-8 py-3 bg-indigo-600 dark:bg-indigo-500 text-white font-bold rounded-2xl shadow-lg hover:bg-indigo-700 transition-all active:scale-95"
    >
      Explore Menu
    </button>
  </motion.div>
);

// --- Review Modal Component ---
const ReviewModal = ({ isOpen, onClose, foodId, foodTitle, user }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [image, setImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setRating(5);
      setComment('');
      setImage(null);
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return toast.error("Please add a comment.");
    if (!user || !user.id) return toast.error("User information not found. Please relogin.");
    let token = getCookie('authToken');
    console.log('rrarsfdgfd ', token)
    const decoded = jwtDecode(token);


    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('token', toast);
    formData.append('profile_image', decoded.img_url)
    formData.append('foodId', foodId);
    formData.append('userId', user.id);
    formData.append('userName', user.name);
    formData.append('rating', rating);
    formData.append('comment', comment);
    if (image) formData.append('image', image); // Matches your multer config 'image'

    try {
      const response = await axios.post(`${backend_Url}/production/food/review`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' } // Important for file uploads
      });

      if (response.data.status) {
        toast.success('Review submitted successfully!');
        onClose();
      } else {
        toast.error(response.data.message || 'Failed to submit review');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-8 w-full max-w-md shadow-2xl relative"
        >
          <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>

          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Rate your food</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm">How was your <span className="font-semibold text-indigo-500">{foodTitle}</span>?</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Star Rating */}
            <div className="flex justify-center gap-2 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className={`transition-colors duration-200 ${star <= rating ? 'text-yellow-400' : 'text-slate-200 dark:text-slate-700'}`}
                >
                  <svg className="w-10 h-10 fill-current" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                </button>
              ))}
            </div>

            {/* Comment */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Review Comment</label>
              <textarea
                rows="3"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Tell us what you liked (or didn't like)..."
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
                required
              />
            </div>

            {/* Image Upload (Optional) */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Add a Photo (Optional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                className="w-full text-sm text-slate-500 dark:text-slate-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 dark:file:bg-indigo-900/30 dark:file:text-indigo-400 hover:file:bg-indigo-100 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-amber-950 font-bold py-3.5 px-4 rounded-xl transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
            >
              {isSubmitting ? (
                <svg className="animate-spin h-5 w-5 text-blue-800" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : "Submit Review"}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default OrdersPage;