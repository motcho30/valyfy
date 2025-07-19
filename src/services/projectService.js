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
      const { fileName, fileType, content, metadata, prdSource } = fileData;
      const { data, error } = await supabase
        .from('project_files')
        .insert({
          project_id: projectId,
          file_name: fileName,
          file_type: fileType,
          file_content: content,
          file_size: new TextEncoder().encode(content).length,
          metadata: metadata || {},
          prd_source: prdSource || null
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
  },

  // Get PRD files by source
  async getPRDsBySource(userId, source = null) {
    try {
      let query = supabase
        .from('project_files')
        .select(`
          *,
          projects!inner(name, user_id)
        `)
        .eq('file_type', 'PRD Document')
        .eq('projects.user_id', userId);

      if (source) {
        query = query.eq('prd_source', source);
      }

      const { data, error } = await query
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return {
        data: data?.map(file => ({
          id: file.id,
          name: file.file_name,
          projectName: file.projects.name,
          source: file.prd_source,
          createdAt: file.created_at,
          content: file.file_content
        })) || [],
        error: null
      };
    } catch (error) {
      console.error('Error fetching PRDs by source:', error);
      return { data: null, error };
    }
  },

  // Get analytics about PRD sources
  async getPRDSourceAnalytics(userId) {
    try {
      const { data, error } = await supabase
        .from('project_files')
        .select(`
          prd_source,
          projects!inner(user_id)
        `)
        .eq('file_type', 'PRD Document')
        .eq('projects.user_id', userId);

      if (error) throw error;

      const analytics = {
        landing_page: 0,
        project_creation_flow: 0,
        project_detail_app: 0,
        unknown: 0,
        total: data?.length || 0
      };

      data?.forEach(file => {
        const source = file.prd_source || 'unknown';
        if (analytics[source] !== undefined) {
          analytics[source]++;
        } else {
          analytics.unknown++;
        }
      });

      return { data: analytics, error: null };
    } catch (error) {
      console.error('Error fetching PRD analytics:', error);
      return { data: null, error };
    }
  },

  // Track prompt copy activity
  async trackPromptCopy(copyData) {
    try {
      const { data, error } = await supabase
        .from('prompt_copy_activities')
        .insert([copyData])
        .select()
        .single();

      if (error) {
        console.error('Error tracking prompt copy:', error);
        // Don't throw - we don't want copy tracking to break the copy functionality
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Exception in trackPromptCopy:', error);
      return { data: null, error };
    }
  },

  // Get prompt copy analytics for a user
  async getPromptCopyAnalytics(userId) {
    try {
      const { data, error } = await supabase
        .from('prompt_copy_activities')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Group by design card for analytics
      const analytics = {
        total_copies: data?.length || 0,
        unique_designs: new Set(data?.map(activity => activity.design_card_id)).size,
        authenticated_copies: data?.filter(activity => activity.user_authenticated).length || 0,
        paid_access_copies: data?.filter(activity => activity.has_payment_access).length || 0,
        recent_copies: data?.slice(0, 10) || [],
        popular_designs: {}
      };

      // Count copies per design
      data?.forEach(activity => {
        const key = activity.design_card_name;
        analytics.popular_designs[key] = (analytics.popular_designs[key] || 0) + 1;
      });

      return { data: analytics, error: null };
    } catch (error) {
      console.error('Error fetching prompt copy analytics:', error);
      return { data: null, error };
    }
  },

  // Get global prompt copy statistics (for admin/analytics)
  async getGlobalPromptCopyStats() {
    try {
      const { data, error } = await supabase
        .from('prompt_copy_activities')
        .select('design_card_id, design_card_name, user_authenticated, has_payment_access, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const stats = {
        total_copies: data?.length || 0,
        unique_users: new Set(data?.map(activity => activity.user_id)).size,
        authenticated_copies: data?.filter(activity => activity.user_authenticated).length || 0,
        paid_access_copies: data?.filter(activity => activity.has_payment_access).length || 0,
        most_copied_designs: {},
        copies_by_date: {}
      };

      // Aggregate data
      data?.forEach(activity => {
        // Most copied designs
        const designKey = activity.design_card_name;
        stats.most_copied_designs[designKey] = (stats.most_copied_designs[designKey] || 0) + 1;

        // Copies by date
        const date = activity.created_at.split('T')[0];
        stats.copies_by_date[date] = (stats.copies_by_date[date] || 0) + 1;
      });

      return { data: stats, error: null };
    } catch (error) {
      console.error('Error fetching global prompt copy stats:', error);
      return { data: null, error };
    }
  }
}

export default projectService