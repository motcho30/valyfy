import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

const aiTools = [
  {
    name: 'Lovable',
    description: 'AI-powered web development',
    bestFor: 'AI-powered web development',
    logo: '/lovablelogo.png',
    url: 'https://lovable.dev'
  },
  {
    name: 'Cursor',
    description: 'AI-powered code editor',
    bestFor: 'AI-powered code editor',
    logo: '/cursorlogo.png',
    url: 'https://cursor.sh'
  },
  {
    name: 'Claude',
    description: 'Advanced AI conversations',
    bestFor: 'Advanced AI conversations',
    logo: '/aitoolslogos/claude-ai.png',
    url: 'https://claude.ai'
  },
  {
    name: 'ChatGPT',
    description: 'General AI assistance',
    bestFor: 'General AI assistance',
    logo: '/aitoolslogos/chatgptlogo.png',
    url: 'https://chatgpt.com'
  },
  {
    name: 'Bolt',
    description: 'Rapid app deployment',
    bestFor: 'Rapid app deployment',
    logo: '/aitoolslogos/bolt.png',
    url: 'https://bolt.new'
  },
  {
    name: 'Spaceship',
    description: 'Domain management',
    bestFor: 'Domain management',
    logo: '/aitoolslogos/spaceship.png',
    url: 'https://spaceship.com'
  },
  {
    name: 'Mobbin',
    description: 'Mobile app design inspiration',
    bestFor: 'Mobile app design inspiration',
    logo: '/aitoolslogos/mobbin.png',
    url: 'https://mobbin.com'
  },
  {
    name: 'Supabase',
    description: 'Backend as a Service',
    bestFor: 'Backend as a Service',
    logo: '/aitoolslogos/supabase.png',
    url: 'https://supabase.com'
  },
  {
    name: 'RevenueCAT',
    description: 'In-app purchase management',
    bestFor: 'In-app purchase management',
    logo: '/aitoolslogos/rc.png',
    url: 'https://revenuecat.com'
  },
  {
    name: 'Superwall',
    description: 'Paywall optimization',
    bestFor: 'Paywall optimization',
    logo: '/darkmode.png',
    url: 'https://superwall.com'
  },
  {
    name: 'Rork',
    description: 'App analytics and insights',
    bestFor: 'App analytics and insights',
    logo: '/aitoolslogos/rork.png',
    url: 'https://rork.com'
  }
];

const AIToolCard = ({ tool }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -2 }}
      className="bg-white rounded-lg border border-gray-200 p-6 relative group hover:shadow-md transition-all duration-200 h-32 flex items-center"
    >
      {/* Go to tool button */}
      <motion.a
        href={tool.url}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="absolute top-4 right-4 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
      >
        <ExternalLink className="w-4 h-4 text-gray-600" />
      </motion.a>

      {/* Tool logo and content */}
      <div className="flex items-center space-x-4 w-full">
        <div className="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
          <img 
            src={tool.logo} 
            alt={tool.name} 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-lg mb-1">{tool.name}</h3>
          <p className="text-sm text-gray-500 line-clamp-2">
            <span className="font-medium">Best for:</span> {tool.bestFor}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const AIToolsSection = () => {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-sm font-bold tracking-wider uppercase text-blue-600 bg-blue-100 py-1 px-3 rounded-full">
              AI Tools
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-4 mb-4">
              Build and ship with AI-powered tools
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Discover the best AI tools to accelerate your development workflow and bring your ideas to life faster than ever.
            </p>
          </motion.div>
        </div>

        {/* AI Tools Categories */}
        <div className="space-y-12">
          {/* AI Tools Category */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">AI Tools</h3>
            <p className="text-gray-600 mb-8">Build and ship with AI-powered tools</p>
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {aiTools.slice(0, 5).map((tool, index) => (
                <motion.div
                  key={tool.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <AIToolCard tool={tool} />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Infrastructure Category */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Infrastructure</h3>
            <p className="text-gray-600 mb-8">Domains, databases & APIs</p>
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {aiTools.slice(5, 8).map((tool, index) => (
                <motion.div
                  key={tool.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <AIToolCard tool={tool} />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Mobile Apps Category */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Mobile Apps</h3>
            <p className="text-gray-600 mb-8">Build and monetize mobile apps</p>
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {aiTools.slice(8, 11).map((tool, index) => (
                <motion.div
                  key={tool.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <AIToolCard tool={tool} />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIToolsSection; 