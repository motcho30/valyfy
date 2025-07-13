import React from 'react';
import { motion } from 'framer-motion';

const DesignInspiration = ({ onNavigateToFeature }) => {
  const designCards = [
    {
      id: 1,
      company: 'Airbnb',
      description: 'Warm, welcoming design with intuitive booking flow',
      image: '/minimlistic.png',
      logo: '/aitoolslogos/bolt.png',
      color: 'bg-gradient-to-br from-red-50 to-pink-50',
      accent: 'text-red-600'
    },
    {
      id: 2,
      company: 'Apple',
      description: 'Clean, minimal interface with perfect spacing',
      image: '/darkmode.png',
      logo: '/aitoolslogos/claude-ai.png',
      color: 'bg-gradient-to-br from-gray-50 to-slate-50',
      accent: 'text-gray-800'
    },
    {
      id: 3,
      company: 'Stripe',
      description: 'Professional, trustworthy payment experience',
      image: '/pg.png',
      logo: '/aitoolslogos/supabase.png',
      color: 'bg-gradient-to-br from-blue-50 to-indigo-50',
      accent: 'text-blue-600'
    },
    {
      id: 4,
      company: 'Notion',
      description: 'Flexible workspace with elegant functionality',
      image: '/pm.png',
      logo: '/aitoolslogos/mobbin.png',
      color: 'bg-gradient-to-br from-purple-50 to-violet-50',
      accent: 'text-purple-600'
    },
    {
      id: 5,
      company: 'Linear',
      description: 'Fast, focused project management interface',
      image: '/files.png',
      logo: '/aitoolslogos/windsurf.png',
      color: 'bg-gradient-to-br from-green-50 to-emerald-50',
      accent: 'text-green-600'
    },
    {
      id: 6,
      company: 'Figma',
      description: 'Collaborative design tool with smooth UX',
      image: '/darkmode.png',
      logo: '/aitoolslogos/rc.png',
      color: 'bg-gradient-to-br from-orange-50 to-amber-50',
      accent: 'text-orange-600'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative text-center py-20 px-4"
      >
        <div className="absolute inset-0 -z-0">
          <motion.div 
            className="absolute top-[-5rem] left-1/2 transform -translate-x-1/2 w-[20rem] h-[20rem] bg-vibe-cyan/10 rounded-full blur-3xl"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 8, repeat: Infinity, repeatType: "mirror" }}
          />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-bold text-4xl md:text-5xl lg:text-6xl text-black leading-tight mb-6 tracking-tight"
          >
            Transform the design of your app to look like:
          </motion.h1>
                     <motion.p 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, delay: 0.4 }}
             className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
           >
             Copy paste prompts from the designs you like to transform your project's frontend
           </motion.p>
        </div>
      </motion.section>

      {/* Design Cards Grid */}
      <motion.section 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="pb-20 px-4"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {designCards.map((card) => (
              <motion.div
                key={card.id}
                variants={cardVariants}
                whileHover={{ 
                  y: -8,
                  transition: { duration: 0.3 }
                }}
                className="group cursor-pointer"
                onClick={() => onNavigateToFeature && onNavigateToFeature('create-project')}
              >
                <div className={`${card.color} rounded-2xl p-6 h-full transition-all duration-300 hover:shadow-xl border border-gray-100`}>
                  {/* Company Logo */}
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center p-1">
                      <img 
                        src={card.logo} 
                        alt={`${card.company} logo`} 
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <h3 className={`ml-3 text-lg font-semibold ${card.accent}`}>
                      {card.company}
                    </h3>
                  </div>

                  {/* Design Preview */}
                  <div className="mb-4 relative overflow-hidden rounded-xl bg-white shadow-sm">
                    <div className="aspect-[4/3] relative">
                      <img 
                        src={card.image} 
                        alt={`${card.company} design preview`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-700 text-sm leading-relaxed mb-4">
                    {card.description}
                  </p>

                  {/* CTA */}
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${card.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                      Get this style →
                    </span>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:shadow-md transition-all duration-300"
                    >
                      <svg 
                        className={`w-4 h-4 ${card.accent}`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M9 5l7 7-7 7" 
                        />
                      </svg>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Bottom CTA Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-16 px-4 bg-gradient-to-br from-gray-50 to-white"
      >
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to create your own?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Start building with any of these design styles in minutes
          </p>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigateToFeature && onNavigateToFeature('create-project')}
            className="bg-vibe-cyan text-black px-8 py-3 rounded-xl font-semibold text-lg hover:shadow-lg transition-all duration-200 relative"
          >
            Start building now
            <span className="absolute -top-1 -right-1 text-lg">✨</span>
          </motion.button>
        </div>
      </motion.section>
    </div>
  );
};

export default DesignInspiration; 