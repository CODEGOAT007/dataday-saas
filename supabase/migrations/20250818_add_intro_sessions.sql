-- Intro Sessions table for shared admin/user onboarding flow
-- Reason: Enable real-time sync of steps and voice note between admin and user during Intro Session

-- Create table
CREATE TABLE IF NOT EXISTS public.intro_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  admin_id UUID,

  -- Shared state
  current_step TEXT DEFAULT 'goal-details' CHECK (current_step IN ('goal-details','voice-message','send-notifications')),
  goal_title TEXT,
  frequency TEXT,
  duration TEXT,
  voice_note_url TEXT,

  -- Presence / UX hints
  is_recording BOOLEAN DEFAULT FALSE,
  last_seen_user TIMESTAMPTZ,
  last_seen_admin TIMESTAMPTZ,

  -- Audit
  updated_by TEXT CHECK (updated_by IN ('user','admin')),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_intro_sessions_user_id ON public.intro_sessions(user_id);

-- Enable RLS
ALTER TABLE public.intro_sessions ENABLE ROW LEVEL SECURITY;

-- Policies: allow the session's user to view/update their intro session
DROP POLICY IF EXISTS "IntroSession user can view" ON public.intro_sessions;
CREATE POLICY "IntroSession user can view" ON public.intro_sessions
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "IntroSession user can update" ON public.intro_sessions;
CREATE POLICY "IntroSession user can update" ON public.intro_sessions
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Inserts can be performed by service role (admin-side API) or by the user
DROP POLICY IF EXISTS "IntroSession user can insert" ON public.intro_sessions;
CREATE POLICY "IntroSession user can insert" ON public.intro_sessions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

