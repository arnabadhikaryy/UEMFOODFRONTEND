

import React from 'react';
import { useNavigate } from 'react-router-dom';


const OrderSuccess = () => {
    const navigate = useNavigate();
  // In a real app, you would fetch these from your state management or API
  const orderId = "#" + Math.floor(100000 + Math.random() * 900000);
  const estimatedTime = "30 - 45 mins";

  return (
    <div className=" h-full w-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      <div className="bg-white max-w-md w-full rounded-3xl shadow-xl overflow-hidden transform transition-all">
        
        {/* Header Section with Confetti/Success Vibe */}
        <div className="bg-green-500 p-8 text-center">
          <div className="mx-auto w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 shadow-lg animate-bounce">
            <svg 
              className="w-10 h-10 text-green-500" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Order Confirmed!</h1>
          <p className="text-green-100 text-sm">
            Sit tight! Your delicious food is being prepared.
          </p>
        </div>

        {/* Order Details Section */}
        <div className="p-8">
          <div className="bg-gray-50 rounded-2xl p-5 mb-6 border border-gray-100">
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
              <span className="text-gray-500 font-medium">Order ID</span>
              <span className="text-gray-900 font-bold">{orderId}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 font-medium">Estimated Delivery</span>
              <span className="text-gray-900 font-bold flex items-center gap-2">
                <svg className="w-4 h-4 text-orange-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {estimatedTime}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button 
              onClick={() => console.log('Redirecting to order tracking...')}
              className="w-full bg-orange-500 hover:bg-orange-600 text-blue-800 font-bold py-4 rounded-xl transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              Track My Order
            </button>
            <button 
              onClick={() => navigate('/')}
              className="w-full bg-white hover:bg-gray-50 text-blue-700 font-bold py-4 rounded-xl border-2 border-gray-200 transition-colors duration-200"
            >
              Back to Menu
            </button>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default OrderSuccess;