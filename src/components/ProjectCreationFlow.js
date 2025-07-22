import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, ArrowRight, Check } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { usePayment } from '../contexts/PaymentContext';
import ProjectPaymentModal from './ProjectPaymentModal';
import DesignSelector from './DesignSelector';

import { extractFeatures } from '../services/featureExtractionService';
import { generatePRD } from '../services/prdGeneratorService';

const ProjectCreationFlow = ({ onClose, onProjectCreated }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();
  const { hasAccess, isLoading: paymentLoading, isPaymentRequired, initiatePayment } = usePayment();

  // Project creation state
  const [projectName, setProjectName] = useState('');
  const [appIdea, setAppIdea] = useState('');
  const [projectType, setProjectType] = useState('Web App');
  
  // Payment modal state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isRestoringProject, setIsRestoringProject] = useState(false);
  
  // Flow state
  const [currentStep, setCurrentStep] = useState(1); // 1: Create, 2: Features, 3: Design, 4: Generate, 5: Complete
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Feature selection state
  const [extractedFeatures, setExtractedFeatures] = useState([]);
  const [suggestedFeatures, setSuggestedFeatures] = useState([]);
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [isExtracting, setIsExtracting] = useState(false);
  
  // Design state
  const [selectedDesign, setSelectedDesign] = useState(null);
  
  // Generation state
  const [generatedPRD, setGeneratedPRD] = useState('');
  const [generationError, setGenerationError] = useState(null);
  
  // Created project
  const [createdProject, setCreatedProject] = useState(null);


  // Redirect to auth if not authenticated, with redirect parameter
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth?redirect=/create-project');
    }
  }, [isAuthenticated, navigate]);

  // Handle payment success return from Stripe
  useEffect(() => {
    const paymentStatus = searchParams.get('payment');
    const sessionId = searchParams.get('session_id');
    
    if (paymentStatus === 'success' && sessionId) {
      console.log('💳 Payment successful! Session ID:', sessionId);
      setIsRestoringProject(true);
      
      // Try to restore project from localStorage
      const savedProjectData = localStorage.getItem('project_creation_state');
      if (savedProjectData) {
        try {
          const projectData = JSON.parse(savedProjectData);
          console.log('🔄 Restoring project creation state:', projectData);
          setCreatedProject(projectData);
          localStorage.removeItem('project_creation_state'); // Clean up
          
          // Navigate to project dashboard after a brief delay to show success
          setTimeout(() => {
            setIsRestoringProject(false);
            onProjectCreated && onProjectCreated(projectData, false);
          }, 2000);
        } catch (error) {
          console.error('❌ Failed to restore project state:', error);
          setIsRestoringProject(false);
        }
      } else {
        setIsRestoringProject(false);
      }
      
      // Clean up URL
      const url = new URL(window.location);
      url.searchParams.delete('payment');
      url.searchParams.delete('session_id');
      window.history.replaceState({}, document.title, url.toString());
      
    } else if (paymentStatus === 'cancelled') {
      console.log('💳 Payment cancelled by user');
      
      // Try to restore project from localStorage and show paywall again
      const savedProjectData = localStorage.getItem('project_creation_state');
      if (savedProjectData) {
        try {
          const projectData = JSON.parse(savedProjectData);
          console.log('🔄 Restoring project creation state after cancelled payment');
          setCreatedProject(projectData);
          setCurrentStep(5); // Show completion step
          // Don't remove localStorage yet in case they want to retry payment
        } catch (error) {
          console.error('❌ Failed to restore project state:', error);
        }
      }
      
      // Clean up URL
      const url = new URL(window.location);
      url.searchParams.delete('payment');
      window.history.replaceState({}, document.title, url.toString());
    }
  }, [searchParams, onProjectCreated]);

  // Monitor payment status changes to proceed after successful payment
  useEffect(() => {
    if (createdProject && isAuthenticated && !isPaymentRequired && showPaymentModal) {
      console.log('✅ Payment successful, proceeding to project dashboard...');
      setShowPaymentModal(false);
      onProjectCreated && onProjectCreated(createdProject, false); // No guidance needed
    }
  }, [isPaymentRequired, isAuthenticated, createdProject, showPaymentModal, onProjectCreated]);

  // Don't render anything if not authenticated (after all hooks are called)
  if (!isAuthenticated) {
    return null;
  }

  const projectTypes = [
    'Web App',
    'Mobile App'
  ];

  // Step 1: Create Project
  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!projectName.trim() || !appIdea.trim()) return;

    setIsProcessing(true);
    
    // Create project
    const newProject = {
      id: Date.now(),
      name: projectName.trim(),
      description: appIdea.trim(),
      type: projectType,
      createdDate: new Date().toISOString().split('T')[0],
      lastModified: new Date().toISOString().split('T')[0],
      filesCount: 0
    };
    
    setCreatedProject(newProject);
    
    // Auto-advance to feature extraction
    setTimeout(() => {
      setIsProcessing(false);
      setCurrentStep(2);
      extractFeaturesFromDescription(appIdea);
    }, 1500);
  };

  // Step 2: Extract Features
  const extractFeaturesFromDescription = async (description) => {
    setIsExtracting(true);
    
    try {
      const result = await extractFeatures(description, true);
      setExtractedFeatures(result.extracted_features || []);
      setSuggestedFeatures(result.suggested_features || []);
      setIsExtracting(false);
    } catch (error) {
      console.error('Feature extraction failed:', error);
      // Fallback to basic extraction
      setExtractedFeatures(['User Authentication', 'Database Integration', 'API Integration']);
      setSuggestedFeatures(['Mobile Responsive', 'Search Functionality', 'Notifications', 'Analytics Dashboard']);
      setIsExtracting(false);
    }
  };

  // Step 3: Handle Feature Selection
  const handleFeatureSelection = (features) => {
    setSelectedFeatures(features);
    setCurrentStep(3); // Move to design selection
  };

  // Step 4: Handle Design Selection
  const handleDesignSelection = (design) => {
    console.log('🎨 Design selected:', design);
    setSelectedDesign(design);
    setCurrentStep(4); // Move to generation
    generateFiles(design); // Pass design directly to avoid state timing issues
  };

  // Step 5: Generate Both Files
  const generateFiles = async (designOverride = null) => {
    setIsProcessing(true);
    setGenerationError(null);
    
    // Use the passed design or fall back to state
    const designToUse = designOverride || selectedDesign;
    
    try {
      console.log('🚀 Starting file generation...');
      console.log('📋 Parameters for generation:');
      console.log('  - App Idea length:', appIdea?.length);
      console.log('  - Selected Features:', selectedFeatures);
      console.log('  - Design to use:', designToUse);
      console.log('  - Design ID:', designToUse?.id);
      console.log('  - Design Name:', designToUse?.name);
      
      // Generate PRD
      console.log('📝 Calling generatePRD...');
      const prd = await generatePRD(appIdea, selectedFeatures, designToUse, (partial) => {
        // Update progressively so the UI can reflect progress if desired
        setGeneratedPRD(partial);
      });

      console.log('✅ PRD generated successfully');
      console.log('📊 PRD length:', prd?.length);

      setGeneratedPRD(prd);
      
      // Update project with file count, features, design, and generated content
      const updatedProject = {
        ...createdProject,
        features: selectedFeatures,
        selectedFeatures: selectedFeatures,
        selectedDesign: designToUse,
        designId: designToUse?.id,
        filesCount: 1,
        lastModified: new Date().toISOString().split('T')[0],
        generatedFiles: [
          {
            id: 'prd-' + Date.now(),
            name: `${createdProject.name.replace(/\s+/g, '-')}-prd.md`,
            type: 'PRD Document',
            content: prd,
            date: new Date().toISOString().split('T')[0],
            size: `${Math.round(prd.length / 1024)}KB`,
            icon: 'FileText'
          }
        ]
      };
      setCreatedProject(updatedProject);
      
      console.log('Project with generated files:', updatedProject); // Debug log
      
      setCurrentStep(5); // Complete
      setCreatedProject(updatedProject);
      
      // Check if payment is required after project generation
      if (isAuthenticated && isPaymentRequired) {
        console.log('🔒 Payment required, showing paywall...');
        
        // Save project state before showing paywall
        localStorage.setItem('project_creation_state', JSON.stringify(updatedProject));
        console.log('💾 Saved project state for payment flow');
        
        setShowPaymentModal(true);
        return; // Don't show the project yet
      }
      
      // If no payment required, proceed to dashboard
      onProjectCreated && onProjectCreated(updatedProject, false); // No guidance needed
    } catch (error) {
      setGenerationError(error.message);
    } finally {
      setIsProcessing(false);
    }
  };



  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Handle payment modal closure
  const handlePaymentModalClose = () => {
    console.log('💳 Payment modal closed without payment');
    setShowPaymentModal(false);
    // Keep user on the completion step, they can still download files or try payment again
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full px-6 py-6 fixed top-0 left-0 right-0 z-50 backdrop-blur-sm"
      >
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="bg-gray-100/80 backdrop-blur-sm rounded-full px-6 py-3 flex items-center space-x-4 shadow-sm border border-white/20">
            <h1 className="text-xl font-bold text-black">Valyfy</h1>
            <span className="text-black/40">|</span>
            <span className="text-sm text-black/60">
              {currentStep === 1 ? 'Create Project' : 
               currentStep === 2 ? 'Select Features' :
               currentStep === 3 ? 'Choose Design' :
               currentStep === 4 ? 'Generating Files' :
               'Project Ready'}
            </span>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="p-3 hover:bg-black/5 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-black/60" />
          </motion.button>
        </div>
      </motion.header>

      <main className="max-w-6xl mx-auto px-6 pt-32 pb-12 flex flex-col min-h-screen">
        
        {/* Payment Success & Project Restoration */}
        {isRestoringProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-grow flex flex-col items-center justify-center text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8"
            >
              <Check className="w-10 h-10 text-white" />
            </motion.div>

            <h1 className="font-jersey text-4xl md:text-5xl text-black leading-tight mb-4">
              Payment Successful! 🎉
            </h1>
            <p className="text-black/60 text-lg mb-8">
              Restoring your project and setting up your dashboard...
            </p>
            
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              className="w-8 h-8 border-2 border-vibe-cyan border-t-transparent rounded-full"
            />
          </motion.div>
        )}
        {/* Step 1: Create Project */}
        {!isRestoringProject && currentStep === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center py-16"
          >
            <h1 className="font-jersey text-4xl md:text-5xl text-black leading-tight mb-4">
              Create new project
            </h1>
            <p className="text-black/60 text-lg mb-12">
              Start by describing your amazing app idea ✨
            </p>

            {!isProcessing ? (
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                onSubmit={handleCreateProject}
                className="bg-white/60 backdrop-blur-xl border border-black/10 rounded-2xl p-8 shadow-lg max-w-2xl mx-auto"
              >
                <div className="space-y-6">
                  {/* Project Name */}
                  <div className="text-left">
                    <label className="block text-sm font-semibold text-black/60 uppercase tracking-wider mb-3">
                      Project Name
                    </label>
                    <input
                      type="text"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      placeholder="e.g., E-commerce Platform"
                      className="w-full px-4 py-4 border border-black/10 rounded-xl focus:ring-2 focus:ring-vibe-cyan focus:border-transparent text-lg bg-white/50 backdrop-blur-sm placeholder-black/40"
                      required
                    />
                  </div>

                  {/* Project Type */}
                  <div className="text-left">
                    <label className="block text-sm font-semibold text-black/60 uppercase tracking-wider mb-3">
                      Project Type
                    </label>
                    <select
                      value={projectType}
                      onChange={(e) => setProjectType(e.target.value)}
                      className="w-full px-4 py-4 border border-black/10 rounded-xl focus:ring-2 focus:ring-vibe-cyan focus:border-transparent text-lg bg-white/50 backdrop-blur-sm"
                    >
                      {projectTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  {/* App Idea */}
                  <div className="text-left">
                    <label className="block text-sm font-semibold text-black/60 uppercase tracking-wider mb-3">
                      Describe Your App Idea
                    </label>
                    <textarea
                      value={appIdea}
                      onChange={(e) => setAppIdea(e.target.value)}
                      placeholder="Describe your app idea in detail. What does it do? Who is it for? What are the main features? The more detail you provide, the better files we can generate."
                      rows={6}
                      className="w-full px-4 py-4 border border-black/10 rounded-xl focus:ring-2 focus:ring-vibe-cyan focus:border-transparent resize-none bg-white/50 backdrop-blur-sm placeholder-black/40"
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-center space-x-4 pt-6">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={onClose}
                      className="px-8 py-3 border border-black/10 rounded-xl font-medium text-black/70 hover:bg-black/5 transition-colors"
                    >
                      Cancel
                    </motion.button>
                    
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      disabled={!projectName.trim() || !appIdea.trim()}
                      className="px-8 py-3 bg-vibe-cyan text-black rounded-xl font-semibold hover:shadow-lg disabled:opacity-50 transition-all flex items-center space-x-2"
                    >
                      <span>Continue</span>
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.form>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <div className="flex justify-center mb-8">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 border-2 border-vibe-cyan border-t-transparent rounded-full"
                  />
                </div>
                <h2 className="text-2xl font-light text-black mb-4">
                  Creating your project...
                </h2>
                <p className="text-black/60">
                  Setting up workspace and preparing feature extraction ✨
                </p>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Step 2: Feature Extraction */}
        {currentStep === 2 && isExtracting && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full max-w-4xl text-center flex-grow flex flex-col items-center justify-center"
          >
            <div className="mb-8">
              <h1 className="font-jersey text-4xl md:text-5xl text-black leading-tight mb-4">
                Analyzing {createdProject?.name}
              </h1>
              <p className="text-black/60 text-lg mb-4">
                Extracting features from your project description ✨
              </p>
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 max-w-2xl mx-auto mb-8">
                <p className="text-sm text-black/60 italic">
                  "{createdProject?.description}"
                </p>
              </div>
            </div>

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

        {/* Step 2: Feature Selection */}
        {!isRestoringProject && currentStep === 2 && !isExtracting && (
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
                Choose what to include in your {createdProject?.name}
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

        {/* Step 3: Design Selection */}
        {!isRestoringProject && currentStep === 3 && (
          <DesignSelector
            onDesignSelected={handleDesignSelection}
            onBack={handleBack}
            projectName={createdProject?.name}
          />
        )}

        {/* Step 4: Generating Files */}
        {!isRestoringProject && currentStep === 4 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-grow flex flex-col items-center justify-center text-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mb-8"
            />
            <h2 className="text-3xl font-bold text-slate-800 mb-4">
              Generating your vibecoding project...
            </h2>
            <p className="text-slate-500 max-w-md">
              Our AI is crafting your documents and project files.
              This will take about 30 seconds.
            </p>
          </motion.div>
        )}

        {/* Step 5: Complete */}
        {!isRestoringProject && currentStep === 5 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-20 h-20 bg-vibe-cyan rounded-full flex items-center justify-center mx-auto mb-8"
            >
              <Check className="w-10 h-10 text-black" />
            </motion.div>

            <h1 className="font-jersey text-4xl md:text-5xl text-black leading-tight mb-4">
              Project Created! 🎉
            </h1>
            <p className="text-black/60 text-lg mb-8">
              Your {createdProject?.name} is ready with generated PRD
            </p>
            
            {isAuthenticated && isPaymentRequired ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="max-w-4xl mx-auto mb-12"
              >
                {/* Value Preview Section */}
                <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl p-8 mb-8 shadow-lg">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-black mb-2">
                      Your Complete PRD Document is Ready! 📋
                    </h2>
                    <div className="flex justify-center items-center space-x-6 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>{selectedFeatures.length} Features Analyzed</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span>{selectedDesign?.name || 'Custom'} Design Applied</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Blurred Content Preview */}
                  <div className="relative">
                    <div className="bg-white border border-gray-200 rounded-xl p-6 max-h-96 overflow-hidden relative">
                      <div className="prose max-w-none text-left">
                        <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono leading-relaxed">
                          {generatedPRD.substring(0, 1500)}...
                        </pre>
                      </div>
                      
                      {/* Blur overlay */}
                      <div 
                        className="absolute inset-0 backdrop-blur-sm bg-white/30"
                        style={{
                          background: 'linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.3) 30%, rgba(255,255,255,0.8) 70%, rgba(255,255,255,0.95) 100%)'
                        }}
                      />
                      
                      {/* Lock overlay */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 2, type: "spring" }}
                          className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-2xl p-6 shadow-xl max-w-md mx-4"
                        >
                          <div className="text-center">
                            <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                              </svg>
                            </div>
                            <h3 className="text-lg font-bold text-black mb-2">
                              Unlock Your Complete PRD
                            </h3>
                            <p className="text-sm text-gray-600 mb-4">
                              Full document with technical specifications, user stories, API requirements, and implementation roadmap
                            </p>
                            <div className="flex items-center justify-center space-x-2 text-xs text-gray-500 mb-6">
                              <span>• Technical Architecture</span>
                              <span>• User Flow Diagrams</span>
                              <span>• Development Timeline</span>
                            </div>
                            
                            {/* Unlock Button */}
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={async () => {
                                try {
                                  await initiatePayment('project-creation');
                                } catch (error) {
                                  console.error('Payment failed:', error);
                                  setShowPaymentModal(true);
                                }
                              }}
                              className="w-full px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                            >
                              🔓 Unlock for £5
                            </motion.button>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                    
                    {/* Scroll indicator */}
                    <div className="text-center mt-4">
                      <span className="text-xs text-gray-400">
                        {Math.round(generatedPRD.length / 100)} more sections below...
                      </span>
                    </div>
                  </div>
                                </div>
                </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="bg-vibe-cyan/20 border border-vibe-cyan/30 rounded-xl p-4 mb-12 max-w-md mx-auto"
              >
                <p className="text-sm text-black/70">
                  ✨ <strong>Setup guide coming up!</strong> We'll show you how to configure everything in just a moment...
                </p>
              </motion.div>
            )}

            {!isPaymentRequired && (
              <div className="flex justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="px-8 py-3 bg-slate-800 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  Go to Dashboard
                </motion.button>
              </div>
            )}
          </motion.div>
        )}
      </main>



      {/* Project Payment Modal */}
      <ProjectPaymentModal 
        isOpen={showPaymentModal}
        onClose={handlePaymentModalClose}
        project={createdProject}
        onPaymentInitiated={() => {
          setShowPaymentModal(false);
          // Payment service will handle the redirect to Stripe
        }}
      />
    </div>
  );
};

// Feature Selector Component
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

export default ProjectCreationFlow; 