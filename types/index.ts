import type { Database } from './supabase'

// Reason: Extract table types from Supabase database schema
export type User = Database['public']['Tables']['users']['Row']
export type Goal = Database['public']['Tables']['goals']['Row']
export type DailyLog = Database['public']['Tables']['daily_logs']['Row']
export type EmergencySupportTeamMember = Database['public']['Tables']['emergency_support_team']['Row']
export type EscalationLog = Database['public']['Tables']['escalation_logs']['Row']
export type Interaction = Database['public']['Tables']['interactions']['Row']
export type PlanningSession = Database['public']['Tables']['planning_sessions']['Row']

// Reason: Insert types for creating new records
export type UserInsert = Database['public']['Tables']['users']['Insert']
export type GoalInsert = Database['public']['Tables']['goals']['Insert']
export type DailyLogInsert = Database['public']['Tables']['daily_logs']['Insert']
export type EmergencySupportTeamInsert = Database['public']['Tables']['emergency_support_team']['Insert']
export type EscalationLogInsert = Database['public']['Tables']['escalation_logs']['Insert']
export type InteractionInsert = Database['public']['Tables']['interactions']['Insert']
export type PlanningSessionInsert = Database['public']['Tables']['planning_sessions']['Insert']

// Reason: Update types for modifying existing records
export type UserUpdate = Database['public']['Tables']['users']['Update']
export type GoalUpdate = Database['public']['Tables']['goals']['Update']
export type DailyLogUpdate = Database['public']['Tables']['daily_logs']['Update']
export type EmergencySupportTeamUpdate = Database['public']['Tables']['emergency_support_team']['Update']
export type EscalationLogUpdate = Database['public']['Tables']['escalation_logs']['Update']
export type InteractionUpdate = Database['public']['Tables']['interactions']['Update']
export type PlanningSessionUpdate = Database['public']['Tables']['planning_sessions']['Update']

// Reason: Extended types with relationships
export type GoalWithLogs = Goal & {
  daily_logs: DailyLog[]
}

export type UserWithGoals = User & {
  goals: Goal[]
  emergency_support_team: EmergencySupportTeamMember[]
}

export type DailyLogWithGoal = DailyLog & {
  goals: Goal
}

// Reason: Enum types for better type safety
export type SubscriptionTier = '$35' | '$65' | '$120' | '$200'

export type GoalStatus = 'active' | 'paused' | 'completed' | 'archived'

export type GoalFrequency = 'daily' | 'weekly' | 'monthly'

export type RelationshipType = 'parent' | 'spouse' | 'sibling' | 'friend' | 'coworker'

export type ContactMethod = 'text_voicemail' | 'email' | 'text_only'

export type InteractionType = 
  | 'progress_team_ai' 
  | 'progress_team_human' 
  | 'emergency_support_team_notification' 
  | 'planning_session'

export type AIPersona = 'coach' | 'friend' | 'mentor'

export type EscalationState = 'none' | 'day1_sent' | 'day2_sent' | 'day3_sent'

export type EscalationType =
  | 'progress_team_outreach'
  | 'emergency_support_team_notification'
  | 'emergency_support_team_checkin_request'
  | 'milestone_celebration'

export type PlanningSessionType = 'planning' | 'weekly_checkin'

// Reason: UI-specific types
export interface DashboardStats {
  totalGoals: number
  activeGoals: number
  completedGoals: number
  currentStreak: number
  longestStreak: number
  completionRate: number
}

export interface GoalProgress {
  goalId: string
  title: string
  currentStreak: number
  completionRate: number
  recentLogs: DailyLog[]
  nextMilestone: number
}

export interface AIInsight {
  id: string
  type: 'encouragement' | 'suggestion' | 'warning' | 'celebration'
  title: string
  message: string
  goalId?: string
  createdAt: string
}

export interface NotificationPreferences {
  dailyReminders: boolean
  weeklyReports: boolean
  milestoneAlerts: boolean
  emergencySupportTeamUpdates: boolean
  aiInsights: boolean
}

export interface OnboardingStep {
  id: string
  title: string
  description: string
  completed: boolean
  required: boolean
}

// Reason: API response types
export interface ApiResponse<T = any> {
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T = any> {
  data: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

// Reason: Form types
export interface LoginForm {
  email: string
  password: string
}

export interface SignupForm {
  email: string
  password: string
  confirmPassword: string
  name: string
}

export interface CreateGoalForm {
  title: string
  description?: string
  targetFrequency: GoalFrequency
  escalationEnabled: boolean
}

export interface CreateLogForm {
  goalId: string
  logDate: string
  completed: boolean
  notes?: string
  photoUrl?: string
  videoUrl?: string
  voiceUrl?: string
}

export interface EmergencySupportTeamForm {
  name: string
  relationship: RelationshipType
  phone?: string
  email?: string
  preferredContactMethod: ContactMethod
}

// Reason: Chart and analytics types
export interface ChartDataPoint {
  date: string
  value: number
  label?: string
}

export interface ProgressChartData {
  daily: ChartDataPoint[]
  weekly: ChartDataPoint[]
  monthly: ChartDataPoint[]
}

export interface StreakData {
  current: number
  longest: number
  history: Array<{
    startDate: string
    endDate: string
    length: number
  }>
}
