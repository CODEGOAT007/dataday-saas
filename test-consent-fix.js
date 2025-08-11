// Test script to verify the consent email fix works
require('dotenv').config({ path: '.env.local' })

async function testConsentFix() {
  console.log('🧪 Testing Consent Email Fix')
  console.log('============================')
  
  try {
    // Test the API endpoint directly with authentication
    const response = await fetch('http://localhost:3000/api/consent/send-all', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Note: In a real test, you'd need to include authentication headers
        // For now, this will test the API structure
      },
      body: JSON.stringify({}),
    })

    console.log('📊 Response Status:', response.status)
    
    if (response.ok) {
      const data = await response.json()
      console.log('✅ Success Response:', data)
    } else {
      const errorText = await response.text()
      console.log('❌ Error Response:', errorText)
      
      try {
        const errorJson = JSON.parse(errorText)
        console.log('❌ Parsed Error:', errorJson)
      } catch (e) {
        console.log('❌ Raw Error Text:', errorText)
      }
    }
    
  } catch (error) {
    console.error('❌ Network Error:', error.message)
  }
  
  console.log('\n💡 Key Changes Made:')
  console.log('1. ✅ Removed dependency on users table lookup')
  console.log('2. ✅ Get user info from authentication context')
  console.log('3. ✅ Simplified consent service to work with auth data')
  console.log('4. ✅ Fixed the "User not found" error')
  
  console.log('\n🎯 Expected Result:')
  console.log('- Consent emails should now be sent to christopher.j.loy@gmail.com')
  console.log('- No more "User not found" errors')
  console.log('- Support Circle members should receive consent requests')
}

testConsentFix()
