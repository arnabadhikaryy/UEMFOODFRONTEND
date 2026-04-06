import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import amineGif from '../assets/anime.gif'; // Adjust path as needed
import Navbar from './navbar';
import Footer from './futer';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    // Changed to a flex-col layout with min-h-screen to stack Navbar, Main, and Footer properly
    <div className="flex flex-col h-screen w-screen relative overflow-hidden bg-gray-900">
      
      {/* Ensure Navbar sits on top layer */}
      <div className="relative z-20">
        <Navbar />
      </div>
      
      {/* Main Content: flex-grow ensures it takes up all space between Navbar and Footer */}
      <main className="flex-grow flex items-center justify-center relative w-full">
        
        {/* Animated GIF Background */}
        <div className="absolute inset-0 z-0">
          <img 
            src={amineGif} 
            alt="404 background animation" 
            className="w-full h-full object-cover"
          />
          {/* Added a subtle black overlay to ensure text is readable over the GIF */}
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        {/* Content Wrapper */}
        <div className="relative z-10 text-center px-4 py-12 sm:px-6 lg:px-8 w-full">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto relative"
          >
            {/* Optional: Floating elements (adjusted for mobile sizes) */}
            <motion.div
              className="absolute -top-10 -left-4 md:-top-20 md:-left-20 w-24 h-24 md:w-40 md:h-40 rounded-full bg-blue-400 opacity-10 pointer-events-none"
              animate={{
                x: [0, 30, 0],
                y: [0, 20, 0],
              }}
              transition={{ duration: 10, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
            />
            <motion.div
              className="absolute -bottom-5 -right-4 md:-bottom-10 md:-right-10 w-20 h-20 md:w-32 md:h-32 rounded-full bg-indigo-400 opacity-10 pointer-events-none"
              animate={{
                x: [0, -30, 0],
                y: [0, -20, 0],
              }}
              transition={{ duration: 8, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 2 }}
            />

            {/* Error Code - Scaled dynamically from text-7xl on mobile to text-9xl on desktop */}
            <motion.h1 
              className="text-7xl sm:text-8xl md:text-9xl font-extrabold text-white drop-shadow-xl mb-2 md:mb-4"
              animate={{ 
                rotate: [0, -5, 5, -5, 0],
                y: [0, -10, 10, -10, 0]
              }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            >
              404
            </motion.h1>
            
            {/* Error Message - Adjusted responsive text sizing */}
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-400 drop-shadow-md mb-4 md:mb-6"
            >
              Something Went Wrong...
            </motion.h2>
            
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-sm sm:text-base md:text-xl text-green-200 drop-shadow mb-8 max-w-md mx-auto"
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
              className="px-6 py-3 md:px-8 md:py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm md:text-base font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Go to Home
            </motion.button>
            
          </motion.div>
        </div>
      </main>

      {/* Ensure Footer sits on top layer at the bottom */}
      <div className="relative z-20">
        <Footer />
      </div>
      
    </div>
  );
};

export default NotFoundPage;