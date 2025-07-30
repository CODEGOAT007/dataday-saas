import { createClient } from '@/lib/supabase-client'
import { NotificationService } from './notification-service'
import type {
  User,
  Goal,
  DailyLog,
  EmergencySupportTeamMember,
  EscalationLog,
  EscalationLogInsert,
  EscalationType
} from '@/types'

const supabase = createClient()

export class EscalationService {
  
  /**
   * Check for missed goals and trigger appropriate escalations
   * This should be run daily via a cron job or scheduled function
   */
  static async processEscalations() {
    console.log('🚨 Processing daily escalations...')
    
    try {
      // Get all active users with active goals
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select(`
          *,
          goals!inner(
            id,
            title,
            status,
            target_frequency,
            frequency_type
          )
        `)
        .eq('goals.status', 'active')

      if (usersError) throw usersError

      for (const user of users || []) {
        await this.processUserEscalations(user)
      }
      
      console.log(`✅ Processed escalations for ${users?.length || 0} users`)
    } catch (error) {
      console.error('❌ Error processing escalations:', error)
      throw error
    }
  }

  /**
   * Process escalations for a specific user
   */
  private static async processUserEscalations(user: User & { goals: Goal[] }) {
    const today = new Date().toISOString().split('T')[0]
    
    for (const goal of user.goals) {
      // Check if goal should have been logged today (based on frequency)
      const shouldHaveLogged = await this.shouldHaveLoggedToday(goal, today)
      
      if (shouldHaveLogged) {
        // Check if user logged this goal today
        const { data: todayLog } = await supabase
          .from('daily_logs')
          .select('*')
          .eq('user_id', user.id)
          .eq('goal_id', goal.id)
          .eq('log_date', today)
          .single()

        if (!todayLog) {
          // Goal was missed - check escalation state
          await this.handleMissedGoal(user, goal, today)
        }
      }
    }
  }

  /**
   * Handle a missed goal by determining escalation level and taking action
   */
  private static async handleMissedGoal(user: User, goal: Goal, date: string) {
    // Count consecutive missed days for this goal
    const missedDays = await this.getConsecutiveMissedDays(user.id, goal.id, date)
    
    console.log(`📊 User ${user.id} missed goal "${goal.title}" for ${missedDays} consecutive days`)

    if (missedDays === 1) {
      // Day 1: Progress Support Team outreach
      await this.triggerProgressTeamOutreach(user, goal, date)
    } else if (missedDays === 2) {
      // Day 2: Emergency Support Team notification
      await this.triggerEmergencySupportTeamNotification(user, goal, date)
    } else if (missedDays >= 3) {
      // Day 3+: Follow-up Emergency Support Team check-in request
      await this.triggerEmergencySupportTeamCheckin(user, goal, date)
    }
  }

  /**
   * Day 1 Escalation: Progress Support Team reaches out with encouragement
   */
  private static async triggerProgressTeamOutreach(user: User, goal: Goal, date: string) {
    console.log(`📞 Day 1: Progress Support Team outreach for ${user.email}`)
    
    // Create escalation log
    const escalationLog: EscalationLogInsert = {
      user_id: user.id,
      goal_id: goal.id,
      escalation_day: 1,
      type: 'progress_team_outreach',
      contact_method: 'email', // Progress team uses email/in-app
      message_sent: `Hi ${user.full_name || 'there'}! We noticed you missed your "${goal.title}" goal yesterday. No worries - everyone has off days! 🌟 

Remember why you started this journey. You've got this! Would you like to share what happened or adjust your goal to make it more achievable?

Your Progress Support Team is here to help! 💪`,
      successful: false // Will be updated when user responds
    }

    const { data: insertedLog, error } = await supabase
      .from('escalation_logs')
      .insert(escalationLog)
      .select()
      .single()

    if (error) {
      console.error('Error creating escalation log:', error)
      return
    }

    // Send email notification to user
    if (user.email) {
      await NotificationService.sendEmail(
        user.email,
        `Dataday: Let's get back on track with "${goal.title}"`,
        escalationLog.message_sent || ''
      )
    }
    
    console.log('✅ Progress Support Team outreach logged')
  }

