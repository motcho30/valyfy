import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DesignSelector from './DesignSelector';
import { generateCursorRules } from '../services/cursorRulesService';
import { extractFeatures } from '../services/featureExtractionService';

const CursorRulesGenerator = ({ onClose, project = null }) => {
  // If project is provided, start from step 2 and use project description
  const [currentStep, setCurrentStep] = useState(project ? 2 : 1);
  const [appIdea, setAppIdea] = useState(project ? project.description : '');
  const [extractedFeatures, setExtractedFeatures] = useState([]);
  const [suggestedFeatures, setSuggestedFeatures] = useState([]);
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [generatedRules, setGeneratedRules] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [generationError, setGenerationError] = useState(null);

  // Auto-advance to feature extraction if project is provided
  useEffect(() => {
    if (project && project.description) {
      setAppIdea(project.description);
      setCurrentStep(2);
    }
  }, [project]);

  // GPT-powered feature extraction logic
  const extractFeaturesFromDescription = async (description) => {
    setIsExtracting(true);
    
    try {
      // Use the real GPT-powered feature extraction service
      const result = await extractFeatures(description, true); // useRealAPI = true
      
      setExtractedFeatures(result.extracted_features || []);
      setSuggestedFeatures(result.suggested_features || []);
      setIsExtracting(false);
      setCurrentStep(3);
    } catch (error) {
      console.error('Feature extraction failed:', error);
      
      // Fallback to basic extraction if API fails
      const commonFeatures = [
        'User Authentication',
        'Database Integration', 
        'API Integration',
        'Real-time Features',
        'File Upload',
        'Payment Integration',
        'Search Functionality',
        'Notifications',
        'Analytics Dashboard',
        'Mobile Responsive',
        'Email Integration',
        'Social Media Integration',
        'Multi-language Support',
        'Dark Mode',
        'Admin Panel'
      ];

      const extracted = [];
      const suggested = [];

      // Extract features based on keywords as fallback
      const lowerDesc = description.toLowerCase();
      
      if (lowerDesc.includes('auth') || lowerDesc.includes('login') || lowerDesc.includes('user') || lowerDesc.includes('account')) {
        extracted.push('User Authentication');
      }
      if (lowerDesc.includes('database') || lowerDesc.includes('data') || lowerDesc.includes('store')) {
        extracted.push('Database Integration');
      }
      if (lowerDesc.includes('api') || lowerDesc.includes('backend') || lowerDesc.includes('server')) {
        extracted.push('API Integration');
      }
      if (lowerDesc.includes('real-time') || lowerDesc.includes('live') || lowerDesc.includes('chat') || lowerDesc.includes('realtime')) {
        extracted.push('Real-time Features');
      }
      if (lowerDesc.includes('upload') || lowerDesc.includes('file') || lowerDesc.includes('image')) {
        extracted.push('File Upload');
      }
      if (lowerDesc.includes('payment') || lowerDesc.includes('buy') || lowerDesc.includes('purchase') || lowerDesc.includes('ecommerce') || lowerDesc.includes('e-commerce')) {
        extracted.push('Payment Integration');
      }
      if (lowerDesc.includes('search') || lowerDesc.includes('find')) {
        extracted.push('Search Functionality');
      }
      if (lowerDesc.includes('notification') || lowerDesc.includes('alert') || lowerDesc.includes('notify')) {
        extracted.push('Notifications');
      }
      if (lowerDesc.includes('dashboard') || lowerDesc.includes('analytics') || lowerDesc.includes('chart') || lowerDesc.includes('report')) {
        extracted.push('Analytics Dashboard');
      }
      if (lowerDesc.includes('mobile') || lowerDesc.includes('responsive')) {
        extracted.push('Mobile Responsive');
      }

      // Add suggested features that weren't extracted
      suggested.push(...commonFeatures.filter(feature => !extracted.includes(feature)).slice(0, 6));

      setExtractedFeatures(extracted);
      setSuggestedFeatures(suggested);
      setIsExtracting(false);
      setCurrentStep(3);
    }
  };

  const handleAppIdeaSubmit = () => {
    if (appIdea.trim()) {
      setCurrentStep(2);
    }
  };

  const handleFeatureSelection = (featuresList) => {
    setSelectedFeatures(featuresList);
    setCurrentStep(4); // Move to design selection
  };

  const handleDesignSelection = (design) => {
    setSelectedDesign(design);
    setCurrentStep(5); // Move to final step (cursor.rules generation)
  };

  const handleBack = () => {
    if (currentStep > 1) {
      // If we're in project mode, don't go back to step 1
      if (project && currentStep === 2) {
        onClose && onClose();
        return;
      }
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGenerateRules = async () => {
    setIsGenerating(true);
    setGenerationError(null);
    try {
      const projectName = project ? project.name : 'My App';
      const rules = await generateCursorRules(appIdea, selectedFeatures, selectedDesign, projectName);
      setGeneratedRules(rules);
      setCurrentStep(6);
    } catch (error) {
      setGenerationError(error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  // Auto-start feature extraction when reaching step 2
  useEffect(() => {
    if (currentStep === 2 && appIdea.trim() && extractedFeatures.length === 0 && !isExtracting) {
      extractFeaturesFromDescription(appIdea);
    }
  }, [currentStep, appIdea, extractedFeatures.length, isExtracting]);

  // Adjust progress dots based on project mode
  const totalSteps = project ? 5 : 6; // Skip step 1 if project is provided
  const stepOffset = project ? 1 : 0; // Offset for progress calculation

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
        
        {/* Project context header */}
        {project && (
          <div className="text-center">
            <p className="text-xs font-semibold text-black/40 uppercase tracking-wider">
              Generating for Project
            </p>
            <h3 className="text-sm font-semibold text-black">{project.name}</h3>
          </div>
        )}
        
        {/* Minimal progress dots */}
        <div className="flex space-x-2">
          {Array.from({ length: totalSteps }, (_, i) => i + 1 + stepOffset).map((step) => (
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
        {/* Step 1: App Idea Input (only show if no project) */}
        {currentStep === 1 && !project && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full max-w-2xl"
          >
            <div className="text-center mb-12">
              <h2 className="text-2xl font-light text-black/80 mb-2">
                What are cursor.rules?
              </h2>
              <p className="max-w-xl mx-auto text-sm text-black/50 mb-10">
                .cursorrules is a simple configuration file that tells Cursor AI how to generate and structure your code by defining rules, patterns, and best practices for your project. Think of it as a customizable style guide for the AI, ensuring every snippet it writes matches your team's conventions and design preferences.
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
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full max-w-4xl text-center"
          >
            {project && (
              <div className="mb-8">
                <h1 className="font-jersey text-4xl md:text-5xl text-black leading-tight mb-4">
                  Analyzing {project.name}
                </h1>
                <p className="text-black/60 text-lg mb-4">
                  Extracting features from your project description ✨
                </p>
                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 max-w-2xl mx-auto mb-8">
                  <p className="text-sm text-black/60 italic">
                    "{project.description}"
                  </p>
                </div>
              </div>
            )}
            
            {!project && (
              <div className="mb-8">
                <h1 className="text-4xl font-light text-black mb-4 tracking-tight">
                  Analyzing your app idea
                </h1>
                <p className="text-black/60 text-lg">
                  Extracting key features and functionality ✨
                </p>
              </div>
            )}

            <div className="flex justify-center mb-8">
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="w-20 h-20 border border-black/10 rounded-full"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 w-20 h-20 border-t border-vibe-cyan rounded-full"
                />
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-2 w-16 h-16 bg-white/60 backdrop-blur-xl rounded-full border border-black/5"
                  style={{ 
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)'
                  }}
                />
              </div>
            </div>
            
            <div className="space-y-4 max-w-md mx-auto">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center text-sm text-black/60"
              >
                <div className="w-1.5 h-1.5 bg-vibe-cyan rounded-full mr-3"></div>
                Analyzing app description
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 }}
                className="flex items-center text-sm text-black/60"
              >
                <div className="w-1.5 h-1.5 bg-vibe-cyan rounded-full mr-3"></div>
                Extracting core features
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.5 }}
                className="flex items-center text-sm text-black/60"
              >
                <div className="w-1.5 h-1.5 bg-black rounded-full mr-3"></div>
                Preparing feature selection
              </motion.div>
            </div>
          </motion.div>
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
                Choose what to include in your {project ? project.name : 'app'}
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
            projectName={project?.name}
          />
        )}

        {/* Step 5: Final Result */}
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
                Ready to Generate
              </h1>
              <p className="text-black/60 text-lg mb-8">
                Generate cursor rules for {project ? project.name : 'your project'}
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-black/60">Project:</span>
                  <span className="font-medium text-black">{project?.name || 'Custom App'}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-black/60">Features:</span>
                  <span className="font-medium text-black">{selectedFeatures.length} selected</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-black/60">Design Style:</span>
                  <span className="font-medium text-black">{selectedDesign?.name || 'Not selected'}</span>
                </div>
              </div>

              <div className="flex justify-center space-x-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleBack}
                  className="px-8 py-3 rounded-full border border-black/20 text-black/60 hover:bg-black/5 transition-all"
                >
                  Back
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleGenerateRules}
                  disabled={isGenerating}
                  className="px-8 py-3 rounded-full bg-vibe-cyan text-black font-semibold hover:shadow-lg disabled:opacity-50 transition-all flex items-center space-x-2"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                      <span>Generating...</span>
                    </>
                  ) : (
                    <span>Generate Rules</span>
                  )}
                </motion.button>
              </div>

              {generationError && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
                  <p className="text-sm text-red-600">{generationError}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Step 6: Generated Rules */}
        {currentStep === 6 && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full max-w-4xl"
          >
            <div className="text-center mb-8">
              <h1 className="text-4xl font-light text-black mb-4 tracking-tight">
                Your cursor rules are ready! 🎉
              </h1>
              <p className="text-black/60 text-lg">
                {project ? `Generated for ${project.name}` : 'Custom generated rules'}
              </p>
            </div>

            <div className="bg-white/60 backdrop-blur-xl border border-black/10 rounded-3xl p-8"
              style={{ 
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)'
              }}
            >
              <pre className="bg-black/5 rounded-2xl p-6 text-sm font-mono overflow-auto max-h-96 whitespace-pre-wrap">
                {generatedRules}
              </pre>
              
              <div className="flex justify-center space-x-4 mt-8">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    navigator.clipboard.writeText(generatedRules);
                  }}
                  className="px-8 py-3 rounded-full border border-black/20 text-black/60 hover:bg-black/5 transition-all"
                >
                  Copy to Clipboard
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    const filename = project 
                      ? `${project.name.toLowerCase().replace(/\s+/g, '-')}-cursor-rules.txt`
                      : 'cursor-rules.txt';
                    const blob = new Blob([generatedRules], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = filename;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="px-8 py-3 rounded-full bg-vibe-cyan text-black font-semibold hover:shadow-lg transition-all"
                >
                  Download File
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

// FeatureSelector component inline
const FeatureSelector = ({ extractedFeatures, suggestedFeatures, onSelectionComplete, onBack }) => {
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
    <div className="space-y-8">
      {/* Extracted Features */}
      {extractedFeatures.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-black mb-4">Detected from your description:</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {extractedFeatures.map(feature => (
              <motion.button
                key={feature}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggleFeature(feature)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  selectedFeatures.includes(feature)
                    ? 'bg-vibe-cyan/20 border-vibe-cyan text-black'
                    : 'bg-white border-black/10 hover:border-black/20 text-black/70'
                }`}
              >
                <div className="text-sm font-medium">{feature}</div>
                <div className="text-xs mt-1 opacity-60">Auto-detected</div>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Suggested Features */}
      {suggestedFeatures.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-black mb-4">Additional features you might need:</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {suggestedFeatures.map(feature => (
              <motion.button
                key={feature}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggleFeature(feature)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  selectedFeatures.includes(feature)
                    ? 'bg-black/10 border-black/20 text-black'
                    : 'bg-white border-black/5 hover:border-black/10 text-black/50'
                }`}
              >
                <div className="text-sm font-medium">{feature}</div>
                <div className="text-xs mt-1 opacity-40">Optional</div>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-between pt-8">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onBack}
          className="px-8 py-3 rounded-full border border-black/20 text-black/60 hover:bg-black/5 transition-all"
        >
          Back
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleComplete}
          disabled={selectedFeatures.length === 0}
          className="px-8 py-3 rounded-full bg-vibe-cyan text-black font-semibold hover:shadow-lg disabled:opacity-50 transition-all"
        >
          Continue with {selectedFeatures.length} features
        </motion.button>
      </div>
    </div>
  );
};

export default CursorRulesGenerator; 