// Direct test of email notification system
const { Resend } = require('resend');

const resend = new Resend('re_SFJG5Qzf_2DdwEDAnHXWqVZcs9CQWhXXK');

async function testEmergencySupportTeamEmail() {
  try {
    console.log('🧪 Testing Emergency Support Team Email Notification');
    console.log('==================================================');
    
    const emergencyMessage = `Hi Test Contact!

Christopher Loy asked you to be part of their Emergency Support Team for achieving their goals on MyDataDay.

They've missed their "Work on MyDataDay Every day for at least 30 minutes." goal for 2 days now and could use some encouragement from someone who cares about them.

Could you reach out and check in? Sometimes a simple "How are you doing?" from a friend makes all the difference! ❤️

Thanks for being an amazing support person!

- The MyDataDay Team

(Note: SMS notifications temporarily unavailable - sent via email instead)`;

    console.log('📧 Sending emergency support team notification...');
    console.log('📧 To: christopher.j.loy+test1@gmail.com');
    console.log('📧 From: hello@mydataday.app');
    console.log('');
    
    const result = await resend.emails.send({
      from: 'hello@mydataday.app',
      to: 'christopher.j.loy+test1@gmail.com',
      subject: 'Christopher Loy added you to their Emergency Support Team',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
          <!-- Header with Logo -->
          <div style="text-align: center; margin-bottom: 30px; padding: 20px; background: linear-gradient(135deg, #1e3a8a 0%, #7c3aed 50%, #3730a3 100%); border-radius: 12px;">
            <div style="display: inline-flex; align-items: center; gap: 12px; color: white;">
              <!-- Calendar Check Logo (Matches Gravatar - Black circle, white calendar, green check) -->
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

          <h2 style="color: #dc2626; margin-bottom: 20px; text-align: center;">🚨 Emergency Support Team Notification</h2>

          <p style="font-size: 16px; line-height: 1.6; color: #374151;">Hi <strong>Test Contact</strong>!</p>

          <p style="font-size: 16px; line-height: 1.6; color: #374151;"><strong>Christopher Loy</strong> asked you to be part of their Emergency Support Team for achieving their goals on MyDataDay.</p>

          <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 25px 0; border-radius: 6px;">
            <p style="margin: 0; font-weight: 600; color: #92400e;"><strong>⚠️ They've missed their daily goal for 2 days now</strong> and could use some encouragement from someone who cares about them.</p>
          </div>

          <p style="font-size: 16px; line-height: 1.6; color: #374151;">Could you reach out and check in? Sometimes a simple <em>"How are you doing?"</em> from a friend makes all the difference! ❤️</p>

          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <p style="margin: 0; font-size: 14px; color: #6b7280; text-align: center;">
              <strong>💡 Quick ways to help:</strong><br>
              Send a text • Make a call • Drop by for coffee • Just say "thinking of you"
            </p>
          </div>

          <p style="font-size: 16px; line-height: 1.6; color: #374151;">Thanks for being an amazing support person!</p>

          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">

          <div style="text-align: center;">
            <p style="color: #6b7280; font-size: 14px; margin: 0;">
              <strong>- The MyDataDay Team</strong><br>
              <em>Helping people achieve their goals through social accountability</em><br>
              <small style="color: #9ca3af;">Note: SMS notifications temporarily unavailable - sent via email instead</small>
            </p>
          </div>
        </div>
      `
    });

    console.log('✅ Emergency support team email sent successfully!');
    console.log('📧 Email ID:', result.data?.id);
    console.log('');
    console.log('📬 Check your Gmail inbox (christopher.j.loy+test1@gmail.com)');
    console.log('📬 Look for subject: "Christopher Loy needs encouragement"');
    
    // Send to additional test contacts
    console.log('');
    console.log('📧 Sending to additional test contacts...');
    
    const additionalContacts = [
      'christopher.j.loy+test2@gmail.com',
      'christopher.j.loy+testebf20354-6d07-4624-ba83-e9124e506a23@gmail.com'
    ];
    
    for (const email of additionalContacts) {
      try {
        const result2 = await resend.emails.send({
          from: 'hello@mydataday.app',
          to: email,
          subject: 'Christopher Loy needs encouragement',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #2563eb;">🚨 Emergency Support Team Notification</h2>
              <p>Hi there!</p>
              <p><strong>Christopher Loy</strong> asked you to be part of their Emergency Support Team for achieving their goals on MyDataDay.</p>
              <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0;">
                <p><strong>⚠️ They've missed their goal for 2 days now</strong> and could use some encouragement!</p>
              </div>
              <p>Could you reach out and check in? ❤️</p>
              <p>Thanks for being an amazing support person!</p>
              <hr style="margin: 30px 0;">
              <p style="color: #6b7280; font-size: 14px;"><strong>- The MyDataDay Team</strong></p>
            </div>
          `
        });
        
        console.log(`✅ Sent to ${email} - ID: ${result2.data?.id}`);
      } catch (error) {
        console.log(`❌ Failed to send to ${email}:`, error.message);
      }
    }
    
    console.log('');
    console.log('🎉 Emergency Support Team Email Test Complete!');
    console.log('📧 Check all your Gmail inboxes for the notifications');
    
  } catch (error) {
    console.error('❌ Email test failed:', error.message);
  }
}

console.log('🚨 This will send REAL emergency support team emails!');
console.log('📧 They will go to your Gmail test addresses.');
console.log('');

// Run the test
testEmergencySupportTeamEmail();
