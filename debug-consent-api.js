// Debug script to test the consent API directly
require('dotenv').config({ path: '.env.local' })

async function testConsentAPI() {
  console.log('🧪 TESTING CONSENT API DIRECTLY')
  console.log('=' .repeat(50))

  try {
    // Test the API endpoint directly
    const response = await fetch('https://mydataday.app/api/consent/send-all', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        userId: 'test-user-id' // Replace with your actual user ID
      }),
    })

    console.log('📊 Response Status:', response.status)
    console.log('📊 Response Headers:', Object.fromEntries(response.headers.entries()))

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
    console.error('❌ Network Error:', error)
  }
}

console.log('💡 To run this test:')
console.log('1. Replace "test-user-id" with your actual user ID')
console.log('2. Run: node debug-consent-api.js')
console.log('')

// Uncomment to run the test
// testConsentAPI()
