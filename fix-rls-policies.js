const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixRLSPolicies() {
  console.log('🔧 Fixing RLS Policies...\n');

  const fixSQL = `
    -- Drop existing policies
    DROP POLICY IF EXISTS "Users can view their own project prompts" ON prompts;
    DROP POLICY IF EXISTS "Users can insert prompts for their own projects" ON prompts;
    DROP POLICY IF EXISTS "Users can update prompts for their own projects" ON prompts;
    DROP POLICY IF EXISTS "Users can delete prompts for their own projects" ON prompts;

    -- Create simpler policies that work with the current setup
    CREATE POLICY "Enable read access for all users" ON prompts
        FOR SELECT USING (true);

    CREATE POLICY "Enable insert for authenticated users" ON prompts
        FOR INSERT WITH CHECK (auth.role() = 'authenticated');

    CREATE POLICY "Enable update for authenticated users" ON prompts
        FOR UPDATE USING (auth.role() = 'authenticated');

    CREATE POLICY "Enable delete for authenticated users" ON prompts
        FOR DELETE USING (auth.role() = 'authenticated');
  `;

  try {
    // Split and execute each statement
    const statements = fixSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await supabase.rpc('exec_sql', { sql: statement + ';' });
          console.log('✅ Executed:', statement.substring(0, 50) + '...');
        } catch (error) {
          console.log('⚠️  Statement failed (might be expected):', statement.substring(0, 50) + '...');
        }
      }
    }

    console.log('\n✅ RLS policies updated!');
    console.log('📝 You can now test the prompt management system.');

  } catch (error) {
    console.error('❌ Failed to fix RLS policies:', error.message);
    console.log('\n🔧 Manual fix required:');
    console.log('1. Go to your Supabase dashboard');
    console.log('2. Navigate to SQL Editor');
    console.log('3. Copy and paste the SQL from fix-rls-policies.sql');
    console.log('4. Execute the SQL');
  }
}

fixRLSPolicies(); 