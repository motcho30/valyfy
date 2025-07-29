const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function debugPromptTable() {
  console.log('🔍 Debugging Prompt Table...\n');

  try {
    // 1. Check if table exists
    console.log('1. Checking if prompts table exists...');
    const { data: tableInfo, error: tableError } = await supabase
      .from('prompts')
      .select('*')
      .limit(1);

    if (tableError) {
      console.error('❌ Table error:', tableError);
      return;
    }

    console.log('✅ Table exists and is accessible\n');

    // 2. Check table structure
    console.log('2. Checking table structure...');
    const { data: columns, error: columnError } = await supabase
      .rpc('get_table_columns', { table_name: 'prompts' });

    if (columnError) {
      console.log('⚠️  Could not get column info via RPC, trying alternative method...');
      
      // Try to insert a test record to see what fields are expected
      const testData = {
        project_id: '00000000-0000-0000-0000-000000000000', // dummy UUID
        name: 'Test Prompt',
        content: 'Test content',
        category: 'Test',
        usage_count: 0
      };

      const { data: insertTest, error: insertError } = await supabase
        .from('prompts')
        .insert(testData)
        .select();

      if (insertError) {
        console.error('❌ Insert test failed:', insertError);
        console.log('\nExpected fields based on error:');
        console.log('- project_id (UUID)');
        console.log('- name (text)');
        console.log('- content (text)');
        console.log('- category (text)');
        console.log('- usage_count (integer)');
      } else {
        console.log('✅ Test insert successful');
        console.log('📋 Table structure appears correct');
        
        // Clean up test data
        await supabase
          .from('prompts')
          .delete()
          .eq('name', 'Test Prompt');
      }
    } else {
      console.log('📋 Table columns:', columns);
    }

    // 3. Check RLS policies
    console.log('\n3. Checking RLS policies...');
    const { data: policies, error: policyError } = await supabase
      .rpc('get_policies', { table_name: 'prompts' });

    if (policyError) {
      console.log('⚠️  Could not get policies via RPC');
    } else {
      console.log('📋 RLS policies:', policies);
    }

  } catch (error) {
    console.error('❌ Debug failed:', error);
  }
}

debugPromptTable(); 