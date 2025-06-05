import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import amineGif from '../assets/anime.gif'; // Adjust path as needed
import Footer from './futer';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative h-screen w-screen flex items-center justify-center overflow-hidden">
      {/* Animated GIF Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src={amineGif} 
          alt="404 background animation" 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10 text-center px-4 py-12 sm:px-6 lg:px-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          {/* Error Code */}
          <motion.h1 
            className="text-9xl font-bold text-gray-900 mb-4"
            animate={{ 
              rotate: [0, -5, 5, -5, 0],
              y: [0, -10, 10, -10, 0]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 3,
              ease: "easeInOut"
            }}
          >
            404
          </motion.h1>
          
          {/* Error Message */}
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-4xl font-bold text-green-500 mb-6"
          >
            Something Went Wrong...
          </motion.h2>
          
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-xl text-green-500 mb-8"
          >
            The page you're looking for isn't available!
          </motion.p>
          
          {/* Home Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            onClick={() => navigate('/')}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Go to Home
          </motion.button>
          
          {/* Optional: Floating elements */}
          <motion.div
            className="absolute -top-20 -left-20 w-40 h-40 rounded-full bg-blue-400 opacity-10"
            animate={{
              x: [0, 50, 0],
              y: [0, 30, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-indigo-400 opacity-10"
            animate={{
              x: [0, -40, 0],
              y: [0, -20, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
              delay: 2
            }}
          />
        </motion.div>
      </div>
      <Footer/>
    </div>
  );
};

export default NotFoundPage;