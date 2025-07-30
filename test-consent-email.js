// Test script to send consent email to Michael Loy
require('dotenv').config({ path: '.env.local' })
const { Resend } = require('resend')

// Initialize Resend with the API key from .env.local
const resend = new Resend(process.env.RESEND_API_KEY)

async function sendConsentEmail() {
  console.log('🧪 Testing Consent Email to Michael Loy')
  console.log('==================================')
  
  const email = 'make.music.faster@gmail.com'
  const subject = 'Christopher Loy added you to their Emergency Support Team'
  
  const message = `Hi Michael!

Christopher Loy has added you to their Emergency Support Team on MyDataday - a personal goal achievement app that helps people succeed through social accountability.

Here's what this means:

🎯 WHAT IS MYDATADAY?
MyDataday helps people achieve their goals by creating a support network of people who care about them (like you!).

👥 YOUR ROLE AS EMERGENCY SUPPORT TEAM:
• You'll only be contacted if Christopher Loy misses their goals for 2+ consecutive days
• We'll ask you to send a quick check-in message (like "Hey, how are you doing?")
• You'll also get notified when they hit major milestones (7, 30, 60 day streaks) so you can celebrate with them!

📱 HOW IT WORKS:
• Day 1 missed: Our team reaches out to Christopher Loy with encouragement
• Day 2 missed: You get a notification asking you to check in
• Day 3+ missed: We may ask multiple Emergency Support Team members to help

🔒 YOUR PRIVACY:
• We only share Christopher Loy's goal progress, never personal details
• You can opt out anytime by replying to any message
• We typically contact Emergency Support Team members 1-2 times per month maximum

💪 WHY THIS WORKS:
People are 90% more likely to achieve their goals when they have social accountability. Your support could be the difference between Christopher Loy succeeding or giving up.

GIVE CONSENT:
https://mydataday.app/consent/test-member-id

If you'd prefer not to participate, that's completely okay! Just ignore this message and we won't contact you again.

Thanks for being someone Christopher Loy trusts and cares about! ❤️

- The MyDataday Team`

  try {
    console.log(`📧 Sending consent email to: ${email}`)
    console.log(`📧 From: ${process.env.MYDATADAY_FROM_EMAIL}`)
    
    const result = await resend.emails.send({
      from: process.env.MYDATADAY_FROM_EMAIL || 'hello@mydataday.app',
      to: email,
      subject: subject,
      html: formatEmailHTML(message)
    })

    console.log(`✅ Consent email sent successfully!`)
    console.log(`📧 Email ID: ${result.data?.id}`)
    console.log(`📬 Check ${email} for the consent request`)
    
  } catch (error) {
    console.error('❌ Failed to send consent email:', error)
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
sendConsentEmail()
