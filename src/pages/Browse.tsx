import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import logo from "@/assets/logo.png";
import CredibilityScore, { getScoreLevel } from "@/components/CredibilityScore";
import { Heart, ArrowLeft, Search, Filter, X, Sparkles, MessageCircle, Users, Shield, Clock } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  bio: string | null;
  phone_number: string | null;
  avatar_url: string | null;
  skills_offered: string[];
  skills_wanted: string[];
  age_group: string | null;
  credibility_score: number | null;
  skill_exchange_duration: string | null;
}

const DURATION_LABELS: Record<string, string> = {
  "30": "30 mins",
  "60": "60 mins",
  "90": "90 mins",
  "120": "120 mins",
};

// Skill categories for filtering
const SKILL_CATEGORIES = [
  { value: "all", label: "All Categories" },
  {
    value: "technology",
    label: "Technology",
    keywords: [
      "coding",
      "programming",
      "web",
      "design",
      "computer",
      "software",
      "app",
      "data",
      "ai",
      "python",
      "javascript",
    ],
  },
  {
    value: "arts",
    label: "Arts & Crafts",
    keywords: ["art", "paint", "draw", "craft", "pottery", "knit", "crochet", "sew", "jewelry", "sculpture"],
  },
  {
    value: "music",
    label: "Music",
    keywords: ["music", "piano", "guitar", "violin", "sing", "drum", "instrument", "compose", "song"],
  },
  {
    value: "languages",
    label: "Languages",
    keywords: [
      "language",
      "english",
      "mandarin",
      "malay",
      "tamil",
      "japanese",
      "korean",
      "french",
      "spanish",
      "german",
    ],
  },
  {
    value: "cooking",
    label: "Cooking & Baking",
    keywords: ["cook", "bake", "cuisine", "recipe", "food", "kitchen", "pastry", "culinary"],
  },
  {
    value: "fitness",
    label: "Fitness & Sports",
    keywords: [
      "fitness",
      "yoga",
      "gym",
      "sport",
      "swim",
      "run",
      "exercise",
      "martial",
      "dance",
      "basketball",
      "tennis",
    ],
  },
  {
    value: "business",
    label: "Business & Finance",
    keywords: ["business", "finance", "marketing", "accounting", "invest", "entrepreneur", "management", "sales"],
  },
  {
    value: "education",
    label: "Education & Tutoring",
    keywords: ["math", "science", "tutor", "teach", "exam", "study", "academic", "history", "geography"],
  },
];

const AGE_GROUPS = [
  { value: "all", label: "All Ages" },
  { value: "18-25", label: "18-25" },
  { value: "26-35", label: "26-35" },
  { value: "36-45", label: "36-45" },
  { value: "46-55", label: "46-55" },
  { value: "56-65", label: "56-65" },
  { value: "65+", label: "65+" },
];

