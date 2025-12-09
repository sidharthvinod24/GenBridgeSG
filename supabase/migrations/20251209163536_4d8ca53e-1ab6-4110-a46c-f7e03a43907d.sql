-- Add DELETE policy for conversations so users can remove their conversations
CREATE POLICY "Users can delete their conversations"
ON public.conversations FOR DELETE
USING (auth.uid() = participant_one OR auth.uid() = participant_two);

-- Add length constraints to profiles table for security
ALTER TABLE public.profiles
ADD CONSTRAINT profiles_full_name_length CHECK (char_length(full_name) <= 100),
ADD CONSTRAINT profiles_bio_length CHECK (char_length(bio) <= 1000),
ADD CONSTRAINT profiles_location_length CHECK (char_length(location) <= 100);

-- Add length constraint to messages table
ALTER TABLE public.messages
ADD CONSTRAINT messages_content_length CHECK (char_length(content) <= 5000);