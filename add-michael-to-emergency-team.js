// Script to add Michael Loy to Christopher's emergency support team
require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function addMichaelToEmergencyTeam() {
  console.log('👥 Adding Michael Loy to Emergency Support Team')
  console.log('==============================================')
  
  try {
    // Get Christopher's user info
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
    
    // Check if Michael is already in the emergency support team
    const { data: existingMember } = await supabase
      .from('emergency_support_team')
      .select('*')
      .eq('user_id', user.id)
      .eq('email', 'make.music.faster@gmail.com')
      .single()

    if (existingMember) {
      console.log('✅ Michael Loy is already in the emergency support team!')
      console.log('🔗 Member ID:', existingMember.id)
      console.log('✅ Consent Given:', existingMember.consent_given ? 'Yes' : 'No')
      return
    }

    // Add Michael to the emergency support team
    const newMember = {
      user_id: user.id,
      name: 'Michael Loy',
      relationship: 'sibling',
      email: 'make.music.faster@gmail.com',
      phone: null, // We don't have his phone number
      preferred_contact_method: 'email',
      consent_given: false, // Will be updated when he gives consent
      milestone_notifications_enabled: true,
      escalation_notifications_enabled: true,
      is_active: true
    }

    const { data: insertedMember, error: insertError } = await supabase
      .from('emergency_support_team')
      .insert(newMember)
      .select()
      .single()

    if (insertError) {
      console.error('❌ Error adding Michael to emergency support team:', insertError)
      return
    }

    console.log('✅ Michael Loy added to emergency support team!')
    console.log('🔗 Member ID:', insertedMember.id)
    console.log('📧 Email:', insertedMember.email)
    console.log('👨‍👩‍👧‍👦 Relationship:', insertedMember.relationship)
    console.log('📞 Preferred Contact:', insertedMember.preferred_contact_method)
    
    console.log('\n📧 Now sending consent request...')
    
    // Now send consent request using the ConsentService logic
    const consentUrl = `${process.env.NEXT_PUBLIC_APP_URL}/consent/${insertedMember.id}`
    const subject = `${user.full_name} added you to their Emergency Support Team`
    
    const message = `Hi ${insertedMember.name}!

${user.full_name} has added you to their Emergency Support Team on MyDataday - a personal goal achievement app that helps people succeed through social accountability.

Here's what this means:

🎯 WHAT IS MYDATADAY?
MyDataday helps people achieve their goals by creating a support network of people who care about them (like you!).

👥 YOUR ROLE AS EMERGENCY SUPPORT TEAM:
• You'll only be contacted if ${user.full_name} misses their goals for 2+ consecutive days
• We'll ask you to send a quick check-in message (like "Hey, how are you doing?")
• You'll also get notified when they hit major milestones (7, 30, 60 day streaks) so you can celebrate with them!

📱 HOW IT WORKS:
• Day 1 missed: Our team reaches out to ${user.full_name} with encouragement
• Day 2 missed: You get a notification asking you to check in
• Day 3+ missed: We may ask multiple Emergency Support Team members to help

🔒 YOUR PRIVACY:
• We only share ${user.full_name}'s goal progress, never personal details
• You can opt out anytime by replying to any message
• We typically contact Emergency Support Team members 1-2 times per month maximum

💪 WHY THIS WORKS:
People are 90% more likely to achieve their goals when they have social accountability. Your support could be the difference between ${user.full_name} succeeding or giving up.

GIVE CONSENT:
${consentUrl}

If you'd prefer not to participate, that's completely okay! Just ignore this message and we won't contact you again.

Thanks for being someone ${user.full_name} trusts and cares about! ❤️

- The MyDataday Team`

    // Send consent email using the API endpoint
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/consent/send-all`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.id }),
      })

      if (response.ok) {
        console.log('✅ Consent request sent via API!')
      } else {
        console.log('⚠️  API call failed, but member was added successfully')
        console.log('💡 You can manually send consent email using the test script')
      }
    } catch (error) {
      console.log('⚠️  API call failed, but member was added successfully')
      console.log('💡 You can manually send consent email using: node send-consent-requests.js')
    }

  } catch (error) {
    console.error('❌ Error:', error)
  }
}

// Run the script
addMichaelToEmergencyTeam()
