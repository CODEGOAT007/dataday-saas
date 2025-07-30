// Script to add missing user to the users table
require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function fixMissingUser() {
  console.log('🔧 FIXING MISSING USER IN DATABASE')
  console.log('=' .repeat(50))

  const userId = '9fc00f52-b0aa-4a01-8a3d-a72b0992577e'
  const userEmail = 'christopher.j.loy@gmail.com'
  const userName = 'Christopher Loy'

  try {
    // 1. Check if user already exists
    console.log('\n1️⃣ CHECKING IF USER EXISTS')
    console.log('-'.repeat(30))
    
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      console.log('❌ Error checking user:', checkError)
      return
    }

    if (existingUser) {
      console.log('✅ User already exists in users table!')
      console.log('   ID:', existingUser.id)
      console.log('   Email:', existingUser.email)
      console.log('   Name:', existingUser.full_name)
      return
    }

    console.log('❌ User not found in users table. Creating...')

    // 2. Insert user into users table
    console.log('\n2️⃣ CREATING USER RECORD')
    console.log('-'.repeat(25))
    
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert({
        id: userId,
        email: userEmail,
        full_name: userName,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (insertError) {
      console.log('❌ Error creating user:', insertError)
      return
    }

    console.log('✅ User created successfully!')
    console.log('   ID:', userId)
    console.log('   Email:', userEmail)
    console.log('   Name:', userName)

    // 3. Verify the fix
    console.log('\n3️⃣ VERIFYING THE FIX')
    console.log('-'.repeat(20))
    
    const { data: verifyUser, error: verifyError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (verifyError) {
      console.log('❌ Verification failed:', verifyError)
      return
    }

    console.log('✅ Verification successful!')
    console.log('   User exists in database and can now use emergency support team features')

    console.log('\n🎉 FIX COMPLETE!')
    console.log('Now try adding Michael to your emergency support team again.')

  } catch (error) {
    console.error('❌ Script error:', error)
  }
}

fixMissingUser()
