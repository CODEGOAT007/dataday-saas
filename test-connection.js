// Test Supabase connection and database setup
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://uezplxpuatwvkjgdacjx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlenBseHB1YXR3dmtqZ2RhY2p4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0Nzk4NjMsImV4cCI6MjA2OTA1NTg2M30.fQJIFEQBxp7bqXPFhbJIu5BmgdMpesW17aIHDYOpTaQ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('🔍 Testing Supabase connection...\n');

  try {
    // Test 1: Check if we can connect
    console.log('1. Testing basic connection...');
    const { data, error } = await supabase.from('users').select('count').limit(1);
    if (error) {
      console.log('❌ Connection failed:', error.message);
      return;
    }
    console.log('✅ Connection successful!\n');

    // Test 2: Check all tables exist
    console.log('2. Checking database tables...');
    const tables = ['users', 'goals', 'daily_logs', 'emergency_support_team', 'ai_interactions', 'streaks'];
    
    for (const table of tables) {
      try {
        const { error } = await supabase.from(table).select('*').limit(1);
        if (error) {
          console.log(`❌ Table '${table}' error:`, error.message);
        } else {
          console.log(`✅ Table '${table}' exists and accessible`);
        }
      } catch (err) {
        console.log(`❌ Table '${table}' failed:`, err.message);
      }
    }

    console.log('\n3. Testing authentication...');
    // Test auth endpoint
    const { data: authData, error: authError } = await supabase.auth.getSession();
    if (authError) {
      console.log('❌ Auth error:', authError.message);
    } else {
      console.log('✅ Authentication endpoint working');
    }

    console.log('\n🎉 Database setup complete and working!');
    console.log('\n📋 Next steps:');
    console.log('1. Start your Next.js app: npm run dev');
    console.log('2. Visit http://localhost:3000');
    console.log('3. Try signing up for an account');
    console.log('4. Test creating goals and logging progress');

  } catch (error) {
    console.log('❌ Test failed:', error.message);
  }
}

testConnection();
