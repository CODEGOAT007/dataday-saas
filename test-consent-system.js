// Test the consent system by sending consent requests to all pending members
require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')
const { Resend } = require('resend')

// Initialize services
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)
const resend = new Resend(process.env.RESEND_API_KEY)

async function testConsentSystem() {
  console.log('🧪 Testing Consent System')
  console.log('=========================')
  
  try {
    const userId = '9fc00f52-b0aa-4a01-8a3d-a72b0992577e'
    
    // Get user info
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (userError || !user) {
      console.error('❌ User not found:', userError)
      return
    }

    console.log('👤 User:', user.full_name, '(' + user.email + ')')
    
    // Get pending members (those without consent)
    const { data: pendingMembers, error: membersError } = await supabase
      .from('emergency_support_team')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .eq('consent_given', false)

    if (membersError) {
      console.error('❌ Error fetching pending members:', membersError)
      return
    }

    if (!pendingMembers || pendingMembers.length === 0) {
      console.log('✅ No pending consent requests found')
      return
    }

    console.log(`📧 Found ${pendingMembers.length} members needing consent:`)
    pendingMembers.forEach(member => {
      console.log(`   • ${member.name} (${member.email}) - ${member.preferred_contact_method}`)
    })

    // Send consent requests to each member
    for (const member of pendingMembers) {
      console.log(`\n📧 Sending consent request to ${member.name}...`)
      
      const consentUrl = `${process.env.NEXT_PUBLIC_APP_URL}/consent/${member.id}`
      const subject = `${user.full_name} added you to their Emergency Support Team`
      
      const message = `Hi ${member.name}!

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

      // Send email if preferred method is email
      if (member.preferred_contact_method === 'email' && member.email) {
        try {
          const result = await resend.emails.send({
            from: process.env.MYDATADAY_FROM_EMAIL,
            to: member.email,
            subject: subject,
            html: formatEmailHTML(message)
          })

          console.log(`   ✅ Email sent to ${member.email} - ID: ${result.data?.id}`)
          
          // Update consent_date to track that we sent the request
          await supabase
            .from('emergency_support_team')
            .update({
              consent_date: new Date().toISOString(),
              consent_method: 'email',
              updated_at: new Date().toISOString()
            })
            .eq('id', member.id)
            
        } catch (error) {
          console.error(`   ❌ Failed to send email to ${member.email}:`, error.message)
        }
      } else {
        console.log(`   ⚠️  Skipping ${member.name} - preferred method: ${member.preferred_contact_method}`)
      }
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    console.log('\n🎉 Consent system test complete!')
    
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

function formatEmailHTML(message) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
      <!-- Header with Logo -->
      <div style="text-align: center; margin-bottom: 30px; padding: 20px; background: linear-gradient(135deg, #1e3a8a 0%, #7c3aed 50%, #3730a3 100%); border-radius: 12px;">
        <div style="display: inline-flex; align-items: center; gap: 12px; color: white;">
          <!-- Calendar Check Logo -->
          <div style="width: 40px; height: 40px; background-color: #000000; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center;">
            <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
              <!-- Calendar with white stroke -->
              <g stroke="white" stroke-width="2" fill="none">
                <!-- Calendar body -->
                <rect x="7" y="8" width="18" height="16" rx="2" ry="2" />
                <!-- Calendar rings/hangers -->
                <path d="M20 6v4M12 6v4" stroke-linecap="round" />
                <!-- Calendar header line -->
                <path d="M7 13h18" />
              </g>
              <!-- Green checkmark -->
              <path d="M13 18l2 2L19 16" stroke="#22c55e" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" fill="none" />
            </svg>
          </div>
          <span style="font-size: 24px; font-weight: 600; color: white; margin-left: 6px;">MyDataDay</span>
        </div>
      </div>
      
      <div style="line-height: 1.6; color: #374151;">
        ${message.split('\n').map(line => {
          if (line.trim() === '') return '<br>'
          if (line.startsWith('🎯') || line.startsWith('👥') || line.startsWith('📱') || line.startsWith('🔒') || line.startsWith('💪')) {
            return `<h3 style="color: #1f2937; margin-top: 25px; margin-bottom: 10px;">${line}</h3>`
          }
          if (line.startsWith('•')) {
            return `<div style="margin-left: 20px; margin-bottom: 8px;">${line}</div>`
          }
          if (line.startsWith('GIVE CONSENT:')) {
            return `<div style="text-align: center; margin: 30px 0;"><a href="${line.replace('GIVE CONSENT:', '').trim()}" style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">✅ Give Consent</a></div>`
          }
          return `<p style="margin-bottom: 15px;">${line}</p>`
        }).join('')}
      </div>
      
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
      
      <div style="text-align: center; color: #6b7280; font-size: 14px;">
        <p style="margin: 0;">
          <strong>- The MyDataDay Team</strong><br>
          <em>Helping people achieve their goals through social accountability</em>
        </p>
      </div>
    </div>
  `
}

// Run the test
testConsentSystem()
