import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import EcommercePromptDemo from './EcommercePromptDemo';
import PRDStarter from './PRDStarter';
import Auth from './Auth';

const StickyScrollFeatures = () => {
  const scrollRef = useRef(null);
  const [showAuth, setShowAuth] = useState(false);
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end end"]
  });

  const mainFeatures = [
    {
      title: "Copy-paste prompts that actually work",
      description: "Pixel-perfect UI prompts, backend setup, and debugging helpers that catch real issues.",
      demo: (
          <EcommercePromptDemo />
      )
    },
    {
      title: "Vibecode with the PRD method",
      description: "Instantly generate your project's foundation. Get custom cursor.config rules, PRDs, and design specs tailored to your stack and skip the setup.",
      demo: (
          <div className="w-full h-full bg-white rounded-2xl shadow-lg overflow-hidden">
              <video 
                  src="/file.mov" 
                  alt="Starter pack files" 
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
              />
          </div>
      )
    },
    {
      title: "Your AI co-founder for brainstorming",
      description: "Generate feature breakdowns, roadmaps, and get PM-style feedback on your vision. Turn your idea into a plan.",
      demo: <PRDStarter onAuthRequired={() => setShowAuth(true)} />
    }
  ];

  const [activeFeature, setActiveFeature] = useState(0);

    useEffect(() => {
        return scrollYProgress.onChange(latest => {
            const featureIndex = Math.min(Math.floor(latest * mainFeatures.length), mainFeatures.length - 1);
            setActiveFeature(featureIndex);
        })
    }, [scrollYProgress]);

  return (
    <>
      <section ref={scrollRef} className="py-20 relative" style={{ height: `${mainFeatures.length * 100}vh` }}>
        <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
          <div className="w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center px-12">
            <div>
              {mainFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  className="mb-24"
                  animate={{
                    opacity: activeFeature === index ? 1 : 0.3,
                    y: activeFeature === index ? 0 : 10
                  }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-4xl font-bold text-gray-900 mb-4">{feature.title}</h2>
                  <p className="text-xl text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
            
            <div className="w-full h-[700px] relative flex items-center justify-center">
               {mainFeatures.map((feature, index) => (
                   <motion.div
                        key={index}
                        className="absolute w-full h-full"
                        animate={{
                            opacity: activeFeature === index ? 1 : 0,
                            scale: activeFeature === index ? 1 : 0.95,
                        }}
                        transition={{ duration: 0.5 }}
                    >
                        {feature.demo}
                    </motion.div>
               ))}
            </div>
          </div>
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
  
  export default StickyScrollFeatures; 