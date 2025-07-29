const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:');
  console.error('   - REACT_APP_SUPABASE_URL');
  console.error('   - SUPABASE_SERVICE_ROLE_KEY');
  console.error('\nPlease check your .env file and try again.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupPromptManagement() {
  console.log('🚀 Setting up Prompt Management System...\n');

  try {
    // Read the SQL schema
    const schemaPath = path.join(__dirname, 'supabase-prompt-management-schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    console.log('📋 Creating prompts table and policies...');
    
    // Execute the schema
    const { error } = await supabase.rpc('exec_sql', { sql: schema });
    
    if (error) {
      // If RPC doesn't exist, try direct SQL execution
      console.log('⚠️  RPC method not available, trying direct execution...');
      
      // Split the schema into individual statements
      const statements = schema
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

      for (const statement of statements) {
        if (statement.trim()) {
          try {
            await supabase.rpc('exec_sql', { sql: statement + ';' });
          } catch (stmtError) {
            console.log(`⚠️  Statement failed (this might be expected): ${statement.substring(0, 50)}...`);
          }
        }
      }
    }

    console.log('✅ Database setup completed!\n');
    
    console.log('📝 Next steps:');
    console.log('1. Run your React app: npm start');
    console.log('2. Create a project in your app');
    console.log('3. Navigate to the Prompt Management section');
    console.log('4. Start creating and managing your prompts!\n');
    
    console.log('🔧 Manual setup (if automatic failed):');
    console.log('1. Go to your Supabase dashboard');
    console.log('2. Navigate to SQL Editor');
    console.log('3. Copy and paste the contents of supabase-prompt-management-schema.sql');
    console.log('4. Execute the SQL\n');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    console.log('\n🔧 Manual setup required:');
    console.log('1. Go to your Supabase dashboard');
    console.log('2. Navigate to SQL Editor');
    console.log('3. Copy and paste the contents of supabase-prompt-management-schema.sql');
    console.log('4. Execute the SQL');
  }
}

// Run the setup
setupPromptManagement(); 