import React from 'react';
import { motion } from 'framer-motion';

const HandDrawnArrow = ({ className = "", direction = "down-right" }) => {
  const drawVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { 
      pathLength: 1, 
      opacity: 1,
      transition: { 
        pathLength: { duration: 1.2, ease: "easeInOut" },
        opacity: { duration: 0.5 }
      }
    }
  };

  // Different arrow directions
  const arrows = {
    "down-right": {
      viewBox: "0 0 120 100",
      path: "M20,20 Q40,15 60,25 Q80,35 95,55 Q100,65 95,75 M95,75 L85,70 M95,75 L90,85"
    },
    "down-left": {
      viewBox: "0 0 120 100", 
      path: "M110,20 C100,25 70,80 45,85 M45,85 L55,76 M45,85 L57,89"
    },
    "up-right": {
      viewBox: "0 0 120 100",
      path: "M20,80 Q40,85 60,75 Q80,65 95,45 Q100,35 95,25 M95,25 L85,30 M95,25 L90,15"
    }
  };

  const currentArrow = arrows[direction] || arrows["down-right"];

  return (
    <motion.svg
      className={className}
      viewBox={currentArrow.viewBox}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial="hidden"
      animate="visible"
    >
      <motion.path
        d={currentArrow.path}
        variants={drawVariants}
        style={{
          filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))'
        }}
      />
    </motion.svg>
  );
};

export default HandDrawnArrow; 