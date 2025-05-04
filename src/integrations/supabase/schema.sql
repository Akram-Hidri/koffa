
-- Add icon and color columns to spaces table if they don't exist
ALTER TABLE IF EXISTS public.spaces 
ADD COLUMN IF NOT EXISTS icon text,
ADD COLUMN IF NOT EXISTS color text,
ADD COLUMN IF NOT EXISTS type text;
