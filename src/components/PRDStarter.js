import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, ArrowRight, Loader2, ChevronDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { generatePRD } from '../services/prdGeneratorService';
import { downloadFormats, extractAppName } from '../services/downloadService';
import { projectService } from '../services/projectService';

const PRDStarter = ({ onAuthRequired }) => {
  const [appIdea, setAppIdea] = useState('');
  const [generatedPRD, setGeneratedPRD] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showDownload, setShowDownload] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState('pdf');
  const [showFormatDropdown, setShowFormatDropdown] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowFormatDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const formatOptions = [
    { value: 'pdf', label: 'PDF Document', icon: '📄', description: 'Professional formatted document' },
    { value: 'md', label: 'Markdown File', icon: '📝', description: 'Developer-friendly format' },
    { value: 'txt', label: 'Text File', icon: '📃', description: 'Simple plain text format' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!appIdea.trim()) return;

    setIsGenerating(true);
    try {
      // Generate PRD with basic features and minimalistic design
      const basicFeatures = ['User Interface', 'Core Functionality', 'Data Management'];
      const minimalisticDesign = { name: 'Minimalistic', id: 'minimalistic' };
      
      const prd = await generatePRD(appIdea, basicFeatures, minimalisticDesign);
      setGeneratedPRD(prd);
      setShowDownload(true);
    } catch (error) {
      console.error('PRD generation failed:', error);
      // Show a fallback PRD
      setGeneratedPRD(`# Product Requirements Document\n\n## App Idea\n${appIdea}\n\n## Overview\nThis is a placeholder PRD. The full document would include detailed specifications, user stories, and technical requirements.`);
      setShowDownload(true);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!user) {
      onAuthRequired?.();
      return;
    }

    setIsDownloading(true);
    try {
      const appName = extractAppName(generatedPRD) || extractAppName(appIdea) || 'My App';
      
      // Start both download and save operations in parallel
      const downloadPromise = downloadFormats[selectedFormat] 
        ? downloadFormats[selectedFormat](generatedPRD, appName)
        : Promise.resolve();

      // Save to project in the background (only if authenticated)
      const savePromise = isAuthenticated && user && user.id 
        ? savePRDToProject(appName)
        : Promise.resolve();

      // Wait for both operations to complete
      await Promise.all([downloadPromise, savePromise]);
      
    } catch (error) {
      console.error('Download or save failed:', error);
      // Don't show error for save failures, as download is the primary action
    } finally {
      setIsDownloading(false);
    }
  };

  // Extracted save logic for reuse
  const savePRDToProject = async (appName) => {
    try {
      console.log('💾 Auto-saving PRD to project in background...');
      
      const projectData = {
        user_id: user.id,
        name: appName,
        description: appIdea.length > 200 ? appIdea.substring(0, 200) + '...' : appIdea,
        type: 'Web App',
        project_type: 'Web App',
        features: ['User Interface', 'Core Functionality', 'Data Management'],
        metadata: {
          app_idea: appIdea,
          created_via: 'landing_page_prd',
          is_landing_page_project: true
        }
      };

      const createdProject = await projectService.createProject(user.id, projectData);
      
      if (!createdProject || !createdProject.id) {
        throw new Error('Project creation returned invalid data');
      }

      const fileData = {
        fileName: `${appName.replace(/\s+/g, '-')}-prd.md`,
        fileType: 'PRD Document',
        content: generatedPRD,
        prdSource: 'landing_page',
        metadata: {
          icon: 'FileText',
          generated_date: new Date().toISOString().split('T')[0],
          creation_source: 'landing_page_prd'
        }
      };

      await projectService.saveGeneratedFile(createdProject.id, fileData);
      console.log('✅ PRD auto-saved to project successfully');
      
    } catch (error) {
      console.warn('Auto-save to project failed:', error);
      // Don't throw - we don't want to break the download flow
    }
  };



  const selectedFormatOption = formatOptions.find(option => option.value === selectedFormat);

  return (
    <div className="w-full bg-white rounded-2xl shadow-lg overflow-visible" style={{ minHeight: '600px' }}>
        <div className="p-10 flex flex-col h-full">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-vibe-cyan rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-6 h-6 text-black" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              Start creating a PRD for your app
            </h3>
            <p className="text-gray-600 text-sm">
              Describe your app idea and get a comprehensive Product Requirements Document
            </p>
          </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
          <div className="flex-1 mb-8">
            <textarea
              value={appIdea}
              onChange={(e) => setAppIdea(e.target.value)}
              placeholder="Describe your app idea here..."
              className="w-full h-full p-6 border border-gray-200 rounded-xl focus:ring-2 focus:ring-vibe-cyan focus:border-transparent resize-none text-gray-700 placeholder-gray-400 text-base leading-relaxed"
              disabled={isGenerating}
              style={{ minHeight: '200px' }}
            />
          </div>

          {/* Submit Button */}
          {!showDownload && (
            <motion.button
              type="submit"
              disabled={!appIdea.trim() || isGenerating}
              whileHover={{ scale: appIdea.trim() && !isGenerating ? 1.02 : 1 }}
              whileTap={{ scale: appIdea.trim() && !isGenerating ? 0.98 : 1 }}
              className={`w-full py-4 px-8 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                appIdea.trim() && !isGenerating
                  ? 'bg-vibe-cyan text-black hover:shadow-lg'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating PRD...</span>
                </>
              ) : (
                <>
                  <span>Generate PRD</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          )}

          {/* Download Section */}
          {showDownload && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                <p className="text-green-700 text-sm font-medium">
                  ✨ Your PRD is ready!
                </p>
              </div>

              {/* Format Selector */}
                              <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Choose download format:
                  </label>
                  <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setShowFormatDropdown(!showFormatDropdown)}
                    className="w-full p-3 border border-gray-200 rounded-xl bg-white hover:border-gray-300 transition-colors duration-200 flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{selectedFormatOption?.icon}</span>
                      <div className="text-left">
                        <div className="font-medium text-gray-900">{selectedFormatOption?.label}</div>
                        <div className="text-xs text-gray-500">{selectedFormatOption?.description}</div>
                      </div>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${showFormatDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Options */}
                  {showFormatDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden"
                    >
                      {formatOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => {
                            setSelectedFormat(option.value);
                            setShowFormatDropdown(false);
                          }}
                          className={`w-full p-3 text-left hover:bg-gray-50 transition-colors duration-150 flex items-center space-x-3 ${
                            selectedFormat === option.value ? 'bg-blue-50 border-r-2 border-r-blue-500' : ''
                          }`}
                        >
                          <span className="text-lg">{option.icon}</span>
                          <div>
                            <div className="font-medium text-gray-900">{option.label}</div>
                            <div className="text-xs text-gray-500">{option.description}</div>
                          </div>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </div>
              </div>
              
              {/* Download Button */}
              <motion.button
                type="button"
                onClick={handleDownload}
                disabled={isDownloading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 px-8 rounded-xl font-medium bg-black text-white hover:bg-black/90 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{isAuthenticated && user ? 'Downloading & Saving...' : 'Preparing Download...'}</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>
                      {!user 
                        ? 'Sign up to Download' 
                        : isAuthenticated 
                          ? `Download ${selectedFormatOption?.label} + Save to Project`
                          : `Download as ${selectedFormatOption?.label}`
                      }
                    </span>
                  </>
                )}
              </motion.button>

              <motion.button
                type="button"
                onClick={() => {
                  setAppIdea('');
                  setGeneratedPRD('');
                  setShowDownload(false);
                  setSelectedFormat('pdf');
                }}
                className="w-full py-2 px-6 rounded-xl font-medium text-gray-600 hover:text-gray-800 transition-colors duration-200"
              >
                Create Another PRD
              </motion.button>
            </motion.div>
          )}
        </form>
      </div>
    </div>
  );
};

export default PRDStarter; 