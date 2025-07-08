import React from 'react';
import { motion } from 'framer-motion';
import StickyScrollFeatures from './StickyScrollFeatures';
import AIToolsSection from './AIToolsSection';
import FAQ from './FAQ';

const Hero = ({ onNavigateToFeature }) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Main Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative text-center py-20 px-4 overflow-hidden"
      >
        <div className="absolute inset-0 -z-0">
            <motion.div 
                className="absolute top-[-10rem] left-[-10rem] w-[30rem] h-[30rem] bg-vibe-cyan/20 rounded-full blur-3xl"
                animate={{ scale: [1, 1.1, 1], rotate: [0, 10, 0] }}
                transition={{ duration: 20, repeat: Infinity, repeatType: "mirror" }}
            />
            <motion.div 
                className="absolute bottom-[-10rem] right-[-10rem] w-[30rem] h-[30rem] bg-blue-200/20 rounded-full blur-3xl"
                animate={{ scale: [1, 1.05, 1], rotate: [0, -10, 0] }}
                transition={{ duration: 25, repeat: Infinity, repeatType: "mirror", delay: 5 }}
            />
        </div>
        
        <div className="relative z-10">
          <h1 className="font-bold text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-black leading-tight max-w-5xl mx-auto mb-6 tracking-tight">
            Your all in one<br />vibe coding toolkit
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Everything you need to launch your next app—organised, streamlined, and ready to go.
          </p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-12"
          >
            <motion.button
              whileHover={{ scale: 1.05, rotate: 1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigateToFeature && onNavigateToFeature('create-project')}
              className="bg-vibe-cyan text-black px-12 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all duration-200 relative mr-4"
            >
              Start building now
              <span className="absolute -top-2 -right-2 text-xl">✨</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="text-black/60 hover:text-black text-lg underline transition-colors"
            >
              Watch demo first
            </motion.button>
          </motion.div>
        </div>
      </motion.section>

      {/* Sticky Scroll Features Section */}
      <StickyScrollFeatures />
      
      {/* AI Tools Section */}
      <AIToolsSection />
      
      {/* FAQ Section */}
      <FAQ />

      {/* Final CTA Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-20 px-4 bg-gradient-to-br from-vibe-cyan/5 to-blue-50"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Ready to build something amazing?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join developers who've shipped faster with our vibe coding toolkit. 
            No credit card required, no setup hassle.
          </p>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block"
          >
            <button
              onClick={() => onNavigateToFeature && onNavigateToFeature('create-project')}
              className="bg-black text-white px-12 py-4 rounded-xl font-semibold text-lg hover:bg-gray-800 transition-all duration-200 relative"
            >
              Start your first project
              <span className="absolute -top-2 -right-2 text-xl">🚀</span>
            </button>
          </motion.div>
          
          <div className="mt-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onNavigateToFeature && onNavigateToFeature('dashboard')}
              className="text-gray-600 hover:text-gray-900 text-lg underline transition-colors"
            >
              Or explore the dashboard
            </motion.button>
          </div>
        </div>
      </motion.section>

      {/* Bottom padding */}
      <div className="h-20"></div>
    </div>
  );
};

export default Hero;