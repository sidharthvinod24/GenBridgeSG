import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MapPin, Sparkles, Heart, ArrowLeftRight, MessageCircle, X, RotateCcw } from "lucide-react";
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [skippedMatches, setSkippedMatches] = useState<MatchedProfile[]>([]);
  const [connecting, setConnecting] = useState(false);
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
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("*")
        .neq("user_id", userId);

      if (error) throw error;

      const matchedProfiles: MatchedProfile[] = [];

      profiles?.forEach((profile) => {
        const skillsICanTeach = userSkillsOffered.filter((skill) =>
          profile.skills_wanted?.some(
            (wanted: string) => wanted.toLowerCase() === skill.toLowerCase()
          )
        );

        const skillsTheyCanTeach = (profile.skills_offered || []).filter(
          (skill: string) =>
            userSkillsWanted.some(
              (wanted) => wanted.toLowerCase() === skill.toLowerCase()
            )
        );

        if (skillsICanTeach.length > 0 || skillsTheyCanTeach.length > 0) {
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

  const handleSwipe = async (direction: "left" | "right") => {
    if (isAnimating || currentIndex >= matches.length) return;

    setSwipeDirection(direction);
    setIsAnimating(true);

    setTimeout(async () => {
      if (direction === "right") {
        // Like - start conversation
        const match = matches[currentIndex];
        setConnecting(true);
        const conversationId = await startConversation(userId, match.user_id);
        setConnecting(false);
        if (conversationId) {
          toast.success(`Connected with ${match.full_name || "user"}! 💬`);
        }
      } else {
        // Pass - add to skipped
        setSkippedMatches(prev => [...prev, matches[currentIndex]]);
      }

      setCurrentIndex(prev => prev + 1);
      setSwipeDirection(null);
      setIsAnimating(false);
    }, 300);
  };

  const handleUndo = () => {
    if (skippedMatches.length === 0 || currentIndex === 0) return;
    
    const lastSkipped = skippedMatches[skippedMatches.length - 1];
    setSkippedMatches(prev => prev.slice(0, -1));
    setCurrentIndex(prev => prev - 1);
  };

  const currentMatch = matches[currentIndex];
  const isPerfectMatch = currentMatch?.matchingSkillsICanTeach.length > 0 && 
                         currentMatch?.matchingSkillsTheyCanTeach.length > 0;

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
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <Heart className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">No Matches Yet</h3>
            <p className="text-muted-foreground">
              We're looking for people with matching skills. Check back soon!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (currentIndex >= matches.length) {
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
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-primary" />
            </div>
            <h3 className="font-semibold text-xl mb-2">You've seen all matches!</h3>
            <p className="text-muted-foreground mb-6">
              Check your messages to connect with people you liked.
            </p>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={() => navigate("/messages")}>
                <MessageCircle className="w-4 h-4 mr-2" />
                View Messages
              </Button>
              <Button onClick={() => { setCurrentIndex(0); setSkippedMatches([]); }}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Start Over
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-elevated overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="font-display text-xl flex items-center gap-2">
            <Heart className="w-5 h-5 text-primary heartbeat" />
            Find Your Match
          </CardTitle>
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            {currentIndex + 1} / {matches.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        {/* Card Stack */}
        <div className="relative h-[400px] w-full">
          {/* Background cards for stack effect */}
          {matches.slice(currentIndex + 1, currentIndex + 3).map((_, i) => (
            <div
              key={i}
              className="absolute inset-x-0 top-0 h-full bg-card rounded-2xl border border-border"
              style={{
                transform: `scale(${1 - (i + 1) * 0.05}) translateY(${(i + 1) * 8}px)`,
                zIndex: -i - 1,
                opacity: 1 - (i + 1) * 0.3,
              }}
            />
          ))}

          {/* Current Card */}
          <div
            className={`absolute inset-0 bg-gradient-to-b from-card to-card/95 rounded-2xl border-2 
              ${isPerfectMatch ? "border-primary shadow-[0_0_30px_rgba(var(--primary)/0.3)]" : "border-border"} 
              transition-all duration-300 ease-out overflow-hidden
              ${swipeDirection === "left" ? "translate-x-[-120%] rotate-[-20deg] opacity-0" : ""}
              ${swipeDirection === "right" ? "translate-x-[120%] rotate-[20deg] opacity-0" : ""}
            `}
          >
            {/* Perfect Match Banner */}
            {isPerfectMatch && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
                <Badge className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-1 text-sm animate-pulse">
                  ✨ Perfect Match!
                </Badge>
              </div>
            )}

            {/* Avatar Section */}
            <div className="h-[45%] bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20 flex items-center justify-center relative">
              <Avatar className="w-28 h-28 border-4 border-white shadow-xl">
                <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-3xl font-bold">
                  {getInitials(currentMatch.full_name)}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Info Section */}
            <div className="p-5 space-y-4">
              <div className="text-center">
                <h3 className="font-display text-2xl font-bold text-foreground">
                  {currentMatch.full_name || "Anonymous"}
                </h3>
                {(currentMatch.location || currentMatch.age_group) && (
                  <p className="text-muted-foreground flex items-center justify-center gap-1 mt-1">
                    <MapPin className="w-4 h-4" />
                    {currentMatch.location}
                    {currentMatch.age_group && ` • ${currentMatch.age_group}`}
                  </p>
                )}
              </div>

              {/* Skills Exchange */}
              <div className="space-y-3">
                {currentMatch.matchingSkillsTheyCanTeach.length > 0 && (
                  <div className="bg-primary/5 rounded-xl p-3">
                    <p className="text-xs font-semibold text-primary mb-2 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Can teach you
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {currentMatch.matchingSkillsTheyCanTeach.map((skill) => (
                        <Badge key={skill} className="bg-primary/20 text-primary border-0">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {currentMatch.matchingSkillsICanTeach.length > 0 && (
                  <div className="bg-secondary/5 rounded-xl p-3">
                    <p className="text-xs font-semibold text-secondary mb-2 flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      Wants to learn from you
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {currentMatch.matchingSkillsICanTeach.map((skill) => (
                        <Badge key={skill} className="bg-secondary/20 text-secondary border-0">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-4 mt-6">
          <Button
            variant="outline"
            size="icon"
            className="w-12 h-12 rounded-full border-2 text-muted-foreground hover:border-muted-foreground hover:bg-muted/50 disabled:opacity-50"
            onClick={handleUndo}
            disabled={skippedMatches.length === 0 || isAnimating}
          >
            <RotateCcw className="w-5 h-5" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="w-16 h-16 rounded-full border-2 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground transition-all"
            onClick={() => handleSwipe("left")}
            disabled={isAnimating}
          >
            <X className="w-8 h-8" />
          </Button>

          <Button
            size="icon"
            className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white shadow-lg transition-all"
            onClick={() => handleSwipe("right")}
            disabled={isAnimating || connecting}
          >
            <Heart className="w-8 h-8" fill="currentColor" />
          </Button>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-4">
          Swipe right to connect, left to pass
        </p>
      </CardContent>
    </Card>
  );
};

export default SkillMatches;
