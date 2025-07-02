import React from 'react';
import { motion } from 'framer-motion';

const LovableIcon = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="flex flex-col items-center"
    >
      <motion.img
        src="/lovablelogo.png"
        alt="Lovable Logo"
        className="w-20 h-20 object-contain"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 0.5, type: "spring" }}
      />
    </motion.div>
  );
};

export default LovableIcon; 