import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, X } from 'lucide-react';
import VariableInputModal from './VariableInputModal';

const PromptModal = ({ template, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [promptText, setPromptText] = useState('');
  const [editingVariable, setEditingVariable] = useState(null);

  useEffect(() => {
    if (template) {
      setPromptText(template.prompt);
    }
  }, [template]);

  if (!template) {
    return null;
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(promptText);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  
  const handleVariableClick = (variable) => {
    setEditingVariable(variable);
  };

  const handleVariableSave = (variableName, newValue) => {
    const newPromptText = promptText.replace(variableName, newValue);
    setPromptText(newPromptText);
    setEditingVariable(null);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="bg-white rounded-2xl shadow-xl w-full max-w-2xl m-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-slate-800">{template.title}</h2>
              <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={24} />
              </button>
            </div>
            <div className="bg-slate-50/70 rounded-lg p-4 max-h-[60vh] overflow-y-auto border border-slate-200/80">
              <p className="text-slate-600 whitespace-pre-wrap font-mono text-sm leading-relaxed">
                {promptText.split(/({[^{}]+})/g).map((part, i) =>
                  part.startsWith('{') && part.endsWith('}') ? (
                    <span
                      key={i}
                      className="bg-emerald-100 text-emerald-900 font-medium rounded-md px-1.5 py-1 inline-block cursor-pointer hover:bg-emerald-200 transition-colors ring-1 ring-emerald-300 shadow-sm"
                      onClick={() => handleVariableClick(part)}
                    >
                      {part}
                    </span>
                  ) : (
                    part
                  )
                )}
              </p>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleCopy}
                className="flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-slate-800 text-white font-semibold hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
              >
                {copied ? <Check size={20} /> : <Copy size={20} />}
                {copied ? 'Copied!' : 'Copy Prompt'}
              </button>
            </div>
          </div>
        </motion.div>
        {editingVariable && (
          <VariableInputModal
            variableName={editingVariable}
            onSave={handleVariableSave}
            onClose={() => setEditingVariable(null)}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default PromptModal; 