-- Add a JSONB column to store skill proficiency levels for skills offered
-- Format: {"skill_name": "proficiency_level", ...}
-- Proficiency levels: beginner, intermediate, advanced, expert

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS skills_proficiency jsonb DEFAULT '{}'::jsonb;

-- Add a computed credibility score column (calculated based on proficiency levels)
-- This will be updated via trigger when skills_proficiency changes
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS credibility_score integer DEFAULT 0;

-- Create a function to calculate credibility score based on proficiency levels
CREATE OR REPLACE FUNCTION public.calculate_credibility_score()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  total_score integer := 0;
  skill_count integer := 0;
  proficiency_value text;
  skill_key text;
BEGIN
  -- Calculate score based on proficiency levels
  -- Beginner: 1 point, Intermediate: 2 points, Advanced: 3 points, Expert: 4 points
  IF NEW.skills_proficiency IS NOT NULL AND jsonb_typeof(NEW.skills_proficiency) = 'object' THEN
    FOR skill_key, proficiency_value IN SELECT * FROM jsonb_each_text(NEW.skills_proficiency)
    LOOP
      skill_count := skill_count + 1;
      CASE proficiency_value
        WHEN 'beginner' THEN total_score := total_score + 1;
        WHEN 'intermediate' THEN total_score := total_score + 2;
        WHEN 'advanced' THEN total_score := total_score + 3;
        WHEN 'expert' THEN total_score := total_score + 4;
        ELSE total_score := total_score + 1;
      END CASE;
    END LOOP;
  END IF;

  -- Calculate average score and normalize to 0-100 scale
  -- Max score per skill is 4 (expert), so we normalize based on that
  IF skill_count > 0 THEN
    -- Base score from proficiency (up to 60 points)
    NEW.credibility_score := LEAST(60, (total_score::float / skill_count * 15)::integer);
    -- Bonus for having multiple skills (up to 20 points)
    NEW.credibility_score := NEW.credibility_score + LEAST(20, skill_count * 4);
    -- Bonus for questionnaire completion (up to 20 points) - check if questionnaire fields are filled
    IF NEW.q_skill_or_hobby IS NOT NULL THEN NEW.credibility_score := NEW.credibility_score + 4; END IF;
    IF NEW.q_proud_story IS NOT NULL THEN NEW.credibility_score := NEW.credibility_score + 4; END IF;
    IF NEW.q_learning_style IS NOT NULL THEN NEW.credibility_score := NEW.credibility_score + 4; END IF;
    IF NEW.q_explaining_patience IS NOT NULL THEN NEW.credibility_score := NEW.credibility_score + 4; END IF;
    IF NEW.q_joining_reason IS NOT NULL THEN NEW.credibility_score := NEW.credibility_score + 4; END IF;
  ELSE
    NEW.credibility_score := 0;
  END IF;

  -- Cap at 100
  NEW.credibility_score := LEAST(100, NEW.credibility_score);

  RETURN NEW;
END;
$$;

-- Create trigger to update credibility score when profile changes
DROP TRIGGER IF EXISTS update_credibility_score ON public.profiles;
CREATE TRIGGER update_credibility_score
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.calculate_credibility_score();

-- Add constraint for valid proficiency levels
ALTER TABLE public.profiles 
ADD CONSTRAINT valid_proficiency_levels 
CHECK (
  skills_proficiency IS NULL OR 
  jsonb_typeof(skills_proficiency) = 'object'
);