-- Remove location column and add phone_number
ALTER TABLE public.profiles DROP COLUMN IF EXISTS location;
ALTER TABLE public.profiles ADD COLUMN phone_number TEXT;

-- Update default credibility score to 0 for new users
ALTER TABLE public.profiles ALTER COLUMN credibility_score SET DEFAULT 0;

-- Update existing profiles that have NULL credibility_score to 0
UPDATE public.profiles SET credibility_score = 0 WHERE credibility_score IS NULL;