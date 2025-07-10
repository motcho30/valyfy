import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, Code, Bug, Zap } from 'lucide-react';

const tips = [
  {
    id: 1,
    title: "Be Specific, Not Vague",
    icon: <Lightbulb className="w-5 h-5" />,
    content: "When interacting with Cursor AI, provide clear and concise instructions. Avoid ambiguity to ensure the AI understands your intent and generates accurate results. Think of it as giving precise commands to an intelligent assistant.",
    example: "Instead of 'Make a button', try 'Create a blue rounded button with white text that says Submit'.",
  },
  {
    id: 2,
    title: "Context is Everything",
    icon: <Code className="w-5 h-5" />,
    content: "Provide Cursor AI with as much relevant context as possible. This includes the project structure, dependencies, existing code, and the overall goal. The more context the AI has, the better it can understand your problem.",
    example: "Share your tech stack, file structure, related components, and your end goal for better results.",
  },
  {
    id: 3,
    title: "Incremental Changes",
    icon: <Zap className="w-5 h-5" />,
    content: "Instead of making large, sweeping changes, break down your tasks into smaller, manageable steps. This iterative approach allows you to test and validate each change, making it easier to identify and fix issues as you go.",
    example: "Don't ask to 'Build the entire dashboard'. Instead, start with 'Create the header component'.",
  },
  {
    id: 4,
    title: "Error Handling Like a Pro",
    icon: <Bug className="w-5 h-5" />,
    content: "When encountering errors, don't just paste the error message. Analyze the error, understand its context, and provide Cursor AI with relevant information including the code snippet and the full error message.",
    example: "Include what you were trying to do, the full error, and what you've already tried.",
  }
];

const AITipsSection = () => {
  const [expanded, setExpanded] = useState(0);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            AI Tips & Tricks
          </h2>
          <p className="text-lg text-gray-600">
            Everything you need to know to build faster with an AI that actually gets it.
          </p>
        </motion.div>
        
        <div className="space-y-4">
          {tips.map((tip, index) => (
            <motion.div
              key={tip.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div 
                className="bg-slate-50/80 rounded-xl border border-slate-200/60 overflow-hidden cursor-pointer"
                onClick={() => setExpanded(expanded === index ? false : index)}
              >
                <div className="flex items-center justify-between p-5">
                  <div className="flex items-center space-x-4">
                    <div className="text-slate-500">{tip.icon}</div>
                    <h3 className="font-semibold text-gray-800">{tip.title}</h3>
                  </div>
                  <motion.div
                    animate={{ rotate: expanded === index ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </motion.div>
                </div>
                
                <AnimatePresence initial={false}>
                  {expanded === index && (
                    <motion.div
                      key="content"
                      initial="collapsed"
                      animate="open"
                      exit="collapsed"
                      variants={{
                        open: { opacity: 1, height: 'auto' },
                        collapsed: { opacity: 0, height: 0 }
                      }}
                      transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5 pt-2 border-t border-slate-200/60">
                        <p className="text-gray-600 mb-3">{tip.content}</p>
                        <div className="bg-slate-200/50 rounded-md p-3 text-sm">
                          <span className="font-mono text-slate-700">{tip.example}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AITipsSection; 