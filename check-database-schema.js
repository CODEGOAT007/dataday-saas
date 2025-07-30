// Script to check the actual database schema for emergency_support_team table
require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function checkDatabaseSchema() {
  console.log('🔍 Checking Database Schema for emergency_support_team')
  console.log('===================================================')
  
  try {
    // Try to get the table structure by querying information_schema
    const { data: columns, error: schemaError } = await supabase
      .rpc('get_table_columns', { table_name: 'emergency_support_team' })
      .select()

    if (schemaError) {
      console.log('⚠️  Could not get schema via RPC, trying direct query...')
      
      // Try a direct query to see what columns exist
      const { data: sampleData, error: queryError } = await supabase
        .from('emergency_support_team')
        .select('*')
        .limit(1)

      if (queryError) {
        console.error('❌ Error querying emergency_support_team:', queryError)
        return
      }

      if (sampleData && sampleData.length > 0) {
        console.log('✅ Found emergency_support_team table with columns:')
        const columns = Object.keys(sampleData[0])
        columns.forEach(column => {
          console.log(`   • ${column}: ${typeof sampleData[0][column]}`)
        })
      } else {
        console.log('📭 Table exists but has no data. Let me try to insert a test record...')
        
        // Try to insert with minimal data to see what's required
        const { error: insertError } = await supabase
          .from('emergency_support_team')
          .insert({
            user_id: '9fc00f52-b0aa-4a01-8a3d-a72b0992577e',
            name: 'Test Member',
            relationship: 'friend'
          })

        if (insertError) {
          console.error('❌ Insert error reveals schema issues:', insertError)
        } else {
          console.log('✅ Basic insert worked - checking what was created...')
          
          const { data: newData } = await supabase
            .from('emergency_support_team')
            .select('*')
            .eq('name', 'Test Member')
            .single()

          if (newData) {
            console.log('✅ Columns in the actual table:')
            Object.keys(newData).forEach(column => {
              console.log(`   • ${column}: ${newData[column]} (${typeof newData[column]})`)
            })
            
            // Clean up test record
            await supabase
              .from('emergency_support_team')
              .delete()
              .eq('name', 'Test Member')
          }
        }
      }
    } else {
      console.log('✅ Schema information:')
      columns.forEach(col => {
        console.log(`   • ${col.column_name}: ${col.data_type}`)
      })
    }

  } catch (error) {
    console.error('❌ Error:', error)
  }
}

// Run the check
checkDatabaseSchema()
