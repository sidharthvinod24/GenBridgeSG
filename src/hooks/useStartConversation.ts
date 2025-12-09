import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useStartConversation = () => {
  const startConversation = async (currentUserId: string, targetUserId: string) => {
    try {
      // Check if conversation already exists
      const { data: existingConvo } = await supabase
        .from("conversations")
        .select("id")
        .or(
          `and(participant_one.eq.${currentUserId},participant_two.eq.${targetUserId}),and(participant_one.eq.${targetUserId},participant_two.eq.${currentUserId})`
        )
        .maybeSingle();

      if (existingConvo) {
        return existingConvo.id;
      }

      // Create new conversation
      const { data: newConvo, error } = await supabase
        .from("conversations")
        .insert({
          participant_one: currentUserId,
          participant_two: targetUserId,
        })
        .select()
        .single();

      if (error) throw error;
      
      toast.success("Conversation started!");
      return newConvo.id;
    } catch (error: any) {
      console.error("Error starting conversation:", error);
      toast.error("Failed to start conversation");
      return null;
    }
  };

  return { startConversation };
};
