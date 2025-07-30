// Debug script to check user and emergency support team data
require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function debugUserAndMembers() {
  console.log('🔍 DEBUGGING USER AND EMERGENCY SUPPORT TEAM DATA')
  console.log('=' .repeat(60))

  try {
    // 1. Check if user exists
    console.log('\n1️⃣ CHECKING USER DATA')
    console.log('-'.repeat(30))
    
    // Check by user ID directly (correct UUID)
    const { data: userById, error: userByIdError } = await supabase
      .from('users')
      .select('*')
      .eq('id', '9fc00f52-b0aa-4a01-8a3d-a72b0992577e')

    console.log('🔍 Checking user by ID:', userByIdError ? 'ERROR' : 'SUCCESS')
    if (userByIdError) console.log('   Error:', userByIdError)
    if (userById && userById.length > 0) {
      console.log('   Found user:', userById[0].email)
    } else {
      console.log('   No user found with ID: 9fc00f52-b0aa-4a01-8a3d-a72b0992577e')
    }

    // Also check by email
    const { data: users, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'christopher.j.loy@gmail.com')

    if (userError) {
      console.log('❌ User query error:', userError)
      return
    }

    if (!users || users.length === 0) {
      console.log('❌ No user found with email christopher.j.loy@gmail.com')
      return
    }

    const user = users[0]
    console.log('✅ User found:')
    console.log('   ID:', user.id)
    console.log('   Email:', user.email)
    console.log('   Name:', user.full_name)

    // 2. Check emergency support team members
    console.log('\n2️⃣ CHECKING EMERGENCY SUPPORT TEAM MEMBERS')
    console.log('-'.repeat(45))
    
    const { data: members, error: membersError } = await supabase
      .from('emergency_support_team')
      .select('*')
      .eq('user_id', user.id)

    if (membersError) {
      console.log('❌ Members query error:', membersError)
      return
    }

    console.log(`📊 Found ${members?.length || 0} emergency support team members:`)
    
    if (members && members.length > 0) {
      members.forEach((member, index) => {
        console.log(`\n   Member ${index + 1}:`)
        console.log('     ID:', member.id)
        console.log('     Name:', member.name)
        console.log('     Email:', member.email)
        console.log('     Relationship:', member.relationship)
        console.log('     Active:', member.is_active)
        console.log('     Consent Given:', member.consent_given)
        console.log('     Created:', member.created_at)
      })

      // 3. Check which members need consent
      console.log('\n3️⃣ CHECKING MEMBERS NEEDING CONSENT')
      console.log('-'.repeat(35))
      
      const pendingMembers = members.filter(member => 
        member.is_active && (member.consent_given === null || member.consent_given === false)
      )
      
      console.log(`📧 ${pendingMembers.length} members need consent emails:`)
      pendingMembers.forEach(member => {
        console.log(`   - ${member.name} (${member.email}) - consent_given: ${member.consent_given}`)
      })

    } else {
      console.log('   No emergency support team members found')
    }

    // 4. Test the ConsentService logic
    console.log('\n4️⃣ TESTING CONSENT SERVICE QUERY')
    console.log('-'.repeat(35))
    
    const { data: pendingQuery, error: pendingError } = await supabase
      .from('emergency_support_team')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .or('consent_given.is.null,consent_given.eq.false')

    if (pendingError) {
      console.log('❌ Pending query error:', pendingError)
    } else {
      console.log(`✅ ConsentService query would find ${pendingQuery?.length || 0} members`)
      if (pendingQuery && pendingQuery.length > 0) {
        pendingQuery.forEach(member => {
          console.log(`   - ${member.name}: consent_given = ${member.consent_given}`)
        })
      }
    }

  } catch (error) {
    console.error('❌ Script error:', error)
  }
}

debugUserAndMembers()
