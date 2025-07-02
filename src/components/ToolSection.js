import React from 'react';
import { motion } from 'framer-motion';
import HandDrawnArrow from './HandDrawnArrow';

const ToolSection = ({ 
  icon, 
  title, 
  titleStyle = "text-6xl font-bold text-black", 
  buttonText, 
  buttonStyle = "bg-vibe-cyan text-black", 
  focusColor = "vibe-cyan",
  className = "" 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className={`mt-32 relative ${className}`}
    >
      <div className="flex flex-col items-center">
        {icon}
        <h2 className={`mt-8 tracking-tight ${titleStyle}`}>{title}</h2>
      </div>
      
      <div className="mt-16 flex justify-between items-start max-w-4xl mx-auto">
        {/* Left side - Beginner section */}
        <div className="flex flex-col items-start">
          <p className="text-lg text-black mb-8">Beginner? Get started</p>
          
          {/* Hand-drawn arrow pointing to button */}
          <div className="relative mb-4">
            <HandDrawnArrow direction="down-left" className="absolute -top-16 left-8" />
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200 ${buttonStyle}`}
          >
            {buttonText}
          </motion.button>
        </div>
        
        {/* Right side - PRD section */}
        <div className="flex flex-col items-end max-w-md">
          <p className="text-lg text-black mb-6 text-right">
            Generate a cursor rules file and a cursor personalized PRD for your app
          </p>
          <input
            type="text"
            placeholder="Explain what you want to build"
            className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-${focusColor} focus:border-transparent`}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default ToolSection; 