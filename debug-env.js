// Load environment variables
require('dotenv').config();

// Debug environment variables
console.log('=== Environment Variables Debug ===');
console.log('REACT_APP_SUPABASE_URL:', process.env.REACT_APP_SUPABASE_URL);
console.log('REACT_APP_SUPABASE_ANON_KEY:', process.env.REACT_APP_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET');
console.log('REACT_APP_SUPABASE_ANON_KEY length:', process.env.REACT_APP_SUPABASE_ANON_KEY?.length || 0);
console.log('REACT_APP_SUPABASE_ANON_KEY starts with:', process.env.REACT_APP_SUPABASE_ANON_KEY?.substring(0, 10) || 'N/A');

// Test Supabase connection
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

console.log('\n=== Supabase Connection Test ===');
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing environment variables!');
  console.log('URL:', supabaseUrl ? 'SET' : 'MISSING');
  console.log('KEY:', supabaseAnonKey ? 'SET' : 'MISSING');
  process.exit(1);
}

if (supabaseAnonKey === 'YOUR_SUPABASE_ANON_KEY_HERE') {
  console.error('❌ Placeholder key detected! Please update your .env file with the real key.');
  console.log('Go to: https://kjwwfmmciwsamjjfcwio.supabase.co/project/settings/api');
  console.log('Copy the "anon public" key and replace YOUR_SUPABASE_ANON_KEY_HERE in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testAuth() {
  try {
    console.log('🧪 Testing auth signup...');
    const { data, error } = await supabase.auth.signUp({
      email: 'test@example.com',
      password: 'testpassword123'
    });
    
    if (error) {
      console.error('❌ Auth test failed:', error.message);
      if (error.message.includes('Invalid API key')) {
        console.log('🔧 Fix: Update your .env file with the correct Supabase anon key');
      }
    } else {
      console.log('✅ Auth test successful (user may already exist)');
    }
  } catch (err) {
    console.error('💥 Auth test exception:', err.message);
  }
}

testAuth(); 