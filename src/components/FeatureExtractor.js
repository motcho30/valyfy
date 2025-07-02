import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Upload, FileCode, Zap, Download, Copy, Check } from 'lucide-react';

const FeatureExtractor = ({ onClose }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [extractedFeatures, setExtractedFeatures] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const handleFiles = async (files) => {
    if (files.length === 0) return;
    
    setIsLoading(true);
    
    // Simulate processing delay
    setTimeout(() => {
      const mockFeatures = {
        components: [
          { name: 'Header', type: 'Component', file: 'Header.js', dependencies: ['React', 'motion'] },
          { name: 'Dashboard', type: 'Component', file: 'Dashboard.js', dependencies: ['React', 'useState', 'motion'] },
          { name: 'FeatureCard', type: 'Component', file: 'Dashboard.js', dependencies: ['motion'] }
        ],
        hooks: [
          { name: 'useState', usage: '8 times', files: ['App.js', 'Dashboard.js', 'Header.js'] },
          { name: 'useEffect', usage: '3 times', files: ['Dashboard.js'] }
        ],
        utilities: [
          { name: 'formatTime', type: 'Function', file: 'utils.js' },
          { name: 'localStorage', type: 'Browser API', usage: 'User preferences' }
        ],
        dependencies: [
          { name: 'framer-motion', version: '^10.16.4', usage: 'Animations' },
          { name: 'lucide-react', version: '^0.294.0', usage: 'Icons' },
          { name: 'react-router-dom', version: '^6.x', usage: 'Navigation' }
        ]
      };
      
      setExtractedFeatures(mockFeatures);
      setIsLoading(false);
    }, 2000);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(JSON.stringify(text, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generateMarkdownReport = () => {
    if (!extractedFeatures) return '';
    
    return `# Feature Analysis Report

## Components (${extractedFeatures.components.length})
${extractedFeatures.components.map(comp => 
  `- **${comp.name}** (${comp.type})\n  - File: \`${comp.file}\`\n  - Dependencies: ${comp.dependencies.join(', ')}`
).join('\n\n')}

## React Hooks (${extractedFeatures.hooks.length})
${extractedFeatures.hooks.map(hook => 
  `- **${hook.name}** - Used ${hook.usage}\n  - Files: ${hook.files.join(', ')}`
).join('\n\n')}

## Utilities (${extractedFeatures.utilities.length})
${extractedFeatures.utilities.map(util => 
  `- **${util.name}** (${util.type})\n  - File: \`${util.file}\``
).join('\n\n')}

## Dependencies (${extractedFeatures.dependencies.length})
${extractedFeatures.dependencies.map(dep => 
  `- **${dep.name}** v${dep.version}\n  - Usage: ${dep.usage}`
).join('\n\n')}
`;
  };

  return (
    <div className="min-h-screen bg-white p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-jersey text-4xl text-black">Feature Extractor</h1>
          <p className="text-slate-600 mt-2">Analyze your codebase and extract key features automatically</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClose}
          className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors"
        >
          <X className="w-6 h-6 text-slate-700" />
        </motion.button>
      </div>

      <div className="max-w-4xl mx-auto">
        {!extractedFeatures ? (
          /* File Upload Section */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
                isDragOver
                  ? 'border-vibe-cyan bg-vibe-cyan/5'
                  : 'border-slate-300 hover:border-slate-400'
              }`}
            >
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Zap className="w-8 h-8 text-vibe-cyan" />
                    </motion.div>
                  ) : (
                    <Upload className="w-8 h-8 text-slate-600" />
                  )}
                </div>
                
                <h3 className="text-xl font-semibold text-slate-800 mb-2">
                  {isLoading ? 'Analyzing your code...' : 'Upload your project files'}
                </h3>
                
                <p className="text-slate-600 mb-6 max-w-md">
                  {isLoading 
                    ? 'This might take a moment while we extract features from your codebase'
                    : 'Drag and drop your JavaScript/TypeScript files here, or click to browse'
                  }
                </p>

                {!isLoading && (
                  <div className="flex items-center space-x-4">
                    <motion.label
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-vibe-cyan text-black px-6 py-3 rounded-xl font-semibold cursor-pointer hover:shadow-lg transition-all"
                    >
                      <input
                        type="file"
                        multiple
                        accept=".js,.jsx,.ts,.tsx,.json"
                        onChange={handleFileInput}
                        className="hidden"
                      />
                      Choose Files
                    </motion.label>
                    
                    <div className="flex items-center space-x-2 text-slate-500">
                      <FileCode className="w-4 h-4" />
                      <span className="text-sm">JS, JSX, TS, TSX, JSON</span>
                    </div>
                  </div>
                )}

                {isLoading && (
                  <div className="mt-4">
                    <div className="w-64 h-2 bg-slate-200 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-vibe-cyan"
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 2, ease: "easeInOut" }}
                      />
                    </div>
                    <p className="text-sm text-slate-500 mt-2">Scanning components, hooks, and dependencies...</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          /* Results Section */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Actions */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-slate-800">Analysis Results</h2>
              <div className="flex items-center space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => copyToClipboard(extractedFeatures)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-medium transition-colors flex items-center space-x-2"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied!' : 'Copy JSON'}</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    const blob = new Blob([generateMarkdownReport()], { type: 'text/markdown' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'feature-analysis.md';
                    a.click();
                  }}
                  className="px-4 py-2 bg-vibe-cyan text-black rounded-lg font-medium hover:shadow-lg transition-all flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Export Report</span>
                </motion.button>
              </div>
            </div>

            {/* Feature Categories */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Components */}
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
                  <FileCode className="w-5 h-5 mr-2" />
                  Components ({extractedFeatures.components.length})
                </h3>
                <div className="space-y-3">
                  {extractedFeatures.components.map((comp, idx) => (
                    <div key={idx} className="bg-white rounded-lg p-3">
                      <div className="font-medium text-slate-800">{comp.name}</div>
                      <div className="text-sm text-slate-600">{comp.file}</div>
                      <div className="text-xs text-blue-600 mt-1">
                        {comp.dependencies.join(', ')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dependencies */}
              <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-green-800 mb-4">
                  Dependencies ({extractedFeatures.dependencies.length})
                </h3>
                <div className="space-y-3">
                  {extractedFeatures.dependencies.map((dep, idx) => (
                    <div key={idx} className="bg-white rounded-lg p-3">
                      <div className="font-medium text-slate-800">{dep.name}</div>
                      <div className="text-sm text-slate-600">{dep.version}</div>
                      <div className="text-xs text-green-600 mt-1">{dep.usage}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hooks */}
              <div className="bg-purple-50 border border-purple-200 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-purple-800 mb-4">
                  React Hooks ({extractedFeatures.hooks.length})
                </h3>
                <div className="space-y-3">
                  {extractedFeatures.hooks.map((hook, idx) => (
                    <div key={idx} className="bg-white rounded-lg p-3">
                      <div className="font-medium text-slate-800">{hook.name}</div>
                      <div className="text-sm text-slate-600">{hook.usage}</div>
                      <div className="text-xs text-purple-600 mt-1">
                        {hook.files.join(', ')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Utilities */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-amber-800 mb-4">
                  Utilities ({extractedFeatures.utilities.length})
                </h3>
                <div className="space-y-3">
                  {extractedFeatures.utilities.map((util, idx) => (
                    <div key={idx} className="bg-white rounded-lg p-3">
                      <div className="font-medium text-slate-800">{util.name}</div>
                      <div className="text-sm text-slate-600">{util.type}</div>
                      {util.file && (
                        <div className="text-xs text-amber-600 mt-1">{util.file}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* New Analysis Button */}
            <div className="mt-8 text-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setExtractedFeatures(null)}
                className="px-6 py-3 bg-slate-800 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                Analyze Another Project
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default FeatureExtractor; 