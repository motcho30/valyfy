import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HandDrawnArrow from './HandDrawnArrow';

const features = [
  {
    category: "Project Conception",
    title: "Generate PRDs Instantly",
    description: "Transform your raw ideas into structured Product Requirement Documents. Our AI outlines features, user stories, and technical specs in seconds.",
    visual: "Visual representation of a PRD"
  },
  {
    category: "Design & Architecture",
    title: "Visualize Your Application",
    description: "From database schemas to UI mockups, generate all the necessary design documents. Give your team a clear blueprint to build from.",
    visual: "Diagram of app architecture"
  },
  {
    category: "Developer Acceleration",
    title: "Scaffold Code & Tests",
    description: "Kickstart development with AI-generated boilerplate code, API endpoints, and test suites based on your PRD and design specs.",
    visual: "Code snippet example"
  }
];

const Hero = ({ onNavigateToFeature }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % features.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + features.length) % features.length);
  };

  return (
    <div>
      {/* Main Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-center py-16"
      >
        <h1 className="font-jersey text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-black leading-tight max-w-4xl mx-auto">
          Your vibe coding<br />productivity app
        </h1>
      </motion.section>

      {/* Features Section */}
      <div className="mt-32 relative">
        <div className="mt-16 flex flex-col items-center text-center">
          {/* Generate Features Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative max-w-5xl">
            {/* Arrow pointing to center */}
            <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 w-28 h-16 text-vibe-cyan/60">
              <HandDrawnArrow direction="down" className="w-full h-full" />
            </div>
            <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 text-vibe-cyan/80 text-sm rotate-6">
              <span style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                get these generated!
              </span>
            </div>
            
            {/* Feature Card 1 */}
            <motion.div
              whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0,0,0,0.08)' }}
              className="w-full h-56 bg-slate-50 border border-slate-200/80 rounded-2xl shadow-md p-6 flex flex-col"
            >
              <div className="text-left flex-1">
                <h4 className="font-semibold text-slate-800">PRD Generator</h4>
                <div className="mt-3">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">For:</p>
                  <ul className="mt-2 space-y-1">
                    <li className="text-xs text-slate-600">› Product requirements</li>
                    <li className="text-xs text-slate-600">› Development roadmap</li>
                    <li className="text-xs text-slate-600">› Stakeholder alignment</li>
                  </ul>
                </div>
              </div>
            </motion.div>
            
            {/* Feature Card 2 */}
            <motion.div
              whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0,0,0,0.08)' }}
              className="w-full h-56 bg-slate-50 border border-slate-200/80 rounded-2xl shadow-md p-6 flex flex-col"
            >
              <div className="text-left flex-1">
                <h4 className="font-semibold text-slate-800">Feature Extractor</h4>
                <div className="mt-3">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">For:</p>
                  <ul className="mt-2 space-y-1">
                    <li className="text-xs text-slate-600">› Extract app features</li>
                    <li className="text-xs text-slate-600">› Analyze codebase</li>
                    <li className="text-xs text-slate-600">› Feature documentation</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Feature Card 3 */}
            <motion.div
              whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0,0,0,0.08)' }}
              className="w-full h-56 bg-slate-50 border border-slate-200/80 rounded-2xl shadow-md p-6 flex flex-col"
            >
              <div className="text-left flex-1">
                <h4 className="font-semibold text-slate-800">Prompt Templates</h4>
                <div className="mt-3">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">For:</p>
                  <ul className="mt-2 space-y-1">
                    <li className="text-xs text-slate-600">› Cursor prompts</li>
                    <li className="text-xs text-slate-600">› Faster development</li>
                    <li className="text-xs text-slate-600">› Custom workflows</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Start Project Section */}
          <div className="mt-20">
            <div className="flex items-center justify-center">
              <div className="text-center">
                <p className="text-lg text-black mb-6" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                  Ready to build something amazing? Let's start! ✨
                </p>
                
                <motion.button
                  whileHover={{ scale: 1.05, rotate: 1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onNavigateToFeature && onNavigateToFeature('create-project')}
                  className="bg-vibe-cyan text-black px-12 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all duration-200 relative"
                >
                  Start with your first project
                  <span className="absolute -top-2 -right-2 text-xl">🚀</span>
                </motion.button>

                <div className="mt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onNavigateToFeature && onNavigateToFeature('dashboard')}
                    className="text-black/60 hover:text-black text-sm underline transition-colors"
                  >
                    Go to Dashboard
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New Section inspired by the image */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="py-20 px-4"
      >
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800">
            AI to empower your process
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Enhance your development workflow with our full range of AI-driven solutions, designed to streamline every aspect of project creation.
          </p>
        </div>

        <div className="mt-16 max-w-5xl mx-auto relative">
          <div className="flex items-center justify-center space-x-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 200 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -200 }}
                transition={{ duration: 0.5 }}
                className="w-full"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[-1, 0, 1].map(offset => {
                    const index = (currentIndex + offset + features.length) % features.length;
                    const feature = features[index];
                    const isCenter = offset === 0;

                    return (
                      <motion.div
                        key={index}
                        animate={{
                          scale: isCenter ? 1 : 0.9,
                          opacity: isCenter ? 1 : 0.5,
                          zIndex: isCenter ? 10 : 1
                        }}
                        transition={{ duration: 0.4 }}
                        className={`bg-white rounded-2xl shadow-lg p-8 border border-gray-100 flex flex-col ${isCenter ? 'shadow-2xl' : ''}`}
                      >
                        <p className="text-sm font-semibold text-vibe-cyan uppercase tracking-wider">{feature.category}</p>
                        <h3 className="text-2xl font-bold text-gray-900 mt-3">{feature.title}</h3>
                        <p className="mt-4 text-gray-600 flex-grow">{feature.description}</p>
                        <div className="mt-6 h-48 bg-slate-100 rounded-lg flex items-center justify-center">
                          <span className="text-slate-400 text-sm">{feature.visual}</span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          
          <button 
            onClick={handlePrev} 
            className="absolute -left-12 top-1/2 -translate-y-1/2 bg-white/50 backdrop-blur-sm rounded-full p-2 text-gray-600 hover:bg-white transition-all shadow-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button 
            onClick={handleNext} 
            className="absolute -right-12 top-1/2 -translate-y-1/2 bg-white/50 backdrop-blur-sm rounded-full p-2 text-gray-600 hover:bg-white transition-all shadow-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </motion.section>

      {/* Bottom padding for breathing room */}
      <div className="h-32"></div>
    </div>
  );
};

export default Hero; 