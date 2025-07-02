import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import CursorRulesGenerator from './components/CursorRulesGenerator';
import PRDGenerator from './components/PRDGenerator';
import FeatureExtractor from './components/FeatureExtractor';
import CursorTutorial from './components/CursorTutorial';
import Dashboard from './components/Dashboard';
import ProjectCreationFlow from './components/ProjectCreationFlow';
import ProjectDetail from './components/ProjectDetail';
import Auth from './components/Auth';
import DatabaseSetup from './components/DatabaseSetup';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import './index.css';

function AppContent() {
  const [currentView, setCurrentView] = useState('home');
  const [currentProject, setCurrentProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [showDatabaseSetup, setShowDatabaseSetup] = useState(false);
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

  const handleNavigateToFeature = (feature, project = null) => {
    setCurrentProject(project);
    setCurrentView(feature);
  };

  const handleNavigateToProject = (project) => {
    setCurrentProject(project);
    setCurrentView('project-detail');
  };

  const handleProjectCreated = async (projectData) => {
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
        setCurrentView('project-detail');
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
        console.log('📋 Project ID for files:', createdProject.id);
        
        // Save files one by one with detailed logging
        const savedFiles = [];
        for (const file of projectData.generatedFiles) {
          try {
            console.log('📝 Processing file:', file.name, 'type:', file.type);
            console.log('📊 File content length:', file.content?.length || 0, 'characters');
            
            const fileData = {
              project_id: createdProject.id,
              file_name: file.name,
              file_type: file.type,
              content: file.content,
              file_content: file.content, // Save to both fields for compatibility
              file_size: file.content?.length || 0,
              metadata: {
                original_id: file.id,
                icon: file.icon,
                generated_date: file.date,
                creation_source: 'project_creation_flow'
              }
            };
            
            console.log('📦 Prepared file data for:', file.name);
            console.log('🔍 File data structure:', {
              project_id: fileData.project_id,
              file_name: fileData.file_name,
              file_type: fileData.file_type,
              content_length: fileData.content?.length,
              file_size: fileData.file_size,
              has_metadata: !!fileData.metadata
            });
            
            const { data: savedFile, error: fileError } = await db.createProjectFile(fileData);
            
            if (fileError) {
              console.error('❌ Failed to save file:', file.name);
              console.error('📊 Error details:', {
                message: fileError.message,
                code: fileError.code,
                details: fileError.details,
                hint: fileError.hint
              });
              // Don't throw, continue with other files
            } else {
              console.log('✅ Successfully saved file:', file.name, 'with ID:', savedFile?.id);
              savedFiles.push(savedFile);
            }
          } catch (fileException) {
            console.error('💥 Exception saving file:', file.name, fileException);
            // Continue with other files
          }
        }
        
        console.log('📊 File saving summary: saved', savedFiles.length, 'out of', projectData.generatedFiles.length, 'files');
        
        // Verify files were actually saved by querying them back
        if (savedFiles.length > 0) {
          console.log('🔍 Verifying saved files by querying them back...');
          try {
            const { data: verifyFiles, error: verifyError } = await db.getProjectFiles(createdProject.id);
            if (verifyError) {
              console.error('❌ Error verifying files:', verifyError);
            } else {
              console.log('✅ Verification: found', verifyFiles?.length || 0, 'files in database');
              if (verifyFiles?.length > 0) {
                verifyFiles.forEach(file => {
                  console.log('📝 Verified file:', {
                    id: file.id,
                    name: file.file_name,
                    type: file.file_type,
                    content_length: file.content?.length || file.file_content?.length || 0
                  });
                });
              }
            }
          } catch (verifyException) {
            console.error('💥 Exception verifying files:', verifyException);
          }
        }
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
      setCurrentView('project-detail');
      
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
      setCurrentView('project-detail');
    }
  };

  const handleGenerateFile = (toolId, project) => {
    setCurrentProject(project);
    setCurrentView(toolId);
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
      const { db } = await import('./services/supabase');
      
      // Check if this is a Supabase project (numeric ID) or local project
      const isSupabaseProject = !projectId.toString().startsWith('local-');
      
      if (isSupabaseProject) {
        // Save file to Supabase
        const fileData = {
          project_id: projectId,
          file_name: fileName,
          file_type: fileType,
          content: content,
          file_content: content, // Save to both fields
          file_size: content.length,
          metadata: {
            icon: fileType === 'PRD Document' ? 'FileText' : 'Code',
            generated_individually: true,
            created_via: 'individual_generation'
          }
        };

        // Check if file already exists
        const { data: existingFiles } = await db.getProjectFiles(projectId);
        const existingFile = existingFiles?.find(f => f.file_type === fileType);
        
        if (existingFile) {
          // Update existing file
          const { error } = await db.updateProjectFile(existingFile.id, {
            content: content,
            file_content: content,
            file_size: content.length,
            updated_at: new Date().toISOString()
          });
          if (error) throw error;
          console.log('✅ Updated existing file:', fileName);
        } else {
          // Create new file
          const { error } = await db.createProjectFile(fileData);
          if (error) throw error;
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
      // Show error to user but don't crash
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

  // Show auth if not authenticated
  if (!isAuthenticated) {
    return <Auth />;
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return (
          <div className="min-h-screen bg-white">
            <Header onNavigateToDashboard={() => setCurrentView('dashboard')} />
            <main className="max-w-6xl mx-auto px-6 py-12 pt-24">
              <Hero onNavigateToFeature={handleNavigateToFeature} />
            </main>
          </div>
        );

      case 'dashboard':
        return (
          <Dashboard 
            projects={projects}
            loading={loadingProjects}
            onNavigateToFeature={handleNavigateToFeature}
            onNavigateToProject={handleNavigateToProject}
            onSetupDatabase={() => setShowDatabaseSetup(true)}
          />
        );

      case 'create-project':
        return (
          <ProjectCreationFlow 
            onClose={() => setCurrentView('dashboard')}
            onProjectCreated={handleProjectCreated}
          />
        );

      case 'project-detail':
        return currentProject ? (
          <ProjectDetail 
            project={currentProject}
            onClose={() => setCurrentView('dashboard')}
            onGenerateFile={handleGenerateFile}
            onDesignUpdate={(updatedDesign) => handleDesignUpdate(currentProject.id, updatedDesign)}
          />
        ) : (
          <div>Project not found</div>
        );

      case 'cursor-rules':
        return (
          <CursorRulesGenerator 
            onClose={() => currentProject ? setCurrentView('project-detail') : setCurrentView('home')}
            project={currentProject}
            onFileSaved={handleFileSaved}
          />
        );

      case 'prd-generator':
        return (
          <PRDGenerator 
            onClose={() => currentProject ? setCurrentView('project-detail') : setCurrentView('home')}
            project={currentProject}
            onFileSaved={handleFileSaved}
          />
        );

      case 'feature-extractor':
        return (
          <FeatureExtractor 
            onClose={() => currentProject ? setCurrentView('project-detail') : setCurrentView('home')}
            project={currentProject}
          />
        );

      case 'cursor-tutorial':
        return (
          <CursorTutorial 
            onClose={() => currentProject ? setCurrentView('project-detail') : setCurrentView('home')}
            project={currentProject}
          />
        );

      default:
        return (
          <div className="min-h-screen bg-white">
            <Header onNavigateToDashboard={() => setCurrentView('dashboard')} />
            <main className="max-w-6xl mx-auto px-6 py-12 pt-24">
              <Hero onNavigateToFeature={handleNavigateToFeature} />
            </main>
          </div>
        );
    }
  };

  return (
    <div className="App">
      {renderCurrentView()}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;