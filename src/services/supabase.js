import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Auth helpers
export const auth = {
  signUp: async (email, password, metadata = {}) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    })
    return { data, error }
  },

  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  getCurrentUser: () => {
    return supabase.auth.getUser()
  },

  onAuthStateChange: (callback) => {
    return supabase.auth.onAuthStateChange(callback)
  }
}

// Database helpers
// Helper function to ensure we have a valid session
const ensureSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error) {
    console.error('🔐 Session error:', error);
    return { session: null, error };
  }
  
  if (!session) {
    console.log('🔄 No session found, attempting to refresh...');
    const { data: { session: refreshedSession }, error: refreshError } = await supabase.auth.refreshSession();
    
    if (refreshError) {
      console.error('❌ Session refresh failed:', refreshError);
      return { session: null, error: refreshError };
    }
    
    return { session: refreshedSession, error: null };
  }
  
  return { session, error: null };
};

export const db = {
  // Profile operations
  getProfile: async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    return { data, error }
  },

  updateProfile: async (userId, updates) => {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()
    return { data, error }
  },

  // Project operations
  getProjects: async (userId) => {
    console.log('🔍 Fetching projects for user:', userId);
    
    try {
      // First try to get projects without the joined files (simpler query)
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', userId)
        .eq('is_archived', false)
        .order('created_at', { ascending: false });
      
      console.log('📊 Projects query result - data:', data?.length || 0, 'projects, error:', error);
      
      if (error) {
        console.error('❌ Projects query error:', error);
        return { data: null, error };
      }
      
      // If we have projects, try to get their files separately
      if (data && data.length > 0) {
        console.log('💾 Fetching files for', data.length, 'projects...');
        
        // Get files for all projects
        const projectIds = data.map(p => p.id);
        const { data: files, error: filesError } = await supabase
          .from('project_files')
          .select('*')
          .in('project_id', projectIds);
        
        if (filesError) {
          console.warn('⚠️ Could not load project files:', filesError);
          // Continue without files
        } else {
          console.log('✅ Loaded', files?.length || 0, 'files');
          
          // Attach files to projects
          data.forEach(project => {
            project.project_files = files?.filter(f => f.project_id === project.id) || [];
          });
        }
      }
      
      return { data, error: null };
    } catch (exception) {
      console.error('💥 Exception in getProjects:', exception);
      return { data: null, error: exception };
    }
  },

  createProject: async (projectData) => {
    console.log('🔧 Supabase createProject called with:', projectData);
    
    try {
      // Ensure we have a valid session
      const { session, error: sessionError } = await ensureSession();
      
      if (sessionError || !session?.user) {
        console.error('🚫 No valid session available:', sessionError?.message || 'No session');
        return { data: null, error: sessionError || new Error('No authenticated session') };
      }
      
      console.log('✅ Valid session found for user:', session.user.id);
      
      // Verify the user_id matches the session
      if (projectData.user_id !== session.user.id) {
        console.error('❌ User ID mismatch:', projectData.user_id, 'vs', session.user.id);
        return { data: null, error: new Error('User ID mismatch') };
      }
      
      const { data, error } = await supabase
        .from('projects')
        .insert([projectData])
        .select()
        .single();
      
      console.log('📊 Supabase response - data:', data, 'error:', error);
      return { data, error };
    } catch (exception) {
      console.error('💥 Exception in createProject:', exception);
      return { data: null, error: exception };
    }
  },

  updateProject: async (projectId, updates) => {
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', projectId)
      .select()
      .single()
    return { data, error }
  },

  deleteProject: async (projectId) => {
    const { data, error } = await supabase
      .from('projects')
      .update({ is_archived: true })
      .eq('id', projectId)
      .select()
      .single()
    return { data, error }
  },

  // Project files operations
  getProjectFiles: async (projectId) => {
    console.log('💾 Getting files for project:', projectId);
    
    try {
      // Ensure we have a valid session
      const { session, error: sessionError } = await ensureSession();
      
      if (sessionError || !session?.user) {
        console.error('🚫 No valid session for getting files:', sessionError?.message || 'No session');
        return { data: null, error: sessionError || new Error('No authenticated session') };
      }
      
      const { data, error } = await supabase
        .from('project_files')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });
      
      console.log('📊 Got', data?.length || 0, 'files for project', projectId, 'error:', error);
      return { data, error };
    } catch (exception) {
      console.error('💥 Exception in getProjectFiles:', exception);
      return { data: null, error: exception };
    }
  },

  createProjectFile: async (fileData) => {
    console.log('💾 Creating project file:', fileData.file_name, 'for project:', fileData.project_id);
    
    try {
      // Ensure we have a valid session
      const { session, error: sessionError } = await ensureSession();
      
      if (sessionError || !session?.user) {
        console.error('🚫 No valid session for file creation:', sessionError?.message || 'No session');
        return { data: null, error: sessionError || new Error('No authenticated session') };
      }
      
      const { data, error } = await supabase
        .from('project_files')
        .insert([fileData])
        .select()
        .single();
      
      console.log('📊 File creation response - data:', !!data, 'error:', error);
      return { data, error };
    } catch (exception) {
      console.error('💥 Exception in createProjectFile:', exception);
      return { data: null, error: exception };
    }
  },

  updateProjectFile: async (fileId, updates) => {
    console.log('🔄 Updating project file:', fileId);
    
    try {
      // Ensure we have a valid session
      const { session, error: sessionError } = await ensureSession();
      
      if (sessionError || !session?.user) {
        console.error('🚫 No valid session for file update:', sessionError?.message || 'No session');
        return { data: null, error: sessionError || new Error('No authenticated session') };
      }
      
      const { data, error } = await supabase
        .from('project_files')
        .update(updates)
        .eq('id', fileId)
        .select()
        .single();
      
      console.log('📊 File update response - success:', !!data, 'error:', error);
      return { data, error };
    } catch (exception) {
      console.error('💥 Exception in updateProjectFile:', exception);
      return { data: null, error: exception };
    }
  },

  deleteProjectFile: async (fileId) => {
    const { data, error } = await supabase
      .from('project_files')
      .delete()
      .eq('id', fileId)
    return { data, error }
  }
}

export default supabase