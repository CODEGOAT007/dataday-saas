// Debug script to check why consent emails aren't being sent
console.log('🔍 Debugging Consent Email System')
console.log('================================')

// Check environment variables
console.log('📧 Email Configuration:')
console.log('RESEND_API_KEY:', process.env.RESEND_API_KEY ? '✅ Set' : '❌ Missing')
console.log('MYDATADAY_FROM_EMAIL:', process.env.MYDATADAY_FROM_EMAIL || '❌ Missing')
console.log('NODE_ENV:', process.env.NODE_ENV || 'undefined')
console.log('NEXT_PUBLIC_APP_URL:', process.env.NEXT_PUBLIC_APP_URL || '❌ Missing')

console.log('\n📱 SMS Configuration:')
console.log('TWILIO_ACCOUNT_SID:', process.env.TWILIO_ACCOUNT_SID ? '✅ Set' : '❌ Missing')
console.log('TWILIO_AUTH_TOKEN:', process.env.TWILIO_AUTH_TOKEN ? '✅ Set' : '❌ Missing')
console.log('TWILIO_PHONE_NUMBER:', process.env.TWILIO_PHONE_NUMBER || '❌ Missing')

console.log('\n🔍 Diagnosis:')
if (process.env.NODE_ENV === 'development') {
  console.log('⚠️  System is in DEVELOPMENT mode - emails are only logged, not sent!')
  console.log('   This is likely why Michael didn\'t receive the consent email.')
}

if (!process.env.RESEND_API_KEY) {
  console.log('❌ RESEND_API_KEY is missing - emails cannot be sent')
}

if (!process.env.MYDATADAY_FROM_EMAIL) {
  console.log('❌ MYDATADAY_FROM_EMAIL is missing - no sender address configured')
}

console.log('\n💡 Solutions:')
console.log('1. Set NODE_ENV=production in Vercel environment variables')
console.log('2. Configure RESEND_API_KEY in Vercel environment variables')
console.log('3. Set MYDATADAY_FROM_EMAIL=hello@mydataday.app in Vercel')
console.log('4. Manually send consent email using the emergency notification system')

console.log('\n🎯 Next Steps:')
console.log('- Check Vercel dashboard environment variables')
console.log('- Or use the emergency notification test to send Michael an email')
console.log('- The consent system should work once environment is properly configured')
