import React, { useState } from 'react';
import { motion } from 'framer-motion';
import FeatureExtractor from './FeatureExtractor';
import DesignSelector from './DesignSelector';
import { generatePRD } from '../services/prdGeneratorService';

const PRDGenerator = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [appIdea, setAppIdea] = useState('');
  const [extractedFeatures, setExtractedFeatures] = useState([]);
  const [suggestedFeatures, setSuggestedFeatures] = useState([]);
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [generatedPRD, setGeneratedPRD] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState(null);

  const handleAppIdeaSubmit = () => {
    if (appIdea.trim()) {
      setCurrentStep(2);
    }
  };

  const handleFeaturesExtracted = (extracted, suggested) => {
    setExtractedFeatures(extracted);
    setSuggestedFeatures(suggested);
    setCurrentStep(3);
  };

  const handleFeatureSelection = (featuresList) => {
    setSelectedFeatures(featuresList);
    setCurrentStep(4);
  };

  const handleDesignSelection = (design) => {
    setSelectedDesign(design);
    setCurrentStep(5);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGeneratePRD = async () => {
    setIsGenerating(true);
    setGenerationError(null);
    try {
      const prd = await generatePRD(appIdea, selectedFeatures, selectedDesign);
      setGeneratedPRD(prd);
      setCurrentStep(6);
    } catch (error) {
      setGenerationError(error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-8">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-black/5 backdrop-blur-sm border border-black/10 flex items-center justify-center hover:bg-black/10 transition-all"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </motion.button>
        
        {/* Progress dots */}
        <div className="flex space-x-2">
          {[1, 2, 3, 4, 5, 6].map((step) => (
            <div
              key={step}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${
                currentStep >= step ? 'bg-black' : 'bg-black/20'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-8">
        {/* Step 1: App Idea Input */}
        {currentStep === 1 && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full max-w-2xl"
          >
            <div className="text-center mb-12">
              <h2 className="text-2xl font-light text-black/80 mb-2">
                What is a PRD?
              </h2>
              <p className="max-w-xl mx-auto text-sm text-black/50 mb-10">
                A Product Requirements Document (PRD) is a comprehensive guide that outlines what your product should do, how it should work, and why it matters. It serves as the blueprint for development teams, stakeholders, and designers to build your vision into reality.
              </p>
              <h1 className="text-5xl font-light text-black mb-4 tracking-tight">
                What do you want to build?
              </h1>
            </div>
            
            <div className="relative">
              <textarea
                value={appIdea}
                onChange={(e) => setAppIdea(e.target.value)}
                placeholder="Describe your app idea..."
                className="w-full h-40 bg-white/80 backdrop-blur-xl border border-black/10 rounded-3xl p-8 text-lg text-black placeholder-black/40 resize-none focus:outline-none focus:border-vibe-cyan focus:bg-white/90 transition-all duration-300 shadow-lg shadow-black/5"
                style={{ 
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)'
                }}
              />
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAppIdeaSubmit}
                disabled={!appIdea.trim()}
                className={`absolute bottom-8 right-8 px-8 py-3 rounded-full font-medium transition-all duration-300 ${
                  appIdea.trim()
                    ? 'bg-black text-white hover:bg-black/90 shadow-lg shadow-black/20'
                    : 'bg-black/10 text-black/30 cursor-not-allowed'
                }`}
              >
                Continue
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Feature Extraction */}
        {currentStep === 2 && (
          <FeatureExtractor 
            appIdea={appIdea}
            onFeaturesExtracted={handleFeaturesExtracted}
            onBack={handleBack}
          />
        )}

        {/* Step 3: Feature Selection */}
        {currentStep === 3 && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full max-w-6xl h-full flex flex-col"
          >
            <div className="text-center mb-8">
              <h1 className="text-4xl font-light text-black mb-2 tracking-tight">
                Select features
              </h1>
              <p className="text-black/60 text-lg">
                Choose what to include in your PRD
              </p>
            </div>

            <div className="flex-1 min-h-0">
              <FeatureSelector
                extractedFeatures={extractedFeatures}
                suggestedFeatures={suggestedFeatures}
                onSelectionComplete={handleFeatureSelection}
                onBack={handleBack}
              />
            </div>
          </motion.div>
        )}

        {/* Step 4: Design Selection */}
        {currentStep === 4 && (
          <DesignSelector
            onDesignSelected={handleDesignSelection}
            onBack={handleBack}
          />
        )}

        {/* Step 5: Generation Step */}
        {currentStep === 5 && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full max-w-4xl text-center"
          >
            <div className="bg-white/60 backdrop-blur-xl border border-black/10 rounded-3xl p-8"
              style={{ 
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)'
              }}
            >
              <h1 className="text-4xl font-light text-black mb-6 tracking-tight">
                Ready to Generate PRD
              </h1>
              <p className="text-black/60 text-lg mb-8">
                Generate your comprehensive Product Requirements Document
              </p>
              
              <div className="space-y-6">
                <div className="text-left bg-white/40 rounded-2xl p-6">
                  <h3 className="font-medium text-black mb-4">Project Summary</h3>
                  <div className="space-y-2 text-sm text-black/70">
                    <p><strong>App Idea:</strong> {appIdea.substring(0, 100)}...</p>
                    <p><strong>Features:</strong> {selectedFeatures.length} selected</p>
                    <p><strong>Design Style:</strong> {selectedDesign?.name}</p>
                  </div>
                </div>
                
                {generationError && (
                  <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
                    <p className="text-red-600 text-sm">Error: {generationError}</p>
                  </div>
                )}
                
                <motion.button
                  whileHover={{ scale: isGenerating ? 1 : 1.02 }}
                  whileTap={{ scale: isGenerating ? 1 : 0.98 }}
                  onClick={handleGeneratePRD}
                  disabled={isGenerating}
                  className={`px-12 py-4 rounded-full font-light text-lg transition-all duration-300 ${
                    isGenerating
                      ? 'bg-black/50 text-white/70 cursor-not-allowed'
                      : 'bg-black text-white hover:bg-black/90 shadow-xl shadow-black/20'
                  }`}
                >
                  {isGenerating ? (
                    <div className="flex items-center">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                      Generating PRD...
                    </div>
                  ) : (
                    'Generate PRD'
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 6: Generated PRD */}
        {currentStep === 6 && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full max-w-6xl"
          >
            <div className="bg-white/60 backdrop-blur-xl border border-black/10 rounded-3xl p-8"
              style={{ 
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)'
              }}
            >
              <div className="text-center mb-8">
                <h1 className="text-4xl font-light text-black mb-4 tracking-tight">
                  PRD Generated 📋
                </h1>
                <p className="text-black/60 text-lg">
                  Your comprehensive Product Requirements Document is ready
                </p>
              </div>
              
              <div className="space-y-6">
                <div className="bg-black/5 rounded-2xl p-6 max-h-96 overflow-y-auto">
                  <pre className="text-sm text-black/80 whitespace-pre-wrap font-mono">
                    {generatedPRD}
                  </pre>
                </div>
                
                <div className="flex justify-center space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      const blob = new Blob([generatedPRD], { type: 'text/plain' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'product-requirements-document.md';
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      URL.revokeObjectURL(url);
                    }}
                    className="px-8 py-3 rounded-full font-light bg-black text-white hover:bg-black/90 shadow-lg shadow-black/20 transition-all duration-300"
                  >
                    Download PRD
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      navigator.clipboard.writeText(generatedPRD);
                    }}
                    className="px-8 py-3 rounded-full font-light bg-white/80 text-black border border-black/20 hover:bg-white transition-all duration-300"
                  >
                    Copy to Clipboard
                  </motion.button>
                </div>
                
                <div className="text-center">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setCurrentStep(1)}
                    className="text-black/60 hover:text-black transition-colors"
                  >
                    Generate Another PRD
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

// Feature Selector Component
const FeatureSelector = ({ extractedFeatures, suggestedFeatures, onSelectionComplete, onBack }) => {
  const allFeatures = [
    ...extractedFeatures.map(feature => ({ name: feature, isFromDescription: true })),
    ...suggestedFeatures.map(feature => ({ name: feature, isFromDescription: false }))
  ];
  
  const [selectedFeatures, setSelectedFeatures] = useState([...extractedFeatures]);

  const toggleFeature = (featureName) => {
    setSelectedFeatures(prev => 
      prev.includes(featureName) 
        ? prev.filter(f => f !== featureName)
        : [...prev, featureName]
    );
  };

  const handleComplete = () => {
    onSelectionComplete(selectedFeatures);
  };

  return (
    <div className="h-full flex flex-col">
      <motion.button
        whileHover={{ x: -4 }}
        onClick={onBack}
        className="flex items-center text-black/60 hover:text-black transition-colors mb-8"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </motion.button>

      <div className="flex-1 overflow-y-auto pr-2">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pb-4">
          {allFeatures.map((feature, index) => (
            <motion.label
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.02 }}
              className={`group flex items-center p-4 backdrop-blur-xl border rounded-2xl cursor-pointer transition-all duration-300 ${
                selectedFeatures.includes(feature.name)
                  ? feature.isFromDescription
                    ? 'bg-vibe-cyan/20 border-vibe-cyan/30 hover:bg-vibe-cyan/30'
                    : 'bg-black/10 border-black/20 hover:bg-black/15'
                  : 'bg-white/40 border-black/5 hover:bg-white/60 hover:border-black/10'
              }`}
              style={{ 
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)'
              }}
            >
              <div className="relative">
                <input
                  type="checkbox"
                  checked={selectedFeatures.includes(feature.name)}
                  onChange={() => toggleFeature(feature.name)}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded-full border-2 transition-all duration-300 ${
                  selectedFeatures.includes(feature.name)
                    ? feature.isFromDescription
                      ? 'bg-vibe-cyan border-vibe-cyan'
                      : 'bg-black border-black'
                    : 'border-black/20 group-hover:border-black/40'
                }`} />
              </div>
              <span className={`ml-3 font-light ${
                feature.isFromDescription ? 'text-black' : 'text-black/80'
              }`}>
                {feature.name}
              </span>
            </motion.label>
          ))}
        </div>
      </div>

      <div className="pt-6 border-t border-black/5">
        <div className="flex justify-center">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleComplete}
            disabled={selectedFeatures.length === 0}
            className={`px-12 py-4 rounded-full font-light text-lg transition-all duration-300 ${
              selectedFeatures.length > 0
                ? 'bg-black text-white hover:bg-black/90 shadow-xl shadow-black/20'
                : 'bg-black/10 text-black/30 cursor-not-allowed'
            }`}
          >
            Continue ({selectedFeatures.length})
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default PRDGenerator; 