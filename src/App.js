import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import HomePage from './components/HomePage';
import PRDGenerator from './components/PRDGenerator';
import FeatureExtractor from './components/FeatureExtractor';
import Dashboard from './components/Dashboard';
import ProjectCreationFlow from './components/ProjectCreationFlow';
import ProjectDetail from './components/ProjectDetail';
import Auth from './components/Auth';
import ResetPassword from './components/ResetPassword';
import DatabaseSetup from './components/DatabaseSetup';
import CursorTips from './components/CursorTips';
import DesignInspiration from './components/DesignInspiration';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { PaymentProvider } from './contexts/PaymentContext';
import FilesGuidance from './components/FilesGuidance';
import './index.css';
import { projectService } from './services/projectService';
import { generateDesignSpecDocument } from './services/designSpecService';

function AppContent() {
  const [currentProject, setCurrentProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [showDatabaseSetup, setShowDatabaseSetup] = useState(false);
  const [showGuidanceOnProjectLoad, setShowGuidanceOnProjectLoad] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated, loading } = useAuth();

  // Load projects from Supabase and localStorage with timeout
  useEffect(() => {
    let timeoutId;
    let mounted = true;
    
    const loadProjects = async () => {
      if (isAuthenticated && user) {
        console.log('🚀 Starting to load projects for user:', user.id);
        
        // Immediately load from localStorage to show content faster
        const fallbackProjects = JSON.parse(localStorage.getItem('fallback_projects') || '[]');
        console.log('💾 Loaded', fallbackProjects.length, 'projects from localStorage');
        setProjects(fallbackProjects);
        
        // Only show loading if we don't have any projects
        if (fallbackProjects.length === 0) {
          setLoadingProjects(true);
        }
        
        // Set a timeout to prevent infinite loading
        timeoutId = setTimeout(() => {
          if (mounted) {
            console.log('⏰ Project loading timeout - keeping localStorage data');
            setLoadingProjects(false);
          }
        }, 3000); // 3 second timeout (reduced)
        
        try {
          console.log('📄 Attempting to load from Supabase...');
          // Try to load from Supabase first
          const { db } = await import('./services/supabase');
          const { data: supabaseProjects, error } = await db.getProjects(user.id);
          
          if (!mounted) return; // Component unmounted
          
          clearTimeout(timeoutId); // Clear timeout since we got a response
          
          if (error) {
            console.warn('❌ Error loading projects from Supabase:', error);
            // Fallback to localStorage
            const fallbackProjects = JSON.parse(localStorage.getItem('fallback_projects') || '[]');
            setProjects(fallbackProjects);
          } else {
            console.log('✅ Loaded projects from Supabase:', supabaseProjects?.length || 0);
            
            // Transform Supabase projects to frontend format
            const transformedProjects = (supabaseProjects || []).map(project => ({
              ...project,
              features: project.features || [],
              selectedFeatures: project.features || [],
              selectedDesign: project.design_data?.data || null,
              designId: project.design_data?.id || null,
              type: project.type || project.project_type,
              createdDate: new Date(project.created_at).toISOString().split('T')[0],
              lastModified: new Date(project.updated_at).toISOString().split('T')[0],
              filesCount: project.project_files?.length || 0,
              generatedFiles: project.project_files?.map(file => ({
                id: file.id,
                name: file.file_name,
                type: file.file_type,
                content: file.content || file.file_content, // Support both field names
                date: new Date(file.created_at).toISOString().split('T')[0],
                size: file.file_size ? `${Math.round(file.file_size / 1024)}KB` : '0KB',
                icon: file.metadata?.icon || 'FileText'
              })) || []
            }));
            
            // Only update if we got different data
            if (JSON.stringify(transformedProjects) !== JSON.stringify(fallbackProjects)) {
              console.log('🔄 Updating projects with fresh Supabase data');
              setProjects(transformedProjects);
              // Also save to localStorage as backup
              localStorage.setItem('fallback_projects', JSON.stringify(transformedProjects));
            } else {
              console.log('✅ Supabase data matches localStorage - no update needed');
            }
          }
        } catch (error) {
          console.error('💥 Exception loading projects:', error);
          if (!mounted) return;
          
          clearTimeout(timeoutId);
          // Fallback to localStorage
          const fallbackProjects = JSON.parse(localStorage.getItem('fallback_projects') || '[]');
          setProjects(fallbackProjects);
        } finally {
          if (mounted) {
            setLoadingProjects(false);
          }
        }
      } else {
        console.log('🔐 User not authenticated, clearing projects');
        setProjects([]);
        setLoadingProjects(false);
      }
    };

    loadProjects();
    
    // Cleanup function
    return () => {
      mounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isAuthenticated, user]);

  useEffect(() => {
    const handleNavigateGuidance = () => navigate('/files-guidance');
    window.addEventListener('navigate-files-guidance', handleNavigateGuidance);

    const handleNavigateAuth = () => navigate('/auth');
    window.addEventListener('navigate-to-auth', handleNavigateAuth);

    return () => {
      window.removeEventListener('navigate-files-guidance', handleNavigateGuidance);
      window.removeEventListener('navigate-to-auth', handleNavigateAuth);
    };
  }, []);

  const handleNavigateToFeature = (feature, project = null) => {
    setCurrentProject(project);
    
    // If navigating to create-project and user is not authenticated, redirect to auth with redirect param
    if (feature === 'create-project' && !isAuthenticated) {
      navigate('/auth?redirect=/create-project');
      return;
    }
    
    navigate(`/${feature}`);
  };

  const handleNavigateToProject = (project) => {
    setCurrentProject(project);
    navigate('/project-detail');
  };

  const handleProjectCreated = async (projectData, showGuidance = false) => {
    try {
      console.log('🚀 Starting project creation process');
      console.log('📊 Received project data:', projectData);
      console.log('🔐 Auth state - isAuthenticated:', isAuthenticated, 'user:', user?.id);
      
      if (!isAuthenticated || !user) {
        console.warn('❌ User not authenticated, saving to localStorage only');
        console.log('🔐 Auth details - isAuthenticated:', isAuthenticated, 'user exists:', !!user);
        // Fallback to localStorage if not authenticated
        const newProject = {
          ...projectData,
          id: 'local-' + Date.now(),
          files: projectData.generatedFiles || [],
          generatedFiles: projectData.generatedFiles || [],
          filesCount: projectData.generatedFiles?.length || 0
        };
        
        const existingProjects = JSON.parse(localStorage.getItem('fallback_projects') || '[]');
        const updatedProjects = [newProject, ...existingProjects];
        localStorage.setItem('fallback_projects', JSON.stringify(updatedProjects));
        setProjects(updatedProjects);
        setCurrentProject(newProject);
        setShowGuidanceOnProjectLoad(showGuidance);
        navigate('/project-detail');
        return;
      }

      console.log('✅ User is authenticated, proceeding with Supabase save');
      
      // Debug: Check current Supabase session
      try {
        const { supabase } = await import('./services/supabase');
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        console.log('🔐 Current Supabase session:', {
          hasSession: !!session,
          userId: session?.user?.id,
          email: session?.user?.email,
          sessionError: sessionError?.message
        });
      } catch (sessionCheckError) {
        console.error('💥 Error checking session:', sessionCheckError);
      }
      
      // Prepare complete project data for Supabase
      const supabaseProjectData = {
        user_id: user.id,
        name: projectData.name,
        description: projectData.description || projectData.appIdea || '',
        type: projectData.type || 'Web App',
        project_type: projectData.type || 'Web App', // Also save in project_type field
        features: projectData.features || projectData.selectedFeatures || [],
        design_data: projectData.selectedDesign ? {
          id: projectData.selectedDesign.id,
          name: projectData.selectedDesign.name,
          data: projectData.selectedDesign
        } : null,
        metadata: {
          app_idea: projectData.appIdea,
          creation_flow: true,
          files_generated: projectData.generatedFiles?.length || 0,
          created_via: 'project_creation_flow'
        }
      };

      console.log('📝 Prepared Supabase project data:', supabaseProjectData);
      
      // Create project in Supabase
      console.log('🔄 Importing Supabase service...');
      const { db } = await import('./services/supabase');
      console.log('✅ Supabase service imported successfully');
      
      console.log('🔄 Creating project in Supabase...');
      const { data: createdProject, error: projectError } = await db.createProject(supabaseProjectData);
      
      if (projectError) {
        console.error('❌ Error creating project in Supabase:', projectError);
        console.error('📋 Error details:', {
          message: projectError.message,
          details: projectError.details,
          hint: projectError.hint,
          code: projectError.code
        });
        throw new Error(`Failed to create project: ${projectError.message}`);
      }

      console.log('✅ Project created in Supabase successfully:', createdProject);
      console.log('📋 Project ID that will be used for files:', createdProject.id);
      console.log('🔍 Project structure:', {
        id: createdProject.id,
        name: createdProject.name,
        user_id: createdProject.user_id,
        type: createdProject.type
      });

      // Save generated files to Supabase if they exist
      if (projectData.generatedFiles && projectData.generatedFiles.length > 0) {
        console.log('💾 Attempting to save', projectData.generatedFiles.length, 'generated files to Supabase');
        
        const savedFiles = [];
        for (const file of projectData.generatedFiles) {
          try {
            const fileData = {
              fileName: file.name,
              fileType: file.type,
              content: file.content,
              prdSource: file.type === 'PRD Document' ? 'project_creation_flow' : null,
              metadata: {
                original_id: file.id,
                icon: file.icon,
                generated_date: file.date,
                creation_source: 'project_creation_flow'
              }
            };
            
            const savedFile = await projectService.saveGeneratedFile(createdProject.id, fileData);
            savedFiles.push(savedFile);
            console.log('✅ Successfully saved file:', file.name, 'with ID:', savedFile?.id);
          } catch (fileError) {
            console.error('❌ Failed to save file:', file.name, fileError);
          }
        }
        
        console.log('📊 File saving summary: saved', savedFiles.length, 'out of', projectData.generatedFiles.length, 'files');
      
        // Note: Design specs are now handled separately in the project context file
        // PRD content remains pure PRD without design specifications
      } else {
        console.log('💾 No generated files to save');
      }

      // Transform the created project to match our frontend format
      const transformedProject = {
        ...createdProject,
        features: createdProject.features || projectData.features || projectData.selectedFeatures || [],
        selectedFeatures: createdProject.features || projectData.features || projectData.selectedFeatures || [],
        selectedDesign: createdProject.design_data?.data || projectData.selectedDesign || null,
        designId: createdProject.design_data?.id || projectData.selectedDesign?.id || null,
        type: createdProject.type || createdProject.project_type,
        createdDate: new Date(createdProject.created_at).toISOString().split('T')[0],
        lastModified: new Date(createdProject.updated_at).toISOString().split('T')[0],
        generatedFiles: projectData.generatedFiles || [],
        filesCount: projectData.generatedFiles?.length || 0,
        metadata: createdProject.metadata || {}
      };

      // Update local state
      const existingProjects = JSON.parse(localStorage.getItem('fallback_projects') || '[]');
      const updatedProjects = [transformedProject, ...existingProjects];
      localStorage.setItem('fallback_projects', JSON.stringify(updatedProjects));
      
      setProjects(updatedProjects);
      setCurrentProject(transformedProject);
      setShowGuidanceOnProjectLoad(showGuidance);
      navigate('/project-detail');
      
      console.log('Project creation completed successfully');
    } catch (error) {
      console.error('Error creating project:', error);
      
      // Fallback to localStorage on error
      console.log('Falling back to localStorage due to error');
      const newProject = {
        ...projectData,
        id: 'local-' + Date.now(),
        files: projectData.generatedFiles || [],
        generatedFiles: projectData.generatedFiles || [],
        filesCount: projectData.generatedFiles?.length || 0
      };
      
      const existingProjects = JSON.parse(localStorage.getItem('fallback_projects') || '[]');
      const updatedProjects = [newProject, ...existingProjects];
      localStorage.setItem('fallback_projects', JSON.stringify(updatedProjects));
      setProjects(updatedProjects);
      setCurrentProject(newProject);
      setShowGuidanceOnProjectLoad(showGuidance);
      navigate('/project-detail');
    }
  };

  const handleGenerateFile = (toolId, project) => {
    setCurrentProject(project);
    navigate(`/${toolId}`);
  };

  // Function to update project design specs
  const handleDesignUpdate = (projectId, updatedDesign) => {
    try {
      const existingProjects = JSON.parse(localStorage.getItem('fallback_projects') || '[]');
      const updatedProjects = existingProjects.map(p => {
        if (p.id === projectId) {
          return {
            ...p,
            selectedDesign: updatedDesign,
            designId: updatedDesign.id,
            lastModified: new Date().toISOString().split('T')[0]
          };
        }
        return p;
      });

      localStorage.setItem('fallback_projects', JSON.stringify(updatedProjects));
      setProjects(updatedProjects);
      
      // Update current project if it's the one being modified
      if (currentProject && currentProject.id === projectId) {
        const updatedProject = updatedProjects.find(p => p.id === projectId);
        setCurrentProject(updatedProject);
      }
    } catch (error) {
      console.error('Error updating design:', error);
    }
  };

  // Function to save generated files to a project
  const handleFileSaved = async (projectId, fileName, fileType, content) => {
    try {
      if (!isAuthenticated || !user) {
        console.warn('User not authenticated, saving to localStorage only');
        // Fallback to localStorage
        const existingProjects = JSON.parse(localStorage.getItem('fallback_projects') || '[]');
        const updatedProjects = existingProjects.map(p => {
          if (p.id === projectId) {
            const newFile = {
              id: fileType + '-' + Date.now(),
              name: fileName,
              type: fileType,
              content: content,
              date: new Date().toISOString().split('T')[0],
              size: `${Math.round(content.length / 1024)}KB`,
              icon: fileType === 'PRD Document' ? 'FileText' : 'Code'
            };

            const updatedFiles = p.generatedFiles ? [...p.generatedFiles] : [];
            const existingIndex = updatedFiles.findIndex(f => f.type === fileType);
            if (existingIndex >= 0) {
              updatedFiles[existingIndex] = newFile;
            } else {
              updatedFiles.push(newFile);
            }

            return {
              ...p,
              generatedFiles: updatedFiles,
              files: updatedFiles,
              filesCount: updatedFiles.length,
              lastModified: new Date().toISOString().split('T')[0]
            };
          }
          return p;
        });

        localStorage.setItem('fallback_projects', JSON.stringify(updatedProjects));
        setProjects(updatedProjects);
        
        if (currentProject && currentProject.id === projectId) {
          const updatedProject = updatedProjects.find(p => p.id === projectId);
          setCurrentProject(updatedProject);
        }
        return;
      }

      // Save to Supabase
      const isSupabaseProject = !projectId.toString().startsWith('local-');
      
      if (isSupabaseProject) {
        const { data: existingFiles } = await projectService.getProjectFiles(projectId);
        const existingFile = existingFiles?.find(f => f.type === fileType);
        
        if (existingFile) {
          // Update existing file
          const updates = {
            content: content,
            updated_at: new Date().toISOString()
          };
          await projectService.updateGeneratedFile(existingFile.id, updates);
          console.log('✅ Updated existing file:', fileName);
        } else {
          // Create new file
          const fileData = {
            fileName: fileName,
            fileType: fileType,
            content: content,
            prdSource: fileType === 'PRD Document' ? 'project_detail_app' : null,
            metadata: {
              icon: fileType === 'PRD Document' ? 'FileText' : 'Code',
              generated_individually: true,
              created_via: 'individual_generation'
            }
          };
          await projectService.saveGeneratedFile(projectId, fileData);
          console.log('✅ Created new file:', fileName);
        }
        
        console.log('File saved to Supabase successfully');
      }

      // Update local state
      const existingProjects = JSON.parse(localStorage.getItem('fallback_projects') || '[]');
      const updatedProjects = existingProjects.map(p => {
        if (p.id === projectId) {
          const newFile = {
            id: fileType + '-' + Date.now(),
            name: fileName,
            type: fileType,
            content: content,
            date: new Date().toISOString().split('T')[0],
            size: `${Math.round(content.length / 1024)}KB`,
            icon: fileType === 'PRD Document' ? 'FileText' : 'Code'
          };

          const updatedFiles = p.generatedFiles ? [...p.generatedFiles] : [];
          const existingIndex = updatedFiles.findIndex(f => f.type === fileType);
          if (existingIndex >= 0) {
            updatedFiles[existingIndex] = newFile;
          } else {
            updatedFiles.push(newFile);
          }

          return {
            ...p,
            generatedFiles: updatedFiles,
            files: updatedFiles,
            filesCount: updatedFiles.length,
            lastModified: new Date().toISOString().split('T')[0]
          };
        }
        return p;
      });

      localStorage.setItem('fallback_projects', JSON.stringify(updatedProjects));
      setProjects(updatedProjects);
      
      if (currentProject && currentProject.id === projectId) {
        const updatedProject = updatedProjects.find(p => p.id === projectId);
        setCurrentProject(updatedProject);
      }
    } catch (error) {
      console.error('Error saving file:', error);
      alert('Failed to save file. Please try again.');
    }
  };

  // Simple loading - max 2 seconds
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-black/30 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-black/60">Loading...</p>
        </div>
      </div>
    );
  }

  // Show database setup if explicitly requested
  if (showDatabaseSetup) {
    return (
      <DatabaseSetup 
        onComplete={() => {
          setShowDatabaseSetup(false);
          window.location.reload();
        }} 
      />
    );
  }

  // Authentication is now handled within individual route components

        return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={
          <Dashboard 
            projects={projects}
            loading={loadingProjects}
            onNavigateToProject={handleNavigateToProject}
            onSetupDatabase={() => setShowDatabaseSetup(true)}
          />
        } />
        <Route path="/create-project" element={
          <ProjectCreationFlow 
            onClose={() => navigate('/dashboard')}
            onProjectCreated={handleProjectCreated}
          />
        } />
        <Route path="/project-detail" element={
          currentProject ? (
          <ProjectDetail 
            project={currentProject}
            onClose={() => {
              setShowGuidanceOnProjectLoad(false);
                navigate('/dashboard');
            }}
            onNavigateToFeature={handleNavigateToFeature}
            onGenerateFile={handleGenerateFile}
            onDesignUpdate={(updatedDesign) => handleDesignUpdate(currentProject.id, updatedDesign)}
            showGuidanceOnLoad={showGuidanceOnProjectLoad}
          />
        ) : (
          <div>Project not found</div>
          )
        } />
        <Route path="/prd-generator" element={
          <PRDGenerator 
            onClose={() => currentProject ? navigate('/project-detail') : navigate('/')}
            project={currentProject}
            onFileSaved={handleFileSaved}
          />
        } />
        <Route path="/feature-extractor" element={
          <FeatureExtractor 
            onClose={() => currentProject ? navigate('/project-detail') : navigate('/')}
            project={currentProject}
          />
        } />
        <Route path="/files-guidance" element={
          <FilesGuidance onClose={() => navigate('/dashboard')} />
        } />
        <Route path="/cursor-tips" element={<CursorTips />} />
        <Route path="/design-inspiration" element={
            <DesignInspiration onNavigateToFeature={handleNavigateToFeature} />
        } />
        <Route path="/auth" element={<Auth />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="*" element={<div>Not Found</div>} />
      </Routes>
      
      {showDatabaseSetup && (
        <DatabaseSetup onClose={() => setShowDatabaseSetup(false)} />
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
    <AuthProvider>
        <PaymentProvider>
          <AppContent />
      </PaymentProvider>
    </AuthProvider>
    </Router>
  );
}

export default App;