// Test script to trigger emergency support team email notifications
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://uezplxpuatwvkjgdacjx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlenBseHB1YXR3dmtqZ2RhY2p4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0Nzk4NjMsImV4cCI6MjA2OTA1NTg2M30.fQJIFEQBxp7bqXPFhbJIu5BmgdMpesW17aIHDYOpTaQ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testEscalationNotifications() {
  try {
    console.log('🧪 Testing Emergency Support Team Email Notifications');
    console.log('====================================================');
    
    // Get your user info
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'christopher.j.loy@gmail.com')
      .single();

    if (userError) {
      console.log('❌ User lookup error:', userError);
      return;
    }

    if (!user) {
      console.log('❌ User not found');
      return;
    }

    console.log('👤 User:', user.full_name, '(' + user.email + ')');
    
    // Get your goals
    const { data: goals } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', user.id);
    
    console.log('🎯 Goals found:', goals.length);
    
    if (goals.length === 0) {
      console.log('❌ No goals found. Create a goal first!');
      return;
    }
    
    const goal = goals[0];
    console.log('🎯 Testing with goal:', goal.title);
    
    // Get emergency support team
    const { data: supportTeam } = await supabase
      .from('emergency_support_team')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true);
    
    console.log('👥 Emergency Support Team members:', supportTeam.length);
    
    supportTeam.forEach((member, index) => {
      console.log(`  ${index + 1}. ${member.name} (${member.email}) - ${member.notification_method}`);
    });
    
    console.log('');
    console.log('🚨 Simulating Day 2 Escalation (Emergency Support Team Notification)');
    console.log('This will send emails to all your emergency support team members!');
    console.log('');
    
    // Call the escalation API endpoint
    console.log('📞 Calling escalation API...');
    
    const response = await fetch('https://mydataday.app/api/escalations/process', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Note: In production this would need proper auth token
      }
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Escalation API called successfully!');
      console.log('📧 Check your Gmail inboxes for emergency support team notifications!');
      console.log('');
      console.log('Expected emails:');
      supportTeam.forEach((member, index) => {
        console.log(`  📧 ${member.email}`);
      });
    } else {
      console.log('❌ Escalation API failed:', response.status, response.statusText);
      const error = await response.text();
      console.log('Error details:', error);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

console.log('⚠️  This will send REAL emails to your emergency support team!');
console.log('📧 Make sure you want to test this before proceeding.');
console.log('');

// Run the test
testEscalationNotifications();
