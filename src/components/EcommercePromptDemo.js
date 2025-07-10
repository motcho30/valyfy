import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { generatePromptForFeature } from '../services/promptGeneratorService';
import { Zap, Copy, Check } from 'lucide-react';
import DragAndDropAnimation from './DragAndDropAnimation';

const dummyProjectContext = {
    name: 'E-commerce Site',
    type: 'Web Application',
    description: 'A modern online store for selling goods.',
    framework: 'React',
    designSystem: 'Tailwind CSS',
    features: ['Product Page', 'Shopping Cart', 'Checkout', 'Order History']
};

const EcommercePromptDemo = () => {
  const [availableTags, setAvailableTags] = useState([
    { id: 1, name: 'Product Page' },
    { id: 2, name: 'Shopping Cart' },
    { id: 3, name: 'Checkout' },
    { id: 4, name: 'Order History' },
  ]);

  const [selectedTag, setSelectedTag] = useState(null);
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [draggedTag, setDraggedTag] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const dropZoneRef = useRef(null);

  const handleDragStart = (e, tag) => {
    setDraggedTag(tag);
    e.dataTransfer.setData('text/plain', '');
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    if (!dropZoneRef.current?.contains(e.relatedTarget)) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (draggedTag) {
      generatePrompt(draggedTag);
      setDraggedTag(null);
    }
  };

  const generatePrompt = async (tag) => {
    setIsGenerating(true);
    setGeneratedPrompt('');
    setSelectedTag(tag);
    
    try {
      const prompt = await generatePromptForFeature(tag.name, dummyProjectContext);
      setGeneratedPrompt(prompt);
    } catch (error) {
      console.error("Failed to generate prompt:", error);
      setGeneratedPrompt('Error generating prompt. Check API key or network.');
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleReset = () => {
    setSelectedTag(null);
    setGeneratedPrompt('');
  };

  const handleCtaClick = () => {
    window.dispatchEvent(new CustomEvent('navigate-to-auth'));
  };

  return (
    <div className="relative bg-white p-4 rounded-2xl border border-slate-200/60 w-full max-w-xl mx-auto my-4 shadow-lg flex flex-col">
      <DragAndDropAnimation />
      <div className="flex-grow">
        <div className="text-center mb-4">
            <h2 className="text-lg font-medium text-slate-700">Available E-commerce Features</h2>
            <p className="text-sm text-slate-500">Drag a feature to generate a live prompt</p>
        </div>
        
        <div className="flex flex-wrap gap-2 justify-center mb-5">
          {availableTags.map((tag) => (
            <motion.div
              key={tag.id}
              draggable
              onDragStart={(e) => handleDragStart(e, tag)}
              whileHover={{ scale: 1.05, backgroundColor: '#1e293b', color: '#ffffff' }}
              className="px-3 py-1 text-xs rounded-full cursor-grab bg-white border border-slate-300 text-slate-700 transition-colors"
            >
              {tag.name}
            </motion.div>
          ))}
        </div>

        <motion.div
          ref={dropZoneRef}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-6 transition-all ${
            isDragOver ? 'border-slate-400 scale-[1.01]' : 'border-slate-200'
          }`}
          style={{ minHeight: '220px' }}
        >
          {!selectedTag && !isGenerating ? (
            <div className="text-center flex flex-col justify-center items-center h-full">
              <Zap className="w-8 h-8 text-slate-300 mb-3" />
              <h3 className="text-base font-medium text-slate-600">
                Drop a feature here
              </h3>
              <p className="text-slate-400 text-sm">
                Generate a custom prompt.
              </p>
            </div>
          ) : isGenerating ? (
            <div className="text-center flex flex-col justify-center items-center h-full">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="w-10 h-10 border-2 border-slate-800 border-t-transparent rounded-full mx-auto mb-4"
              />
              <h3 className="text-base font-medium text-slate-700">
                Generating for {selectedTag?.name}
              </h3>
            </div>
          ) : (
            <div className="space-y-3 h-full flex flex-col">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-slate-800">
                  Generated Prompt for {selectedTag?.name}
                </h3>
                <button
                  onClick={() => navigator.clipboard.writeText(generatedPrompt)}
                  className="p-1.5 rounded-md hover:bg-slate-200 transition-colors"
                >
                  <Copy className="w-4 h-4 text-slate-500" />
                </button>
              </div>
              
              <div className="bg-slate-50/70 rounded-md border border-slate-200/80 p-3 text-xs text-slate-600 whitespace-pre-wrap overflow-y-auto flex-grow">
                  {generatedPrompt}
              </div>
              <button onClick={handleReset} className="text-xs text-slate-500 hover:underline w-full text-center mt-1">Reset</button>
            </div>
          )}
        </motion.div>
      </div>
      <div className="mt-4 text-center">
        <motion.button
          onClick={handleCtaClick}
          whileHover={{ scale: 1.02 }}
          className="w-full bg-black hover:bg-slate-800 text-white font-medium py-3 px-4 rounded-lg text-base transition-colors"
        >
          Create Your Project Prompts
        </motion.button>
      </div>
    </div>
  );
};

export default EcommercePromptDemo; 