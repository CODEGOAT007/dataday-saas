-- MyDataday Database Schema
-- This creates all the tables and relationships for the MyDataday app

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  timezone TEXT DEFAULT 'UTC',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Onboarding and preferences
  onboarding_completed_at TIMESTAMP WITH TIME ZONE,
  preferred_notification_time TIME DEFAULT '09:00:00',
  notification_preferences JSONB DEFAULT '{"email": true, "sms": false, "push": true}',
  
  -- Subscription info (Updated for MyDataday pricing tiers)
  subscription_tier TEXT DEFAULT '$35' CHECK (subscription_tier IN ('$35', '$65', '$120', '$200')),
  subscription_status TEXT DEFAULT 'active' CHECK (subscription_status IN ('active', 'cancelled', 'past_due')),
  subscription_ends_at TIMESTAMP WITH TIME ZONE,

  -- Progress Support Team assignment
  assigned_progress_team_member_id UUID,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  personal_best_before_dataday INTEGER DEFAULT 0, -- Self-reported baseline
  
  -- Profile info
  bio TEXT,
  location TEXT,
  website TEXT
);

-- Goals table
CREATE TABLE public.goals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('health', 'career', 'personal', 'financial', 'education', 'relationships', 'other')),
  
  -- Goal settings
  target_frequency INTEGER DEFAULT 1, -- How many times per day/week
  frequency_type TEXT DEFAULT 'daily' CHECK (frequency_type IN ('daily', 'weekly')),
  difficulty_level INTEGER DEFAULT 1 CHECK (difficulty_level BETWEEN 1 AND 5),
  
  -- Dates
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  target_end_date DATE,
  
  -- Status
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'cancelled')),
  is_public BOOLEAN DEFAULT FALSE,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Support Circle (Family/Friends Social Accountability Network)
CREATE TABLE public.support_circle (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  relationship TEXT NOT NULL CHECK (relationship IN ('parent', 'spouse', 'sibling', 'friend', 'coworker', 'other')),

  -- Contact information
  phone TEXT,
  email TEXT,
  preferred_contact_method TEXT DEFAULT 'text_voicemail' CHECK (preferred_contact_method IN ('text_voicemail', 'email', 'text_only')),

  -- Consent and permissions
  consent_given BOOLEAN DEFAULT FALSE,
  consent_date TIMESTAMP WITH TIME ZONE,
  consent_method TEXT, -- 'phone', 'email', 'in_person'

  -- Engagement tracking
  last_contacted TIMESTAMP WITH TIME ZONE,
  contact_count INTEGER DEFAULT 0,
  response_count INTEGER DEFAULT 0,

  -- Notification preferences
  milestone_notifications_enabled BOOLEAN DEFAULT TRUE, -- For 7, 30, 60 day celebrations
  escalation_notifications_enabled BOOLEAN DEFAULT TRUE, -- For missed goal alerts

  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  deactivated_reason TEXT, -- 'user_request', 'no_response', 'opted_out'

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Ensure valid contact method
  CONSTRAINT valid_contact_info CHECK (
    (preferred_contact_method = 'email' AND email IS NOT NULL) OR
    (preferred_contact_method IN ('text_voicemail', 'text_only') AND phone IS NOT NULL)
  )
);

-- Daily logs table
CREATE TABLE public.daily_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  goal_id UUID REFERENCES public.goals(id) ON DELETE CASCADE NOT NULL,
  
  -- Log data
  log_date DATE NOT NULL DEFAULT CURRENT_DATE,
  completed BOOLEAN DEFAULT FALSE,
  completion_time TIMESTAMP WITH TIME ZONE,
  
  -- Progress tracking
  progress_value DECIMAL(5,2), -- For quantifiable goals (e.g., 7.5 hours of sleep)
  progress_unit TEXT, -- e.g., 'hours', 'minutes', 'reps', 'pages'
  
  -- Notes and reflection
  notes TEXT,
  mood_rating INTEGER CHECK (mood_rating BETWEEN 1 AND 5),
  energy_level INTEGER CHECK (energy_level BETWEEN 1 AND 5),

  -- Media attachments
  photo_url TEXT,
  video_url TEXT,
  voice_url TEXT,

  -- Escalation tracking
  escalation_state TEXT DEFAULT 'none' CHECK (escalation_state IN ('none', 'day1_sent', 'day2_sent', 'day3_sent')),

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure one log per goal per day
  UNIQUE(user_id, goal_id, log_date)
);

