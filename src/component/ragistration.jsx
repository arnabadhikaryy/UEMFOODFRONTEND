import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import backend_Url from '../backend_url_return_function/backendUrl';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    password: '',
    village: '',
    pin: '',
    landmark: ''
  });
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [agreedToPolicy, setAgreedToPolicy] = useState(false);

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
      setAvatar(file);
      
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

    if (!formData.fullName || !formData.phone || !formData.password || !formData.village || !formData.pin || !formData.landmark) {
      toast.error('Please fill all fields');
      setLoading(false);
      return;
    }

    if (!avatar) {
      toast.error('Please upload a profile image');
      setLoading(false);
      return;
    }

    if (!agreedToPolicy) {
      toast.error('You must read and agree to the Privacy Policy to register.');
      setLoading(false);
      return;
    }

    try {
      const combinedAddress = `village: ${formData.village} , pin: ${formData.pin} , landmark: ${formData.landmark}`;

      const formDataToSend = new FormData();
      formDataToSend.append('fullName', formData.fullName);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('password', formData.password);
      formDataToSend.append('user_address', combinedAddress);
      formDataToSend.append('avatar', avatar);

      const response = await axios.post(
        `${backend_Url}/user/siginup`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.status) {
        toast.success('Registration successful! Please login');
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } else {
        toast.error(response.data.message || 'Registration failed');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full w-screen bg-[#fdf2f2] flex flex-col items-center justify-center p-4 py-20 font-sans selection:bg-[#ff5733] selection:text-white">
      <Toaster position="top-center" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-md w-full relative pt-12"
      >
        {/* Dynamic Avatar Upload (Replaces the static Chef Header) */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-12 z-20">
          <div className="relative group w-32 h-32">
            {preview ? (
              <img 
                src={preview} 
                alt="Profile preview" 
                className="w-full h-full rounded-full object-cover border-4 border-white shadow-md bg-white transition-transform group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-white border-4 border-white shadow-md flex flex-col items-center justify-center transition-colors group-hover:bg-gray-50 cursor-pointer overflow-hidden">
                 <svg className="w-10 h-10 text-gray-300 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Photo</span>
              </div>
            )}
            <label 
              htmlFor="avatar" 
              className="absolute bottom-1 right-1 bg-[#ff5733] text-white rounded-full p-2 cursor-pointer hover:bg-[#e04c2c] shadow-lg transition-transform hover:scale-110"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <input 
                id="avatar" 
                name="avatar" 
                type="file" 
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-[40px] shadow-2xl pt-28 pb-8 px-6 sm:px-10 w-full relative z-10">
          
          {/* Top Toggle Buttons */}
          <div className="flex bg-gray-50 rounded-full p-1.5 mb-8 shadow-inner">
            <button 
              type="button"
              className="flex-1 py-3 text-center rounded-full bg-[#ff5733] text-black font-semibold text-sm shadow-md transition-all"
            >
              Register
            </button>
            <button 
              onClick={() => navigate('/login')}
              type="button"
              className="flex-1 py-3 text-center rounded-full text-gray-500 font-semibold text-sm transition-all hover:text-gray-700"
            >
              Log In
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name Input */}
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <label htmlFor="fullName" className="block text-gray-600 text-sm font-medium mb-1.5 ml-2">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="block w-full px-6 py-4 bg-gray-50 border-transparent rounded-full text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#ff5733] focus:border-transparent transition-all duration-200 outline-none"
                placeholder="Full Name"
              />
            </motion.div>

            {/* Phone Number Input */}
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <label htmlFor="phone" className="block text-gray-600 text-sm font-medium mb-1.5 ml-2">Phone Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <span className="text-gray-400 font-medium">+91</span>
                </div>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="block w-full pl-14 pr-6 py-4 bg-gray-50 border-transparent rounded-full text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#ff5733] focus:border-transparent transition-all duration-200 outline-none"
                  placeholder="Phone Number"
                />
              </div>
            </motion.div>

            {/* Password Input */}
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <label htmlFor="password" className="block text-gray-600 text-sm font-medium mb-1.5 ml-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-6 pr-14 py-4 bg-gray-50 border-transparent rounded-full text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#ff5733] focus:border-transparent transition-all duration-200 outline-none"
                  placeholder="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 pr-4 flex items-center text-gray-400 hover:text-[#ff5733] transition-colors focus:outline-none"
                >
                   {showPassword ? (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0l-3.29-3.29" /></svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  )}
                </button>
              </div>
            </motion.div>

            {/* Address Group */}
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="space-y-4 pt-2 border-t border-gray-100">
              <label className="block text-gray-600 text-sm font-medium ml-2">Delivery Details</label>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="village"
                  value={formData.village}
                  onChange={handleChange}
                  className="block w-full px-6 py-4 bg-gray-50 border-transparent rounded-full text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#ff5733] focus:border-transparent transition-all duration-200 outline-none text-sm"
                  placeholder="Village"
                />
                <input
                  type="text"
                  name="pin"
                  value={formData.pin}
                  onChange={handleChange}
                  className="block w-full px-6 py-4 bg-gray-50 border-transparent rounded-full text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#ff5733] focus:border-transparent transition-all duration-200 outline-none text-sm"
                  placeholder="PIN Code"
                />
              </div>
              <input
                type="text"
                name="landmark"
                value={formData.landmark}
                onChange={handleChange}
                className="block w-full px-6 py-4 bg-gray-50 border-transparent rounded-full text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#ff5733] focus:border-transparent transition-all duration-200 outline-none"
                placeholder="Landmark"
              />
            </motion.div>

            {/* Privacy Policy Checkbox */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="flex items-center pt-2 pl-2">
              <input
                id="privacyPolicy"
                type="checkbox"
                checked={agreedToPolicy}
                onChange={(e) => setAgreedToPolicy(e.target.checked)}
                className="w-4 h-4 text-[#ff5733] bg-gray-50 border-gray-300 rounded focus:ring-[#ff5733] focus:ring-2 transition-all cursor-pointer"
              />
              <label htmlFor="privacyPolicy" className="ml-3 text-sm text-gray-500 cursor-pointer">
                I agree to <span className="text-[#ff5733] font-medium">Terms</span> and {' '}
                <a
                  href="https://docs.google.com/document/d/1rrMWZ1AkCdf_eiSGXCjodsfTuMHhXvN_fDR11biKRXk/edit?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#ff5733] font-medium hover:underline transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  Privacy Policy.
                </a>
              </label>
            </motion.div>

            {/* Submit Button */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center items-center py-4 px-4 rounded-full shadow-lg text-lg font-bold text-black bg-[#ff5733] hover:bg-[#e04c2c] focus:outline-none focus:ring-4 focus:ring-[#ff5733]/30 transition-all ${loading ? 'opacity-70 cursor-not-allowed' : 'active:scale-[0.98]'}`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Registering...
                  </>
                ) : 'Registration'}
              </button>
            </motion.div>
          </form>

          {/* Footer Link */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="mt-8 text-center">
            <p className="text-sm text-gray-500 font-medium">
              Already Have An Account?{' '}
              <button
                onClick={() => navigate('/login')}
                className="font-bold text-[#ff5733] hover:text-[#e04c2c] transition-colors focus:outline-none"
              >
                Log In
              </button>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;