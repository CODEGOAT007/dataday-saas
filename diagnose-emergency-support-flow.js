// Comprehensive diagnostic script to test the emergency support team addition flow
require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

console.log('🔍 DIAGNOSING EMERGENCY SUPPORT TEAM ADDITION FLOW')
console.log('=' .repeat(60))

async function diagnoseFlow() {
  // Step 1: Test environment variables
  console.log('\n📋 STEP 1: Environment Variables')
  console.log('--------------------------------')
  
  const requiredEnvVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY'
  ]
  
  let envIssues = false
  requiredEnvVars.forEach(varName => {
    const value = process.env[varName]
    if (value) {
      console.log(`✅ ${varName}: ${value.substring(0, 20)}...`)
    } else {
      console.log(`❌ ${varName}: MISSING`)
      envIssues = true
    }
  })
  
  if (envIssues) {
    console.log('❌ Environment variable issues detected!')
    return
  }

  // Step 2: Test Supabase client connections
  console.log('\n🔌 STEP 2: Supabase Client Connections')
  console.log('-------------------------------------')
  
  // Test anon client (what the frontend uses)
  const anonClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
  
  // Test service role client (for admin operations)
  const serviceClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )
  
  try {
    // Test anon client connection
    const { data: anonTest, error: anonError } = await anonClient
      .from('users')
      .select('count')
      .limit(1)
    
    if (anonError) {
      console.log('❌ Anon client connection failed:', anonError.message)
    } else {
      console.log('✅ Anon client connection successful')
    }
    
    // Test service client connection
    const { data: serviceTest, error: serviceError } = await serviceClient
      .from('users')
      .select('count')
      .limit(1)
    
    if (serviceError) {
      console.log('❌ Service client connection failed:', serviceError.message)
    } else {
      console.log('✅ Service client connection successful')
    }
  } catch (error) {
    console.log('❌ Client connection test failed:', error.message)
    return
  }

  // Step 3: Test user authentication
  console.log('\n👤 STEP 3: User Authentication')
  console.log('------------------------------')
  
  try {
    // Get user info using service client
    const { data: user, error: userError } = await serviceClient
      .from('users')
      .select('*')
      .eq('email', 'christopher.j.loy@gmail.com')
      .single()

    if (userError || !user) {
      console.log('❌ User not found:', userError?.message || 'No user returned')
      return
    }

    console.log('✅ User found:', user.full_name, '(' + user.email + ')')
    console.log('🆔 User ID:', user.id)
    
    // Test if we can authenticate as this user with anon client
    // Note: This is tricky because we can't actually sign in programmatically
    // But we can test RLS policies
    
    // Step 4: Test RLS policies
    console.log('\n🔒 STEP 4: RLS Policy Testing')
    console.log('-----------------------------')
    
    // Test if we can read emergency support team with service client (bypasses RLS)
    const { data: serviceRead, error: serviceReadError } = await serviceClient
      .from('emergency_support_team')
      .select('*')
      .eq('user_id', user.id)
    
    if (serviceReadError) {
      console.log('❌ Service client read failed:', serviceReadError.message)
    } else {
      console.log(`✅ Service client read successful: ${serviceRead.length} members found`)
    }
    
    // Test if we can read with anon client (should fail due to RLS if not authenticated)
    const { data: anonRead, error: anonReadError } = await anonClient
      .from('emergency_support_team')
      .select('*')
      .eq('user_id', user.id)
    
    if (anonReadError) {
      console.log('⚠️  Anon client read failed (expected due to RLS):', anonReadError.message)
    } else {
      console.log(`⚠️  Anon client read successful: ${anonRead.length} members (unexpected - RLS may not be working)`)
    }

    // Step 5: Test emergency support team insertion
    console.log('\n➕ STEP 5: Emergency Support Team Insertion Test')
    console.log('-----------------------------------------------')
    
    const testMember = {
      user_id: user.id,
      name: 'Test Member (Diagnostic)',
      relationship: 'friend',
      email: 'test@example.com',
      phone: null,
      preferred_contact_method: 'email',
      consent_given: false,
      milestone_notifications_enabled: true,
      escalation_notifications_enabled: true,
      is_active: true
    }
    
    // Test with service client first
    console.log('Testing insertion with service client...')
    const { data: serviceInsert, error: serviceInsertError } = await serviceClient
      .from('emergency_support_team')
      .insert(testMember)
      .select()
      .single()
    
    if (serviceInsertError) {
      console.log('❌ Service client insertion failed:', serviceInsertError.message)
      console.log('   Full error:', JSON.stringify(serviceInsertError, null, 2))
    } else {
      console.log('✅ Service client insertion successful!')
      console.log('🔗 Inserted member ID:', serviceInsert.id)
      
      // Clean up test record
      await serviceClient
        .from('emergency_support_team')
        .delete()
        .eq('id', serviceInsert.id)
      console.log('🧹 Test record cleaned up')
    }
    
    // Test with anon client (should fail due to RLS)
    console.log('\nTesting insertion with anon client...')
    const { data: anonInsert, error: anonInsertError } = await anonClient
      .from('emergency_support_team')
      .insert(testMember)
      .select()
      .single()
    
    if (anonInsertError) {
      console.log('⚠️  Anon client insertion failed (expected due to RLS):', anonInsertError.message)
    } else {
      console.log('⚠️  Anon client insertion successful (unexpected - RLS may not be working)')
      // Clean up if it somehow worked
      await serviceClient
        .from('emergency_support_team')
        .delete()
        .eq('id', anonInsert.id)
    }

    // Step 6: Test consent email API
    console.log('\n📧 STEP 6: Consent Email API Test')
    console.log('---------------------------------')
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/consent/send-all`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.id }),
      })
      
      if (response.ok) {
        const result = await response.json()
        console.log('✅ Consent API call successful:', result)
      } else {
        const errorText = await response.text()
        console.log('❌ Consent API call failed:', response.status, errorText)
      }
    } catch (error) {
      console.log('❌ Consent API call error:', error.message)
    }

    // Step 7: Summary and recommendations
    console.log('\n📊 STEP 7: Summary and Recommendations')
    console.log('-------------------------------------')
    
    console.log('\n🔍 LIKELY ISSUES:')
    console.log('1. Frontend authentication state may not be properly set')
    console.log('2. RLS policies require proper JWT token from authenticated session')
    console.log('3. The anon client needs to be authenticated with user session')
    console.log('4. Check browser dev tools for authentication errors')
    
    console.log('\n💡 NEXT STEPS:')
    console.log('1. Check if user is actually signed in on the frontend')
    console.log('2. Verify JWT token is being sent with requests')
    console.log('3. Test the actual onboarding flow in browser with dev tools open')
    console.log('4. Look for JavaScript errors in browser console')

  } catch (error) {
    console.error('❌ Diagnostic failed:', error)
  }
}

// Run the diagnostic
diagnoseFlow()
