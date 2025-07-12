import React, { useState } from 'react';
import { motion } from 'framer-motion';

const VariableInputModal = ({ variableName, onSave, onClose }) => {
  const [value, setValue] = useState('');

  const handleSave = () => {
    onSave(variableName, value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60]"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-md m-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          Set value for <span className="font-mono bg-slate-100 text-slate-900 rounded px-2 py-1">{variableName}</span>
        </h3>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyPress={handleKeyPress}
          className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-slate-500 focus:outline-none"
          placeholder={`Enter value for ${variableName.slice(1, -1)}...`}
          autoFocus
        />
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="py-2 px-4 rounded-lg bg-slate-200 text-slate-700 font-semibold hover:bg-slate-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="py-2 px-4 rounded-lg bg-slate-800 text-white font-semibold hover:bg-slate-700 transition-colors"
          >
            Save
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default VariableInputModal; 