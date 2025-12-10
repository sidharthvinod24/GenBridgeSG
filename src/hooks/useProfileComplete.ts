import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export const useProfileComplete = () => {
  const { user } = useAuth();
  const [isComplete, setIsComplete] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkProfile = async () => {
      if (!user) {
        setIsComplete(false);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("full_name, skills_offered, skills_wanted, q_joining_reason")
          .eq("user_id", user.id)
          .maybeSingle();

        if (error) {
          console.error("Error checking profile:", error);
          setIsComplete(false);
        } else if (data) {
          // Profile is complete if user has name, at least one skill to teach, and one skill to learn
          const hasName = !!data.full_name?.trim();
          const hasSkillsOffered = (data.skills_offered?.length || 0) > 0;
          const hasSkillsWanted = (data.skills_wanted?.length || 0) > 0;
          const hasQuestionnaire = !!data.q_joining_reason;
          
          setIsComplete(hasName && hasSkillsOffered && hasSkillsWanted && hasQuestionnaire);
        } else {
          setIsComplete(false);
        }
      } catch (err) {
        console.error("Error checking profile:", err);
        setIsComplete(false);
      } finally {
        setLoading(false);
      }
    };

    checkProfile();
  }, [user]);

  return { isComplete, loading };
};
