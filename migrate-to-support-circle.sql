-- Migration script to rename emergency_support_team to support_circle
-- Run this script to update the database schema and data

BEGIN;

-- Step 1: Create new support_circle table with same structure
CREATE TABLE IF NOT EXISTS public.support_circle (
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

  -- Contact tracking
  last_contacted TIMESTAMP WITH TIME ZONE,
  contact_count INTEGER DEFAULT 0,
  response_count INTEGER DEFAULT 0,

  -- Notification preferences
  milestone_notifications_enabled BOOLEAN DEFAULT TRUE, -- For 7, 30, 60 day celebrations
  escalation_notifications_enabled BOOLEAN DEFAULT TRUE, -- For missed goal notifications

  -- Status and lifecycle
  is_active BOOLEAN DEFAULT TRUE,
  deactivated_reason TEXT,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 2: Copy data from emergency_support_team to support_circle (if old table exists)
INSERT INTO public.support_circle (
  id, user_id, name, relationship, phone, email, preferred_contact_method,
  consent_given, consent_date, consent_method, last_contacted, contact_count, response_count,
  milestone_notifications_enabled, escalation_notifications_enabled, is_active, deactivated_reason,
  created_at, updated_at
)
SELECT 
  id, user_id, name, relationship, phone, email, preferred_contact_method,
  consent_given, consent_date, consent_method, last_contacted, contact_count, response_count,
  milestone_notifications_enabled, escalation_notifications_enabled, is_active, deactivated_reason,
  created_at, updated_at
FROM public.emergency_support_team
WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'emergency_support_team')
ON CONFLICT (id) DO NOTHING;

-- Step 3: Add support_circle_id column to escalation_logs
ALTER TABLE public.escalation_logs 
ADD COLUMN IF NOT EXISTS support_circle_id UUID REFERENCES public.support_circle(id);

-- Step 4: Copy emergency_support_team_id data to support_circle_id
UPDATE public.escalation_logs 
SET support_circle_id = emergency_support_team_id 
WHERE emergency_support_team_id IS NOT NULL 
AND support_circle_id IS NULL;

-- Step 5: Update escalation_logs type values
UPDATE public.escalation_logs 
SET type = 'support_circle_notification' 
WHERE type = 'emergency_support_team_notification';

UPDATE public.escalation_logs 
SET type = 'support_circle_checkin_request' 
WHERE type = 'emergency_support_team_checkin_request';

-- Step 6: Add support_circle_id column to interactions
ALTER TABLE public.interactions 
ADD COLUMN IF NOT EXISTS support_circle_id UUID REFERENCES public.support_circle(id);

-- Step 7: Copy emergency_support_team_id data to support_circle_id in interactions
UPDATE public.interactions 
SET support_circle_id = emergency_support_team_id 
WHERE emergency_support_team_id IS NOT NULL 
AND support_circle_id IS NULL;

-- Step 8: Update interactions type values
UPDATE public.interactions 
SET type = 'support_circle_notification' 
WHERE type = 'emergency_support_team_notification';

-- Step 9: Create indexes for new table
CREATE INDEX IF NOT EXISTS idx_support_circle_user_id ON public.support_circle(user_id);
CREATE INDEX IF NOT EXISTS idx_support_circle_active ON public.support_circle(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_support_circle_consent ON public.support_circle(user_id, consent_given);

-- Step 10: Create indexes for new foreign key columns
CREATE INDEX IF NOT EXISTS idx_escalation_logs_support_circle_id ON public.escalation_logs(support_circle_id);
CREATE INDEX IF NOT EXISTS idx_interactions_support_circle_id ON public.interactions(support_circle_id);

-- Step 11: Create trigger for automatic timestamp updates
CREATE TRIGGER IF NOT EXISTS update_support_circle_updated_at 
BEFORE UPDATE ON public.support_circle
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Step 12: Drop old foreign key constraints and columns (commented out for safety)
-- Only run these after confirming everything works:

-- ALTER TABLE public.escalation_logs DROP COLUMN IF EXISTS emergency_support_team_id;
-- ALTER TABLE public.interactions DROP COLUMN IF EXISTS emergency_support_team_id;

-- Step 13: Drop old table (commented out for safety)
-- Only run this after confirming everything works:

-- DROP TABLE IF EXISTS public.emergency_support_team CASCADE;

COMMIT;

-- Verification queries (run these to check the migration worked):
-- SELECT COUNT(*) FROM public.support_circle;
-- SELECT COUNT(*) FROM public.escalation_logs WHERE support_circle_id IS NOT NULL;
-- SELECT DISTINCT type FROM public.escalation_logs WHERE type LIKE '%support_circle%';
