import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { getCookie } from '../middelwaie/cookie';
import { motion } from 'framer-motion';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const token = getCookie('authToken');
      if (token) {
        try {
          const decoded = jwtDecode(token);
          setUser({
            name: decoded.name,
            phone: decoded.phone,
            img_url: decoded.img_url
          });
        } catch (error) {
          console.error('Error decoding token:', error);
        }
      }
    };

    checkAuth();
    // Optional: Add event listener for token changes
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const handleLogout = () => {
    // Clear the auth token cookie
    document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    setUser(null);
    setDropdownOpen(false);
    navigate('/');
  };

  return (
    <nav className="bg-green-300 shadow-lg">
      <div className=" max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side - Logo/Brand */}
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-gray-900">
              UEM Food
            </Link>
          </div>

          {/* Center - Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink to="/" text="Home" />
            {user && <NavLink to="/addfood" text="Add Food" />}
            {user && <NavLink to="/orderhistory" text="Your Orders" />}
            {user && <NavLink to="/allusersorders" text="All Users Orders" />}  
          </div>

          {/* Right side - Auth Section */}
          <div className="flex items-center">
            {user ? (
              <div className="relative ml-3">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <span className="hidden md:inline text-sm font-medium text-gray-700">
                    {user.name}
                  </span>
                  <img
                    className="h-8 w-8 rounded-full object-cover"
                    src={user.img_url || 'https://www.gravatar.com/avatar/default?s=200'}
                    alt="Profile"
                  />
                  <svg
                    className={`h-4 w-4 text-gray-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown menu */}
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                  >
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Your Profile
                    </Link>
                    <div className="block px-4 py-2 text-sm text-gray-500 border-t border-gray-100">
                      {user.phone}
                    </div>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </motion.div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <svg
                className={`h-6 w-6 ${dropdownOpen ? 'hidden' : 'block'}`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                className={`h-6 w-6 ${dropdownOpen ? 'block' : 'hidden'}`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {dropdownOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden"
        >
          <div className="pt-2 pb-3 space-y-1">
            <MobileNavLink to="/" text="Home" onClick={() => setDropdownOpen(false)} />
            {user && (
              <>
                <MobileNavLink to="/addfood" text="Add Food" onClick={() => setDropdownOpen(false)} />
                <MobileNavLink to="/orderhistory" text="Your Orders" onClick={() => setDropdownOpen(false)} />
                <MobileNavLink to="/profile" text="Your Profile" onClick={() => setDropdownOpen(false)} />
              </>
            )}
            {!user && (
              <Link
                to="/login"
                onClick={() => setDropdownOpen(false)}
                className="block w-full pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300"
              >
                Login
              </Link>
            )}
            {user && (
              <button
                onClick={handleLogout}
                className="block w-full text-left pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-red-600 hover:text-red-800 hover:bg-gray-50 hover:border-gray-300"
              >
                Sign out
              </button>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
};

// Reusable NavLink component for desktop
const NavLink = ({ to, text }) => (
  <Link
    to={to}
    className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-blue-500"
  >
    {text}
  </Link>
);

// Reusable NavLink component for mobile
const MobileNavLink = ({ to, text, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="block pl-3 pr-4 py-2 border-l-4 border-blue-500 text-base font-medium text-blue-700 bg-blue-50"
  >
    {text}
  </Link>
);

export default Navbar;