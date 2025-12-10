-- Add skill exchange duration column to profiles
ALTER TABLE public.profiles 
ADD COLUMN skill_exchange_duration text;