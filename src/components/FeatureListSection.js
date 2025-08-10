import React, { useState } from 'react';
import { motion } from 'framer-motion';
import EcommercePromptDemo from './EcommercePromptDemo';
import ProjectStarterKit from './ProjectStarterKit';
import PRDStarter from './PRDStarter';
import Auth from './Auth';

const FeatureListSection = () => {
  const [showAuth, setShowAuth] = useState(false);

  const features = [
    {
      title: "AI Co-Founder Mode",
      description: "Just tell us what you wanna build and we'll turn your scattered thoughts into a clear plan that AI actually understands. Optimized for cursor, lovable, and whatever comes next.",
      demo: <PRDStarter onAuthRequired={() => setShowAuth(true)} />,
    },
    {
      title: "Copy-Paste Prompts That Actually Work",
      description: "Pixel-perfect UI generation, backend setup, and debugging helpers that catch real issues.",
      demo: <EcommercePromptDemo />,
    },
    {
      title: "Instant Project Foundation",
      description: "Download professionally crafted cursor.config rules, PRDs, and design specs for web and mobile development. Skip the boring setup, and jump straight to building.",
      demo: <ProjectStarterKit />,
    },
  ];

  return (
    <>
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6 space-y-32">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7 }}
              className="flex flex-col space-y-12"
            >
              {/* Text Section - Always on Top */}
              <div className="text-center max-w-4xl mx-auto">
                <h2 className="text-4xl font-bold text-gray-900 mb-5">{feature.title}</h2>
                <p className="text-xl text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
              
              {/* Component Section - Always Below */}
              <div className="w-full max-w-5xl mx-auto">
                {feature.demo}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Auth Modal */}
      {showAuth && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <Auth onClose={() => setShowAuth(false)} />
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default FeatureListSection; 