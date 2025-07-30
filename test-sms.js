// Quick test script to verify Twilio SMS functionality
const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = '+19093230653';

const client = twilio(accountSid, authToken);

async function testSMS() {
  try {
    console.log('🧪 Testing Twilio SMS functionality...');
    console.log('📱 From:', fromNumber);
    console.log('📱 To: [YOUR PHONE NUMBER - REPLACE THIS]');
    
    // Your phone number
    const toNumber = '+13123950224';
    
    const result = await client.messages.create({
      body: '🎉 MyDataDay SMS Test - Twilio Working!\n\nThis SMS was sent from your emergency notification system. Your SMS notifications are ready! 🚀\n\n- MyDataDay Team',
      from: fromNumber,
      to: toNumber
    });

    console.log('✅ SMS sent successfully!');
    console.log('📱 Message SID:', result.sid);
    console.log('📱 Status:', result.status);
    console.log('📬 Check your phone for the test SMS!');
    
  } catch (error) {
    console.error('❌ SMS test failed:', error.message);
    
    if (error.message.includes('21610')) {
      console.log('🚨 A2P 10DLC registration required for this number');
      console.log('💡 You may need to complete the Twilio registration process');
    }
    
    if (error.message.includes('21614')) {
      console.log('🚨 Invalid phone number format');
      console.log('💡 Make sure phone number is in format: +1234567890');
    }
  }
}

console.log('🚀 Testing SMS to +13123950224...');
console.log('');

// Run the test
testSMS();
