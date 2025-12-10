-- Fix 1: Secure profiles table - restrict full access to owner only, create function for public profile viewing

-- Drop the existing overly permissive SELECT policy
DROP POLICY IF EXISTS "Profiles are viewable by authenticated users" ON public.profiles;

-- Create new policy: Users can only view their own full profile
CREATE POLICY "Users can view own full profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = user_id);

-- Create a security definer function to get public profile data for browsing/matching
-- This only exposes non-sensitive fields
CREATE OR REPLACE FUNCTION public.get_public_profiles()
RETURNS TABLE (
  id uuid,
  user_id uuid,
  full_name text,
  bio text,
  avatar_url text,
  skills_offered text[],
  skills_wanted text[],
  skills_proficiency jsonb,
  skill_exchange_duration text,
  credibility_score integer,
  age_group text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    id,
    user_id,
    full_name,
    bio,
    avatar_url,
    skills_offered,
    skills_wanted,
    skills_proficiency,
    skill_exchange_duration,
    credibility_score,
    age_group
  FROM public.profiles
  WHERE user_id != auth.uid();
$$;

-- Create function to get a single public profile by user_id
CREATE OR REPLACE FUNCTION public.get_public_profile(target_user_id uuid)
RETURNS TABLE (
  id uuid,
  user_id uuid,
  full_name text,
  bio text,
  avatar_url text,
  skills_offered text[],
  skills_wanted text[],
  skills_proficiency jsonb,
  skill_exchange_duration text,
  credibility_score integer,
  age_group text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    id,
    user_id,
    full_name,
    bio,
    avatar_url,
    skills_offered,
    skills_wanted,
    skills_proficiency,
    skill_exchange_duration,
    credibility_score,
    age_group
  FROM public.profiles
  WHERE user_id = target_user_id;
$$;