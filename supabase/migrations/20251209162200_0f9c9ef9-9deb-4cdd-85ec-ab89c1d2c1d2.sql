-- Add profile questionnaire columns
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS q_skill_or_hobby text,
ADD COLUMN IF NOT EXISTS q_frustrating_task text,
ADD COLUMN IF NOT EXISTS q_talk_topic text,
ADD COLUMN IF NOT EXISTS q_learning_style text,
ADD COLUMN IF NOT EXISTS q_proud_story text,
ADD COLUMN IF NOT EXISTS q_hands_or_screens text,
ADD COLUMN IF NOT EXISTS q_explaining_patience text,
ADD COLUMN IF NOT EXISTS q_other_generation text,
ADD COLUMN IF NOT EXISTS q_conversation_preference text,
ADD COLUMN IF NOT EXISTS q_joining_reason text;