// Debug script to check SMS delivery status
const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

async function checkMessageStatus() {
  try {
    console.log('🔍 Checking recent SMS messages...');
    
    // Get recent messages
    const messages = await client.messages.list({ limit: 5 });
    
    console.log(`📱 Found ${messages.length} recent messages:`);
    console.log('');
    
    messages.forEach((message, index) => {
      console.log(`Message ${index + 1}:`);
      console.log(`  SID: ${message.sid}`);
      console.log(`  From: ${message.from}`);
      console.log(`  To: ${message.to}`);
      console.log(`  Status: ${message.status}`);
      console.log(`  Error Code: ${message.errorCode || 'None'}`);
      console.log(`  Error Message: ${message.errorMessage || 'None'}`);
      console.log(`  Date: ${message.dateCreated}`);
      console.log(`  Body: ${message.body.substring(0, 50)}...`);
      console.log('  ---');
    });
    
    // Check account info
    console.log('🏢 Account Information:');
    const account = await client.api.accounts(accountSid).fetch();
    console.log(`  Status: ${account.status}`);
    console.log(`  Type: ${account.type}`);
    
  } catch (error) {
    console.error('❌ Error checking messages:', error.message);
  }
}

async function sendSimpleTest() {
  try {
    console.log('🧪 Sending simple test SMS...');
    
    const result = await client.messages.create({
      body: 'Test from MyDataDay',
      from: '+19093230653',
      to: '+13123950224'
    });

    console.log('✅ Message sent!');
    console.log(`📱 SID: ${result.sid}`);
    console.log(`📱 Status: ${result.status}`);
    
    // Wait a moment then check status
    setTimeout(async () => {
      try {
        const message = await client.messages(result.sid).fetch();
        console.log(`📱 Updated Status: ${message.status}`);
        console.log(`📱 Error Code: ${message.errorCode || 'None'}`);
        console.log(`📱 Error Message: ${message.errorMessage || 'None'}`);
      } catch (err) {
        console.error('Error fetching message status:', err.message);
      }
    }, 5000);
    
  } catch (error) {
    console.error('❌ SMS failed:', error.message);
    console.error('Full error:', error);
  }
}

console.log('🔍 SMS Debugging Tool');
console.log('====================');

checkMessageStatus().then(() => {
  console.log('');
  console.log('🧪 Sending new test...');
  sendSimpleTest();
});
