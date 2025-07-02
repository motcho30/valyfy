// Check current database schema
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkSchema() {
  console.log('🔍 Checking database schema...');
  
  try {
    // Check projects table structure
    console.log('\n📋 Projects table structure:');
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('*')
      .limit(1);
    
    if (projectsError) {
      console.log('❌ Error:', projectsError.message);
    } else if (projects && projects.length > 0) {
      console.log('✅ Columns:', Object.keys(projects[0]));
    } else {
      console.log('📭 No projects found, cannot determine structure');
    }
    
    // Check project_files table structure
    console.log('\n📁 Project files table structure:');
    const { data: files, error: filesError } = await supabase
      .from('project_files')
      .select('*')
      .limit(1);
    
    if (filesError) {
      console.log('❌ Error:', filesError.message);
    } else if (files && files.length > 0) {
      console.log('✅ Columns:', Object.keys(files[0]));
    } else {
      console.log('📭 No files found, cannot determine structure');
    }
    
    // Try to check table schema directly (might not work with RLS)
    console.log('\n🔍 Attempting to get table info...');
    
    // Check if additional columns exist by trying to select them
    console.log('\n🧪 Testing if extended fields exist...');
    
    const { data: testProjects, error: testError } = await supabase
      .from('projects')
      .select('id, name, features, design_data, metadata, project_type')
      .limit(1);
    
    if (testError) {
      console.log('❌ Extended fields test failed:', testError.message);
      console.log('💡 Suggestion: You need to run the schema update SQL');
    } else {
      console.log('✅ Extended fields exist!');
      if (testProjects && testProjects.length > 0) {
        console.log('📊 Sample with extended fields:', testProjects[0]);
      }
    }
    
  } catch (error) {
    console.error('💥 Error checking schema:', error);
  }
}

checkSchema();