import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PRDSection from './PRDSection';
import DesignSpec from './DesignSpec';
import FilesGuidance from './FilesGuidance';
import DesignReview from './DesignReview';
import ProductManagerTab from './ProductManagerTab';
import { generatePromptForFeature } from '../services/promptGeneratorService';
import { useProjectFiles } from '../hooks/useProjectFiles';
import { Check, Copy, Zap, History, GripVertical, Palette, ArrowRight, Plus, Bot } from 'lucide-react';
import CursorTips from './CursorTips';

const AddFeatureModal = ({ isOpen, onClose, newFeatureName, setNewFeatureName, onAddFeature }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-8 shadow-xl w-full max-w-md"
        onClick={e => e.stopPropagation()}
      >
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Add new feature</h3>
        <p className="text-sm text-gray-600 mb-6">
          Insert a feature, page, or development stage to generate a prompt for.
        </p>
        <input
          type="text"
          value={newFeatureName}
          onChange={(e) => setNewFeatureName(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && onAddFeature()}
          placeholder="e.g. User Authentication"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
          autoFocus
        />
        <div className="flex justify-end space-x-3 mt-6">
          <button onClick={onClose} className="px-5 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition font-medium">
            Cancel
          </button>
          <button onClick={onAddFeature} className="px-5 py-2 text-white bg-gray-800 rounded-lg hover:bg-black transition font-semibold">
            Add & Generate
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const ProjectDetail = ({ project, onClose, onGenerateFile, onDesignUpdate, onNavigateToFeature, showGuidanceOnLoad = false }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [fileContents, setFileContents] = useState({});
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(showGuidanceOnLoad);

  const loadFileContent = async (fileId, fileType) => {
    if (fileContents[fileId]) return fileContents[fileId];
    
    try {
      setLoadingFiles(true);
      
      const isSupabaseProject = !project.id.toString().startsWith('local-');
      
      if (isSupabaseProject) {
        const { db } = await import('../services/supabase');
        const { data: files } = await db.getProjectFiles(project.id);
        const file = files?.find(f => f.file_type === fileType);
        
        if (file?.file_content) {
          setFileContents(prev => ({ ...prev, [fileId]: file.file_content }));
          return file.file_content;
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

  const generatedFiles = {
    prd: project.generatedFiles?.find(f => f.type === 'PRD Document')?.content || 
         fileContents[project.generatedFiles?.find(f => f.type === 'PRD Document')?.id] || null,
    features: project.generatedFiles?.find(f => f.type === 'Analysis Report')?.content || 
              fileContents[project.generatedFiles?.find(f => f.type === 'Analysis Report')?.id] || null,
    tutorial: project.generatedFiles?.find(f => f.type === 'Tutorial')?.content || 
              fileContents[project.generatedFiles?.find(f => f.type === 'Tutorial')?.id] || null,
  };
  
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
            if (file.file_content) {
              contents[file.id] = file.file_content;
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
    { id: 'overview', name: 'Overview', icon: 'target', action: () => setActiveTab('overview') },
    { id: 'prompt-templates', name: 'Prompt Templates', icon: 'zap', action: () => setActiveTab('prompt-templates') },
    { id: 'product-manager', name: 'Product Manager', icon: 'bot', action: () => setActiveTab('product-manager') },
    { id: 'design-review', name: 'Design Review', icon: 'palette', action: () => setActiveTab('design-review') },
    { id: 'cursor-tips', name: 'Cursor Tips', icon: 'lightbulb', action: () => setActiveTab('cursor-tips') },
  ];

  const handlePRDUpdate = (updatedContent) => {
    console.log('PRD updated:', updatedContent);
  };

  const openModal = (modalType) => {
    setActiveModal(modalType);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <ProjectOverview project={project} generatedFiles={generatedFiles} setActiveTab={setActiveTab} onOpenModal={openModal} onGenerateFile={onGenerateFile} loadFileContent={loadFileContent} onShowOnboarding={() => setShowOnboarding(true)} />;
      case 'prompt-templates':
        return <ProjectPromptTemplates project={project} availableFeatures={project.features || project.selectedFeatures || []} />;
      case 'design-review':
        return <DesignReview project={project} />;
      case 'product-manager':
        return <ProductManagerTab project={project} />;
      case 'cursor-tips':
        return <CursorTips />;
      default:
        return null;
    }
  };

  const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-2xl max-w-6xl max-h-[90vh] overflow-hidden shadow-xl" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
          </div>
          <div className="overflow-y-auto max-h-[calc(90vh-80px)]">{children}</div>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div className="h-screen bg-white flex overflow-hidden">
      <motion.div initial={{ x: -300, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.6 }} className="w-80 bg-white border-r border-slate-200 shadow-sm flex flex-col">
        <div className="p-6 border-b border-slate-200">
          <motion.button onClick={onClose} whileHover={{ scale: 1.02 }} className="flex items-center text-slate-600 hover:text-slate-800 transition-colors mb-4">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Back to Dashboard
          </motion.button>
          <h1 className="font-jersey text-2xl text-black mb-2">{project.name}</h1>
          <p className="text-sm text-slate-600 leading-relaxed">{project.description}</p>
          <div className="flex items-center space-x-2 mt-4">
            <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs">{project.type}</span>
            {project.framework && (<span className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs">{project.framework}</span>)}
          </div>
        </div>
        <nav className="flex-1 p-6 overflow-y-auto">
          <div className="space-y-1">
            {sidebarItems.map((item) => {
              const getIcon = (iconName) => {
                const icons = {
                  'play-circle': (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polygon points="10,8 16,12 10,16"/></svg>),
                  'target': (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>),
                  'zap': (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>),
                  'palette': (<Palette className="w-5 h-5" />),
                  'bot': (<Bot className="w-5 h-5" />),
                  'lightbulb': (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014.846 17H9.154a3.374 3.374 0 00-1.849-1.007L6.757 15.34z" /></svg>)
                };
                return icons[iconName] || icons['target'];
              };
              
              return (
                <motion.button key={item.id} onClick={item.action} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${activeTab === item.id ? 'bg-black text-white' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
                  <div className="flex-shrink-0">{getIcon(item.icon)}</div>
                  <span className="font-medium text-sm">{item.name}</span>
                </motion.button>
              );
            })}
          </div>
        </nav>

      </motion.div>
      <div className="flex-1 overflow-y-auto">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="h-full">
          {renderTabContent()}
        </motion.div>
      </div>
      <Modal isOpen={activeModal === 'design-spec'} onClose={closeModal} title="Design Specifications"><DesignSpec project={project} onUpdate={onDesignUpdate} /></Modal>
      <Modal isOpen={activeModal === 'prd'} onClose={closeModal} title="Product Requirements Document">
        <div className="p-8">
          {loadingFiles ? <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div><span className="ml-3 text-slate-600">Loading PRD content...</span></div> : generatedFiles.prd ? <PRDSection content={generatedFiles.prd} project={project} onDownload={() => console.log('PRD downloaded')} onUpdate={handlePRDUpdate} /> : <EmptyState title="Product Requirements Document" description="Create comprehensive technical and business requirements for your project" icon="📋" onGenerate={async () => { const prdFile = project.generatedFiles?.find(f => f.type === 'PRD Document'); if (prdFile && !prdFile.content) { await loadFileContent(prdFile.id, 'PRD Document'); } else { onGenerateFile('prd-generator', project); } closeModal(); }} />}
        </div>
      </Modal>
      
      {/* Onboarding Overlay */}
      {showOnboarding && (
        <div className="fixed inset-0 z-50">
          <FilesGuidance
            project={project}
            onClose={() => setShowOnboarding(false)}
            onComplete={() => {
              setShowOnboarding(false);
              setActiveTab('overview');
            }}
          />
        </div>
      )}
    </div>
  );
};

const ProjectOverview = ({ project, generatedFiles, setActiveTab, onOpenModal, onGenerateFile, loadFileContent, onShowOnboarding }) => {
  const getDesignData = () => {
    // First check if we have a complete selectedDesign object
    if (project?.selectedDesign && typeof project.selectedDesign === 'object') {
      // For custom designs, use the selectedDesign directly
      if (project.selectedDesign.isCustom) {
        return {
          ...project.selectedDesign,
          // Ensure we have colors from the analysis
          colors: project.selectedDesign.analysis?.colors || project.selectedDesign.colors || {},
          // Use the analysis data for other properties
          typography: project.selectedDesign.analysis?.typography || { primary: 'Inter', body: { size: '16px', weight: '400', lineHeight: '1.7' } },
          components: project.selectedDesign.analysis?.components || { borderRadius: '8px', shadows: 'subtle layered shadows' }
        };
      }
      // For standard designs with colors object
      if (project.selectedDesign.colors && Object.keys(project.selectedDesign.colors).length > 0) {
        return project.selectedDesign;
      }
    }
    
    // Fallback to predefined designs
    const designs = {
      'minimalistic': {
        id: 'minimalistic', 
        name: 'Minimalistic/Modern', 
        description: 'Clean, uncluttered, content-focused', 
        colors: {
          background: { hex: '#F9FAFB', name: 'Background' }, 
          foreground: { hex: '#FFFFFF', name: 'Foreground' }, 
          accent: { hex: '#10B981', name: 'Primary Accent' }, 
          primaryText: { hex: '#111827', name: 'Primary Text' }
        }, 
        typography: { primary: 'Inter', body: { size: '16px', weight: '400', lineHeight: '1.7' } }, 
        components: { borderRadius: '8px', shadows: 'subtle layered shadows' }
      }, 
      'tech-dark': {
        id: 'tech-dark', 
        name: 'Tech Dark Mode', 
        description: 'Premium dark-mode tech aesthetic', 
        colors: {
          background: { hex: '#000000', name: 'Background' }, 
          surface: { hex: '#111116', name: 'Surface' }, 
          accent: { hex: '#5865F2', name: 'Electric Blue' }, 
          primaryText: { hex: '#FFFFFF', name: 'Text Primary' }
        }, 
        typography: { primary: 'Space Grotesk', body: { size: '16px', weight: '400', lineHeight: '1.7' } }, 
        components: { borderRadius: '12px', shadows: 'glow effects and blur' }
      }
    };
    
    const designId = project?.designId || 'minimalistic';
    return designs[designId] || designs['minimalistic'];
  };
  const designData = getDesignData();

  const parsePRDForOverview = (prdContent) => {
    if (!prdContent) return null;
    const sections = {};
    const lines = prdContent.split('\n');
    let currentSectionKey = '';
    
    const sectionMapping = {
      'problem statement': 'problemStatement',
      'solution': 'solution',
      'target audience': 'targetAudience',
      'user flow': 'userFlow',
    };

    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed.startsWith('## ')) {
        const headerText = trimmed.replace(/^##\s*/, '').toLowerCase();
        const foundKey = Object.keys(sectionMapping).find(key => headerText.includes(key));
        if (foundKey) {
          currentSectionKey = sectionMapping[foundKey];
          sections[currentSectionKey] = '';
        } else {
          currentSectionKey = '';
        }
      } else if (currentSectionKey && trimmed) {
        sections[currentSectionKey] += line + '\n';
        }
    });

    Object.keys(sections).forEach(key => {
      const content = sections[key];
      if (content) {
        const firstParagraph = content.split('\n\n')[0];
        sections[key] = firstParagraph.replace(/^[*-]\s*/gm, '').trim();
    }
    });

    return sections;
  };

  const parsedPRD = parsePRDForOverview(generatedFiles.prd);

  const storedPrompts = React.useMemo(() => {
    if (!project?.id) return [];
    try {
      return JSON.parse(localStorage.getItem(`prompts_${project.id}`) || '[]');
    } catch { return []; }
  }, [project?.id]);

  return (
    <div className="w-full bg-white p-6 md:p-10 space-y-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-gray-900">Project Overview</h1>
        <p className="text-gray-500">Quick snapshot of your design system, requirements and prompts.</p>
      </div>
      
      {/* Setup Guide Section */}
      <div className="bg-gradient-to-r from-vibe-cyan/10 to-green-100 border border-vibe-cyan/20 rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              🚀 Set up your Cursor foundation
            </h3>
            <p className="text-gray-600 text-sm">
              Get step-by-step guidance on setting up your project files with Cursor AI
            </p>
          </div>
          <button
            onClick={onShowOnboarding}
            className="px-6 py-3 bg-vibe-cyan text-black rounded-xl font-semibold hover:shadow-lg transition-all flex items-center space-x-2"
          >
            <span>Setup Guide</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-colors group">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Design Specifications</h3>
            <button onClick={() => onOpenModal('design-spec')} className="px-3 py-1 text-xs font-semibold bg-gray-100 border border-gray-200 text-gray-700 rounded-md hover:bg-gray-200 transition">View</button>
          </div>
          <div className="space-y-3 text-sm">
            <div className="text-xs uppercase tracking-wide text-gray-500">Theme</div>
            <div className="font-medium text-gray-800">{designData.name}</div>
            <div className="text-xs uppercase tracking-wide text-gray-500">Description</div>
            <p className="text-gray-600 leading-relaxed">{designData.description}</p>
            <div className="text-xs uppercase tracking-wide text-gray-500">Colors</div>
            <div className="flex space-x-3">
              {Object.entries(designData.colors).slice(0,4).map(([key, color]) => (
                <div key={key} className="flex flex-col items-center space-y-1">
                  <span className="w-6 h-6 rounded-full border" style={{background: color.hex}} />
                  <span className="text-[10px] text-gray-500">{color.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-colors group">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Product Requirements</h3>
            <button onClick={() => onOpenModal('prd')} className="px-3 py-1 text-xs font-semibold bg-gray-100 border border-gray-200 text-gray-700 rounded-md hover:bg-gray-200 transition">View</button>
          </div>
          {generatedFiles.prd && parsedPRD ? (
            <VisualPRDCard parsedPRD={parsedPRD} />
          ) : (
            <div className="space-y-3 text-sm">
              <p className="text-gray-400 text-sm">PRD not generated yet.</p>
              <button 
                onClick={async () => { const prdFile = project.generatedFiles?.find(f => f.type === 'PRD Document'); if (prdFile && !prdFile.content) { await loadFileContent(prdFile.id, 'PRD Document'); } else { onGenerateFile('prd-generator', project); }}}
                className="text-xs text-vibe-cyan hover:underline"
              >
                Generate PRD
              </button>
            </div>
          )}
        </div>
        <div className="border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-colors group">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Prompt Templates</h3>
            <button onClick={() => setActiveTab('prompt-templates')} className="px-3 py-1 text-xs font-semibold bg-gray-100 border border-gray-200 text-gray-700 rounded-md hover:bg-gray-200 transition">View</button>
          </div>
          <div className="space-y-3 text-sm">
            {storedPrompts.length > 0 ? (
              <div className="space-y-2 pt-2">
                <div className="text-xs text-gray-500 mb-2">Recent Saved Prompts</div>
                {storedPrompts.slice(-3).map((p)=> (
                  <div key={p.id} className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 mt-1.5"></div>
                    <div className="text-xs text-gray-700 line-clamp-2">
                      <span className="font-medium mr-1">{p.feature}</span>
                      <span className="text-gray-500">• {new Date(p.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {(project.features || project.selectedFeatures || []).slice(0,3).map((f,idx) => (
                  <span key={idx} className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs">{f}</span>
                ))}
                {(project.features || project.selectedFeatures || []).length > 3 && (
                  <span className="px-2 py-0.5 border border-gray-300 rounded-full text-xs text-gray-500">+{(project.features || project.selectedFeatures || []).length-3}</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const VisualPRDCard = ({ parsedPRD }) => {
  const sections = [
    { key: 'problemStatement', title: 'Problem', icon: 'AlertTriangle' },
    { key: 'solution', title: 'Solution', icon: 'CheckCircle' },
    { key: 'targetAudience', title: 'Audience', icon: 'Users' },
    { key: 'userFlow', title: 'User Flow', icon: 'GitMerge' },
  ];

  const getIcon = (iconName) => {
    const icons = {
      AlertTriangle: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
      CheckCircle: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
      Users: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.124-1.28-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.124-1.28.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
      GitMerge: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 15l3-3m0 0l-3-3m3 3H9a3 3 0 00-3 3v1m0 0v1a3 3 0 003 3h3m-3-3h3m0 0a3 3 0 003-3V9m-6 9v-1m0 0v-1a3 3 0 013-3h3m-6 0h.01" /></svg>,
    };
    return <div className="text-slate-500">{icons[iconName]}</div>;
  };
  
  return (
    <div className="grid grid-cols-2 gap-4">
      {sections.map(({ key, title, icon }) => (
        parsedPRD[key] && (
          <div key={key} className="bg-slate-50 p-3 rounded-lg border border-slate-200/60">
            <div className="flex items-center space-x-2 mb-1">
              {getIcon(icon)}
              <h4 className="text-sm font-semibold text-slate-700">{title}</h4>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed truncate">{parsedPRD[key].split('\n')[0]}</p>
          </div>
        )
      ))}
    </div>
  );
};

const Card = ({ title, onOpen, onGenerate, content, children }) => (
  <motion.div whileHover={{ scale: 1.01 }} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
    <div className="flex items-center justify-between p-4 border-b border-slate-200/80">
      <h3 className="font-semibold text-slate-800">{title}</h3>
      <div className="flex items-center space-x-2">
        <button onClick={onOpen} className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">View</button>
      </div>
    </div>
    <div className="p-6">
      {content !== null ? (
        children
      ) : (
        <div className="text-center py-8">
          <p className="text-slate-500 mb-4">This document hasn't been generated yet.</p>
          <button onClick={onGenerate} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold">Generate Now</button>
        </div>
      )}
    </div>
  </motion.div>
);

const EmptyState = ({ title, description, icon, onGenerate }) => (
  <div className="text-center py-20">
    <div className="text-6xl mb-6">{icon}</div><h3 className="text-2xl font-semibold text-slate-800 mb-4">{title}</h3><p className="text-slate-600 mb-8">{description}</p><motion.button onClick={onGenerate} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-slate-800 text-white px-8 py-3 rounded-xl font-semibold hover:bg-slate-700 transition-all duration-200">Generate Now</motion.button>
  </div>
);

const ProjectPromptTemplates = ({ project, availableFeatures }) => {
  const { saveGeneratedFile, getProjectFiles, loading: filesLoading } = useProjectFiles();
  const [features, setFeatures] = useState(availableFeatures);
  const [isAddFeatureModalOpen, setAddFeatureModalOpen] = useState(false);
  const [newFeatureName, setNewFeatureName] = useState('');
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [savedPrompts, setSavedPrompts] = useState([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isApiAvailable, setIsApiAvailable] = useState(true);
  const [showCopySuccess, setShowCopySuccess] = useState(false);
  const [draggedFeature, setDraggedFeature] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const dropZoneRef = React.useRef(null);
  const [showSavedPrompts, setShowSavedPrompts] = useState(false);
  const savedPromptsRef = React.useRef(null);

  useEffect(() => {
    setFeatures(availableFeatures);
  }, [availableFeatures]);
  
  React.useEffect(() => {
    function handleClickOutside(event) {
      if (savedPromptsRef.current && !savedPromptsRef.current.contains(event.target)) setShowSavedPrompts(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [savedPromptsRef]);

  useEffect(() => {
    if (!project?.id || project.id.toString().startsWith('local-')) return;
    const fetchPrompts = async () => {
      try {
        const files = await getProjectFiles(project.id);
        const promptFiles = files.filter(f => f.type === 'Prompt Template').map(f => ({id: f.id, feature: f.metadata?.feature || f.name.replace('-prompt.md', '').replace(/-/g, ' '), content: f.content, createdAt: f.createdAt})).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setSavedPrompts(promptFiles);
      } catch (error) {
        console.error("Failed to fetch prompts from database", error);
    setSavedPrompts([]);
    }
    };
    fetchPrompts();
    setIsApiAvailable(!!process.env.REACT_APP_OPENAI_API_KEY);
  }, [project?.id]);

  const handleDragStart = (e, feature) => {
    setDraggedFeature(feature);
    e.dataTransfer.setData('text/plain', '');
  };

  const handleDragOver = (e) => { e.preventDefault(); setIsDragOver(true); };
  const handleDragLeave = (e) => { if (!dropZoneRef.current?.contains(e.relatedTarget)) setIsDragOver(false); };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (draggedFeature) {
      generatePrompt(draggedFeature);
      setDraggedFeature(null);
    }
  };
    
  const handleSavedPromptClick = (prompt) => {
    setSelectedFeature(prompt.feature);
    setGeneratedPrompt(prompt.content);
  };

  const savePrompt = async () => {
    if (!selectedFeature || !generatedPrompt || !project?.id || project.id.toString().startsWith('local-')) return;
    try {
      const newFile = await saveGeneratedFile(project.id, { fileName: `${selectedFeature.replace(/\s+/g, '-')}-prompt.md`, fileType: 'Prompt Template', content: generatedPrompt, metadata: { feature: selectedFeature } });
      const newPrompt = { id: newFile.id, feature: selectedFeature, content: generatedPrompt, createdAt: newFile.createdAt };
      setSavedPrompts(prev => [newPrompt, ...prev]);
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 2000);
    } catch (error) {
      console.error("Failed to save prompt:", error);
      alert("There was an error saving your prompt. Please try again.");
    }
  };

  const generatePrompt = async (feature) => {
    setSelectedFeature(feature);
    setIsGenerating(true);
    setGeneratedPrompt('');
    try {
      const context = { name: project.name, type: project.type, description: project.description, framework: project.framework, features: features };
      const prompt = await generatePromptForFeature(feature, context);
      setGeneratedPrompt(prompt);
    } catch (error) {
      console.error('Error generating prompt:', error);
      setGeneratedPrompt(`Error: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFeatureClick = (feature) => generatePrompt(feature);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedPrompt);
      setShowCopySuccess(true);
      setTimeout(() => setShowCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy!', err);
    }
  };

  const handleAddFeature = () => {
    if (newFeatureName.trim()) {
      const newFeature = newFeatureName.trim();
      if (!features.includes(newFeature)) {
        setFeatures(prev => [...prev, newFeature]);
      }
      generatePrompt(newFeature);
      setNewFeatureName('');
      setAddFeatureModalOpen(false);
    }
  };

  if (!isApiAvailable) return <div>Your OpenAI API key is not configured. Please set it up to use this feature.</div>;

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-white">
      <AddFeatureModal 
        isOpen={isAddFeatureModalOpen}
        onClose={() => setAddFeatureModalOpen(false)}
        newFeatureName={newFeatureName}
        setNewFeatureName={setNewFeatureName}
        onAddFeature={handleAddFeature}
      />
      <div className="flex justify-between items-start mb-8">
        <div><h2 className="text-2xl font-bold text-gray-900">Prompt Generator</h2><p className="text-gray-500 mt-1">Select or drag a feature to generate a detailed prompt.</p></div>
        <div className="relative" ref={savedPromptsRef}>
          <button onClick={() => setShowSavedPrompts(!showSavedPrompts)} className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"><History className="w-4 h-4" /><span>History</span></button>
          {showSavedPrompts && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-10">
              <div className="p-3 border-b"><h4 className="font-semibold">Saved Prompts</h4></div>
              <div className="p-2 max-h-96 overflow-y-auto">{savedPrompts.length > 0 ? savedPrompts.map((prompt) => (<button key={prompt.id} onClick={() => { handleSavedPromptClick(prompt); setShowSavedPrompts(false); }} className="w-full text-left p-2 rounded-md hover:bg-gray-100"><div className="font-medium text-sm">{prompt.feature}</div><p className="text-xs text-gray-500 truncate">{prompt.content}</p></button>)) : <div className="p-4 text-center text-sm text-gray-500">No saved prompts yet.</div>}</div>
             </motion.div>
           )}
         </div>
            </div>
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Available Features</h3>
          <button onClick={() => setAddFeatureModalOpen(true)} className="flex items-center space-x-1.5 px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
            <Plus className="w-4 h-4" />
            <span>Add Feature</span>
          </button>
        </div>
        <div className="flex flex-wrap gap-3">
              {features.map((feature, index) => (
            <motion.div key={index} draggable onDragStart={(e) => handleDragStart(e, feature)} onClick={() => handleFeatureClick(feature)} whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} title="Click or drag to generate" className={`flex items-center space-x-2 px-4 py-2 rounded-full cursor-grab transition-all ${selectedFeature === feature ? 'bg-gray-800 text-white' : 'bg-white border border-gray-200'}`}>
              <GripVertical className="w-4 h-4 text-gray-400" /><span className="font-medium">{feature}</span>
            </motion.div>
                  ))}
                </div>
              </div>
      <div
        ref={dropZoneRef}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative rounded-xl border-2 border-dashed p-6 transition-all duration-300 flex flex-col ${
          isDragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50/50'
        }`}
        style={{ minHeight: '400px' }}
      >
        {isGenerating ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                 <motion.div
                   animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-10 h-10 border-2 border-gray-400 border-t-gray-800 rounded-full mb-4"
                 />
            <p className="text-gray-600">Generating prompt for "{selectedFeature}"...</p>
               </div>
        ) : generatedPrompt ? (
          <>
            <div className="flex items-center justify-between mb-4 flex-shrink-0">
              <h3 className="text-lg font-semibold text-gray-800">Generated Prompt</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={copyToClipboard}
                  title="Copy to clipboard"
                  className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  {showCopySuccess ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                </button>
                <button
                         onClick={savePrompt}
                  disabled={!generatedPrompt}
                  className="px-4 py-2 text-sm bg-vibe-cyan text-black rounded-lg hover:shadow-md disabled:bg-gray-300 disabled:text-gray-500 disabled:hover:shadow-none transition-all font-semibold"
                       >
                  {showSuccessMessage ? 'Saved!' : 'Save Prompt'}
                </button>
              </div>
            </div>
            <textarea
              value={generatedPrompt}
              onChange={(e) => setGeneratedPrompt(e.target.value)}
              className="w-full flex-grow p-4 bg-white border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Generated prompt will appear here..."
            />
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-gray-500">
            <Zap className="w-10 h-10 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-700">Select or drag a feature here</h3>
            <p className="mt-1">Your tailored implementation prompt will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetail; 