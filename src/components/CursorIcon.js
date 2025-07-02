import React from 'react';
import { motion } from 'framer-motion';

const CursorIcon = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="flex flex-col items-center"
    >
      <motion.img
        src="/cursorlogo.png"
        alt="Cursor AI Logo"
        className="w-20 h-20 object-contain"
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      />
    </motion.div>
  );
};

export default CursorIcon; 