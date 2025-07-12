import React from 'react';
import { motion } from 'framer-motion';
import EcommercePromptDemo from './EcommercePromptDemo';
import ProjectStarterKit from './ProjectStarterKit';

const features = [
  {
    title: "Copy-Paste Prompts That Actually Work",
    description: "Pixel-perfect UI generation, backend setup, and debugging helpers that catch real issues.",
    demo: <EcommercePromptDemo />,
  },
  {
    title: "Instant Project Foundation",
    description: "Generate custom cursor.config rules, PRDs, and design specs tailored to your exact stack. Skip the boring setup, and jump straight to building.",
    demo: <ProjectStarterKit />,
  },
  {
    title: "AI Co-Founder Mode",
    description: "Get PM-style feedback, feature breakdowns, and roadmaps that turn your wild ideas into solid plans.",
    demo: (
      <div className="w-full h-full bg-white rounded-2xl shadow-lg overflow-hidden">
        <video 
            src="/pm.mov" 
            alt="AI Product Manager" 
            className="w-full h-full object-cover"
            autoPlay loop muted playsInline
        />
      </div>
    ),
  },
];

const FeatureListSection = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6 space-y-32">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
          >
            <div className={`lg:order-${index % 2 === 1 ? 2 : 1}`}>
              <h2 className="text-4xl font-bold text-gray-900 mb-5">{feature.title}</h2>
              <p className="text-xl text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
            <div className={`lg:order-${index % 2 === 1 ? 1 : 2}`}>
              {feature.demo}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default FeatureListSection; 