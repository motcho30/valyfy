import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { generatePRD } from '../services/prdGeneratorService';

const PRDStarter = ({ onAuthRequired }) => {
  const [appIdea, setAppIdea] = useState('');
  const [generatedPRD, setGeneratedPRD] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showDownload, setShowDownload] = useState(false);
  const { user } = useAuth();

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

  const handleDownload = () => {
    if (!user) {
      onAuthRequired?.();
      return;
    }

    const blob = new Blob([generatedPRD], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'product-requirements-document.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full h-full bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="p-8 flex flex-col h-full">
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
          <div className="flex-1 mb-6">
            <textarea
              value={appIdea}
              onChange={(e) => setAppIdea(e.target.value)}
              placeholder="Describe your app idea here... What problem does it solve? Who is it for? What are the key features?"
              className="w-full h-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-vibe-cyan focus:border-transparent resize-none text-gray-700 placeholder-gray-400 text-sm"
              disabled={isGenerating}
            />
          </div>

          {/* Submit Button */}
          {!showDownload && (
            <motion.button
              type="submit"
              disabled={!appIdea.trim() || isGenerating}
              whileHover={{ scale: appIdea.trim() && !isGenerating ? 1.02 : 1 }}
              whileTap={{ scale: appIdea.trim() && !isGenerating ? 0.98 : 1 }}
              className={`w-full py-3 px-6 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
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

          {/* Download Button */}
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
              
              <motion.button
                type="button"
                onClick={handleDownload}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 px-6 rounded-xl font-medium bg-black text-white hover:bg-black/90 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>{user ? 'Download PRD' : 'Sign up to Download'}</span>
              </motion.button>

              <motion.button
                type="button"
                onClick={() => {
                  setAppIdea('');
                  setGeneratedPRD('');
                  setShowDownload(false);
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