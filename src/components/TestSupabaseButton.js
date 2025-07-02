import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const TestSupabaseButton = () => {
  const { user, isAuthenticated } = useAuth();
  
  const testSupabaseConnection = async () => {
    console.log('🧪 Testing Supabase connection from React context');
    console.log('🔐 Auth state:', { isAuthenticated, userId: user?.id });
    
    try {
      const { db, supabase } = await import('../services/supabase');
      
      // Check session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      console.log('📋 Session check:', {
        hasSession: !!session,
        userId: session?.user?.id,
        email: session?.user?.email,
        error: sessionError?.message
      });
      
      if (!session) {
        console.log('❌ No session found, trying to get user...');
        const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();
        console.log('👤 Current user:', {
          hasUser: !!currentUser,
          userId: currentUser?.id,
          error: userError?.message
        });
      }
      
      // Try to create a test project first
      const testProject = {
        user_id: user.id,
        name: 'Test Project ' + Date.now(),
        description: 'Test from React context',
        type: 'Web App'
      };
      
      console.log('🚀 Attempting to create test project:', testProject);
      const result = await db.createProject(testProject);
      
      if (result.error) {
        console.error('❌ Test project creation failed:', result.error);
        return;
      }
      
      console.log('✅ Test project created successfully:', result.data);
      const projectId = result.data.id;
      
      // Now test file creation
      console.log('💾 Testing file creation for project:', projectId);
      
      const testFileData = {
        project_id: projectId,
        file_name: 'test-debug-file.md',
        file_type: 'Test File',
        content: 'This is test content for debugging file creation.',
        file_content: 'This is test content for debugging file creation.',
        file_size: 50,
        metadata: {
          test: true,
          created_via: 'react_debug_button'
        }
      };
      
      console.log('📝 Attempting to create test file:', testFileData);
      const fileResult = await db.createProjectFile(testFileData);
      
      if (fileResult.error) {
        console.error('❌ Test file creation failed:', fileResult.error);
      } else {
        console.log('✅ Test file created successfully:', fileResult.data);
      }
      
      // Check if files exist in the project
      console.log('🔍 Checking files for project:', projectId);
      const filesResult = await db.getProjectFiles(projectId);
      
      if (filesResult.error) {
        console.error('❌ Error getting project files:', filesResult.error);
      } else {
        console.log('📊 Found', filesResult.data?.length || 0, 'files in project');
        if (filesResult.data?.length > 0) {
          console.log('📝 Files:', filesResult.data.map(f => ({ name: f.file_name, type: f.file_type, size: f.file_size })));
        }
      }
      
      // Clean up
      try {
        await supabase.from('projects').delete().eq('id', projectId);
        console.log('🗑️ Test project and files cleaned up');
      } catch (cleanupError) {
        console.warn('⚠️ Could not clean up test project:', cleanupError);
      }
      
    } catch (error) {
      console.error('💥 Test failed:', error);
    }
  };
  
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }
  
  return (
    <button
      onClick={testSupabaseConnection}
      className="fixed bottom-4 left-4 bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600"
    >
      Test Supabase
    </button>
  );
};

export default TestSupabaseButton;