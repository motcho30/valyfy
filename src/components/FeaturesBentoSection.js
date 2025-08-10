import React from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Palette, 
  Zap, 
  Users, 
  MessageSquare, 
  Settings, 
  Target,
  Code,
  Lightbulb,
  Sparkles
} from 'lucide-react';
import { BentoCard, BentoGrid } from './ui/bento-grid';

const FeaturesBentoSection = ({ onNavigateToFeature }) => {
  const features = [
    {
      Icon: FileText,
      name: "AI Co-Founder Mode",
      description: "Just tell us what you wanna build and we'll turn your scattered thoughts into a clear plan that AI actually understands. Optimized for cursor, lovable, and whatever comes next.",
      href: "#",
      cta: "Get Started",
      background: null,
      className: "lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3",
    },
    {
      Icon: Zap,
      name: "Copy-Paste Prompts",
      description: "Pixel-perfect UI generation, backend setup, and debugging helpers that catch real issues.",
      href: "#",
      cta: "Get Started",
      background: null,
      className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
    },
    {
      Icon: Code,
      name: "Instant Project Foundation",
      description: "Download professionally crafted cursor.config rules, PRDs, and design specs for web and mobile development. Skip the boring setup, and jump straight to building.",
      href: "#",
      cta: "Get Started",
      background: null,
      className: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
    },
    {
      Icon: Palette,
      name: "Design Inspiration",
      description: "Browse curated design inspiration from top apps like Airbnb, Discord, Figma, and more. Get the exact design patterns you need.",
      href: "#",
      cta: "Get Started",
      background: (
        <img 
          src="/designfeaturesection.png" 
          className="absolute -right-20 -top-20 opacity-60 w-40 h-40 object-cover rounded-lg" 
          alt="Design Inspiration"
        />
      ),
      className: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
    },

    {
      Icon: MessageSquare,
      name: "Prompt Templates",
      description: "Save and organize your best prompts. Build a library of reusable templates for different features and use cases.",
      href: "#",
      cta: "Get Started",
      background: null,
      className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-2",
    },
    {
      Icon: Target,
      name: "Product Requirements",
      description: "Generate comprehensive PRDs with technical specifications, user flows, and business requirements. Perfect for stakeholder alignment.",
      href: "#",
      cta: "Get Started",
      background: null,
      className: "lg:col-start-1 lg:col-end-2 lg:row-start-2 lg:row-end-3",
    },
    {
      Icon: Lightbulb,
      name: "Design Review",
      description: "Get AI-powered feedback on your designs. Improve UX, accessibility, and visual hierarchy with expert insights.",
      href: "#",
      cta: "Get Started",
      background: null,
      className: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
    },

    {
      Icon: Sparkles,
      name: "AI Tips & Tricks",
      description: "Learn best practices for working with AI coding assistants. Get tips for better prompts and more efficient development.",
      href: "#",
      cta: "Get Started",
      background: null,
      className: "lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-3",
    },
  ];

  const handleFeatureClick = (feature) => {
    if (onNavigateToFeature) {
      // Map feature names to navigation targets
      const navigationMap = {
        "AI Co-Founder Mode": "create-project",
        "Copy-Paste Prompts": "prompt-templates",
        "Instant Project Foundation": "create-project",
        "Design Inspiration": "design-inspiration",
        "Prompt Templates": "prompt-templates",
        "Product Requirements": "create-project",
        "Design Review": "design-review",
        "AI Tips & Tricks": "create-project"
      };
      
      const target = navigationMap[feature.name] || "create-project";
      onNavigateToFeature(target);
    }
  };

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Everything you need to build faster
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            From project planning to deployment, our toolkit streamlines every step of your development process
          </p>
        </motion.div>

        {/* Bento Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <BentoGrid className="lg:grid-rows-3">
            {features.map((feature) => (
              <BentoCard 
                key={feature.name} 
                {...feature}
                href="#"
                onClick={() => handleFeatureClick(feature)}
              />
            ))}
          </BentoGrid>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-16"
        >
          <p className="text-lg text-gray-600 mb-6">
            Ready to supercharge your development workflow?
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigateToFeature && onNavigateToFeature('create-project')}
            className="bg-vibe-cyan text-black px-12 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all duration-200 relative"
          >
            Start building now
            <span className="absolute -top-2 -right-2 text-xl">✨</span>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesBentoSection; 