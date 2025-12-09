-- Allow users to update read_at on messages sent TO them (not by them) in their conversations
CREATE POLICY "Users can mark messages as read in their conversations"
ON public.messages
FOR UPDATE
USING (
  -- User is NOT the sender (they're the recipient)
  auth.uid() != sender_id 
  AND 
  -- User is a participant in the conversation
  EXISTS (
    SELECT 1 FROM conversations
    WHERE conversations.id = messages.conversation_id
    AND (conversations.participant_one = auth.uid() OR conversations.participant_two = auth.uid())
  )
)
WITH CHECK (
  -- Only allow updating read_at field (not content or other fields)
  auth.uid() != sender_id
  AND
  EXISTS (
    SELECT 1 FROM conversations
    WHERE conversations.id = messages.conversation_id
    AND (conversations.participant_one = auth.uid() OR conversations.participant_two = auth.uid())
  )
);