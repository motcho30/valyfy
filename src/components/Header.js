import React, { useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

const Header = ({ onNavigateToDashboard }) => {
  const { scrollY: motionScrollY } = useScroll();
  
  // Transform scroll position to opacity (fade out when scrolling down)
  const opacity = useTransform(motionScrollY, [0, 200], [1, 0.3]);
  const y = useTransform(motionScrollY, [0, 200], [0, -10]);

  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={{ opacity, y }}
      className="w-full px-6 py-6 fixed top-0 left-0 right-0 z-50 backdrop-blur-sm"
    >
      <div className="flex items-center justify-center">
        <div className="bg-gray-100/80 backdrop-blur-sm rounded-full px-6 py-3 flex items-center space-x-8 shadow-sm border border-white/20">
          <h1 className="text-xl font-bold text-black">Valyfy</h1>
          <nav className="flex space-x-6">
            <div className="relative">
              <button 
                className="text-gray-700 hover:text-black transition-colors duration-200"
              >
                Features
              </button>

            </div>
            <a href="#about" className="text-gray-700 hover:text-black transition-colors duration-200">
              About valyfy
            </a>
            <button 
              onClick={() => onNavigateToDashboard && onNavigateToDashboard()}
              className="text-gray-700 hover:text-black transition-colors duration-200"
            >
              Dashboard
            </button>
          </nav>
        </div>
      </div>
    </motion.header>
  );
};

export default Header; 