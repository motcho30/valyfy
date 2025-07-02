// Test project file creation
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testFileCreation() {
  console.log('🧪 Testing Project File Creation');
  
  try {
    // First, check if there are any projects we can use
    console.log('\n🔍 Looking for existing projects...');
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('id, name')
      .limit(1);
    
    if (projectsError) {
      console.log('❌ Cannot read projects:', projectsError.message);
      return;
    }
    
    if (!projects || projects.length === 0) {
      console.log('📭 No projects found to test with');
      return;
    }
    
    const testProject = projects[0];
    console.log('✅ Using project:', testProject.name, 'ID:', testProject.id);
    
    // Test creating a file
    const testFileData = {
      project_id: testProject.id,
      file_name: 'test-file.md',
      file_type: 'Test File',
      content: 'This is a test file content for debugging.',
      file_content: 'This is a test file content for debugging.',
      file_size: 45,
      metadata: {
        test: true,
        created_via: 'debug_script'
      }
    };
    
    console.log('\n📝 Attempting to create test file...');
    console.log('📋 File data:', testFileData);
    
    const { data: fileResult, error: fileError } = await supabase
      .from('project_files')
      .insert([testFileData])
      .select()
      .single();
    
    if (fileError) {
      console.log('❌ File creation failed:', fileError);
      console.log('📋 Error details:', {
        message: fileError.message,
        details: fileError.details,
        hint: fileError.hint,
        code: fileError.code
      });
      
      // Check table structure
      console.log('\n🔍 Checking project_files table structure...');
      const { data: tableData, error: tableError } = await supabase
        .from('project_files')
        .select('*')
        .limit(1);
      
      if (tableError) {
        console.log('❌ Cannot read project_files table:', tableError.message);
      } else {
        console.log('✅ Table accessible, found', tableData?.length || 0, 'existing files');
        if (tableData && tableData.length > 0) {
          console.log('📊 Table structure:', Object.keys(tableData[0]));
        }
      }
      
    } else {
      console.log('✅ Test file created successfully:', fileResult);
      
      // Clean up
      console.log('\n🗑️ Cleaning up test file...');
      const { error: deleteError } = await supabase
        .from('project_files')
        .delete()
        .eq('id', fileResult.id);
      
      if (deleteError) {
        console.log('⚠️ Could not delete test file:', deleteError.message);
      } else {
        console.log('✅ Test file cleaned up');
      }
    }
    
  } catch (exception) {
    console.error('💥 Unexpected error:', exception);
  }
}

testFileCreation();