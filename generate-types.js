// Script to generate TypeScript types from Supabase
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = 'https://uezplxpuatwvkjgdacjx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlenBseHB1YXR3dmtqZ2RhY2p4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0Nzk4NjMsImV4cCI6MjA2OTA1NTg2M30.fQJIFEQBxp7bqXPFhbJIu5BmgdMpesW17aIHDYOpTaQ';

const supabase = createClient(supabaseUrl, supabaseKey);

// Generate basic TypeScript types
const types = `
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
          subscription_tier: 'free' | 'starter' | 'pro' | 'enterprise'
          subscription_status: 'active' | 'cancelled' | 'past_due'
          subscription_ends_at: string | null
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
          subscription_tier?: 'free' | 'starter' | 'pro' | 'enterprise'
          subscription_status?: 'active' | 'cancelled' | 'past_due'
          subscription_ends_at?: string | null
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
          subscription_tier?: 'free' | 'starter' | 'pro' | 'enterprise'
          subscription_status?: 'active' | 'cancelled' | 'past_due'
          subscription_ends_at?: string | null
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
          created_at?: string
          updated_at?: string
        }
      }
      emergency_support_team: {
        Row: {
          id: string
          user_id: string
          name: string
          relationship: string
          email: string | null
          phone: string | null
          notify_on_day: number
          notification_method: 'email' | 'sms' | 'both'
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          relationship: string
          email?: string | null
          phone?: string | null
          notify_on_day?: number
          notification_method?: 'email' | 'sms' | 'both'
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          relationship?: string
          email?: string | null
          phone?: string | null
          notify_on_day?: number
          notification_method?: 'email' | 'sms' | 'both'
          is_active?: boolean
          created_at?: string
          updated_at?: string
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
`;

// Write the types to file
fs.writeFileSync('types/supabase.ts', types);
console.log('✅ TypeScript types generated successfully!');
