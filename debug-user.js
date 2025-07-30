// Debug user profile creation
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://uezplxpuatwvkjgdacjx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlenBseHB1YXR3dmtqZ2RhY2p4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE7NTM0Nzk4NjMsImV4cCI6MjA2OTA1NTg2M30.fQJIFEQBxp7bqXPFhbJIu5BmgdMpesW17aIHDYOpTaQ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugUser() {
  console.log('🔍 DEBUGGING USER PROFILE ISSUE\n');

  try {
    // Check current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
      console.log('❌ Session error:', sessionError.message);
      return;
    }

    if (!session) {
      console.log('❌ No active session found');
      return;
    }

    console.log('✅ Active session found');
    console.log('📧 User email:', session.user.email);
    console.log('🆔 User ID:', session.user.id);

    // Check if user profile exists
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (profileError) {
      if (profileError.code === 'PGRST116') {
        console.log('❌ User profile does not exist in users table');
        console.log('💡 Creating user profile now...');
        
        // Create the user profile
        const { data: newProfile, error: insertError } = await supabase
          .from('users')
          .insert({
            id: session.user.id,
            email: session.user.email,
            full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single();

        if (insertError) {
          console.log('❌ Error creating profile:', insertError.message);
        } else {
          console.log('✅ User profile created successfully');
          console.log('👤 Profile:', newProfile);
        }
      } else {
        console.log('❌ Profile check error:', profileError.message);
      }
    } else {
      console.log('✅ User profile exists');
      console.log('👤 Profile:', profile);
      
      if (profile.onboarding_completed_at) {
        console.log('✅ Onboarding already completed at:', profile.onboarding_completed_at);
      } else {
        console.log('⏳ Onboarding not yet completed');
        console.log('💡 Completing onboarding now...');
        
        const { error: updateError } = await supabase
          .from('users')
          .update({ 
            onboarding_completed_at: new Date().toISOString() 
          })
          .eq('id', session.user.id);

        if (updateError) {
          console.log('❌ Error completing onboarding:', updateError.message);
        } else {
          console.log('✅ Onboarding completed successfully');
        }
      }
    }

  } catch (error) {
    console.log('❌ Debug failed:', error.message);
  }
}

debugUser();
