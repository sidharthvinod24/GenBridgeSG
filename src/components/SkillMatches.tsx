import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MapPin, Sparkles, Heart, ArrowLeftRight, MessageCircle } from "lucide-react";
import { useStartConversation } from "@/hooks/useStartConversation";
import { toast } from "sonner";

interface MatchedProfile {
  id: string;
  user_id: string;
  full_name: string | null;
  bio: string | null;
  location: string | null;
  avatar_url: string | null;
  skills_offered: string[];
  skills_wanted: string[];
  age_group: string | null;
  matchingSkillsICanTeach: string[];
  matchingSkillsTheyCanTeach: string[];
  matchScore: number;
}

interface SkillMatchesProps {
  userSkillsOffered: string[];
  userSkillsWanted: string[];
  userId: string;
}

const SkillMatches = ({ userSkillsOffered, userSkillsWanted, userId }: SkillMatchesProps) => {
  const [matches, setMatches] = useState<MatchedProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState<string | null>(null);
  const navigate = useNavigate();
  const { startConversation } = useStartConversation();

  useEffect(() => {
    fetchMatches();
  }, [userSkillsOffered, userSkillsWanted, userId]);

  const fetchMatches = async () => {
    if (userSkillsOffered.length === 0 && userSkillsWanted.length === 0) {
      setLoading(false);
      return;
    }

    try {
      // Fetch all profiles except the current user
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("*")
        .neq("user_id", userId);

      if (error) throw error;

      // Calculate matches
      const matchedProfiles: MatchedProfile[] = [];

      profiles?.forEach((profile) => {
        // Skills I can teach them (my offered matches their wanted)
        const skillsICanTeach = userSkillsOffered.filter((skill) =>
          profile.skills_wanted?.some(
            (wanted: string) => wanted.toLowerCase() === skill.toLowerCase()
          )
        );

        // Skills they can teach me (their offered matches my wanted)
        const skillsTheyCanTeach = (profile.skills_offered || []).filter(
          (skill: string) =>
            userSkillsWanted.some(
              (wanted) => wanted.toLowerCase() === skill.toLowerCase()
            )
        );

        // Only include if there's at least one match
        if (skillsICanTeach.length > 0 || skillsTheyCanTeach.length > 0) {
          // Calculate match score - higher if bidirectional match
          const matchScore =
            skillsICanTeach.length + skillsTheyCanTeach.length +
            (skillsICanTeach.length > 0 && skillsTheyCanTeach.length > 0 ? 5 : 0);

          matchedProfiles.push({
            ...profile,
            matchingSkillsICanTeach: skillsICanTeach,
            matchingSkillsTheyCanTeach: skillsTheyCanTeach,
            matchScore,
          });
        }
      });

      // Sort by match score (best matches first)
      matchedProfiles.sort((a, b) => b.matchScore - a.matchScore);

      setMatches(matchedProfiles);
    } catch (error) {
      console.error("Error fetching matches:", error);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string | null) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleConnect = async (matchUserId: string) => {
    setConnecting(matchUserId);
    const conversationId = await startConversation(userId, matchUserId);
    if (conversationId) {
      navigate("/messages");
    }
    setConnecting(null);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-display text-xl flex items-center gap-2">
            <Heart className="w-5 h-5 text-primary" />
            Finding Matches...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (userSkillsOffered.length === 0 && userSkillsWanted.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-display text-xl flex items-center gap-2">
            <Heart className="w-5 h-5 text-primary" />
            Skill Matches
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <ArrowLeftRight className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Add Your Skills First</h3>
            <p className="text-muted-foreground">
              Edit your profile to add skills you can teach and want to learn.
              We'll find your perfect matches!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (matches.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-display text-xl flex items-center gap-2">
            <Heart className="w-5 h-5 text-primary" />
            Skill Matches
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary-light flex items-center justify-center">
              <Heart className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">No Matches Yet</h3>
            <p className="text-muted-foreground">
              We're looking for people with matching skills. Check back soon as more
              people join the community!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-elevated">
      <CardHeader>
        <CardTitle className="font-display text-xl flex items-center gap-2">
          <Heart className="w-5 h-5 text-primary heartbeat" />
          Your Skill Matches
          <Badge variant="secondary" className="ml-2 bg-primary-light text-primary">
            {matches.length} found
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {matches.slice(0, 5).map((match) => (
            <div
              key={match.id}
              className="p-4 rounded-xl border border-border bg-card hover:shadow-card transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <Avatar className="w-14 h-14 border-2 border-primary/20">
                  <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-primary-foreground font-bold">
                    {getInitials(match.full_name)}
                  </AvatarFallback>
                </Avatar>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-display font-bold text-lg text-foreground truncate">
                      {match.full_name || "Anonymous"}
                    </h4>
                    {match.matchingSkillsICanTeach.length > 0 &&
                      match.matchingSkillsTheyCanTeach.length > 0 && (
                        <Badge className="bg-accent text-accent-foreground text-xs">
                          Perfect Match!
                        </Badge>
                      )}
                  </div>

                  {match.location && (
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mb-3">
                      <MapPin className="w-3 h-3" />
                      {match.location}
                      {match.age_group && ` • ${match.age_group}`}
                    </p>
                  )}

                  {/* Matching Skills */}
                  <div className="space-y-2">
                    {match.matchingSkillsTheyCanTeach.length > 0 && (
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-primary" />
                          Can teach you:
                        </span>
                        {match.matchingSkillsTheyCanTeach.map((skill) => (
                          <Badge
                            key={skill}
                            variant="secondary"
                            className="bg-primary-light text-primary text-xs"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {match.matchingSkillsICanTeach.length > 0 && (
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                          <Heart className="w-3 h-3 text-secondary" />
                          Wants to learn:
                        </span>
                        {match.matchingSkillsICanTeach.map((skill) => (
                          <Badge
                            key={skill}
                            variant="secondary"
                            className="bg-secondary-light text-secondary text-xs"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Action */}
                <Button 
                  variant="soft" 
                  size="sm" 
                  className="shrink-0"
                  onClick={() => handleConnect(match.user_id)}
                  disabled={connecting === match.user_id}
                >
                  <MessageCircle className="w-4 h-4 mr-1" />
                  {connecting === match.user_id ? "..." : "Connect"}
                </Button>
              </div>
            </div>
          ))}

          {matches.length > 5 && (
            <div className="text-center pt-2">
              <Button variant="outline">
                View All {matches.length} Matches
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SkillMatches;
