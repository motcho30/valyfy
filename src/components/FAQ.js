import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  {
    question: "What is this toolkit for?",
    answer: "This is an AI-powered toolkit designed to help developers and product managers accelerate the initial phases of app development. It helps with generating project foundations, brainstorming features, creating product documents, and providing ready-to-use prompts for coding."
  },
  {
    question: "Is my source code secure?",
    answer: "Yes, security is our top priority. We do not store your source code on our servers. All analysis and generation happens in a secure, isolated environment, and your intellectual property remains yours."
  },
  {
    question: "Can I customize the generated project files?",
    answer: "Absolutely. The generated files (like `cursor.config`, PRDs, and design specs) are meant to be a starting point. You have full control to modify and adapt them to your specific needs."
  },
  {
    question: "What makes this different from other AI assistants?",
    answer: "Our toolkit is focused on the 'vibe' and foundational structure of a project, not just line-by-line code completion. We help you think like a product manager and architect, ensuring your project starts on the right track with a clear vision and solid documentation."
  }
];

const FAQItem = ({ faq }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 py-6">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left text-lg font-medium text-gray-800"
      >
        <span>{faq.question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </motion.div>
      </motion.button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="mt-4 text-gray-600"
          >
            {faq.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQ = () => {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
            <span className="text-sm font-bold tracking-wider uppercase text-blue-600 bg-blue-100 py-1 px-3 rounded-full">FAQ</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-4">
                Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600 mt-4">
                Find answers to common questions about our services.
            </p>
        </div>
        <div>
          {faqs.map((faq, index) => (
            <FAQItem key={index} faq={faq} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ; 