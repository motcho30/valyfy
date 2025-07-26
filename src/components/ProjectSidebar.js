import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Target, 
  Zap, 
  Bot, 
  Palette, 
  Lightbulb,
  FileText,
  Settings,
  Users,
  BarChart3,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const ProjectSidebar = ({ 
  project, 
  activeTab, 
  setActiveTab, 
  onClose 
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const sidebarItems = [
    { 
      id: 'overview', 
      name: 'Overview', 
      icon: Target, 
      description: 'Project files & resources',
      action: () => setActiveTab('overview') 
    },
    { 
      id: 'prompt-templates', 
      name: 'Prompt Templates', 
      icon: Zap, 
      description: 'AI prompts for development',
      action: () => setActiveTab('prompt-templates') 
    },
    { 
      id: 'product-manager', 
      name: 'Product Manager', 
      icon: Bot, 
      description: 'AI-powered project management',
      action: () => setActiveTab('product-manager') 
    },
    { 
      id: 'design-review', 
      name: 'Design Review', 
      icon: Palette, 
      description: 'UI/UX analysis & feedback',
      action: () => setActiveTab('design-review') 
    },
    { 
      id: 'cursor-tips', 
      name: 'Cursor Tips', 
      icon: Lightbulb, 
      description: 'Development best practices',
      action: () => setActiveTab('cursor-tips') 
    },
  ];

  return (
    <motion.div 
      initial={{ x: -300, opacity: 0 }} 
      animate={{ x: 0, opacity: 1 }} 
      transition={{ duration: 0.6, ease: "easeOut" }} 
      className={`bg-white border-r border-gray-100 shadow-sm flex flex-col h-screen transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-80'
      }`}
    >
      {/* Header Section */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <motion.button 
            onClick={onClose} 
            whileHover={{ scale: 1.02 }} 
            whileTap={{ scale: 0.98 }}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
            {!isCollapsed && <span className="font-medium ml-2">Back to Dashboard</span>}
          </motion.button>
          
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4 text-gray-600" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            )}
          </button>
        </div>
        
        {!isCollapsed && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <div>
              <h1 className="font-bold text-2xl text-gray-900 mb-2 leading-tight">
                {project.name}
              </h1>
              <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
                {project.description}
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1.5 bg-vibe-cyan/10 text-vibe-cyan rounded-full text-xs font-semibold border border-vibe-cyan/20">
                {project.type}
              </span>
              {project.framework && (
                <span className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
                  {project.framework}
                </span>
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* Navigation Section */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-2">
          {sidebarItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <motion.button 
                key={item.id} 
                onClick={item.action} 
                whileHover={{ scale: 1.01 }} 
                whileTap={{ scale: 0.99 }} 
                className={`w-full group relative rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-vibe-cyan text-white shadow-lg shadow-vibe-cyan/25' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
                title={isCollapsed ? item.name : undefined}
              >
                <div className={`flex items-center transition-all duration-200 ${
                  isCollapsed ? 'justify-center p-3' : 'p-4'
                }`}>
                  <div className={`flex-shrink-0 transition-all duration-200 ${
                    isActive 
                      ? 'text-white' 
                      : 'text-gray-400 group-hover:text-vibe-cyan'
                  }`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  {!isCollapsed && (
                    <div className="flex-1 text-left ml-3">
                      <div className={`font-semibold text-sm transition-colors duration-200 ${
                        isActive 
                          ? 'text-white' 
                          : 'text-gray-900 group-hover:text-gray-900'
                      }`}>
                        {item.name}
                      </div>
                      <div className={`text-xs transition-colors duration-200 ${
                        isActive 
                          ? 'text-white/80' 
                          : 'text-gray-500 group-hover:text-gray-600'
                      }`}>
                        {item.description}
                      </div>
                    </div>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </nav>

      {/* Footer Section */}
      <div className="p-4 border-t border-gray-100">
        {!isCollapsed ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-gray-50 rounded-xl p-4"
          >
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-vibe-cyan/10 rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-vibe-cyan" />
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900">Project Status</div>
                <div className="text-xs text-gray-500">Ready for development</div>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Last updated: {new Date().toLocaleDateString()}</span>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Active</span>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="flex justify-center">
            <div className="w-8 h-8 bg-vibe-cyan/10 rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-vibe-cyan" />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProjectSidebar; 