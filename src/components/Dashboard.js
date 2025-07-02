import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Folder, Calendar, ArrowRight, User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import DebugInfo from './DebugInfo';
import TestSupabaseButton from './TestSupabaseButton';

const Dashboard = ({ projects = [], loading = false, onNavigateToFeature, onNavigateToProject, onSetupDatabase }) => {
  const [currentTime, setCurrentTime] = useState('');
  const { user, profile, signOut, updateProfile } = useAuth();
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({ full_name: '', username: '' });

  const userName = profile?.full_name || user?.email?.split('@')[0] || 'Developer';

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hour = now.getHours();
      let greeting = 'Good morning';
      if (hour >= 12 && hour < 17) greeting = 'Good afternoon';
      else if (hour >= 17) greeting = 'Good evening';
      
      setCurrentTime(`${greeting}, ${userName}!`);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, [userName]);

  useEffect(() => {
    if (profile) {
      setProfileData({
        full_name: profile.full_name || '',
        username: profile.username || ''
      });
    }
  }, [profile]);

  const handleProfileUpdate = async () => {
    try {
      await updateProfile(profileData);
      setEditingProfile(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleCreateProject = () => {
    onNavigateToFeature && onNavigateToFeature('create-project');
  };

  const handleOpenProject = (project) => {
    onNavigateToProject && onNavigateToProject(project);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full px-6 py-6 fixed top-0 left-0 right-0 z-50 backdrop-blur-sm"
      >
        <div className="flex items-center justify-center">
          <div className="bg-gray-100/80 backdrop-blur-sm rounded-full px-6 py-3 flex items-center space-x-8 shadow-sm border border-white/20">
            <h1 className="text-xl font-bold text-black">Valyfy</h1>
            <nav className="flex items-center space-x-6">
              <div className="flex items-center space-x-3 px-4 py-2 bg-vibe-cyan/20 rounded-full">
                <div className="w-8 h-8 bg-vibe-cyan rounded-full flex items-center justify-center">
                  <span className="text-black font-semibold text-sm">
                    {userName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-black font-medium">{userName}</span>
                <button
                  onClick={() => setEditingProfile(true)}
                  className="text-black/60 hover:text-black transition-colors"
                >
                  <User className="w-4 h-4" />
                </button>
                <button
                  onClick={handleSignOut}
                  className="text-black/60 hover:text-black transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </nav>
          </div>
        </div>
      </motion.header>

      <main className="max-w-6xl mx-auto px-6 py-12 pt-32">
        {/* Welcome Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center py-16"
        >
          <h1 className="font-jersey text-4xl md:text-5xl lg:text-6xl text-black leading-tight mb-4">
            {currentTime}
          </h1>
          <p className="text-black/60 text-lg mb-8">
            Ready to build something amazing? ✨
          </p>
        </motion.div>

        {/* Profile Edit Modal */}
        {editingProfile && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
              <h3 className="text-xl font-semibold mb-4">Edit Profile</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <input
                    type="text"
                    value={profileData.full_name}
                    onChange={(e) => setProfileData(prev => ({ ...prev, full_name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vibe-cyan focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Username</label>
                  <input
                    type="text"
                    value={profileData.username}
                    onChange={(e) => setProfileData(prev => ({ ...prev, username: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vibe-cyan focus:border-transparent"
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setEditingProfile(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleProfileUpdate}
                    className="flex-1 px-4 py-2 bg-vibe-cyan text-black rounded-lg hover:shadow-lg"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Projects Grid */}
        {loading && projects.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-8 h-8 border-2 border-black/30 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-black/60">Loading your projects...</p>
            <p className="text-xs text-black/40 mt-2">This should only take a few seconds</p>
          </div>
        ) : projects.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-sm">
              <Folder className="w-12 h-12 text-black/40" />
            </div>
            <h3 className="text-2xl font-light text-black mb-4">
              Start your first project
            </h3>
            <p className="text-black/60 mb-8 max-w-md mx-auto">
              Create your first project to get started with generating amazing files
            </p>
            
            <div className="space-y-4">
              <motion.button
                whileHover={{ scale: 1.05, rotate: 1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCreateProject}
                className="bg-vibe-cyan text-black px-8 py-4 rounded-2xl font-semibold hover:shadow-lg transition-all duration-200 relative"
              >
                + Create Your First Project
                <span className="absolute -top-2 -right-2 text-xs">🚀</span>
              </motion.button>
              
              {onSetupDatabase && (
                <div className="text-center">
                  <p className="text-black/40 text-sm mb-3">
                    Want to enable real database storage?
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onSetupDatabase}
                    className="bg-slate-100 text-black px-6 py-2 rounded-xl text-sm hover:bg-slate-200 transition-colors"
                  >
                    🔧 Set Up Database
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <div className="space-y-8">
            {/* Create New Project Button */}
            <div className="text-center mb-8">
              <motion.button
                whileHover={{ y: -2, boxShadow: '0 10px 20px rgba(0,0,0,0.08)' }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCreateProject}
                className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 inline-flex items-center space-x-3"
              >
                <div className="w-12 h-12 bg-vibe-cyan rounded-xl flex items-center justify-center">
                  <Plus className="w-6 h-6 text-black" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-black">Create New Project</h3>
                  <p className="text-sm text-black/60">Start with your app idea</p>
                </div>
              </motion.button>
            </div>

            {/* Projects List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}
                  onClick={() => handleOpenProject(project)}
                  className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 shadow-sm cursor-pointer hover:shadow-md transition-all duration-300 group"
                >
                  {/* Project Preview */}
                  <div className="aspect-video bg-white border border-slate-200/80 rounded-xl mb-4 flex items-center justify-center relative overflow-hidden">
                    <div className="text-black/20">
                      <Folder className="w-12 h-12" />
                    </div>
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight className="w-4 h-4 text-vibe-cyan" />
                    </div>
                  </div>
                  
                  {/* Project Info */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-black/40 uppercase tracking-wider">
                        {project.type}
                      </span>
                      <span className="text-xs text-vibe-cyan font-medium">
                        {project.filesCount} files
                      </span>
                    </div>
                    
                    <h3 className="font-semibold text-black text-lg">{project.name}</h3>
                    
                    <p className="text-sm text-black/60 line-clamp-2 leading-relaxed">
                      {project.description}
                    </p>
                    
                    {/* Project Stats */}
                    <div className="flex items-center justify-between pt-2 text-xs text-black/40">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>Updated {project.lastModified}</span>
                      </div>
                      <span>Created {project.createdDate}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Padding */}
        <div className="h-32"></div>
      </main>
      
      {/* Debug Info - only shows in development */}
      <DebugInfo projects={projects} loading={loading} />
      <TestSupabaseButton />
    </div>
  );
};

export default Dashboard;