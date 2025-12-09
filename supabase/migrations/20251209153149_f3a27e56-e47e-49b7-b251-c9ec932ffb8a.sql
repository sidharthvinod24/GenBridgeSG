-- Create profiles for any existing users who don't have one
INSERT INTO public.profiles (user_id, full_name)
SELECT id, raw_user_meta_data ->> 'full_name'
FROM auth.users
WHERE id NOT IN (SELECT user_id FROM public.profiles);