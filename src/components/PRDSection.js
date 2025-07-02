import React from 'react';
import { motion } from 'framer-motion';
import CleanPRD from './CleanPRD';

const PRDSection = ({ content, project, onDownload, onUpdate }) => {
  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'PRD.md';
    a.click();
    URL.revokeObjectURL(url);
    if (onDownload) onDownload();
  };

  // If no content is generated yet, show a loading or empty state
  if (!content) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-50 border border-slate-200/80 rounded-2xl shadow-md p-12 text-center"
      >
        <div className="text-slate-400 mb-4">
          <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-slate-600 mb-2">PRD Not Generated Yet</h3>
        <p className="text-slate-500">
          Generate your Product Requirements Document to see the visual breakdown here.
        </p>
      </motion.div>
    );
  }

  return (
    <CleanPRD 
      project={project} 
      prdContent={content} 
      onDownload={handleDownload}
      onUpdate={onUpdate}
    />
  );
};

export default PRDSection; 