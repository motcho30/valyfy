import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const mainFeatures = [
  {
    title: "Get your project foundation in seconds",
    description: "Custom cursor.config rules, PRDs, and design specs tailored to your stack.",
    demo: (
        <div className="w-full h-full bg-white rounded-2xl shadow-lg overflow-hidden">
            <img 
                src="/files.png" 
                alt="Starter pack files" 
                className="w-full h-full object-cover"
            />
        </div>
    )
  },
  {
    title: "Brainstorm like you have a co-founder",
    description: "Generate feature breakdowns, roadmaps, and get PM-style feedback on your vision.",
    demo: (
        <div className="w-full h-full bg-white rounded-2xl shadow-lg overflow-hidden">
            <img 
                src="/pm.png" 
                alt="AI Product Manager" 
                className="w-full h-full object-cover"
            />
        </div>
    )
  },
  {
    title: "Copy-paste prompts that actually work",
    description: "Pixel-perfect UI prompts, backend setup, and debugging helpers that catch real issues.",
    demo: (
        <div className="w-full h-full bg-white rounded-2xl shadow-lg overflow-hidden">
            <img 
                src="/pg.png" 
                alt="Prompt generator" 
                className="w-full h-full object-cover"
            />
        </div>
    )
  }
];

const StickyScrollFeatures = () => {
    const scrollRef = useRef(null);
    const { scrollYProgress } = useScroll({
      target: scrollRef,
      offset: ["start start", "end end"]
    });
  
    const [activeFeature, setActiveFeature] = useState(0);

    useEffect(() => {
        return scrollYProgress.onChange(latest => {
            const featureIndex = Math.min(Math.floor(latest * mainFeatures.length), mainFeatures.length - 1);
            setActiveFeature(featureIndex);
        })
    }, [scrollYProgress]);

    return (
      <section ref={scrollRef} className="py-20 relative" style={{ height: `${mainFeatures.length * 100}vh` }}>
        <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
          <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="pr-8">
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
            
            <div className="w-full h-[500px] relative">
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
    );
  };
  
  export default StickyScrollFeatures; 