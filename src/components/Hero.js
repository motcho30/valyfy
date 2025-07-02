import React from 'react';
import { motion } from 'framer-motion';
import CursorIcon from './CursorIcon';
import HandDrawnArrow from './HandDrawnArrow';

const Hero = ({ onNavigateToFeature }) => {
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

      {/* Cursor Section */}
      <div className="mt-32 relative">
        <div className="flex flex-col items-center">
          <CursorIcon />
          <h3 className="text-4xl font-bold text-black mt-8 tracking-wide">CURSOR</h3>
        </div>
        
        <div className="mt-16 flex flex-col items-center text-center">
          {/* Generate Features Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 relative max-w-5xl">
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
                <h4 className="font-semibold text-slate-800">Cursor Rules File</h4>
                <div className="mt-3">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">For:</p>
                  <ul className="mt-2 space-y-1">
                    <li className="text-xs text-slate-600">› Better AI context</li>
                    <li className="text-xs text-slate-600">› Consistent coding</li>
                    <li className="text-xs text-slate-600">› Faster edits</li>
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
            
            {/* Feature Card 3 */}
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

            {/* Feature Card 4 */}
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
                    onClick={() => onNavigateToFeature && onNavigateToFeature('cursor-tutorial')}
                    className="text-black/60 hover:text-black text-sm underline transition-colors mr-6"
                  >
                    How to use Cursor
                  </motion.button>

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

      {/* Bottom padding for breathing room */}
      <div className="h-32"></div>
    </div>
  );
};

export default Hero; 