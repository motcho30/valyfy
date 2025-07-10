import React from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

const aiTools = [
    {
      name: 'Lovable',
      bestFor: 'AI-powered web development',
      logo: '/lovablelogo.png',
      url: 'https://lovable.dev'
    },
    {
      name: 'Cursor',
      bestFor: 'AI-powered code editor',
      logo: '/cursorlogo.png',
      url: 'https://cursor.sh'
    },
    {
      name: 'Claude',
      bestFor: 'Advanced AI conversations',
      logo: '/aitoolslogos/claude-ai.png',
      url: 'https://claude.ai'
    },
    {
      name: 'ChatGPT',
      bestFor: 'General AI assistance',
      logo: '/aitoolslogos/chatgptlogo.png',
      url: 'https://chatgpt.com'
    },
    {
      name: 'Bolt',
      bestFor: 'Rapid app deployment',
      logo: '/aitoolslogos/bolt.png',
      url: 'https://bolt.new'
    },
    {
      name: 'Spaceship',
      bestFor: 'Domain management',
      logo: '/aitoolslogos/spaceship.png',
      url: 'https://spaceship.com'
    },
    {
      name: 'Mobbin',
      bestFor: 'Mobile app design inspiration',
      logo: '/aitoolslogos/mobbin.png',
      url: 'https://mobbin.com'
    },
    {
      name: 'Supabase',
      bestFor: 'Backend as a Service',
      logo: '/aitoolslogos/supabase.png',
      url: 'https://supabase.com'
    },
];

const AIToolCard = ({ tool, index }) => {
  return (
    <motion.a
      href={tool.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-2xl border border-slate-200/70 p-6 flex flex-col items-center justify-start text-center relative group hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
      style={{ minHeight: '180px' }}
    >
      <div className="absolute top-3 right-3 p-1 bg-slate-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
        <Plus className="w-4 h-4 text-slate-500" />
      </div>
      <div className="w-16 h-16 mb-4 flex items-center justify-center">
        <img 
          src={tool.logo} 
          alt={`${tool.name} logo`}
          className="max-w-full max-h-full object-contain"
        />
      </div>
      <h3 className="font-semibold text-slate-800 text-sm mb-1">{tool.name}</h3>
      <p className="text-xs text-slate-500">{tool.bestFor}</p>
    </motion.a>
  );
};

const AIToolsSection = () => {
  return (
    <section className="py-24 bg-slate-50/50">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
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

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {aiTools.map((tool, index) => (
            <AIToolCard tool={tool} index={index} key={tool.name} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AIToolsSection; 