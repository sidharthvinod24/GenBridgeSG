import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import SkillMatches from "@/components/SkillMatches";
import { useUnreadMessages } from "@/hooks/useUnreadMessages";
import { 
  Heart, 
  LogOut, 
  MapPin, 
  Edit3, 
  Save, 
  X, 
  Plus,
  Sparkles,
  Users,
  ArrowRight,
  MessageCircle
} from "lucide-react";
import { toast } from "sonner";

interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  bio: string | null;
  location: string | null;
  avatar_url: string | null;
  skills_offered: string[];
  skills_wanted: string[];
  age_group: string | null;
}

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { unreadCount } = useUnreadMessages();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Form state
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [skillOffered, setSkillOffered] = useState("");
  const [skillWanted, setSkillWanted] = useState("");
  const [skillsOffered, setSkillsOffered] = useState<string[]>([]);
  const [skillsWanted, setSkillsWanted] = useState<string[]>([]);

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setProfile(data);
        setFullName(data.full_name || "");
        setBio(data.bio || "");
        setLocation(data.location || "");
        setAgeGroup(data.age_group || "");
        setSkillsOffered(data.skills_offered || []);
        setSkillsWanted(data.skills_wanted || []);
      }
    } catch (error: any) {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);

    // Auto-add any skills that are typed but not yet added
    const finalSkillsOffered = [...skillsOffered];
    const finalSkillsWanted = [...skillsWanted];
    
    if (skillOffered.trim() && !finalSkillsOffered.includes(skillOffered.trim())) {
      finalSkillsOffered.push(skillOffered.trim());
    }
    if (skillWanted.trim() && !finalSkillsWanted.includes(skillWanted.trim())) {
      finalSkillsWanted.push(skillWanted.trim());
    }

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          bio,
          location,
          age_group: ageGroup,
          skills_offered: finalSkillsOffered,
          skills_wanted: finalSkillsWanted,
        })
        .eq("user_id", user.id);

      if (error) throw error;

      // Update local state with the final values
      setSkillsOffered(finalSkillsOffered);
      setSkillsWanted(finalSkillsWanted);
      setSkillOffered("");
      setSkillWanted("");
      
      toast.success("Profile updated!");
      setEditing(false);
      fetchProfile();
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const addSkillOffered = () => {
    if (skillOffered.trim() && !skillsOffered.includes(skillOffered.trim())) {
      setSkillsOffered([...skillsOffered, skillOffered.trim()]);
      setSkillOffered("");
    }
  };

  const addSkillWanted = () => {
    if (skillWanted.trim() && !skillsWanted.includes(skillWanted.trim())) {
      setSkillsWanted([...skillsWanted, skillWanted.trim()]);
      setSkillWanted("");
    }
  };

  const removeSkillOffered = (skill: string) => {
    setSkillsOffered(skillsOffered.filter(s => s !== skill));
  };

  const removeSkillWanted = (skill: string) => {
    setSkillsWanted(skillsWanted.filter(s => s !== skill));
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-light/30 via-background to-secondary-light/20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="container flex items-center justify-between h-18 py-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-md">
              <Heart className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-xl text-foreground">
              Skill<span className="text-primary">Swap</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:block">
              {user?.email}
            </span>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8 md:py-12">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
            Welcome back, {fullName || "Friend"}! 👋
          </h1>
          <p className="text-lg text-muted-foreground">
            Manage your profile and discover skill matches in your community.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Skill Matches */}
            {user && (
              <SkillMatches 
                userSkillsOffered={skillsOffered}
                userSkillsWanted={skillsWanted}
                userId={user.id}
              />
            )}

            {/* Profile Card */}
            <Card className="shadow-elevated">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="font-display text-2xl">Your Profile</CardTitle>
                  <CardDescription>
                    {editing ? "Edit your profile details" : "Your skill exchange profile"}
                  </CardDescription>
                </div>
                {!editing ? (
                  <Button variant="outline" onClick={() => setEditing(true)}>
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="ghost" onClick={() => setEditing(false)}>
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                    <Button variant="hero" onClick={handleSave} disabled={saving}>
                      <Save className="w-4 h-4 mr-2" />
                      {saving ? "Saving..." : "Save"}
                    </Button>
                  </div>
                )}
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Basic Info */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-base font-medium">
                      Full Name
                    </Label>
                    {editing ? (
                      <Input
                        id="name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Your name"
                        className="h-12"
                      />
                    ) : (
                      <p className="text-lg text-foreground py-3">
                        {fullName || "Not set"}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-base font-medium flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Location
                    </Label>
                    {editing ? (
                      <Input
                        id="location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g., Tampines, Singapore"
                        className="h-12"
                      />
                    ) : (
                      <p className="text-lg text-foreground py-3">
                        {location || "Not set"}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ageGroup" className="text-base font-medium">
                    Age Group
                  </Label>
                  {editing ? (
                    <select
                      id="ageGroup"
                      value={ageGroup}
                      onChange={(e) => setAgeGroup(e.target.value)}
                      className="w-full h-12 px-4 rounded-lg border border-input bg-background text-foreground"
                    >
                      <option value="">Select age group</option>
                      <option value="18-25">18-25</option>
                      <option value="26-35">26-35</option>
                      <option value="36-45">36-45</option>
                      <option value="46-55">46-55</option>
                      <option value="56-65">56-65</option>
                      <option value="65+">65+</option>
                    </select>
                  ) : (
                    <p className="text-lg text-foreground py-3">
                      {ageGroup || "Not set"}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-base font-medium">
                    About You
                  </Label>
                  {editing ? (
                    <Textarea
                      id="bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Tell others about yourself and why you want to exchange skills..."
                      className="min-h-[100px]"
                    />
                  ) : (
                    <p className="text-foreground py-3">
                      {bio || "No bio yet"}
                    </p>
                  )}
                </div>

                {/* Skills Offered */}
                <div className="space-y-3">
                  <Label className="text-base font-medium flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    Skills You Can Teach
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {skillsOffered.map((skill) => (
                      <Badge 
                        key={skill} 
                        variant="secondary"
                        className="px-3 py-1.5 text-sm bg-primary-light text-primary border-primary/20"
                      >
                        {skill}
                        {editing && (
                          <button 
                            onClick={() => removeSkillOffered(skill)}
                            className="ml-2 hover:text-destructive"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </Badge>
                    ))}
                    {skillsOffered.length === 0 && !editing && (
                      <span className="text-muted-foreground">No skills added yet</span>
                    )}
                  </div>
                  {editing && (
                    <div className="flex gap-2">
                      <Input
                        value={skillOffered}
                        onChange={(e) => setSkillOffered(e.target.value)}
                        placeholder="e.g., Cooking, Piano, Web Design"
                        onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkillOffered())}
                        className="h-12"
                      />
                      <Button type="button" variant="outline" onClick={addSkillOffered}>
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>

                {/* Skills Wanted */}
                <div className="space-y-3">
                  <Label className="text-base font-medium flex items-center gap-2">
                    <Heart className="w-4 h-4 text-secondary" />
                    Skills You Want to Learn
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {skillsWanted.map((skill) => (
                      <Badge 
                        key={skill} 
                        variant="secondary"
                        className="px-3 py-1.5 text-sm bg-secondary-light text-secondary border-secondary/20"
                      >
                        {skill}
                        {editing && (
                          <button 
                            onClick={() => removeSkillWanted(skill)}
                            className="ml-2 hover:text-destructive"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </Badge>
                    ))}
                    {skillsWanted.length === 0 && !editing && (
                      <span className="text-muted-foreground">No skills added yet</span>
                    )}
                  </div>
                  {editing && (
                    <div className="flex gap-2">
                      <Input
                        value={skillWanted}
                        onChange={(e) => setSkillWanted(e.target.value)}
                        placeholder="e.g., Photography, Guitar, Languages"
                        onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkillWanted())}
                        className="h-12"
                      />
                      <Button type="button" variant="outline" onClick={addSkillWanted}>
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="font-display text-xl">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="hero" className="w-full justify-start" asChild>
                  <Link to="/browse">
                    <Users className="w-5 h-5 mr-3" />
                    Browse All Skills
                    <ArrowRight className="w-4 h-4 ml-auto" />
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start relative" asChild>
                  <Link to="/messages">
                    <MessageCircle className="w-5 h-5 mr-3" />
                    Messages
                    {unreadCount > 0 && (
                      <span className="absolute right-12 bg-destructive text-destructive-foreground text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                    <ArrowRight className="w-4 h-4 ml-auto" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Profile Completeness */}
            <Card>
              <CardHeader>
                <CardTitle className="font-display text-xl">Profile Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${fullName ? "bg-green-500" : "bg-muted"}`} />
                    <span className={fullName ? "text-foreground" : "text-muted-foreground"}>
                      Name added
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${location ? "bg-green-500" : "bg-muted"}`} />
                    <span className={location ? "text-foreground" : "text-muted-foreground"}>
                      Location set
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${skillsOffered.length > 0 ? "bg-green-500" : "bg-muted"}`} />
                    <span className={skillsOffered.length > 0 ? "text-foreground" : "text-muted-foreground"}>
                      Skills to teach
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${skillsWanted.length > 0 ? "bg-green-500" : "bg-muted"}`} />
                    <span className={skillsWanted.length > 0 ? "text-foreground" : "text-muted-foreground"}>
                      Skills to learn
                    </span>
                  </div>
                </div>

                {/* Tip */}
                <div className="mt-6 p-4 rounded-lg bg-accent/10 border border-accent/20">
                  <p className="text-sm text-muted-foreground">
                    💡 <strong>Tip:</strong> Complete your profile and add skills to find your perfect skill swap matches!
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
