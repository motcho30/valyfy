import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, Code, Bug, GitBranch, Zap, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';

const tips = [
  {
    id: 1,
    title: "Be Specific",
    icon: <Lightbulb className="w-6 h-6" />,
    description: "Think of it as giving precise commands to a highly intelligent assistant",
    content: "When interacting with Cursor AI, provide clear, concise, and specific instructions. Avoid ambiguity to ensure the AI understands your intent and generates accurate results.",
    example: "Instead of: 'Make a button'\nTry: 'Create a blue rounded button with white text that says Submit and has hover effects'",
    category: "fundamentals"
  },
  {
    id: 2,
    title: "Save Your Plans",
    icon: <GitBranch className="w-6 h-6" />,
    description: "Outline your approach before diving into complex tasks",
    content: "Before diving into complex tasks, outline your plan or approach. This helps in structuring your interaction with Cursor AI and allows for better organization and reproducibility of your work.",
    example: "Write down: 1. Create login form 2. Add validation 3. Connect to backend 4. Add error handling",
    category: "planning"
  },
  {
    id: 3,
    title: "Make Small, Incremental Changes",
    icon: <Zap className="w-6 h-6" />,
    description: "Break down tasks into smaller, manageable steps",
    content: "Instead of making large, sweeping changes, break down your tasks into smaller, manageable steps. This iterative approach allows you to test and validate each change, making it easier to identify and fix issues.",
    example: "Don't: 'Build entire dashboard'\nDo: 'Create header component' → 'Add navigation' → 'Style sidebar' → etc.",
    category: "workflow"
  },
  {
    id: 4,
    title: "Error Handling Like a Pro",
    icon: <Bug className="w-6 h-6" />,
    description: "Provide context, not just error messages",
    content: "When encountering errors, don't just paste the error message. Analyze the error, understand its context, and provide Cursor AI with relevant information including the code snippet, error message, and any other relevant details.",
    example: "Include: What you were trying to do, the full error message, relevant code, and what you've already tried",
    category: "debugging"
  },
  {
    id: 5,
    title: "Context is Everything",
    icon: <Code className="w-6 h-6" />,
    description: "The more context, the better the AI can help",
    content: "Provide Cursor AI with as much relevant context as possible. This includes the project structure, dependencies, existing code, and the overall goal. The more context the AI has, the better it can understand your problem.",
    example: "Share: Tech stack, file structure, related components, and your end goal",
    category: "fundamentals"
  },
  {
    id: 6,
    title: "LLMs Aren't Just for Coding",
    icon: <Heart className="w-6 h-6" />,
    description: "Leverage AI for documentation, debugging, and ideation",
    content: "Large Language Models like Cursor AI can do more than just write code. They can assist with various development tasks, including debugging, documentation, and even generating ideas. Leverage their capabilities beyond just code generation.",
    example: "Use for: Writing README files, explaining complex code, brainstorming features, code reviews",
    category: "advanced"
  }
];

const categories = {
  fundamentals: { name: "Fundamentals", color: "bg-vibe-cyan/10 text-vibe-cyan", icon: "🎯" },
  planning: { name: "Planning", color: "bg-purple-100 text-purple-700", icon: "📋" },
  workflow: { name: "Workflow", color: "bg-green-100 text-green-700", icon: "⚡" },
  debugging: { name: "Debugging", color: "bg-red-100 text-red-700", icon: "🐛" },
  advanced: { name: "Advanced", color: "bg-blue-100 text-blue-700", icon: "🚀" }
};

const CursorTips = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const navigate = useNavigate();

  const filteredTips = activeCategory === 'all' 
    ? tips 
    : tips.filter(tip => tip.category === activeCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <Header 
        onNavigateToDashboard={() => navigate('/dashboard')}
        onNavigateToDesignInspiration={() => navigate('/design-inspiration')}
        onNavigateToHome={() => navigate('/')}
      />
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center py-20 pt-32 px-4"
      >
        <h1 className="font-bold text-4xl md:text-5xl lg:text-6xl text-black leading-tight max-w-4xl mx-auto mb-6 tracking-tight">
          Cursor AI Tips & Tricks
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Everything you need to know to build faster with AI that actually gets it.
        </p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8"
        >
          <div className="inline-flex items-center bg-vibe-cyan/10 px-6 py-3 rounded-full">
            <span className="text-2xl mr-2">✨</span>
            <span className="text-vibe-cyan font-semibold">Human-written, AI-approved</span>
          </div>
        </motion.div>
      </motion.section>

      {/* Category Filter */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="px-4 mb-12"
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                activeCategory === 'all'
                  ? 'bg-black text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              All Tips
            </button>
            {Object.entries(categories).map(([key, category]) => (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-200 flex items-center gap-2 ${
                  activeCategory === key
                    ? 'bg-black text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <span>{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Tips Grid */}
      <section className="px-4 pb-20">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              {filteredTips.map((tip, index) => (
                <motion.div
                  key={tip.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-sm border border-gray-200/50 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-vibe-cyan/10 rounded-xl text-vibe-cyan">
                          {tip.icon}
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-1">
                            Tip #{tip.id}: {tip.title}
                          </h3>
                          <p className="text-gray-600">
                            {tip.description}
                          </p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${categories[tip.category].color}`}>
                        {categories[tip.category].name}
                      </span>
                    </div>

                    <div className="space-y-4">
                      <div className="prose prose-gray max-w-none">
                        <p className="text-gray-700 leading-relaxed">
                          {tip.content}
                        </p>
                      </div>
                      
                      {tip.example && (
                        <div className="bg-gray-50 rounded-xl p-4">
                          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                            <span className="text-vibe-cyan">💡</span>
                            Example
                          </h4>
                          <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                            {tip.example}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>


 
    </div>
  );
};

export default CursorTips; 