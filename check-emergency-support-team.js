// Script to check emergency support team members and their consent status
require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function checkEmergencySupportTeam() {
  console.log('🔍 Checking Emergency Support Team for christopher.j.loy@gmail.com')
  console.log('================================================================')
  
  try {
    // Get user info
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'christopher.j.loy@gmail.com')
      .single()

    if (userError) {
      console.error('❌ User lookup error:', userError)
      return
    }

    if (!user) {
      console.log('❌ User not found')
      return
    }

    console.log('👤 User:', user.full_name, '(' + user.email + ')')
    console.log('🆔 User ID:', user.id)
    
    // Get emergency support team members
    const { data: members, error: membersError } = await supabase
      .from('emergency_support_team')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })

    if (membersError) {
      console.error('❌ Error fetching emergency support team:', membersError)
      return
    }

    if (!members || members.length === 0) {
      console.log('📭 No emergency support team members found')
      return
    }

    console.log(`\n👥 Emergency Support Team (${members.length} members):`)
    console.log('=' .repeat(60))
    
    members.forEach((member, index) => {
      console.log(`\n${index + 1}. ${member.name}`)
      console.log(`   🔗 ID: ${member.id}`)
      console.log(`   👨‍👩‍👧‍👦 Relationship: ${member.relationship}`)
      console.log(`   📧 Email: ${member.email || 'Not provided'}`)
      console.log(`   📱 Phone: ${member.phone || 'Not provided'}`)
      console.log(`   📞 Preferred Contact: ${member.preferred_contact_method}`)
      console.log(`   ✅ Consent Given: ${member.consent_given ? '✅ Yes' : '❌ No'}`)
      console.log(`   📅 Consent Date: ${member.consent_date || 'Not set'}`)
      console.log(`   🔧 Consent Method: ${member.consent_method || 'Not set'}`)
      console.log(`   🟢 Active: ${member.is_active ? '✅ Yes' : '❌ No'}`)
      console.log(`   📊 Contact Count: ${member.contact_count}`)
      console.log(`   📈 Response Count: ${member.response_count}`)
      console.log(`   🎉 Milestone Notifications: ${member.milestone_notifications_enabled ? '✅ Enabled' : '❌ Disabled'}`)
      console.log(`   🚨 Escalation Notifications: ${member.escalation_notifications_enabled ? '✅ Enabled' : '❌ Disabled'}`)
      console.log(`   📅 Created: ${new Date(member.created_at).toLocaleDateString()}`)
      console.log(`   🔄 Updated: ${new Date(member.updated_at).toLocaleDateString()}`)
    })

    // Check for pending consent requests
    const pendingMembers = members.filter(member => 
      member.is_active && (member.consent_given === null || member.consent_given === false)
    )

    if (pendingMembers.length > 0) {
      console.log(`\n⏳ Pending Consent Requests (${pendingMembers.length}):`)
      console.log('=' .repeat(40))
      pendingMembers.forEach(member => {
        console.log(`• ${member.name} (${member.preferred_contact_method})`)
      })
      
      console.log('\n💡 To send consent requests to pending members:')
      console.log('   1. Use the /api/consent/send-all endpoint')
      console.log('   2. Or run: node send-consent-requests.js')
    } else {
      console.log('\n✅ All active members have given consent!')
    }

  } catch (error) {
    console.error('❌ Error:', error)
  }
}

// Run the check
checkEmergencySupportTeam()
