import { createClient } from '@/lib/supabase-client'
import { NotificationService } from './notification-service'
import type { EmergencySupportTeamMember, User } from '@/types'

const supabase = createClient()

export class ConsentService {
  
  /**
   * Send consent request to Emergency Support Team member
   */
  static async sendConsentRequest(
    user: User, 
    member: EmergencySupportTeamMember
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const consentUrl = `${process.env.NEXT_PUBLIC_APP_URL}/consent/${member.id}`
      
      const message = this.generateConsentMessage(user, member, consentUrl)
      
      // Send notification based on preferred method
      const results = await NotificationService.sendNotification(
        member.preferred_contact_method,
        member.phone,
        member.email,
        `${user.full_name || 'Someone'} added you to their Emergency Support Team`,
        message
      )

      const wasSuccessful = results.some(result => result.success)
      
      if (wasSuccessful) {
        // Update member record with consent request sent
        await supabase
          .from('emergency_support_team')
          .update({
            consent_date: new Date().toISOString(),
            consent_method: member.preferred_contact_method,
            updated_at: new Date().toISOString()
          })
          .eq('id', member.id)
      }

      return { success: wasSuccessful }
      
    } catch (error) {
      console.error('Error sending consent request:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  /**
   * Process consent response (when someone clicks the consent link)
   */
  static async processConsentResponse(
    memberId: string, 
    consented: boolean,
    responseMethod: 'web' | 'sms' | 'email' = 'web'
  ): Promise<{ success: boolean; member?: EmergencySupportTeamMember; error?: string }> {
    try {
      const { data: member, error: fetchError } = await supabase
        .from('emergency_support_team')
        .select('*, users(*)')
        .eq('id', memberId)
        .single()

      if (fetchError || !member) {
        return { success: false, error: 'Emergency Support Team member not found' }
      }

      // Update consent status
      const { data: updatedMember, error: updateError } = await supabase
        .from('emergency_support_team')
        .update({
          consent_given: consented,
          consent_date: new Date().toISOString(),
          consent_method: responseMethod,
          is_active: consented, // Deactivate if they don't consent
          deactivated_reason: consented ? null : 'no_consent',
          updated_at: new Date().toISOString()
        })
        .eq('id', memberId)
        .select()
        .single()

      if (updateError) {
        return { success: false, error: updateError.message }
      }

      // Send confirmation message
      if (consented) {
        await this.sendConsentConfirmation(member.users, member)
      }

      return { success: true, member: updatedMember }
      
    } catch (error) {
      console.error('Error processing consent response:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  /**
   * Send consent requests to all pending Emergency Support Team members for a user
   */
  static async sendAllConsentRequests(userId: string): Promise<void> {
    try {
      const { data: user } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (!user) {
        throw new Error('User not found')
      }

      const { data: pendingMembers } = await supabase
        .from('emergency_support_team')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .or('consent_given.is.null,consent_given.eq.false')

      if (!pendingMembers || pendingMembers.length === 0) {
        console.log('No pending consent requests for user:', userId)
        return
      }

      console.log(`Sending consent requests to ${pendingMembers.length} Emergency Support Team members`)

      for (const member of pendingMembers) {
        await this.sendConsentRequest(user, member)
        // Add small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000))
      }

      console.log('All consent requests sent successfully')
      
    } catch (error) {
      console.error('Error sending consent requests:', error)
      throw error
    }
  }

  /**
   * Generate consent request message
   */
  private static generateConsentMessage(
    user: User, 
    member: EmergencySupportTeamMember, 
    consentUrl: string
  ): string {
    const userName = user.full_name || 'Someone you know'
    
    return `Hi ${member.name}!

${userName} has added you to their Emergency Support Team on MyDataday - a personal goal achievement app that helps people succeed through social accountability.

Here's what this means:

🎯 WHAT IS MYDATADAY?
MyDataday helps people achieve their goals by creating a support network of people who care about them (like you!).

👥 YOUR ROLE AS EMERGENCY SUPPORT TEAM:
• You'll only be contacted if ${userName} misses their goals for 2+ consecutive days
• We'll ask you to send a quick check-in message (like "Hey, how are you doing?")
• You'll also get notified when they hit major milestones (7, 30, 60 day streaks) so you can celebrate with them!

📱 HOW IT WORKS:
• Day 1 missed: Our team reaches out to ${userName} with encouragement
• Day 2 missed: You get a notification asking you to check in
• Day 3+ missed: We may ask multiple Emergency Support Team members to help

🔒 YOUR PRIVACY:
• We only share ${userName}'s goal progress, never personal details
• You can opt out anytime by replying to any message
• We typically contact Emergency Support Team members 1-2 times per month maximum

💪 WHY THIS WORKS:
People are 90% more likely to achieve their goals when they have social accountability. Your support could be the difference between ${userName} succeeding or giving up.

GIVE CONSENT:
${consentUrl}

If you'd prefer not to participate, that's completely okay! Just ignore this message and we won't contact you again.

Thanks for being someone ${userName} trusts and cares about! ❤️

- The MyDataday Team`
  }

  /**
   * Send confirmation message after consent is given
   */
  private static async sendConsentConfirmation(user: User, member: EmergencySupportTeamMember): Promise<void> {
    const message = `Thank you for joining ${user.full_name || 'your friend'}'s Emergency Support Team! 🎉

You're now part of their success journey. Here's what to expect:

✅ You'll only hear from us if they need encouragement (typically 1-2 times per month)
✅ We'll celebrate their wins with you when they hit major milestones
✅ Your support will help them achieve a 90%+ success rate

You can opt out anytime by replying to any message from us.

Thanks for being an amazing support person! 💪

- The MyDataday Team`

    await NotificationService.sendNotification(
      member.preferred_contact_method,
      member.phone,
      member.email,
      'Welcome to the Emergency Support Team! 🎉',
      message
    )
  }

  /**
   * Get consent statistics for a user
   */
  static async getConsentStats(userId: string): Promise<{
    total: number
    consented: number
    pending: number
    declined: number
  }> {
    const { data: members } = await supabase
      .from('emergency_support_team')
      .select('consent_given, is_active')
      .eq('user_id', userId)

    if (!members) {
      return { total: 0, consented: 0, pending: 0, declined: 0 }
    }

    const total = members.length
    const consented = members.filter(m => m.consent_given === true).length
    const declined = members.filter(m => m.consent_given === false).length
    const pending = members.filter(m => m.consent_given === null).length

    return { total, consented, pending, declined }
  }
}
