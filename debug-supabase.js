// Debug script to test Supabase connection
// Run this with: node debug-supabase.js

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

console.log('🔍 Debugging Supabase Connection');
console.log('📍 Supabase URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
console.log('🔑 Supabase Key:', supabaseAnonKey ? '✅ Set' : '❌ Missing');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing environment variables. Check your .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  try {
    console.log('\n🧪 Testing Supabase connection...');
    
    // Test 1: Check if we can connect
    const { data, error } = await supabase.from('profiles').select('id').limit(1);
    if (error) {
      console.log('❌ Connection test failed:', error.message);
      return;
    }
    console.log('✅ Connection successful');
    
    // Test 2: Check projects table structure
    console.log('\n📋 Checking projects table...');
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('*')
      .limit(1);
    
    if (projectsError) {
      console.log('❌ Projects table error:', projectsError.message);
    } else {
      console.log('✅ Projects table accessible');
      if (projects && projects.length > 0) {
        console.log('📊 Sample project structure:', Object.keys(projects[0]));
      }
    }
    
    // Test 3: Check project_files table structure
    console.log('\n📁 Checking project_files table...');
    const { data: files, error: filesError } = await supabase
      .from('project_files')
      .select('*')
      .limit(1);
    
    if (filesError) {
      console.log('❌ Project files table error:', filesError.message);
    } else {
      console.log('✅ Project files table accessible');
      if (files && files.length > 0) {
        console.log('📊 Sample file structure:', Object.keys(files[0]));
      }
    }
    
    // Test 4: Check auth status (will be null without login)
    console.log('\n🔐 Checking auth status...');
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError) {
      console.log('❌ Auth error:', authError.message);
    } else {
      console.log('✅ Auth working (user:', user ? 'logged in' : 'not logged in', ')');
    }
    
  } catch (error) {
    console.error('💥 Unexpected error:', error);
  }
}

testConnection();