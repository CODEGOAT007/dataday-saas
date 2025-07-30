// Test script to simulate the exact frontend authentication flow
require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

console.log('🧪 TESTING AUTHENTICATED EMERGENCY SUPPORT TEAM INSERTION')
console.log('=' .repeat(60))

async function testAuthenticatedInsertion() {
  // Create client like the frontend does
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  try {
    console.log('\n🔐 STEP 1: Attempting to sign in as Christopher')
    console.log('--------------------------------------------------')
    
    // Try to sign in (this simulates what happens on the frontend)
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'christopher.j.loy@gmail.com',
      password: 'your_password_here' // You'll need to provide the actual password
    })

    if (authError) {
      console.log('❌ Authentication failed:', authError.message)
      console.log('💡 You need to provide the correct password for christopher.j.loy@gmail.com')
      console.log('💡 Or test this through the actual web interface')
      return
    }

    console.log('✅ Authentication successful!')
    console.log('🆔 User ID:', authData.user.id)
    console.log('📧 Email:', authData.user.email)

    console.log('\n➕ STEP 2: Testing Emergency Support Team insertion')
    console.log('--------------------------------------------------')

    const testMember = {
      name: 'Michael Loy',
      relationship: 'sibling',
      email: 'make.music.faster@gmail.com',
      phone: null,
      preferred_contact_method: 'email',
      consent_given: false,
      milestone_notifications_enabled: true,
      escalation_notifications_enabled: true,
      is_active: true
    }

    // This simulates the exact mutation from the frontend
    const { data: insertedMember, error: insertError } = await supabase
      .from('emergency_support_team')
      .insert({
        ...testMember,
        user_id: authData.user.id,
      })
      .select()
      .single()

    if (insertError) {
      console.log('❌ Insertion failed:', insertError.message)
      console.log('   Full error:', JSON.stringify(insertError, null, 2))
    } else {
      console.log('✅ Insertion successful!')
      console.log('🔗 Member ID:', insertedMember.id)
      console.log('👤 Name:', insertedMember.name)
      console.log('📧 Email:', insertedMember.email)

      console.log('\n📧 STEP 3: Testing consent email sending')
      console.log('----------------------------------------')

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/consent/send-all`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Include the session token
            'Authorization': `Bearer ${authData.session.access_token}`,
          },
          body: JSON.stringify({ userId: authData.user.id }),
        })

        if (response.ok) {
          const result = await response.json()
          console.log('✅ Consent email API successful:', result)
        } else {
          const errorText = await response.text()
          console.log('❌ Consent email API failed:', response.status, errorText)
        }
      } catch (error) {
        console.log('❌ Consent email API error:', error.message)
      }

      console.log('\n🧹 STEP 4: Cleaning up test data')
      console.log('----------------------------------')

      // Clean up the test record
      const { error: deleteError } = await supabase
        .from('emergency_support_team')
        .delete()
        .eq('id', insertedMember.id)

      if (deleteError) {
        console.log('⚠️  Failed to clean up test record:', deleteError.message)
      } else {
        console.log('✅ Test record cleaned up successfully')
      }
    }

    console.log('\n🔓 STEP 5: Signing out')
    console.log('----------------------')
    await supabase.auth.signOut()
    console.log('✅ Signed out successfully')

  } catch (error) {
    console.error('❌ Test failed:', error)
  }
}

console.log('\n⚠️  NOTE: This test requires your actual password.')
console.log('If you don\'t want to put your password in this script,')
console.log('you can test the flow through the web interface with')
console.log('browser dev tools open to see the exact error.')

// Uncomment the line below and add your password to run the test
// testAuthenticatedInsertion()

console.log('\n💡 ALTERNATIVE: Test through web interface')
console.log('1. Open https://mydataday.app in browser')
console.log('2. Open Developer Tools (F12)')
console.log('3. Go to Console tab')
console.log('4. Try adding Michael through the UI')
console.log('5. Look for any JavaScript errors or failed network requests')