-- Escalation System Tracking
CREATE TABLE public.escalation_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  goal_id UUID REFERENCES public.goals(id) ON DELETE CASCADE NOT NULL,
  support_circle_id UUID REFERENCES public.support_circle(id),

  -- Escalation details
  escalation_day INTEGER NOT NULL CHECK (escalation_day >= 1), -- 1, 2, 3+ days missed
  type TEXT NOT NULL CHECK (type IN ('progress_team_outreach', 'support_circle_notification', 'support_circle_checkin_request', 'milestone_celebration')),

  -- Communication details
  contact_method TEXT CHECK (contact_method IN ('text_voicemail', 'email', 'text_only')),
  message_sent TEXT,
  response_received TEXT,
  successful BOOLEAN DEFAULT FALSE,

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Interactions (Progress Support Team + Emergency Support Team communications)
CREATE TABLE public.interactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  progress_team_member_id UUID, -- Reference to Progress Support Team member
  support_circle_id UUID REFERENCES public.support_circle(id),

  -- Interaction details
  type TEXT NOT NULL CHECK (type IN ('progress_team_ai', 'progress_team_human', 'support_circle_notification', 'planning_session')),
  content TEXT,
  ai_persona_name TEXT, -- Which of the 2-3 AI personas sent this

  -- Metadata and context
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Planning Sessions Scheduling
CREATE TABLE public.planning_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  progress_team_member_id UUID,

  -- Session details
  session_type TEXT NOT NULL CHECK (session_type IN ('planning', 'weekly_checkin')),
  scheduled_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER,
  notes TEXT,

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Interactions table (for tracking AI coaching conversations)
CREATE TABLE public.ai_interactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  goal_id UUID REFERENCES public.goals(id) ON DELETE CASCADE,
  
  -- Interaction data
  interaction_type TEXT NOT NULL CHECK (interaction_type IN ('coaching', 'motivation', 'analysis', 'planning')),
  ai_persona TEXT NOT NULL CHECK (ai_persona IN ('coach', 'friend', 'mentor')),
  
  -- Conversation
  user_message TEXT NOT NULL,
  ai_response TEXT NOT NULL,
  context_data JSONB, -- Additional context like recent logs, goal progress, etc.
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Streaks table (for tracking goal streaks)
CREATE TABLE public.streaks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  goal_id UUID REFERENCES public.goals(id) ON DELETE CASCADE NOT NULL,
  
  -- Streak data
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_completed_date DATE,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- One streak record per goal
  UNIQUE(user_id, goal_id)
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_support_team ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.escalation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.planning_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.streaks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for goals table
CREATE POLICY "Users can view own goals" ON public.goals
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own goals" ON public.goals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own goals" ON public.goals
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own goals" ON public.goals
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for daily_logs table
CREATE POLICY "Users can view own logs" ON public.daily_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own logs" ON public.daily_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own logs" ON public.daily_logs
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own logs" ON public.daily_logs
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for emergency_support_team table
CREATE POLICY "Users can view own support team" ON public.emergency_support_team
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own support team" ON public.emergency_support_team
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for escalation_logs table
CREATE POLICY "Users can view own escalation logs" ON public.escalation_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can create escalation logs" ON public.escalation_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for interactions table
CREATE POLICY "Users can view own interactions" ON public.interactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can create interactions" ON public.interactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for planning_sessions table
CREATE POLICY "Users can view own planning sessions" ON public.planning_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own planning sessions" ON public.planning_sessions
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for ai_interactions table
CREATE POLICY "Users can view own AI interactions" ON public.ai_interactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own AI interactions" ON public.ai_interactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for streaks table
CREATE POLICY "Users can view own streaks" ON public.streaks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own streaks" ON public.streaks
  FOR ALL USING (auth.uid() = user_id);

-- Indexes for better performance
CREATE INDEX idx_goals_user_id ON public.goals(user_id);
CREATE INDEX idx_goals_status ON public.goals(status);
CREATE INDEX idx_goals_category ON public.goals(category);

CREATE INDEX idx_daily_logs_user_id ON public.daily_logs(user_id);
CREATE INDEX idx_daily_logs_goal_id ON public.daily_logs(goal_id);
CREATE INDEX idx_daily_logs_date ON public.daily_logs(log_date);
CREATE INDEX idx_daily_logs_completed ON public.daily_logs(completed);

CREATE INDEX idx_support_circle_user_id ON public.support_circle(user_id);
CREATE INDEX idx_support_circle_active ON public.support_circle(user_id, is_active);
CREATE INDEX idx_support_circle_consent ON public.support_circle(user_id, consent_given);

CREATE INDEX idx_escalation_logs_user_id ON public.escalation_logs(user_id);
CREATE INDEX idx_escalation_logs_goal_id ON public.escalation_logs(goal_id);
CREATE INDEX idx_escalation_logs_support_circle_id ON public.escalation_logs(support_circle_id);
CREATE INDEX idx_escalation_logs_created_at ON public.escalation_logs(created_at);

CREATE INDEX idx_interactions_user_id ON public.interactions(user_id, created_at);
CREATE INDEX idx_interactions_emergency_support_team_id ON public.interactions(emergency_support_team_id);

CREATE INDEX idx_planning_sessions_user_id ON public.planning_sessions(user_id);
CREATE INDEX idx_planning_sessions_scheduled_at ON public.planning_sessions(scheduled_at);

CREATE INDEX idx_ai_interactions_user_id ON public.ai_interactions(user_id);
CREATE INDEX idx_streaks_user_id ON public.streaks(user_id);

-- Functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for automatic timestamp updates
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_goals_updated_at BEFORE UPDATE ON public.goals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_logs_updated_at BEFORE UPDATE ON public.daily_logs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_support_circle_updated_at BEFORE UPDATE ON public.support_circle
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_streaks_updated_at BEFORE UPDATE ON public.streaks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
