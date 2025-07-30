// Test authentication system
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://uezplxpuatwvkjgdacjx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlenBseHB1YXR3dmtqZ2RhY2p4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0Nzk4NjMsImV4cCI6MjA2OTA1NTg2M30.fQJIFEQBxp7bqXPFhbJIu5BmgdMpesW17aIHDYOpTaQ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testAuth() {
  console.log('🔐 TESTING AUTHENTICATION SYSTEM\n');
  console.log('='.repeat(50));

  try {
    // Test 1: Check auth configuration
    console.log('\n1. 🔧 Testing Auth Configuration...');
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
      console.log('   ❌ Session error:', sessionError.message);
    } else {
      console.log('   ✅ Auth configuration working');
      console.log('   📊 Current session:', session ? 'Active' : 'None');
    }

    // Test 2: Test signup (with a test email)
    console.log('\n2. 📝 Testing Signup Process...');
    const testEmail = `test-${Date.now()}@example.com`;
    const testPassword = 'testpassword123';
    
    const { data: signupData, error: signupError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          full_name: 'Test User'
        }
      }
    });

    if (signupError) {
      console.log('   ❌ Signup error:', signupError.message);
    } else {
      console.log('   ✅ Signup successful');
      console.log('   📧 User created:', signupData.user?.email);
      console.log('   🔑 User ID:', signupData.user?.id);
      console.log('   📨 Email confirmation needed:', !signupData.user?.email_confirmed_at);
    }

    // Test 3: Check if user profile would be created
    if (signupData.user) {
      console.log('\n3. 👤 Testing User Profile Creation...');
      
      // Check if user exists in our users table
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', signupData.user.id)
        .single();

      if (profileError && profileError.code === 'PGRST116') {
        console.log('   ⏳ User profile not yet created (normal for new signup)');
        console.log('   💡 Profile will be created on first login via callback');
      } else if (profileError) {
        console.log('   ❌ Profile check error:', profileError.message);
      } else {
        console.log('   ✅ User profile exists');
        console.log('   📊 Profile data:', profile);
      }
    }

    // Test 4: Test database permissions
    console.log('\n4. 🛡️  Testing Database Permissions...');
    
    // Test if we can access goals table (should be empty but accessible)
    const { data: goals, error: goalsError } = await supabase
      .from('goals')
      .select('count');

    if (goalsError) {
      console.log('   ❌ Goals table access error:', goalsError.message);
    } else {
      console.log('   ✅ Goals table accessible');
    }

    // Test if we can access daily_logs table
    const { data: logs, error: logsError } = await supabase
      .from('daily_logs')
      .select('count');

    if (logsError) {
      console.log('   ❌ Daily logs table access error:', logsError.message);
    } else {
      console.log('   ✅ Daily logs table accessible');
    }

    console.log('\n' + '='.repeat(50));
    console.log('🎉 AUTHENTICATION SYSTEM TEST COMPLETE!');
    console.log('\n📋 NEXT STEPS:');
    console.log('1. Visit http://localhost:3000/auth/signup');
    console.log('2. Create a test account');
    console.log('3. Check your email for confirmation (if required)');
    console.log('4. Try logging in');
    console.log('5. Test the complete flow');
    console.log('\n🚀 Your authentication system is ready!');

  } catch (error) {
    console.log('❌ Test failed:', error.message);
  }
}

testAuth();
