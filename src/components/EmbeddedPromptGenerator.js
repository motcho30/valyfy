import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { generatePromptForFeature } from '../services/promptGeneratorService';
import { Zap, Copy, Check } from 'lucide-react';

const EmbeddedPromptGenerator = ({ project }) => {
  const availableFeatures = project.features || project.selectedFeatures || [];
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const dropZoneRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const generatePrompt = async (featureName) => {
    setIsGenerating(true);
    setGeneratedPrompt('');
    setSelectedFeature({ name: featureName });

    try {
      const prompt = await generatePromptForFeature(featureName, project);
      setGeneratedPrompt(prompt);
    } catch (error) {
      console.error("Failed to generate prompt:", error);
      setGeneratedPrompt('Error generating prompt. Check API key or network.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    if (generatedPrompt) {
      navigator.clipboard.writeText(generatedPrompt);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };
  
  const handleDragStart = (e, featureName) => {
    e.dataTransfer.setData("text/plain", featureName);
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const featureName = e.dataTransfer.getData("text/plain");
    if (featureName) {
      generatePrompt(featureName);
    }
  };

  const handleDragOver = (e) => { e.preventDefault(); setIsDragOver(true); };
  const handleDragLeave = (e) => { setIsDragOver(false); };

  return (
    <div className="flex space-x-4 h-full">
      {/* Feature List */}
      <div className="w-1/3 border-r border-slate-200 pr-4 overflow-y-auto">
        <h4 className="text-sm font-semibold text-slate-600 mb-3">Project Features</h4>
        <div className="space-y-2">
          {availableFeatures.map((feature, index) => (
            <motion.div
              key={index}
              draggable
              onDragStart={(e) => handleDragStart(e, feature)}
              onClick={() => generatePrompt(feature)}
              whileHover={{ backgroundColor: '#f1f5f9' }}
              className="p-2 rounded-md text-sm text-slate-700 cursor-pointer"
            >
              {feature}
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Drop Zone & Prompt Display */}
      <div 
        ref={dropZoneRef}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`w-2/3 flex flex-col transition-colors rounded-lg ${isDragOver ? 'bg-blue-50' : 'bg-slate-50'}`}
      >
        {!selectedFeature ? (
          <div className="flex-grow flex flex-col items-center justify-center text-center p-4">
            <Zap className="w-8 h-8 text-slate-400 mb-3" />
            <h4 className="font-semibold text-slate-700">Generate a Prompt</h4>
            <p className="text-xs text-slate-500">Click or drag a feature to start.</p>
          </div>
        ) : isGenerating ? (
          <div className="flex-grow flex flex-col items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"
            />
             <p className="text-sm text-slate-600 mt-4">Generating for {selectedFeature.name}...</p>
          </div>
        ) : (
          <div className="flex-grow flex flex-col p-4 space-y-3">
            <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-slate-800">Prompt for: {selectedFeature.name}</h4>
                <button
                    onClick={copyToClipboard}
                    className="p-2 rounded-md hover:bg-slate-200 transition-colors"
                >
                    {isCopied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-slate-500" />}
                </button>
            </div>
            <div className="bg-white p-3 rounded-md border border-slate-200 text-xs text-slate-700 whitespace-pre-wrap overflow-y-auto flex-grow">
              {generatedPrompt}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmbeddedPromptGenerator; 