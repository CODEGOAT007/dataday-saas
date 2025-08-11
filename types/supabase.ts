
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          timezone: string
          created_at: string
          updated_at: string
          onboarding_completed_at: string | null
          preferred_notification_time: string
          notification_preferences: Json
          subscription_tier: 'basic' | 'pro' | 'premium' | 'elite'
          subscription_status: 'active' | 'cancelled' | 'past_due' | 'unpaid' | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subscription_current_period_end: string | null
          bio: string | null
          location: string | null
          website: string | null
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          timezone?: string
          created_at?: string
          updated_at?: string
          onboarding_completed_at?: string | null
          preferred_notification_time?: string
          notification_preferences?: Json
          subscription_tier?: 'basic' | 'pro' | 'premium' | 'elite'
          subscription_status?: 'active' | 'cancelled' | 'past_due' | 'unpaid' | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_current_period_end?: string | null
          bio?: string | null
          location?: string | null
          website?: string | null
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          timezone?: string
          created_at?: string
          updated_at?: string
          onboarding_completed_at?: string | null
          preferred_notification_time?: string
          notification_preferences?: Json
          subscription_tier?: 'basic' | 'pro' | 'premium' | 'elite'
          subscription_status?: 'active' | 'cancelled' | 'past_due' | 'unpaid' | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_current_period_end?: string | null
          bio?: string | null
          location?: string | null
          website?: string | null
        }
      }
      goals: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          category: 'health' | 'career' | 'personal' | 'financial' | 'education' | 'relationships' | 'other'
          target_frequency: number
          frequency_type: 'daily' | 'weekly'
          difficulty_level: number
          start_date: string
          target_end_date: string | null
          status: 'active' | 'paused' | 'completed' | 'cancelled'
          is_public: boolean
          created_at: string
          updated_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          category: 'health' | 'career' | 'personal' | 'financial' | 'education' | 'relationships' | 'other'
          target_frequency?: number
          frequency_type?: 'daily' | 'weekly'
          difficulty_level?: number
          start_date?: string
          target_end_date?: string | null
          status?: 'active' | 'paused' | 'completed' | 'cancelled'
          is_public?: boolean
          created_at?: string
          updated_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          category?: 'health' | 'career' | 'personal' | 'financial' | 'education' | 'relationships' | 'other'
          target_frequency?: number
          frequency_type?: 'daily' | 'weekly'
          difficulty_level?: number
          start_date?: string
          target_end_date?: string | null
          status?: 'active' | 'paused' | 'completed' | 'cancelled'
          is_public?: boolean
          created_at?: string
          updated_at?: string
          completed_at?: string | null
        }
      }
      daily_logs: {
        Row: {
          id: string
          user_id: string
          goal_id: string
          log_date: string
          completed: boolean
          completion_time: string | null
          progress_value: number | null
          progress_unit: string | null
          notes: string | null
          mood_rating: number | null
          energy_level: number | null
          photo_url: string | null
          video_url: string | null
          voice_url: string | null
          escalation_state: 'none' | 'day1_sent' | 'day2_sent' | 'day3_sent'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          goal_id: string
          log_date?: string
          completed?: boolean
          completion_time?: string | null
          progress_value?: number | null
          progress_unit?: string | null
          notes?: string | null
          mood_rating?: number | null
          energy_level?: number | null
          photo_url?: string | null
          video_url?: string | null
          voice_url?: string | null
          escalation_state?: 'none' | 'day1_sent' | 'day2_sent' | 'day3_sent'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          goal_id?: string
          log_date?: string
          completed?: boolean
          completion_time?: string | null
          progress_value?: number | null
          progress_unit?: string | null
          notes?: string | null
          mood_rating?: number | null
          energy_level?: number | null
          photo_url?: string | null
          video_url?: string | null
          voice_url?: string | null
          escalation_state?: 'none' | 'day1_sent' | 'day2_sent' | 'day3_sent'
          created_at?: string
          updated_at?: string
        }
      }
      support_circle: {
        Row: {
          id: string
          user_id: string
          name: string
          relationship: 'parent' | 'spouse' | 'sibling' | 'friend' | 'coworker' | 'other'
          phone: string | null
          email: string | null
          preferred_contact_method: 'text_voicemail' | 'text_only' | 'email'
          consent_given: boolean | null
          consent_date: string | null
          consent_method: string | null
          last_contacted: string | null
          contact_count: number
          response_count: number
          milestone_notifications_enabled: boolean
          escalation_notifications_enabled: boolean
          is_active: boolean
          deactivated_reason: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string
          name: string
          relationship: 'parent' | 'spouse' | 'sibling' | 'friend' | 'coworker' | 'other'
          phone?: string | null
          email?: string | null
          preferred_contact_method: 'text_voicemail' | 'text_only' | 'email'
          consent_given?: boolean | null
          consent_date?: string | null
          consent_method?: string | null
          last_contacted?: string | null
          contact_count?: number
          response_count?: number
          milestone_notifications_enabled?: boolean
          escalation_notifications_enabled?: boolean
          is_active?: boolean
          deactivated_reason?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          relationship?: 'parent' | 'spouse' | 'sibling' | 'friend' | 'coworker' | 'other'
          phone?: string | null
          email?: string | null
          preferred_contact_method?: 'text_voicemail' | 'text_only' | 'email'
          consent_given?: boolean | null
          consent_date?: string | null
          consent_method?: string | null
          last_contacted?: string | null
          contact_count?: number
          response_count?: number
          milestone_notifications_enabled?: boolean
          escalation_notifications_enabled?: boolean
          is_active?: boolean
          deactivated_reason?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      escalation_logs: {
        Row: {
          id: string
          user_id: string
          goal_id: string
          emergency_support_team_id: string | null
          escalation_day: number
          type: 'progress_team_outreach' | 'emergency_support_team_notification' | 'emergency_support_team_checkin_request' | 'milestone_celebration'
          contact_method: 'text_voicemail' | 'text_only' | 'email' | null
          message_sent: string | null
          response_received: string | null
          successful: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          goal_id: string
          emergency_support_team_id?: string | null
          escalation_day: number
          type: 'progress_team_outreach' | 'emergency_support_team_notification' | 'emergency_support_team_checkin_request' | 'milestone_celebration'
          contact_method?: 'text_voicemail' | 'text_only' | 'email' | null
          message_sent?: string | null
          response_received?: string | null
          successful?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          goal_id?: string
          emergency_support_team_id?: string | null
          escalation_day?: number
          type?: 'progress_team_outreach' | 'emergency_support_team_notification' | 'emergency_support_team_checkin_request' | 'milestone_celebration'
          contact_method?: 'text_voicemail' | 'text_only' | 'email' | null
          message_sent?: string | null
          response_received?: string | null
          successful?: boolean
          created_at?: string
        }
      }
      interactions: {
        Row: {
          id: string
          user_id: string
          progress_team_member_id: string | null
          emergency_support_team_id: string | null
          type: 'progress_team_ai' | 'progress_team_human' | 'emergency_support_team_notification' | 'planning_session'
          content: string | null
          ai_persona_name: string | null
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          progress_team_member_id?: string | null
          emergency_support_team_id?: string | null
          type: 'progress_team_ai' | 'progress_team_human' | 'emergency_support_team_notification' | 'planning_session'
          content?: string | null
          ai_persona_name?: string | null
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          progress_team_member_id?: string | null
          emergency_support_team_id?: string | null
          type?: 'progress_team_ai' | 'progress_team_human' | 'emergency_support_team_notification' | 'planning_session'
          content?: string | null
          ai_persona_name?: string | null
          metadata?: Json | null
          created_at?: string
        }
      }
      planning_sessions: {
        Row: {
          id: string
          user_id: string
          progress_team_member_id: string | null
          session_type: 'planning' | 'weekly_checkin'
          scheduled_at: string | null
          completed_at: string | null
          duration_minutes: number | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          progress_team_member_id?: string | null
          session_type: 'planning' | 'weekly_checkin'
          scheduled_at?: string | null
          completed_at?: string | null
          duration_minutes?: number | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          progress_team_member_id?: string | null
          session_type?: 'planning' | 'weekly_checkin'
          scheduled_at?: string | null
          completed_at?: string | null
          duration_minutes?: number | null
          notes?: string | null
          created_at?: string
        }
      }
      ai_interactions: {
        Row: {
          id: string
          user_id: string
          goal_id: string | null
          interaction_type: 'coaching' | 'motivation' | 'analysis' | 'planning'
          ai_persona: 'coach' | 'friend' | 'mentor'
          user_message: string
          ai_response: string
          context_data: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          goal_id?: string | null
          interaction_type: 'coaching' | 'motivation' | 'analysis' | 'planning'
          ai_persona: 'coach' | 'friend' | 'mentor'
          user_message: string
          ai_response: string
          context_data?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          goal_id?: string | null
          interaction_type?: 'coaching' | 'motivation' | 'analysis' | 'planning'
          ai_persona?: 'coach' | 'friend' | 'mentor'
          user_message?: string
          ai_response?: string
          context_data?: Json | null
          created_at?: string
        }
      }
      streaks: {
        Row: {
          id: string
          user_id: string
          goal_id: string
          current_streak: number
          longest_streak: number
          last_completed_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          goal_id: string
          current_streak?: number
          longest_streak?: number
          last_completed_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          goal_id?: string
          current_streak?: number
          longest_streak?: number
          last_completed_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
