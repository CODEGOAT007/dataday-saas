// Quick test script to verify Resend email functionality
const { Resend } = require('resend');

const resend = new Resend('re_SFJG5Qzf_2DdwEDAnHXWqVZcs9CQWhXXK');

async function testEmail() {
  try {
    console.log('🧪 Testing Resend email functionality...');
    
    const result = await resend.emails.send({
      from: 'hello@mydataday.app',
      to: 'christopher.j.loy@gmail.com',
      subject: '🎉 MyDataDay Email Test - Resend Working!',
      html: `
        <h2>🎉 Email Test Successful!</h2>
        <p>This email was sent from your MyDataDay notification system using:</p>
        <ul>
          <li><strong>Service:</strong> Resend</li>
          <li><strong>From:</strong> hello@mydataday.app</li>
          <li><strong>API Key:</strong> Configured ✅</li>
          <li><strong>Time:</strong> ${new Date().toISOString()}</li>
        </ul>
        <p>Your emergency support team notifications are now ready to work! 🚀</p>
        <hr>
        <p><em>This is a test email from MyDataDay notification system.</em></p>
      `
    });

    console.log('✅ Email sent successfully!');
    console.log('📧 Email ID:', result.data?.id);
    console.log('📬 Check your Gmail inbox for the test email');
    
  } catch (error) {
    console.error('❌ Email test failed:', error);
  }
}

testEmail();
