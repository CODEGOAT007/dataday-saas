import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface NotificationRequest {
  goalId: string
  goalTitle: string
  goalDescription?: string
  frequency: string
  duration: string
  voiceNoteUrl: string
}

export async function POST(request: NextRequest) {
  try {
    console.log('📧 Support circle notification request received')
    
    const body: NotificationRequest = await request.json()
    const { goalId, goalTitle, goalDescription, frequency, duration, voiceNoteUrl } = body

    if (!goalId || !goalTitle || !voiceNoteUrl) {
      return NextResponse.json(
        { error: 'Missing required fields: goalId, goalTitle, voiceNoteUrl' },
        { status: 400 }
      )
    }

    // Create Supabase client
    const supabase = createServiceRoleClient()

    // Get the goal and user information
    const { data: goalData, error: goalError } = await supabase
      .from('goals')
      .select(`
        *,
        users!inner (
          id,
          full_name,
          email
        )
      `)
      .eq('id', goalId)
      .single()

    if (goalError || !goalData) {
      console.error('❌ Goal not found:', goalError)
      return NextResponse.json(
        { error: 'Goal not found' },
        { status: 404 }
      )
    }

    // Get the user's support circle
    const { data: supportMembers, error: supportError } = await supabase
      .from('support_circle')
      .select('*')
      .eq('user_id', goalData.user_id)
      .eq('consent_given', true) // Only send to consented members

    if (supportError) {
      console.error('❌ Error fetching support circle:', supportError)
      return NextResponse.json(
        { error: 'Failed to fetch support circle' },
        { status: 500 }
      )
    }

    if (!supportMembers || supportMembers.length === 0) {
      console.log('⚠️ No support circle members found')
      return NextResponse.json(
        { message: 'No support circle members to notify' },
        { status: 200 }
      )
    }

    console.log(`📧 Sending notifications to ${supportMembers.length} support members`)

    // Send emails to each support member
    const emailPromises = supportMembers.map(async (member) => {
      try {
        const emailHtml = generateEmailHtml({
          memberName: member.name,
          userName: goalData.users.full_name,
          goalTitle,
          goalDescription,
          frequency,
          duration,
          voiceNoteUrl,
          relationship: member.relationship
        })

        const emailResult = await resend.emails.send({
          from: process.env.MYDATADAY_FROM_EMAIL || 'hello@mydataday.app',
          to: member.email || member.preferred_contact_method === 'email' ? member.email : '',
          subject: `Help ${goalData.users.full_name} with their ${goalTitle} goal 🎯`,
          html: emailHtml
        })

        console.log(`✅ Email sent to ${member.name}:`, emailResult)

        // Update notification status
        await supabase
          .from('support_circle')
          .update({
            notification_sent: true,
            notification_sent_at: new Date().toISOString()
          })
          .eq('id', member.id)

        return { success: true, member: member.name, emailId: emailResult.data?.id }
      } catch (error) {
        console.error(`❌ Failed to send email to ${member.name}:`, error)
        return { success: false, member: member.name, error: error instanceof Error ? error.message : 'Unknown error' }
      }
    })

    const results = await Promise.all(emailPromises)
    const successful = results.filter(r => r.success).length
    const failed = results.filter(r => !r.success).length

    console.log(`📧 Notification results: ${successful} successful, ${failed} failed`)

    // Update the goal with voice note URL
    await supabase
      .from('goals')
      .update({ voice_note_url: voiceNoteUrl })
      .eq('id', goalId)

    return NextResponse.json({
      success: true,
      message: `Notifications sent to ${successful} support members`,
      results: {
        successful,
        failed,
        details: results
      }
    })

  } catch (error) {
    console.error('❌ Support circle notification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function generateEmailHtml({
  memberName,
  userName,
  goalTitle,
  goalDescription,
  frequency,
  duration,
  voiceNoteUrl,
  relationship
}: {
  memberName: string
  userName: string
  goalTitle: string
  goalDescription?: string
  frequency: string
  duration: string
  voiceNoteUrl: string
  relationship: string
}) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Support ${userName}'s Goal</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 30px 20px; text-align: center; }
    .content { padding: 30px 20px; }
    .voice-note { background: #f8fafc; border: 2px solid #e2e8f0; border-radius: 12px; padding: 20px; margin: 20px 0; text-align: center; }
    .goal-details { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 0 8px 8px 0; }
    .support-info { background: #ecfdf5; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0; border-radius: 0 8px 8px 0; }
    .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 10px 5px; }
    .footer { background: #f8fafc; padding: 20px; text-align: center; font-size: 14px; color: #64748b; }
    .audio-player { margin: 15px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎯 You're in ${userName}'s Support Circle!</h1>
      <p>Your ${relationship} has set an exciting new goal and wants your support</p>
    </div>
    
    <div class="content">
      <h2>Hi ${memberName}! 👋</h2>
      
      <p>Great news! <strong>${userName}</strong> has decided to work on an important personal goal and has chosen you to be part of their support journey.</p>
      
      <div class="goal-details">
        <h3>🎯 Their Goal</h3>
        <p><strong>${goalTitle}</strong></p>
        ${goalDescription ? `<p>${goalDescription}</p>` : ''}
        <p><strong>Frequency:</strong> ${frequency}</p>
        <p><strong>Duration:</strong> ${duration}</p>
      </div>
      
      <div class="voice-note">
        <h3>🎙️ Personal Message from ${userName}</h3>
        <p>They recorded a special message just for you:</p>
        <div class="audio-player">
          <audio controls style="width: 100%; max-width: 400px;">
            <source src="${voiceNoteUrl}" type="audio/webm">
            <source src="${voiceNoteUrl}" type="audio/mp4">
            Your browser does not support the audio element.
            <a href="${voiceNoteUrl}" download>Download voice message</a>
          </audio>
        </div>
        <p><small>Can't play the audio? <a href="${voiceNoteUrl}" download>Download the voice message</a></small></p>
      </div>
      
      <div class="support-info">
        <h3>💪 How You Can Help</h3>
        <ul>
          <li><strong>Day 1 missed:</strong> We'll encourage them directly</li>
          <li><strong>Day 2+ missed:</strong> We'll ask you to send them a quick check-in</li>
          <li><strong>Milestones:</strong> We'll celebrate their 7, 30, and 60-day streaks with you!</li>
        </ul>
        <p><strong>Maximum contact:</strong> 1-2 times per month</p>
      </div>
      
      <p>Your support means the world to ${userName}. Thank you for being such an amazing ${relationship}! 🙏</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="mailto:hello@mydataday.app?subject=Question about ${userName}'s goal" class="button">Questions?</a>
        <a href="mailto:hello@mydataday.app?subject=Unsubscribe from ${userName}'s notifications" class="button" style="background: #6b7280;">Manage Notifications</a>
      </div>
    </div>
    
    <div class="footer">
      <p><strong>MyDataday</strong> - Helping people achieve their goals through social accountability</p>
      <p>You can opt out of these notifications anytime by replying "STOP" to any email.</p>
      <p><a href="mailto:hello@mydataday.app">Contact Support</a> | <a href="https://mydataday.app">Visit MyDataday</a></p>
    </div>
  </div>
</body>
</html>
  `
}
