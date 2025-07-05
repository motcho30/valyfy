import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Check, 
  Copy, 
  FileText, 
  FolderOpen, 
  ArrowRight,
  CheckCircle
} from 'lucide-react';

const ProjectGuidance = ({ project, onClose, isVisible }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [copiedItems, setCopiedItems] = useState(new Set());

  const handleStepComplete = (stepNumber) => {
    setCompletedSteps(prev => new Set([...prev, stepNumber]));
    if (stepNumber < 3) {
      setCurrentStep(stepNumber + 1);
    }
  };

  const handleCopyToClipboard = async (content, itemId) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedItems(prev => new Set([...prev, itemId]));
      setTimeout(() => {
        setCopiedItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(itemId);
          return newSet;
        });
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const getPRDContent = () => {
    return project?.generatedFiles?.find(file => file.type === 'PRD Document')?.content || '';
  };

  const steps = [
    {
      id: 1,
      title: "Save Project PRD",
      description: "Save the PRD document to your project's rules folder",
      icon: <FileText className="w-6 h-6" />,
      color: "bg-green-500"
    },
    {
      id: 2,
      title: "Start Coding",
      description: "You're all set! Start building your project",
      icon: <CheckCircle className="w-6 h-6" />,
      color: "bg-purple-500"
    }
  ];

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-vibe-cyan to-blue-500 p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">🎉 Setup Your Project</h2>
                <p className="text-white/80 mt-1">Follow these steps to get started with {project?.name}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="px-6 py-4 bg-gray-50">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold
                    ${completedSteps.has(step.id) ? 'bg-green-500' : 
                      currentStep === step.id ? step.color : 'bg-gray-300'}
                    transition-colors duration-300
                  `}>
                    {completedSteps.has(step.id) ? <Check className="w-5 h-5" /> : step.id}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`
                      w-16 h-1 mx-4
                      ${completedSteps.has(step.id) ? 'bg-green-500' : 'bg-gray-300'}
                      transition-colors duration-300
                    `} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[60vh] overflow-y-auto">
            {/* Step 1: PRD Setup */}
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Save Project PRD</h3>
                    <p className="text-gray-600">Add the PRD to your project folder</p>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <div className="flex items-start space-x-3">
                    <FolderOpen className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-green-900">Recommended folder structure:</h4>
                      <div className="mt-2 text-sm text-green-800 font-mono bg-green-100 p-3 rounded-lg">
                        <div>your-project/</div>
                        <div>├── rules/</div>
                        <div>│   └── prd.md ← Save PRD here</div>
                        <div>├── src/</div>
                        <div>└── ...</div>
                      </div>
                      <p className="mt-2 text-sm text-green-700">
                        Create a <code className="bg-green-100 px-1 rounded">rules</code> folder in your project root and save the PRD there for easy reference.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-xl">
                  <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-gray-600" />
                      <span className="font-medium text-gray-700">prd.md</span>
                    </div>
                    <button
                      onClick={() => handleCopyToClipboard(getPRDContent(), 'prd')}
                      className="flex items-center space-x-2 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      {copiedItems.has('prd') ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copy PRD</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="p-4 max-h-48 overflow-y-auto">
                    <pre className="text-sm text-gray-800 whitespace-pre-wrap">
                      {getPRDContent()?.substring(0, 500) || "No PRD generated"}
                      {getPRDContent()?.length > 500 && "..."}
                    </pre>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => handleStepComplete(1)}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                  >
                    <span>PRD Saved</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Complete */}
            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6 text-center"
              >
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center text-white">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold">🚀 You're All Set!</h3>
                    <p className="text-gray-600 mt-2">Your project is configured and ready to go</p>
                  </div>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                  <h4 className="font-semibold text-purple-900 mb-3">What's next?</h4>
                  <div className="text-left space-y-2 text-purple-800">
                    <div className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-purple-600" />
                      <span>Open your project in Cursor IDE</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-purple-600" />
                      <span>Start coding with AI assistance using your custom rules</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-purple-600" />
                      <span>Reference the PRD document for project requirements</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-purple-600" />
                      <span>Use Cursor's AI features to build faster</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={onClose}
                    className="px-8 py-3 bg-gradient-to-r from-vibe-cyan to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                  >
                    Start Coding! 🎉
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProjectGuidance; 