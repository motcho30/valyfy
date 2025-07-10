import React from 'react';
import { motion } from 'framer-motion';
import HandDrawnArrow from './HandDrawnArrow'; // Assuming this is your arrow component

const DragAndDropAnimation = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 1, 1, 0] }}
      transition={{ 
        duration: 5, 
        repeat: Infinity, 
        repeatDelay: 2,
        times: [0, 0.1, 0.8, 0.9, 1] 
      }}
      className="absolute top-0 left-0 w-full h-full pointer-events-none"
    >
      <motion.div
        animate={{
          x: [180, 220, 220, 220], // Corresponds to Shopping Cart tag position
          y: [120, 120, 220, 220], // Moves down to dropzone
        }}
        transition={{
            duration: 5,
            repeat: Infinity,
            repeatDelay: 2,
            ease: "easeInOut",
        }}
        className="absolute"
      >
        <HandDrawnArrow 
          rotation={120} 
          width="40px" 
          height="40px"
          color="#1e293b"
        />
        <motion.div 
            initial={{opacity: 0}}
            animate={{opacity: [0, 0, 1, 1, 0]}}
            transition={{ 
                duration: 5, 
                repeat: Infinity, 
                repeatDelay: 2,
                times: [0, 0.4, 0.5, 0.9, 1] 
            }}
            className="absolute top-6 left-6 px-3 py-1 text-xs rounded-full cursor-grab bg-white border border-slate-300 text-slate-700"
        >
          Shopping Cart
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default DragAndDropAnimation; 