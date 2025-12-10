-- Add new questionnaire fields for age-based routing
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS age integer;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS q_skills_to_share text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS q_digital_help_needed text[];
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS q_languages_dialects text[];
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS q_cultural_interests text[];
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS q_digital_teaching_skills text[];
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS q_teaching_comfort integer;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS q_communication_preference text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS q_availability text[];
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS q_allow_archive boolean DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS q_open_to_verification boolean DEFAULT false;