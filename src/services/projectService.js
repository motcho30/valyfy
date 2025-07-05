import { supabase } from './supabase'

export const projectService = {
  // Get all projects for a user
  async getUserProjects(userId) {
    try {
      // Check if tables exist first
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          project_files(id, file_name, file_type, created_at)
        `)
        .eq('user_id', userId)
        .eq('is_archived', false)
        .order('created_at', { ascending: false })

      if (error) {
        // If tables don't exist, return localStorage fallback
        if (error.code === '42P01' || error.message.includes('does not exist')) {
          console.warn('Database tables not set up yet, returning localStorage projects')
          const fallbackProjects = JSON.parse(localStorage.getItem('fallback_projects') || '[]')
          return fallbackProjects
        }
        throw error
      }
      
      // Transform data to match the expected format
      return data.map(project => ({
        id: project.id,
        name: project.name,
        description: project.description,
        type: project.type,
        createdDate: project.created_at.split('T')[0],
        lastModified: project.updated_at.split('T')[0],
        filesCount: project.project_files?.length || 0,
        files: project.project_files || []
      }))
    } catch (error) {
      console.error('Error fetching projects:', error)
      // Return localStorage fallback if tables don't exist
      if (error.code === '42P01' || error.message.includes('does not exist')) {
        console.warn('Database tables not set up yet, returning localStorage projects')
        const fallbackProjects = JSON.parse(localStorage.getItem('fallback_projects') || '[]')
        return fallbackProjects
      }
      throw error
    }
  },

  // Create a new project
  async createProject(userId, projectData) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([{
          user_id: userId,
          name: projectData.name,
          description: projectData.description,
          project_type: projectData.type || 'Web App',
          features: projectData.features || [],
          design_data: projectData.design_data || null,
          metadata: projectData.metadata || {}
        }])
        .select()
        .single()

      if (error) {
        console.error('Supabase error creating project:', error);
        throw error;
          }
          
      // Return a frontend-compatible project object
      return {
        id: data.id,
        name: data.name,
        description: data.description,
        type: data.project_type,
        features: data.features,
        selectedDesign: data.design_data,
        createdDate: data.created_at.split('T')[0],
        lastModified: data.updated_at.split('T')[0],
        filesCount: 0,
        generatedFiles: []
      };
    } catch (error) {
      console.error('Error in createProject service:', error)
      throw error
    }
  },

  // Update project
  async updateProject(projectId, updates) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', projectId)
        .select()
        .single()
      if (error) throw error
      
      return {
        id: data.id,
        name: data.name,
        description: data.description,
        type: data.type,
        createdDate: data.created_at.split('T')[0],
        lastModified: data.updated_at.split('T')[0]
      }
    } catch (error) {
      console.error('Error updating project:', error)
      throw error
    }
  },

  // Delete project (archive)
  async deleteProject(projectId) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update({ is_archived: true })
        .eq('id', projectId)
        .select()
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error deleting project:', error)
      throw error
    }
  },

  // Get project files
  async getProjectFiles(projectId) {
    try {
      const { data, error } = await supabase
        .from('project_files')
        .select('*')
        .eq('project_id', projectId)
      if (error) throw error
      
      return data.map(file => ({
        id: file.id,
        name: file.file_name,
        type: file.file_type,
        content: file.file_content,
        file_size: file.file_size,
        metadata: file.metadata,
        createdAt: file.created_at,
        updatedAt: file.updated_at
      }))
    } catch (error) {
      console.error('Error fetching project files:', error)
      throw error
    }
  },

  // Save generated file
  async saveGeneratedFile(projectId, fileData) {
    try {
      const { fileName, fileType, content, metadata } = fileData;
      const { data, error } = await supabase
        .from('project_files')
        .insert({
          project_id: projectId,
          file_name: fileName,
          file_type: fileType,
          file_content: content,
          file_size: new TextEncoder().encode(content).length,
          metadata: metadata || {}
        })
        .select()
        .single()
      if (error) throw error
      
      return {
        id: data.id,
        name: data.file_name,
        type: data.file_type,
        content: data.file_content,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      }
    } catch (error) {
      console.error('Error saving generated file:', error)
      throw error
    }
  },

  // Update generated file
  async updateGeneratedFile(fileId, updates) {
    try {
      // If content is being updated, also update file_size
      if (updates.content) {
        updates.file_content = updates.content;
        updates.file_size = new TextEncoder().encode(updates.content).length;
        delete updates.content; // remove old key
      }

      const { data, error } = await supabase
        .from('project_files')
        .update(updates)
        .eq('id', fileId)
        .select()
        .single()
      if (error) throw error
      
      return {
        id: data.id,
        name: data.file_name,
        type: data.file_type,
        content: data.file_content,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      }
    } catch (error) {
      console.error('Error updating generated file:', error)
      throw error
    }
  },

  // Delete generated file
  async deleteGeneratedFile(fileId) {
    try {
      const { data, error } = await supabase
        .from('project_files')
        .delete()
        .eq('id', fileId)
        .select()
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error deleting generated file:', error)
      throw error
    }
  }
}

export default projectService