import { supabase } from './supabase';

export const promptManagementService = {
  // Get all prompts for a project
  async getPrompts(projectId) {
    try {
      const { data, error } = await supabase
        .from('prompts')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform the data to match the expected format
      return (data || []).map(prompt => ({
        id: prompt.id,
        name: prompt.name,
        content: prompt.content,
        category: prompt.category || 'General',
        usageCount: prompt.usage_count || 0,
        createdAt: prompt.created_at,
        updatedAt: prompt.updated_at
      }));
    } catch (error) {
      console.error('Error fetching prompts:', error);
      throw error;
    }
  },

  // Create a new prompt
  async createPrompt(projectId, promptData) {
    try {
      const { data, error } = await supabase
        .from('prompts')
        .insert({
          project_id: projectId,
          name: promptData.name,
          content: promptData.content,
          category: promptData.category || 'General',
          usage_count: promptData.usageCount || 0
        })
        .select()
        .single();

      if (error) throw error;
      
      // Transform the response to match expected format
      return {
        id: data.id,
        name: data.name,
        content: data.content,
        category: data.category || 'General',
        usageCount: data.usage_count || 0,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
    } catch (error) {
      console.error('Error creating prompt:', error);
      throw error;
    }
  },

  // Update an existing prompt
  async updatePrompt(promptId, promptData) {
    try {
      // First check if the prompt exists
      const { data: existingPrompt, error: checkError } = await supabase
        .from('prompts')
        .select('id')
        .eq('id', promptId)
        .single();

      if (checkError || !existingPrompt) {
        throw new Error('Prompt not found');
      }

      const { data, error } = await supabase
        .from('prompts')
        .update({
          name: promptData.name,
          content: promptData.content,
          category: promptData.category || 'General',
          usage_count: promptData.usageCount || 0
        })
        .eq('id', promptId)
        .select()
        .single();

      if (error) throw error;
      
      // Transform the response to match expected format
      return {
        id: data.id,
        name: data.name,
        content: data.content,
        category: data.category || 'General',
        usageCount: data.usage_count || 0,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
    } catch (error) {
      console.error('Error updating prompt:', error);
      throw error;
    }
  },

  // Delete a prompt
  async deletePrompt(promptId) {
    try {
      const { error } = await supabase
        .from('prompts')
        .delete()
        .eq('id', promptId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting prompt:', error);
      throw error;
    }
  },

  // Increment usage count
  async incrementUsageCount(promptId) {
    try {
      // Get current usage count
      const { data: currentPrompt, error: fetchError } = await supabase
        .from('prompts')
        .select('usage_count')
        .eq('id', promptId)
        .single();

      if (fetchError) throw fetchError;

      const newCount = (currentPrompt.usage_count || 0) + 1;

      const { data, error } = await supabase
        .from('prompts')
        .update({ usage_count: newCount })
        .eq('id', promptId)
        .select()
        .single();

      if (error) throw error;
      
      return {
        id: data.id,
        name: data.name,
        content: data.content,
        category: data.category || 'General',
        usageCount: data.usage_count || 0,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
    } catch (error) {
      console.error('Error incrementing usage count:', error);
      throw error;
    }
  }
}; 