
-- Add the accessibility_preferences column to the profiles table
ALTER TABLE public.profiles 
ADD COLUMN accessibility_preferences JSONB DEFAULT '{}';

-- Add additional onboarding-related columns that are being referenced
ALTER TABLE public.profiles 
ADD COLUMN onboarding_completed BOOLEAN DEFAULT false,
ADD COLUMN user_role TEXT,
ADD COLUMN age_group TEXT;