const Browse = () => {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [ageFilter, setAgeFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchProfiles();
  }, [user]);

  const fetchProfiles = async () => {
    try {
      // For authenticated users, use rate-limited edge function
      if (user) {
        const { data, error } = await supabase.functions.invoke("browse-profiles", {
          body: null,
        });

        if (error) {
          // Check for rate limit error
          if (error.message?.includes("429") || error.message?.includes("Rate limit")) {
            toast.error("Too many requests. Please wait a moment before browsing more profiles.");
            setLoading(false);
            return;
          }
          throw error;
        }

        const profilesWithSkills = (data?.profiles || []).filter(
          (p: Profile) => p.skills_offered?.length > 0 || p.skills_wanted?.length > 0,
        );

        setProfiles(profilesWithSkills);
      } else {
        // For unauthenticated users, use direct query (public browse)
        const { data, error } = await supabase.from("profiles").select("*");

        if (error) throw error;

        const profilesWithSkills = (data || []).filter(
          (p) => p.skills_offered?.length > 0 || p.skills_wanted?.length > 0,
        );

        setProfiles(profilesWithSkills);
      }
    } catch (error: any) {
      console.error("Error fetching profiles:", error);
      toast.error("Failed to load skills");
    } finally {
      setLoading(false);
    }
  };

  const filteredProfiles = useMemo(() => {
    return profiles.filter((profile) => {
      // Search query filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = profile.full_name?.toLowerCase().includes(query);
        const matchesSkillsOffered = profile.skills_offered?.some((s) => s.toLowerCase().includes(query));
        const matchesSkillsWanted = profile.skills_wanted?.some((s) => s.toLowerCase().includes(query));
        if (!matchesName && !matchesSkillsOffered && !matchesSkillsWanted) {
          return false;
        }
      }

      // Category filter
      if (categoryFilter !== "all") {
        const category = SKILL_CATEGORIES.find((c) => c.value === categoryFilter);
        if (category && category.keywords) {
          const allSkills = [...(profile.skills_offered || []), ...(profile.skills_wanted || [])];
          const matchesCategory = allSkills.some((skill) =>
            category.keywords.some((keyword) => skill.toLowerCase().includes(keyword)),
          );
          if (!matchesCategory) return false;
        }
      }

      // Age filter
      if (ageFilter !== "all" && profile.age_group !== ageFilter) {
        return false;
      }

      return true;
    });
  }, [profiles, searchQuery, categoryFilter, ageFilter]);

  const getInitials = (name: string | null) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setCategoryFilter("all");
    setAgeFilter("all");
  };

  const hasActiveFilters = searchQuery || categoryFilter !== "all" || ageFilter !== "all";

  const handleStartChat = async (profileUserId: string) => {
    if (!user) {
      toast.error("Please sign in to start a conversation");
      return;
    }

    try {
      // Check if conversation already exists
      const { data: existingConvo } = await supabase
        .from("conversations")
        .select("id")
        .or(
          `and(participant_one.eq.${user.id},participant_two.eq.${profileUserId}),and(participant_one.eq.${profileUserId},participant_two.eq.${user.id})`,
        )
        .maybeSingle();

      if (existingConvo) {
        // Navigate to existing conversation
        window.location.href = `/messages?convo=${existingConvo.id}`;
        return;
      }

      // Create new conversation
      const { data: newConvo, error } = await supabase
        .from("conversations")
        .insert({
          participant_one: user.id,
          participant_two: profileUserId,
        })
        .select()
        .single();

      if (error) throw error;

      toast.success("Conversation started!");
      window.location.href = `/messages?convo=${newConvo.id}`;
    } catch (error: any) {
      console.error("Error starting conversation:", error);
      toast.error("Failed to start conversation");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">Loading skills...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-light/30 via-background to-secondary-light/20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="container flex items-center justify-between h-18 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to={user ? "/dashboard" : "/"}>
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="GenBridgeSG Logo" className="w-10 h-10 rounded-xl object-cover" />
              <span className="font-display font-bold text-xl text-foreground">
                Gen<span className="text-primary">Bridge</span>SG
              </span>
            </Link>
          </div>

          {user && (
            <Button variant="outline" asChild>
              <Link to="/messages">
                <MessageCircle className="w-4 h-4 mr-2" />
                Messages
              </Link>
            </Button>
          )}
        </div>
      </header>

      <main className="container py-6 md:py-8">
        {/* Search & Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search skills, names..."
                  className="pl-10 h-12"
                />
              </div>

              {/* Filter Toggle */}
              <Button
                variant={showFilters ? "secondary" : "outline"}
                onClick={() => setShowFilters(!showFilters)}
                className="h-12"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
                {hasActiveFilters && (
                  <Badge variant="default" className="ml-2 bg-primary text-primary-foreground">
                    Active
                  </Badge>
                )}
              </Button>
            </div>

            {/* Expanded Filters */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-border">
                <div className="grid sm:grid-cols-3 gap-4">
                  {/* Category */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Category</label>
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        {SKILL_CATEGORIES.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Age Group */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Age Group</label>
                    <Select value={ageFilter} onValueChange={setAgeFilter}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="All Ages" />
                      </SelectTrigger>
                      <SelectContent>
                        {AGE_GROUPS.map((age) => (
                          <SelectItem key={age.value} value={age.value}>
                            {age.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {hasActiveFilters && (
                  <Button variant="ghost" onClick={clearFilters} className="mt-4">
                    <X className="w-4 h-4 mr-2" />
                    Clear all filters
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl font-bold flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            {filteredProfiles.length} {filteredProfiles.length === 1 ? "Person" : "People"} Found
          </h2>
        </div>

        {/* Results Grid */}
        {filteredProfiles.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <Search className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="font-display font-bold text-xl mb-2">No results found</h3>
                <p className="text-muted-foreground mb-4">Try adjusting your search or filters to find more people</p>
                {hasActiveFilters && (
                  <Button variant="outline" onClick={clearFilters}>
                    Clear all filters
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProfiles.map((profile) => (
              <Card key={profile.id} hoverable className="overflow-hidden">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4 mb-4">
                    <Avatar className="w-14 h-14 border-2 border-primary/20">
                      <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-primary-foreground font-bold">
                        {getInitials(profile.full_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-display font-bold text-lg truncate">{profile.full_name || "Anonymous"}</h3>
                        {/* Credibility Score Badge */}
                        {(profile.credibility_score ?? 0) > 0 && (
                          <div
                            className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${getScoreLevel(profile.credibility_score || 0).bg} ${getScoreLevel(profile.credibility_score || 0).color}`}
                          >
                            <Shield className="w-3 h-3" />
                            {profile.credibility_score}
                          </div>
                        )}
                      </div>
                      {profile.age_group && (
                        <Badge variant="outline" className="mt-1 text-xs">
                          {profile.age_group}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Skills Offered */}
                  {profile.skills_offered?.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs font-medium text-muted-foreground flex items-center gap-1 mb-2">
                        <Sparkles className="w-3 h-3 text-primary" />
                        Can teach:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {profile.skills_offered.slice(0, 4).map((skill) => (
                          <Badge key={skill} variant="secondary" className="bg-primary-light text-primary text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {profile.skills_offered.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{profile.skills_offered.length - 4}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Skills Wanted */}
                  {profile.skills_wanted?.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-medium text-muted-foreground flex items-center gap-1 mb-2">
                        <Heart className="w-3 h-3 text-secondary" />
                        Wants to learn:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {profile.skills_wanted.slice(0, 4).map((skill) => (
                          <Badge key={skill} variant="secondary" className="bg-secondary-light text-secondary text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {profile.skills_wanted.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{profile.skills_wanted.length - 4}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Duration */}
                  {profile.skill_exchange_duration && (
                    <div className="mb-4 flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>{DURATION_LABELS[profile.skill_exchange_duration] || profile.skill_exchange_duration}</span>
                    </div>
                  )}

                  <Button variant="hero" size="sm" className="w-full" onClick={() => handleStartChat(profile.user_id)}>
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Start Conversation
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Browse;
