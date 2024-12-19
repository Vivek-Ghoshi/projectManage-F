import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

const Nav = () => {
  const api = import.meta.env.VITE_API_URL;
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [ids,setIds] = useState('');
  
  useEffect(()=>{
    const allProjects = async () => {
      try {
        const {data} = await axios.get(`${api}/api/projects/all`);
        setIds(data)
      } catch (error) {
        console.log(error.message);
      }
    };
    allProjects();
  },[]);

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    // {
    //    path: `/projects`,
    //    label: `Project`,
    //    icon: '📁',
    //  },
    { path: '/progress', label: 'Progress', icon: '📈' },
  ];
  const logoutHandler = async () =>{
   try{
         const {data} = axios.get(`${api}/api/auth/logout`);
        setIsOpen(true)
         localStorage.clear();
         console.log('user logged out')
         navigate('/')
   }
   catch(error){
    console.log(error.message)
   }
  };

  return (
    <nav className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-shrink-0 flex items-center"
          >
            <Link to="/" className="text-2xl font-bold">
              Project Man. System
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="relative group px-3 py-2"
              >
                <span className="flex items-center space-x-2">
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </span>
                {location.pathname === item.path && (
                  <motion.div
                    layoutId="underline"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-white rounded-full"
                    initial={false}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            ))}
            
            {/* Logout Button */}
            <motion.button
              onClick={logoutHandler}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 rounded-lg bg-white text-purple-600 font-medium hover:bg-opacity-90 transition-colors"
            >
              Logout
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md hover:bg-purple-500 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <motion.div
          initial={false}
          animate={{ height: isOpen ? 'auto' : 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden overflow-hidden"
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === item.path
                    ? 'bg-purple-500'
                    : 'hover:bg-purple-500'
                }`}
                onClick={() => setIsOpen(false)}
              >
                <span className="flex items-center space-x-2">
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </span>
              </Link>
            ))}
           
            <button
             onClick={logoutHandler}
              className="w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-purple-500"
            >
                
               Logout 
            </button>
          </div>
        </motion.div>
      </div>
    </nav>
  );
};

export default Nav;