// Test project creation in Supabase
// This script will help debug the exact issue

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testProjectCreation() {
  console.log('🧪 Testing Project Creation Flow');
  
  // Test the exact project data structure we're sending
  const testProjectData = {
    user_id: 'b2ed95d6-9d20-44ed-ae45-ad08193600d0', // Your actual user ID
    name: 'Test Project',
    description: 'Test project for debugging',
    type: 'Web App',
  };
  
  console.log('📝 Test project data:', testProjectData);
  
  try {
    // Test 1: Try to insert directly
    console.log('\n🔄 Attempting to create project...');
    const { data, error } = await supabase
      .from('projects')
      .insert([testProjectData])
      .select()
      .single();
    
    if (error) {
      console.log('❌ Project creation failed:', error);
      console.log('📋 Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      
      // Test 2: Check if the user exists
      console.log('\n🔍 Checking if user exists in auth.users...');
      const { data: userData, error: userError } = await supabase.auth.admin.getUserById(testProjectData.user_id);
      
      if (userError) {
        console.log('❌ User check failed:', userError.message);
      } else {
        console.log('✅ User exists:', userData?.user?.email);
      }
      
      // Test 3: Check RLS policies
      console.log('\n🛡️ Testing RLS policies...');
      const { data: testSelect, error: selectError } = await supabase
        .from('projects')
        .select('*')
        .limit(1);
      
      if (selectError) {
        console.log('❌ Cannot even read projects table:', selectError.message);
      } else {
        console.log('✅ Can read projects table, found', testSelect?.length || 0, 'projects');
      }
      
    } else {
      console.log('✅ Project created successfully:', data);
      
      // Clean up - delete the test project
      const { error: deleteError } = await supabase
        .from('projects')
        .delete()
        .eq('id', data.id);
      
      if (deleteError) {
        console.log('⚠️ Could not delete test project:', deleteError.message);
      } else {
        console.log('🗑️ Test project cleaned up');
      }
    }
    
  } catch (exception) {
    console.error('💥 Unexpected error:', exception);
  }
}

testProjectCreation();