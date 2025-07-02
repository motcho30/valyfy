import React, { useState } from 'react';
import { motion } from 'framer-motion';

const TutorialSection = ({ content, onDownload }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cursor-tutorial.md';
    a.click();
    URL.revokeObjectURL(url);
    if (onDownload) onDownload();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-slate-50 border border-slate-200/80 rounded-2xl shadow-md p-6"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold text-slate-800">Cursor Tutorial</h3>
          <p className="text-sm text-slate-600 mt-1">
            Personalized guide on using Cursor effectively with your project
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-4 py-2 text-sm text-slate-700 hover:text-slate-900 border border-slate-300 rounded-lg hover:bg-white transition-all duration-200"
          >
            {isExpanded ? 'Collapse' : 'Expand'}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDownload}
            className="px-4 py-2 text-sm bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-all duration-200 flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Download</span>
          </motion.button>
        </div>
      </div>

      <motion.div
        initial={false}
        animate={{
          height: isExpanded ? 'auto' : '80px',
          opacity: isExpanded ? 1 : 0.7
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="bg-white rounded-lg border border-slate-200 p-4 font-mono text-sm text-slate-700 leading-relaxed">
          {isExpanded ? (
            <pre className="whitespace-pre-wrap">{content}</pre>
          ) : (
            <div className="relative">
              <pre className="whitespace-pre-wrap line-clamp-3">{content.substring(0, 200)}...</pre>
              <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent"></div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TutorialSection; 