import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MapPin, Sparkles, Heart, ArrowLeftRight, MessageCircle, X, RotateCcw, Clock } from "lucide-react";
import { useStartConversation } from "@/hooks/useStartConversation";
import { toast } from "sonner";
import MatchCelebration from "./MatchCelebration";

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
  skill_exchange_duration: string | null;
  matchingSkillsICanTeach: string[];
  matchingSkillsTheyCanTeach: string[];
  matchScore: number;
}

const DURATION_LABELS: Record<string, string> = {
  "30": "30 mins",
  "60": "60 mins",
  "90": "90 mins",
  "120": "120 mins",
};

interface SkillMatchesProps {
  userSkillsOffered: string[];
  userSkillsWanted: string[];
  userId: string;
}

const SkillMatches = ({ userSkillsOffered, userSkillsWanted, userId }: SkillMatchesProps) => {
  const [matches, setMatches] = useState<MatchedProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [skippedMatches, setSkippedMatches] = useState<MatchedProfile[]>([]);
  const [connecting, setConnecting] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationMatch, setCelebrationMatch] = useState<MatchedProfile | null>(null);
  
  // Swipe state
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isExiting, setIsExiting] = useState<"left" | "right" | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  
  const navigate = useNavigate();
  const { startConversation } = useStartConversation();

  const SWIPE_THRESHOLD = 100;

  useEffect(() => {
    fetchMatches();
  }, [userSkillsOffered, userSkillsWanted, userId]);

  const fetchMatches = async () => {
    if (userSkillsOffered.length === 0 && userSkillsWanted.length === 0) {
      setLoading(false);
      return;
    }

    try {
      // Use rate-limited edge function
      const { data, error } = await supabase.functions.invoke('browse-profiles', {
        body: null,
      });

      if (error) {
        // Check for rate limit error
        if (error.message?.includes('429') || error.message?.includes('Rate limit')) {
          toast.error("Too many requests. Please wait a moment before viewing more matches.");
          setLoading(false);
          return;
        }
        throw error;
      }

      const profiles = data?.profiles || [];
      const matchedProfiles: MatchedProfile[] = [];

      console.log("Matching debug - userSkillsOffered:", userSkillsOffered);
      console.log("Matching debug - userSkillsWanted:", userSkillsWanted);
      console.log("Matching debug - total profiles fetched:", profiles.length);

      profiles.forEach((profile: any) => {
        // Skip profiles that don't have any skills
        const profileSkillsOffered = profile.skills_offered || [];
        const profileSkillsWanted = profile.skills_wanted || [];
        
        // Only consider profiles that have at least one skill
        if (profileSkillsOffered.length === 0 && profileSkillsWanted.length === 0) {
          console.log(`Skipping ${profile.full_name} - no skills`);
          return;
        }

        const skillsICanTeach = userSkillsOffered.filter((skill) =>
          profileSkillsWanted.some(
            (wanted: string) => wanted.toLowerCase() === skill.toLowerCase()
          )
        );

        const skillsTheyCanTeach = profileSkillsOffered.filter(
          (skill: string) =>
            userSkillsWanted.some(
              (wanted) => wanted.toLowerCase() === skill.toLowerCase()
            )
        );

        console.log(`Profile ${profile.full_name}:`, {
          theirSkillsOffered: profileSkillsOffered,
          theirSkillsWanted: profileSkillsWanted,
          skillsICanTeach,
          skillsTheyCanTeach
        });

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
          console.log(`Added ${profile.full_name} as match with score ${matchScore}`);
        }
      });

      console.log("Matching debug - total matches found:", matchedProfiles.length);
      matchedProfiles.sort((a, b) => b.matchScore - a.matchScore);
      setMatches(matchedProfiles);
    } catch (error) {
      console.error("Error fetching matches:", error);
      toast.error("Failed to load matches");
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

  // Touch/Mouse handlers for swiping
  const handleDragStart = (clientX: number, clientY: number) => {
    setDragStart({ x: clientX, y: clientY });
    setIsDragging(true);
  };

  const handleDragMove = (clientX: number, clientY: number) => {
    if (!isDragging) return;
    const deltaX = clientX - dragStart.x;
    const deltaY = clientY - dragStart.y;
    setDragOffset({ x: deltaX, y: deltaY * 0.3 }); // Less vertical movement
  };

  const handleDragEnd = async () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (Math.abs(dragOffset.x) > SWIPE_THRESHOLD) {
      const direction = dragOffset.x > 0 ? "right" : "left";
      await handleSwipe(direction);
    } else {
      // Snap back
      setDragOffset({ x: 0, y: 0 });
    }
  };

  const handleSwipe = async (direction: "left" | "right") => {
    if (currentIndex >= matches.length) return;

    setIsExiting(direction);
    const match = matches[currentIndex];
    const isPerfect = match.matchingSkillsICanTeach.length > 0 && match.matchingSkillsTheyCanTeach.length > 0;

    setTimeout(async () => {
      if (direction === "right") {
        setConnecting(true);
        const conversationId = await startConversation(userId, match.user_id);
        setConnecting(false);
        
        if (conversationId) {
          if (isPerfect) {
            // Show celebration for perfect matches
            setCelebrationMatch(match);
            setShowCelebration(true);
          } else {
            toast.success(`Connected with ${match.full_name || "user"}! 💬`);
          }
        }
      } else {
        setSkippedMatches(prev => [...prev, matches[currentIndex]]);
      }

      setCurrentIndex(prev => prev + 1);
      setIsExiting(null);
      setDragOffset({ x: 0, y: 0 });
    }, 300);
  };

  const handleCelebrationComplete = () => {
    setShowCelebration(false);
    setCelebrationMatch(null);
    toast.success(`Connected with ${celebrationMatch?.full_name || "user"}! 💬`);
  };

  const handleUndo = () => {
    if (skippedMatches.length === 0 || currentIndex === 0) return;
    setSkippedMatches(prev => prev.slice(0, -1));
    setCurrentIndex(prev => prev - 1);
  };

  // Mouse event handlers
  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleDragStart(e.clientX, e.clientY);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    handleDragMove(e.clientX, e.clientY);
  };

  const onMouseUp = () => {
    handleDragEnd();
  };

  const onMouseLeave = () => {
    if (isDragging) {
      handleDragEnd();
    }
  };

  // Touch event handlers
  const onTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleDragStart(touch.clientX, touch.clientY);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleDragMove(touch.clientX, touch.clientY);
  };

  const onTouchEnd = () => {
    handleDragEnd();
  };

  const currentMatch = matches[currentIndex];
  const isPerfectMatch = currentMatch?.matchingSkillsICanTeach.length > 0 && 
                         currentMatch?.matchingSkillsTheyCanTeach.length > 0;

  // Calculate card transform
  const getCardStyle = () => {
    if (isExiting === "left") {
      return { transform: "translateX(-150%) rotate(-30deg)", opacity: 0, transition: "all 0.3s ease-out" };
    }
    if (isExiting === "right") {
      return { transform: "translateX(150%) rotate(30deg)", opacity: 0, transition: "all 0.3s ease-out" };
    }
    if (isDragging || dragOffset.x !== 0) {
      const rotation = dragOffset.x * 0.1;
      return { 
        transform: `translateX(${dragOffset.x}px) translateY(${dragOffset.y}px) rotate(${rotation}deg)`,
        transition: isDragging ? "none" : "all 0.3s ease-out"
      };
    }
    return { transform: "translateX(0) rotate(0)", transition: "all 0.3s ease-out" };
  };

  // Swipe indicator opacity
  const likeOpacity = Math.min(Math.max(dragOffset.x / SWIPE_THRESHOLD, 0), 1);
  const passOpacity = Math.min(Math.max(-dragOffset.x / SWIPE_THRESHOLD, 0), 1);

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
    <>
      {/* Match Celebration Overlay */}
      {showCelebration && celebrationMatch && (
        <MatchCelebration 
          matchName={celebrationMatch.full_name || "your match"}
          onComplete={handleCelebrationComplete}
        />
      )}

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
        <div 
          className="relative h-[420px] w-full select-none"
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseLeave}
        >
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
            ref={cardRef}
            className={`absolute inset-0 bg-gradient-to-b from-card to-card/95 rounded-2xl border-2 cursor-grab active:cursor-grabbing overflow-hidden
              ${isPerfectMatch ? "border-primary shadow-[0_0_30px_rgba(var(--primary)/0.3)]" : "border-border"}`}
            style={getCardStyle()}
            onMouseDown={onMouseDown}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {/* Swipe Indicators */}
            <div 
              className="absolute top-8 left-8 z-20 px-4 py-2 rounded-lg border-4 border-green-500 text-green-500 font-bold text-2xl rotate-[-20deg]"
              style={{ opacity: likeOpacity }}
            >
              LIKE
            </div>
            <div 
              className="absolute top-8 right-8 z-20 px-4 py-2 rounded-lg border-4 border-red-500 text-red-500 font-bold text-2xl rotate-[20deg]"
              style={{ opacity: passOpacity }}
            >
              NOPE
            </div>

            {/* Perfect Match Banner */}
            {isPerfectMatch && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
                <Badge className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-1 text-sm animate-pulse">
                  ✨ Perfect Match!
                </Badge>
              </div>
            )}

            {/* Avatar Section */}
            <div className="h-[45%] bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20 flex items-center justify-center relative pointer-events-none">
              <Avatar className="w-28 h-28 border-4 border-white shadow-xl">
                <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-3xl font-bold">
                  {getInitials(currentMatch.full_name)}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Info Section */}
            <div className="p-5 space-y-4 pointer-events-none">
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
                {currentMatch.skill_exchange_duration && (
                  <p className="text-muted-foreground flex items-center justify-center gap-1 mt-1 text-sm">
                    <Clock className="w-3 h-3" />
                    {DURATION_LABELS[currentMatch.skill_exchange_duration] || currentMatch.skill_exchange_duration}
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
            disabled={skippedMatches.length === 0}
          >
            <RotateCcw className="w-5 h-5" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="w-16 h-16 rounded-full border-2 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground transition-all"
            onClick={() => handleSwipe("left")}
            disabled={!!isExiting}
          >
            <X className="w-8 h-8" />
          </Button>

          <Button
            size="icon"
            className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white shadow-lg transition-all"
            onClick={() => handleSwipe("right")}
            disabled={!!isExiting || connecting}
          >
            <Heart className="w-8 h-8" fill="currentColor" />
          </Button>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-4">
          Drag to swipe or use the buttons
        </p>
      </CardContent>
    </Card>
    </>
  );
};

export default SkillMatches;
