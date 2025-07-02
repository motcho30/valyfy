import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PRDSection from './PRDSection';
import CursorRulesSection from './CursorRulesSection';
import DesignSpec from './DesignSpec';

const ProjectDetail = ({ project, onClose, onGenerateFile, onDesignUpdate }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [fileContents, setFileContents] = useState({});
  const [loadingFiles, setLoadingFiles] = useState(false);

  // Load file content from Supabase when needed
  const loadFileContent = async (fileId, fileType) => {
    if (fileContents[fileId]) return fileContents[fileId];
    
    try {
      setLoadingFiles(true);
      
      // Check if this is a Supabase project
      const isSupabaseProject = !project.id.toString().startsWith('local-');
      
      if (isSupabaseProject) {
        const { db } = await import('../services/supabase');
        const { data: files } = await db.getProjectFiles(project.id);
        const file = files?.find(f => f.file_type === fileType);
        
        if (file?.content) {
          setFileContents(prev => ({ ...prev, [fileId]: file.content }));
          return file.content;
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error loading file content:', error);
      return null;
    } finally {
      setLoadingFiles(false);
    }
  };

  // Check for actual generated files from the project
  const generatedFiles = {
    prd: project.generatedFiles?.find(f => f.type === 'PRD Document')?.content || 
         fileContents[project.generatedFiles?.find(f => f.type === 'PRD Document')?.id] || null,
    cursorRules: project.generatedFiles?.find(f => f.type === 'Cursor Rules')?.content || 
                 fileContents[project.generatedFiles?.find(f => f.type === 'Cursor Rules')?.id] || null,
    features: project.generatedFiles?.find(f => f.type === 'Analysis Report')?.content || 
              fileContents[project.generatedFiles?.find(f => f.type === 'Analysis Report')?.id] || null,
    tutorial: project.generatedFiles?.find(f => f.type === 'Tutorial')?.content || 
              fileContents[project.generatedFiles?.find(f => f.type === 'Tutorial')?.id] || null,
  };
  
  // Load file contents on mount for Supabase projects
  useEffect(() => {
    const loadAllFileContents = async () => {
      if (!project.generatedFiles?.length) return;
      
      const isSupabaseProject = !project.id.toString().startsWith('local-');
      if (!isSupabaseProject) return;
      
      try {
        const { db } = await import('../services/supabase');
        const { data: files } = await db.getProjectFiles(project.id);
        
        if (files?.length) {
          const contents = {};
          files.forEach(file => {
            if (file.content) {
              contents[file.id] = file.content;
            }
          });
          setFileContents(contents);
        }
      } catch (error) {
        console.error('Error loading file contents:', error);
      }
    };
    
    loadAllFileContents();
  }, [project.id, project.generatedFiles]);

  const sidebarItems = [
    { id: 'overview', name: 'Overview', icon: 'target' },
    { id: 'design-spec', name: 'Design Spec', icon: 'palette' },
    { id: 'cursor-rules', name: 'Cursor Rules', icon: 'settings' },
    { id: 'prd', name: 'PRD Document', icon: 'file-text' },
    { id: 'prompt-templates', name: 'Prompt Templates', icon: 'zap' },
  ];

  // Handle PRD updates
  const handlePRDUpdate = (updatedContent) => {
    // For now, just log the update - in a full implementation, this would update the project data
    console.log('PRD updated:', updatedContent);
    // In a full implementation, you would call a parent function to update the project state
    // onUpdateProject({ ...project, generatedFiles: updatedFiles });
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <ProjectOverview project={project} generatedFiles={generatedFiles} />;
      case 'design-spec':
        return <DesignSpec project={project} onUpdate={onDesignUpdate} />;
      case 'cursor-rules':
        return (
          <div className="p-8">
            {loadingFiles ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
                <span className="ml-3 text-slate-600">Loading cursor rules content...</span>
              </div>
            ) : generatedFiles.cursorRules ? (
              <CursorRulesSection 
                content={generatedFiles.cursorRules}
                onDownload={() => console.log('Cursor rules downloaded')}
              />
            ) : (
              <EmptyState 
                title="Cursor Rules File"
                description="Generate a custom .cursorrules file for better AI context and coding consistency"
                icon="⚙️"
                onGenerate={async () => {
                  // Try to load content first for Supabase projects
                  const rulesFile = project.generatedFiles?.find(f => f.type === 'Cursor Rules');
                  if (rulesFile && !rulesFile.content) {
                    await loadFileContent(rulesFile.id, 'Cursor Rules');
                  } else {
                    onGenerateFile('cursor-rules', project);
                  }
                }}
              />
            )}
          </div>
        );
      case 'prd':
        return (
          <div className="p-8">
            {loadingFiles ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
                <span className="ml-3 text-slate-600">Loading PRD content...</span>
              </div>
            ) : generatedFiles.prd ? (
              <PRDSection 
                content={generatedFiles.prd}
                project={project}
                onDownload={() => console.log('PRD downloaded')}
                onUpdate={handlePRDUpdate}
              />
            ) : (
              <EmptyState 
                title="Product Requirements Document"
                description="Create comprehensive technical and business requirements for your project"
                icon="📋"
                onGenerate={async () => {
                  // Try to load content first for Supabase projects
                  const prdFile = project.generatedFiles?.find(f => f.type === 'PRD Document');
                  if (prdFile && !prdFile.content) {
                    await loadFileContent(prdFile.id, 'PRD Document');
                  } else {
                    onGenerateFile('prd-generator', project);
                  }
                }}
              />
            )}
          </div>
        );
      case 'prompt-templates':
        return (
          <ProjectPromptTemplates 
            project={project}
            availableFeatures={project.features || project.selectedFeatures || []}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-screen bg-slate-50 flex overflow-hidden">
      {/* Sidebar */}
      <motion.div
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-80 bg-white border-r border-slate-200 shadow-sm flex flex-col"
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-slate-200">
          <motion.button
            onClick={onClose}
            whileHover={{ scale: 1.02 }}
            className="flex items-center text-slate-600 hover:text-slate-800 transition-colors mb-4"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </motion.button>
          <h1 className="font-jersey text-2xl text-black mb-2">{project.name}</h1>
          <p className="text-sm text-slate-600 leading-relaxed">{project.description}</p>
          <div className="flex items-center space-x-2 mt-4">
            <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs">
              {project.type}
            </span>
            {project.framework && (
              <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs">
                {project.framework}
              </span>
            )}
          </div>
        </div>

        {/* Minimalistic Navigation */}
        <nav className="flex-1 p-6 overflow-y-auto">
          <div className="space-y-1">
            {sidebarItems.map((item) => {
              const getIcon = (iconName) => {
                const icons = {
                  'target': (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
                    </svg>
                  ),
                  'palette': (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c1.19 0 2-.86 2-2 0-.53-.2-1-.5-1.4-.3-.4-.5-.9-.5-1.4 0-1.1.9-2 2-2h2.5c3.04 0 5.5-2.46 5.5-5.5C23 6.48 18.52 2 12 2z"/>
                    </svg>
                  ),
                  'settings': (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 6v6m11-7h-6m-6 0H1"/>
                    </svg>
                  ),
                  'file-text': (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10,9 9,9 8,9"/>
                    </svg>
                  ),
                  'zap': (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                    </svg>
                  )
                };
                return icons[iconName] || icons['target'];
              };
              
              return (
                <motion.button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                    activeTab === item.id
                      ? 'bg-black text-white'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex-shrink-0">
                    {getIcon(item.icon)}
                  </div>
                  <span className="font-medium text-sm">{item.name}</span>
                </motion.button>
              );
            })}
          </div>
        </nav>

        {/* Project Stats */}
        <div className="p-4 border-t border-slate-200">
          <div className="bg-slate-50 rounded-xl p-4">
            <h4 className="text-sm font-semibold text-slate-800 mb-2">Project Stats</h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-600">Files Generated</span>
                <span className="font-medium">{project.filesCount || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Created</span>
                <span className="font-medium">{project.createdDate || new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="h-full"
        >
          {renderTabContent()}
        </motion.div>
      </div>
    </div>
  );
};

// Project Overview Component
const ProjectOverview = ({ project, generatedFiles }) => {
  const tools = [
    {
      name: 'Design Specifications',
      description: 'Visual design system with colors, typography, spacing, and component styles from your selected theme',
      status: 'Available',
      hasContent: true,
      category: 'DESIGN TOOL'
    },
    {
      name: 'Product Requirements',
      description: 'Generate comprehensive PRDs with visual breakdowns and editable sections for startup planning',
      status: generatedFiles.prd ? 'Generated' : 'Not Generated',
      hasContent: !!generatedFiles.prd,
      category: 'PLANNING TOOL'
    },
    {
      name: 'Cursor Rules',
      description: 'Create custom .cursorrules files for better AI context and coding consistency across your project',
      status: generatedFiles.cursorRules ? 'Generated' : 'Not Generated', 
      hasContent: !!generatedFiles.cursorRules,
      category: 'DEV TOOL'
    },
    {
      name: 'Prompt Templates',
      description: 'Build context-aware Cursor prompts using your project features with drag-and-drop interface',
      status: 'Available',
      hasContent: true,
      category: 'AI TOOL'
    },
  ];
  
  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-2xl font-semibold text-slate-900 mb-2">Development Tools</h1>
          <p className="text-slate-600">
            Generate and manage essential development resources for your project
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tools.map((tool, index) => (
            <motion.div
              key={tool.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200 group cursor-pointer"
            >
              {/* Tool Preview/Icon Area */}
              <div className="bg-slate-50 rounded-lg p-4 mb-4 h-24 flex items-center justify-center border border-slate-100">
                <div className="text-center">
                  <div className="w-8 h-8 bg-slate-200 rounded-lg mx-auto mb-2 flex items-center justify-center">
                    <div className="w-4 h-4 bg-slate-400 rounded"></div>
                  </div>
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                    {tool.category}
                  </span>
                </div>
              </div>

              {/* Tool Info */}
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-base font-semibold text-slate-900">{tool.name}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      tool.hasContent 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {tool.status}
                    </span>
                  </div>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    {tool.description}
                  </p>
                </div>

                {/* Action Button */}
                <div className="flex items-center text-slate-400 group-hover:text-slate-600 transition-colors">
                  <span className="text-xs font-medium mr-1">
                    {tool.hasContent ? 'View & Edit' : 'Generate'}
                  </span>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Empty State Component
const EmptyState = ({ title, description, icon, onGenerate }) => (
  <div className="max-w-2xl mx-auto text-center py-20">
    <div className="text-6xl mb-6">{icon}</div>
    <h3 className="text-2xl font-semibold text-slate-800 mb-4">{title}</h3>
    <p className="text-slate-600 mb-8">{description}</p>
    <motion.button
      onClick={onGenerate}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="bg-slate-800 text-white px-8 py-3 rounded-xl font-semibold hover:bg-slate-700 transition-all duration-200"
    >
      Generate Now
    </motion.button>
  </div>
);

// Project-specific Prompt Templates Component
const ProjectPromptTemplates = ({ project, availableFeatures }) => {
  const [selectedTag, setSelectedTag] = useState(null);
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [draggedTag, setDraggedTag] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const savePrompt = () => {
    // Here you would implement the logic to save the prompt
    // For now, we'll just show a console message
    console.log('Saving prompt:', {
      feature: selectedTag,
      prompt: generatedPrompt
    });
  };

  const handleDragStart = (e, tag) => {
    setDraggedTag(tag);
    e.dataTransfer.setData('text/plain', '');
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
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

  const generatePrompt = async (feature) => {
    setIsGenerating(true);
    setGeneratedPrompt('');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const prompt = `# ${feature} Implementation Prompt for ${project.name}

**Project Context**: ${project.description}

**Feature**: ${feature}

**Instructions**:
1. Implement ${feature.toLowerCase()} functionality
2. Follow ${project.type} best practices
3. Ensure consistency with existing codebase
4. Add proper error handling and validation
5. Include responsive design for all screen sizes

**Technical Requirements**:
- Framework: ${project.framework || 'React'}
- Styling: Tailwind CSS
- State Management: React hooks
- TypeScript for type safety
- Performance optimization

**${project.name} Specific Guidelines**:
- Maintain the existing design system
- Follow established naming conventions
- Integrate with current data flow
- Ensure accessibility compliance

**Implementation Steps**:
1. Create component structure
2. Set up state management
3. Implement core functionality
4. Add styling and animations
5. Write unit tests
6. Update documentation

**Code Quality Standards**:
- Clean, readable code
- Proper TypeScript types
- Comprehensive error handling
- Performance considerations
- Mobile-first responsive design`;

      setGeneratedPrompt(prompt);
    } catch (error) {
      setGeneratedPrompt('Error generating prompt. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Prompt Templates</h2>
          <p className="text-lg text-slate-600">
            Generate custom Cursor prompts using your project's features
          </p>
        </motion.div>
        
        {/* Project Features */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Project Features</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {availableFeatures.map((feature, index) => (
              <motion.div
                key={feature}
                draggable
                onDragStart={(e) => handleDragStart(e, feature)}
                whileHover={{ scale: 1.05 }}
                className="px-4 py-3 rounded-lg cursor-grab transition-all bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 shadow-sm"
              >
                <div className="text-sm font-medium truncate">{feature}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Drop Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-8 ${
            isDragOver ? 'border-blue-400 bg-blue-50' : 'border-slate-300 bg-white'
          }`}
        >
          {!selectedTag && !isGenerating ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-6">🎯</div>
              <h3 className="text-2xl font-semibold text-slate-800 mb-4">
                Drop a feature here
              </h3>
              <p className="text-slate-600">
                Drag any project feature to generate a tailored Cursor prompt
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
                Generating prompt for {selectedTag}
              </h3>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-slate-800">
                  Generated Prompt: {selectedTag}
                </h3>
                <div className="flex space-x-3">
                  <motion.button
                    onClick={savePrompt}
                    whileHover={{ scale: 1.02 }}
                    className="px-6 py-2 text-sm bg-black text-white rounded-lg hover:bg-slate-800 transition-all"
                  >
                    Save Prompt
                  </motion.button>
                  <motion.button
                    onClick={() => navigator.clipboard.writeText(generatedPrompt)}
                    whileHover={{ scale: 1.02 }}
                    className="px-6 py-2 text-sm border-2 border-slate-200 text-slate-700 rounded-lg hover:border-slate-300 transition-all"
                  >
                    Copy
                  </motion.button>
                  <motion.button
                    onClick={() => {
                      const blob = new Blob([generatedPrompt], { type: 'text/plain' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `${selectedTag.toLowerCase().replace(/\s+/g, '-')}-prompt.md`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    whileHover={{ scale: 1.02 }}
                    className="px-6 py-2 text-sm border-2 border-slate-200 text-slate-700 rounded-lg hover:border-slate-300 transition-all"
                  >
                    Download
                  </motion.button>
                </div>
              </div>
              
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-6 max-h-96 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm text-slate-700 font-mono leading-relaxed">
                  {generatedPrompt}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail; 