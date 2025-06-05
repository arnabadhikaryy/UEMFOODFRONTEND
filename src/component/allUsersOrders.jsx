
import { useState, useEffect } from 'react';
import axios from 'axios';
import { getCookie } from '../middelwaie/cookie';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import Footer from './futer';

const UsersWithOrdersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsersWithOrders = async () => {
      const token = getCookie('authToken');
      
      if (!token) {
        toast.error('Please login to view this page');
        navigate('/login');
        return;
      }

      try {
        // Verify token is valid before making request
        const decoded = jwtDecode(token);
        if (!decoded?.phone) {
          throw new Error('Invalid token');
        }

        const response = await axios.get(
          'https://uemfoodbackend-production.up.railway.app/production/getUsersWithOrders',
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        if (response.data.status) {
          setUsers(response.data.message || []);
        } else {
          setError(response.data.message || 'Failed to fetch users with orders');
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        if (err.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsersWithOrders();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen w-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen w-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-screen bg-red-50 py-8 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-center" />
      
      <div className="max-w-7xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-gray-900 mb-8 text-center"
        >
          Users with Active Orders
        </motion.h1>

        {users.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1"
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No users with active orders</h3>
            <p className="mt-1 text-gray-500">
              Currently no users have placed any orders.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {users.map((user, userIndex) => (
              <motion.div
                key={user._id || userIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: userIndex * 0.1 }}
                className="bg-white shadow overflow-hidden sm:rounded-lg"
              >
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                  <div className="flex items-center">
                    <img
                      className="h-12 w-12 rounded-full object-cover mr-4"
                      src={user.imageURL || 'https://www.gravatar.com/avatar/default?s=200'}
                      alt={user.name}
                    />
                    <div>
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        {user.name}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {user.phone_number} • {user.address}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <h4 className="text-md font-medium text-gray-900 mb-4">
                    Active Orders ({user.orders.length})
                  </h4>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {user.orders.map((order, orderIndex) => (
                      <motion.div
                        key={order._id || orderIndex}
                        whileHover={{ scale: 1.02 }}
                        className="border rounded-lg overflow-hidden"
                      >
                        <img
                          className="w-full h-40 object-cover"
                          src={order.pic_url}
                          alt={order.title}
                        />
                        <div className="p-4">
                          <h5 className="text-lg font-medium text-gray-900">
                            {order.title}
                          </h5>
                          <p className="mt-1 text-gray-600">₹{order.price}</p>
                          <p className="mt-2 text-xs text-gray-500">
                            Order ID: {order._id}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      <Footer/>
    </div>
  );
};

export default UsersWithOrdersPage;