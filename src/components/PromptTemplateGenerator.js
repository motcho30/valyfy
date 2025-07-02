import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PromptTemplateGenerator = ({ onClose, project = null }) => {
  const [availableTags, setAvailableTags] = useState([
    { id: 1, name: 'Landing Page', color: 'bg-blue-100 text-blue-700' },
    { id: 2, name: 'User Authentication', color: 'bg-green-100 text-green-700' },
    { id: 3, name: 'Dashboard', color: 'bg-purple-100 text-purple-700' },
    { id: 4, name: 'Backend Connection', color: 'bg-orange-100 text-orange-700' },
    { id: 5, name: 'Database Setup', color: 'bg-red-100 text-red-700' },
    { id: 6, name: 'API Integration', color: 'bg-yellow-100 text-yellow-700' },
  ]);

  const [selectedTag, setSelectedTag] = useState(null);
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [draggedTag, setDraggedTag] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const dropZoneRef = useRef(null);

  const handleDragStart = (e, tag) => {
    setDraggedTag(tag);
    e.dataTransfer.setData('text/plain', '');
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    if (!dropZoneRef.current?.contains(e.relatedTarget)) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (draggedTag) {
      setSelectedTag(draggedTag);
      generatePrompt(draggedTag);
      setDraggedTag(null);
    }
  };

  const generatePrompt = async (tag) => {
    setIsGenerating(true);
    setGeneratedPrompt('');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const promptTemplates = {
        'Landing Page': `# Landing Page Implementation Prompt

**Context**: Building a landing page for ${project?.name || 'this application'}.

**Instructions**:
1. Create a modern, responsive landing page component
2. Include hero section with compelling headline
3. Add feature highlights section
4. Implement call-to-action buttons
5. Ensure mobile-first responsive design
6. Use Tailwind CSS for styling
7. Add smooth scroll animations with Framer Motion

**Technical Requirements**:
- React functional component with hooks
- TypeScript for type safety
- Semantic HTML structure
- Accessibility best practices
- SEO optimization

**Example Structure**:
\`\`\`jsx
const LandingPage = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <CTASection />
    </div>
  );
};
\`\`\``,

        'User Authentication': `# User Authentication Implementation Prompt

**Context**: Implement secure user authentication for ${project?.name || 'this application'}.

**Instructions**:
1. Create login and registration forms
2. Implement password validation
3. Add forgot password functionality
4. Include social login options
5. Handle authentication states
6. Implement protected routes
7. Add session management

**Technical Requirements**:
- JWT token management
- Secure password hashing
- Form validation with error handling
- Loading states and feedback
- Redirect logic after authentication

**Security Considerations**:
- Input sanitization
- CSRF protection
- Rate limiting for login attempts
- Password strength requirements`
      };

      const prompt = promptTemplates[tag.name] || `# ${tag.name} Implementation Prompt

**Context**: Implement ${tag.name.toLowerCase()} for ${project?.name || 'this application'}.

**Instructions**:
1. Analyze requirements for ${tag.name.toLowerCase()}
2. Plan component architecture
3. Implement core functionality
4. Add proper error handling
5. Ensure responsive design

**Technical Requirements**:
- React functional components
- TypeScript implementation
- Tailwind CSS styling
- Proper state management`;

      setGeneratedPrompt(prompt);
    } catch (error) {
      setGeneratedPrompt('Error generating prompt. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full px-6 py-6 border-b border-slate-200/60"
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <motion.button
            onClick={onClose}
            whileHover={{ scale: 1.05 }}
            className="flex items-center text-slate-600 hover:text-slate-800"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </motion.button>
          <div className="text-sm text-slate-500">Prompt Templates</div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Title */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-jersey text-4xl md:text-5xl text-black mb-4">
            Cursor Prompt Templates
          </h1>
          <p className="text-lg text-slate-600">
            Drag features to generate tailored Cursor prompts
          </p>
        </motion.div>

        {/* Available Tags */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-800">Available Features</h2>
            <motion.button
              onClick={() => setShowAddModal(true)}
              whileHover={{ scale: 1.05 }}
              className="w-8 h-8 bg-slate-800 text-white rounded-full flex items-center justify-center"
            >
              +
            </motion.button>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {availableTags.map((tag) => (
              <motion.div
                key={tag.id}
                draggable
                onDragStart={(e) => handleDragStart(e, tag)}
                whileHover={{ scale: 1.05 }}
                className={`px-4 py-2 rounded-full cursor-grab ${tag.color} border border-slate-200`}
              >
                {tag.name}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Drop Zone */}
        <motion.div
          ref={dropZoneRef}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className={`border-2 border-dashed rounded-2xl p-8 ${
            isDragOver ? 'border-blue-400 bg-blue-50' : 'border-slate-300 bg-slate-50'
          }`}
        >
          {!selectedTag && !isGenerating ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-6">🎯</div>
              <h3 className="text-2xl font-semibold text-slate-800 mb-4">
                Drop a feature here
              </h3>
              <p className="text-slate-600">
                Drag any feature tag to generate a custom Cursor prompt
              </p>
            </div>
          ) : isGenerating ? (
            <div className="text-center py-20">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-6"
              />
              <h3 className="text-2xl font-semibold text-slate-800 mb-4">
                Generating prompt for {selectedTag?.name}
              </h3>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-slate-800">
                  Generated Prompt for {selectedTag?.name}
                </h3>
                <div className="flex space-x-3">
                  <motion.button
                    onClick={() => navigator.clipboard.writeText(generatedPrompt)}
                    whileHover={{ scale: 1.05 }}
                    className="px-4 py-2 text-sm border border-slate-300 rounded-lg"
                  >
                    Copy
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="px-4 py-2 text-sm bg-slate-800 text-white rounded-lg"
                  >
                    Download
                  </motion.button>
                </div>
              </div>
              
              <div className="bg-white rounded-lg border border-slate-200 p-6 max-h-96 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm text-slate-700 font-mono">
                  {generatedPrompt}
                </pre>
              </div>
            </div>
          )}
        </motion.div>
      </main>

      {/* Add Feature Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 w-full max-w-md"
            >
              <h3 className="text-xl font-semibold mb-4">Add New Feature</h3>
              <input
                type="text"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                placeholder="Enter feature name..."
                className="w-full px-4 py-3 border border-slate-300 rounded-lg mb-4"
                autoFocus
              />
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-slate-600"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (newTagName.trim()) {
                      const colors = [
                        'bg-blue-100 text-blue-700',
                        'bg-green-100 text-green-700',
                        'bg-purple-100 text-purple-700',
                        'bg-orange-100 text-orange-700',
                      ];
                      const newTag = {
                        id: Date.now(),
                        name: newTagName.trim(),
                        color: colors[Math.floor(Math.random() * colors.length)]
                      };
                      setAvailableTags([...availableTags, newTag]);
                      setNewTagName('');
                      setShowAddModal(false);
                    }
                  }}
                  className="px-6 py-2 bg-slate-800 text-white rounded-lg"
                >
                  Add
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PromptTemplateGenerator; 