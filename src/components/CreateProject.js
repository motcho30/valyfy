import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, ArrowRight, Home } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { projectService } from '../services/projectService';

const CreateProject = ({ onClose, onProjectCreated }) => {
  const [projectName, setProjectName] = useState('');
  const [appIdea, setAppIdea] = useState('');
  const [projectType, setProjectType] = useState('Web App');
  const [isCreating, setIsCreating] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!projectName.trim() || !appIdea.trim() || !user) return;

    setIsCreating(true);
    
    try {
      const projectData = {
        name: projectName.trim(),
        description: appIdea.trim(),
        type: projectType
      };
      
      const newProject = await projectService.createProject(user.id, projectData);
      onProjectCreated(newProject);

    } catch (error) {
      console.error('Error creating project:', error);
      // Optional: Show an error message to the user
      setIsCreating(false);
    }
  };

  const projectTypes = [
    'Web App',
    'Mobile App'
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full px-6 py-6 fixed top-0 left-0 right-0 z-50 backdrop-blur-sm"
      >
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="bg-gray-100/80 backdrop-blur-sm rounded-full px-6 py-3 flex items-center space-x-4 shadow-sm border border-white/20">
            <h1 className="text-xl font-bold text-black">Valyfy</h1>
            <button
              onClick={onClose}
              className="text-black/60 hover:text-black transition-colors flex items-center space-x-2"
            >
              <Home className="w-4 h-4" />
              <span className="text-sm">Projects</span>
            </button>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="p-3 hover:bg-black/5 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-black/60" />
          </motion.button>
        </div>
      </motion.header>

      <main className="max-w-4xl mx-auto px-6 py-12 pt-32">
        {!isCreating ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center py-16"
          >
            <h1 className="font-jersey text-4xl md:text-5xl text-black leading-tight mb-4">
              Create new project
            </h1>
            <p className="text-black/60 text-lg mb-12">
              Start by describing your amazing app idea ✨
            </p>

            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              onSubmit={handleSubmit}
              className="bg-white/60 backdrop-blur-xl border border-black/10 rounded-2xl p-8 shadow-lg max-w-2xl mx-auto"
              style={{ 
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)'
              }}
            >
              <div className="space-y-6">
                {/* Project Name */}
                <div className="text-left">
                  <label htmlFor="projectName" className="block text-sm font-semibold text-black/60 uppercase tracking-wider mb-3">
                    Project Name
                  </label>
                  <input
                    type="text"
                    id="projectName"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="e.g., E-commerce Platform"
                    className="w-full px-4 py-4 border border-black/10 rounded-xl focus:ring-2 focus:ring-vibe-cyan focus:border-transparent text-lg bg-white/50 backdrop-blur-sm placeholder-black/40"
                    required
                  />
                </div>

                {/* Project Type */}
                <div className="text-left">
                  <label htmlFor="projectType" className="block text-sm font-semibold text-black/60 uppercase tracking-wider mb-3">
                    Project Type
                  </label>
                  <select
                    id="projectType"
                    value={projectType}
                    onChange={(e) => setProjectType(e.target.value)}
                    className="w-full px-4 py-4 border border-black/10 rounded-xl focus:ring-2 focus:ring-vibe-cyan focus:border-transparent text-lg bg-white/50 backdrop-blur-sm"
                  >
                    {projectTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                {/* App Idea */}
                <div className="text-left">
                  <label htmlFor="appIdea" className="block text-sm font-semibold text-black/60 uppercase tracking-wider mb-3">
                    Describe Your App Idea
                  </label>
                  <textarea
                    id="appIdea"
                    value={appIdea}
                    onChange={(e) => setAppIdea(e.target.value)}
                    placeholder="Describe your app idea in detail. What does it do? Who is it for? What are the main features? The more detail you provide, the better we can help you generate relevant files."
                    rows={6}
                    className="w-full px-4 py-4 border border-black/10 rounded-xl focus:ring-2 focus:ring-vibe-cyan focus:border-transparent resize-none bg-white/50 backdrop-blur-sm placeholder-black/40"
                    required
                  />
                  <p className="mt-3 text-sm text-black/50" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                    This will help us generate project-specific files! ✨
                  </p>
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-center space-x-4 pt-6">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onClose}
                    className="px-8 py-3 border border-black/10 rounded-xl font-medium text-black/70 hover:bg-black/5 transition-colors"
                  >
                    Cancel
                  </motion.button>
                  
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05, rotate: 1 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={!projectName.trim() || !appIdea.trim()}
                    className="px-8 py-3 bg-vibe-cyan text-black rounded-xl font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2 relative"
                  >
                    <span>Create Project</span>
                    <ArrowRight className="w-4 h-4" />
                    <span className="absolute -top-2 -right-2 text-xs">🚀</span>
                  </motion.button>
                </div>
              </div>
            </motion.form>
          </motion.div>
        ) : (
          /* Creating State */
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="flex justify-center mb-8">
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="w-20 h-20 border border-black/10 rounded-full"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 w-20 h-20 border-t border-vibe-cyan rounded-full"
                />
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-2 w-16 h-16 bg-white/60 backdrop-blur-xl rounded-full border border-black/5"
                  style={{ 
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)'
                  }}
                />
              </div>
            </div>
            
            <h2 className="text-2xl font-light text-black mb-4">
              Creating your project...
            </h2>
            <p className="text-black/60">
              Setting up your workspace and preparing tools ✨
            </p>

            <div className="mt-12 space-y-4 max-w-md mx-auto">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center text-sm text-black/60"
              >
                <div className="w-1.5 h-1.5 bg-vibe-cyan rounded-full mr-3"></div>
                Setting up project workspace
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 }}
                className="flex items-center text-sm text-black/60"
              >
                <div className="w-1.5 h-1.5 bg-vibe-cyan rounded-full mr-3"></div>
                Preparing generation tools
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.5 }}
                className="flex items-center text-sm text-black/60"
              >
                <div className="w-1.5 h-1.5 bg-black rounded-full mr-3"></div>
                Almost ready!
              </motion.div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default CreateProject; 