  /**
   * Day 2 Escalation: Emergency Support Team gets notified
   */
  private static async triggerEmergencySupportTeamNotification(user: User, goal: Goal, date: string) {
    console.log(`🚨 Day 2: Emergency Support Team notification for ${user.email}`)
    
    // Get user's Emergency Support Team members
    const { data: supportTeam, error: teamError } = await supabase
      .from('emergency_support_team')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .eq('notify_on_day', 2) // Day 2 notifications

    if (teamError) {
      console.error('Error fetching Emergency Support Team:', teamError)
      return
    }

    if (!supportTeam || supportTeam.length === 0) {
      console.log('⚠️ No Emergency Support Team members found for user')
      return
    }

    // Notify each Emergency Support Team member
    for (const member of supportTeam) {
      const message = `Hi ${member.name}! 

${user.full_name || 'Your friend'} asked you to be part of their Emergency Support Team for achieving their goals on Dataday.

They've missed their "${goal.title}" goal for 2 days now and could use some encouragement from someone who cares about them.

Could you reach out and check in? Sometimes a simple "How are you doing?" from a friend makes all the difference! ❤️

Thanks for being an amazing support person!

- The Dataday Team`

      const escalationLog: EscalationLogInsert = {
        user_id: user.id,
        goal_id: goal.id,
        emergency_support_team_id: member.id,
        escalation_day: 2,
        type: 'emergency_support_team_notification',
        contact_method: member.notification_method,
        message_sent: message,
        successful: false
      }

      const { data: insertedLog, error } = await supabase
        .from('escalation_logs')
        .insert(escalationLog)
        .select()
        .single()

      if (error) {
        console.error('Error creating Emergency Support Team escalation log:', error)
        continue
      }

      // Send notification to Emergency Support Team member
      const notificationResults = await NotificationService.sendNotification(
        member.notification_method,
        member.phone,
        member.email,
        `${user.full_name || 'Your friend'} needs encouragement`,
        message
      )

      // Update escalation log with success status
      const wasSuccessful = notificationResults.some(result => result.success)
      if (wasSuccessful && insertedLog) {
        await supabase
          .from('escalation_logs')
          .update({ successful: true })
          .eq('id', insertedLog.id)
      }

      // Update contact tracking
      await supabase
        .from('emergency_support_team')
        .update({
          last_contacted: new Date().toISOString(),
          contact_count: (member.contact_count || 0) + 1
        })
        .eq('id', member.id)

      console.log(`✅ Notified Emergency Support Team member: ${member.name}`)
    }
  }

  /**
   * Day 3+ Escalation: Request Emergency Support Team to check in directly
   */
  private static async triggerEmergencySupportTeamCheckin(user: User, goal: Goal, date: string) {
    console.log(`🆘 Day 3+: Emergency Support Team check-in request for ${user.email}`)
    
    // Similar to Day 2 but with more urgent messaging
    // Implementation would be similar to triggerEmergencySupportTeamNotification
    // but with different message content emphasizing the need for direct check-in
  }

  /**
   * Trigger milestone celebrations (7, 30, 60 day streaks)
   */
  static async triggerMilestoneCelebration(user: User, goal: Goal, streakDays: number) {
    if (![7, 30, 60].includes(streakDays)) return

    console.log(`🎉 Milestone celebration: ${streakDays} day streak for ${user.email}`)

    // Get Emergency Support Team members who want milestone notifications
    const { data: supportTeam } = await supabase
      .from('emergency_support_team')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .eq('milestone_notifications_enabled', true)

    const message = `🎉 AMAZING NEWS! 

${user.full_name || 'Your friend'} just hit a ${streakDays}-day streak with their "${goal.title}" goal on Dataday!

This is a huge milestone and they couldn't have done it without your support. Consider sending them a congratulations message - they've earned it! 🏆

Keep being an awesome support person!

- The Dataday Team`

    for (const member of supportTeam || []) {
      const escalationLog: EscalationLogInsert = {
        user_id: user.id,
        goal_id: goal.id,
        emergency_support_team_id: member.id,
        escalation_day: 0, // Not a missed day
        type: 'milestone_celebration',
        contact_method: member.preferred_contact_method,
        message_sent: message,
        successful: false
      }

      await supabase.from('escalation_logs').insert(escalationLog)
      
      // TODO: Send actual notification
      console.log(`🎉 Milestone celebration sent to: ${member.name}`)
    }
  }

  /**
   * Helper: Calculate consecutive missed days for a goal
   */
  private static async getConsecutiveMissedDays(userId: string, goalId: string, fromDate: string): Promise<number> {
    // This would check daily_logs table to count consecutive missed days
    // Implementation depends on goal frequency (daily, weekly, etc.)
    
    // For now, return a simple calculation
    // TODO: Implement proper consecutive day calculation based on goal frequency
    return 1 // Placeholder
  }

  /**
   * Helper: Check if a goal should have been logged today based on its frequency
   */
  private static async shouldHaveLoggedToday(goal: Goal, date: string): Promise<boolean> {
    if (goal.frequency_type === 'daily') {
      return true // Daily goals should be logged every day
    }
    
    // TODO: Implement weekly/monthly frequency logic
    return true
  }
}
