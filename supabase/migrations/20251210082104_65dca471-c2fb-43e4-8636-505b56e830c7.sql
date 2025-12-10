-- Update the handle_new_user function to include phone_number from metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, phone_number)
  VALUES (
    NEW.id, 
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.raw_user_meta_data ->> 'phone_number'
  );
  RETURN NEW;
END;
$$;