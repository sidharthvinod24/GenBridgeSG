import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import SkillSelect from "@/components/SkillSelect";
import SkillProficiencySelector, { ProficiencyLevel } from "@/components/SkillProficiencySelector";
import CredibilityScore, { calculateCredibilityScore } from "@/components/CredibilityScore";
import ProfileQuestionnaire, { QuestionnaireAnswers } from "@/components/ProfileQuestionnaire";
import { useUnreadMessages } from "@/hooks/useUnreadMessages";
import { useAdminRole } from "@/hooks/useAdminRole";
import { validateProfile } from "@/lib/validation";
import {
  Heart,
  LogOut,
  Phone,
  Edit3,
  Save,
  X,
  Sparkles,
  Users,
  ArrowRight,
  MessageCircle,
  AlertCircle,
  CheckCircle2,
  ClipboardList,
  Shield,
  Coins,
} from "lucide-react";
import { toast } from "sonner";
import logo from "@/assets/logo.png";
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
  age: number | null;
  skills_proficiency: Record<string, ProficiencyLevel> | null;
  credibility_score: number | null;
  credits: number;
  // New questionnaire fields
  q_skills_to_share: string | null;
  q_digital_help_needed: string[] | null;
  q_languages_dialects: string[] | null;
  q_cultural_interests: string[] | null;
  q_digital_teaching_skills: string[] | null;
  q_teaching_comfort: number | null;
  q_communication_preference: string | null;
  q_availability: string[] | null;
  q_allow_archive: boolean | null;
  q_open_to_verification: boolean | null;
}
const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { unreadCount } = useUnreadMessages();
  const { isAdmin } = useAdminRole();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);

  // Form state
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [skillOffered, setSkillOffered] = useState("");
  const [skillWanted, setSkillWanted] = useState("");
  const [skillsOffered, setSkillsOffered] = useState<string[]>([]);
  const [skillsWanted, setSkillsWanted] = useState<string[]>([]);
  const [skillsProficiency, setSkillsProficiency] = useState<Record<string, ProficiencyLevel>>({});
  const [credibilityScore, setCredibilityScore] = useState(0);
  const [credits, setCredits] = useState(0);

  // Questionnaire answers
  const [questionnaireAnswers, setQuestionnaireAnswers] = useState<QuestionnaireAnswers>({
    age: null,
    q_skills_to_share: "",
    q_digital_help_needed: [],
    q_languages_dialects: [],
    q_communication_preference: "",
    q_availability: [],
    q_allow_archive: false,
    q_skill_to_teach: "",
    q_cultural_interests: [],
    q_digital_teaching_skills: [],
    q_teaching_comfort: 3,
    q_open_to_verification: false,
  });
  useEffect(() => {
    fetchProfile();
  }, [user]);
  const fetchProfile = async () => {
    if (!user) return;
    try {
      let { data, error } = await supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle();
      if (error) throw error;

      // If no profile exists, create one with metadata from signup
      if (!data) {
        const { data: newProfile, error: insertError } = await supabase
          .from("profiles")
          .insert({
            user_id: user.id,
            full_name: user.user_metadata?.full_name || "",
            phone_number: user.user_metadata?.phone_number || null,
          })
          .select()
          .single();
        if (insertError) throw insertError;
        data = newProfile;
      }
      if (data) {
        // If profile exists but phone is missing, try to sync from user metadata
        if (!data.phone_number && user.user_metadata?.phone_number) {
          await supabase
            .from("profiles")
            .update({ phone_number: user.user_metadata.phone_number })
            .eq("user_id", user.id);
          data.phone_number = user.user_metadata.phone_number;
        }
        
        // Cast skills_proficiency properly from JSON
        const proficiency =
          typeof data.skills_proficiency === "object" && data.skills_proficiency !== null
            ? (data.skills_proficiency as Record<string, ProficiencyLevel>)
            : {};
        const profileData: Profile = {
          ...data,
          skills_offered: data.skills_offered || [],
          skills_wanted: data.skills_wanted || [],
          skills_proficiency: proficiency,
          credibility_score: data.credibility_score || 0,
          credits: data.credits || 0,
        };
        setProfile(profileData);
        setFullName(data.full_name || "");
        setBio(data.bio || "");
        setPhoneNumber(data.phone_number || "");
        setAgeGroup(data.age_group || "");
        setSkillsOffered(data.skills_offered || []);
        setSkillsWanted(data.skills_wanted || []);
        setSkillsProficiency(proficiency);
        setCredibilityScore(data.credibility_score || 0);
        setCredits(data.credits || 0);
        setQuestionnaireAnswers({
          age: data.age || null,
          q_skills_to_share: data.q_skills_to_share || "",
          q_digital_help_needed: data.q_digital_help_needed || [],
          q_languages_dialects: data.q_languages_dialects || [],
          q_communication_preference: data.q_communication_preference || "",
          q_availability: data.q_availability || [],
          q_allow_archive: data.q_allow_archive || false,
          q_skill_to_teach: data.q_skills_to_share || "",
          q_cultural_interests: data.q_cultural_interests || [],
          q_digital_teaching_skills: data.q_digital_teaching_skills || [],
          q_teaching_comfort: data.q_teaching_comfort || 3,
          q_open_to_verification: data.q_open_to_verification || false,
        });
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

    // Update proficiency for any new skills (default to beginner)
    const updatedProficiency = {
      ...skillsProficiency,
    };
    finalSkillsOffered.forEach((skill) => {
      if (!updatedProficiency[skill]) {
        updatedProficiency[skill] = "beginner";
      }
    });
    // Remove proficiency for skills that were removed
    Object.keys(updatedProficiency).forEach((skill) => {
      if (!finalSkillsOffered.includes(skill)) {
        delete updatedProficiency[skill];
      }
    });

    // Validate profile data before saving
    const profileData = {
      full_name: fullName,
      bio,
      phone_number: phoneNumber,
      age_group: ageGroup,
      skills_offered: finalSkillsOffered,
      skills_wanted: finalSkillsWanted,
      skills_proficiency: updatedProficiency,
    };

    // Calculate credibility score based on profile completeness
    const newCredibilityScore = calculateCredibilityScore({
      full_name: fullName,
      bio,
      phone_number: phoneNumber,
      age: questionnaireAnswers.age,
      skills_offered: finalSkillsOffered,
      skills_wanted: finalSkillsWanted,
      questionnaire_complete: !!questionnaireAnswers.age,
    });
    const validation = validateProfile(profileData);
    if (!validation.success) {
      const errorMessage = validation.error.errors[0]?.message || "Invalid profile data";
      toast.error(errorMessage);
      setSaving(false);
      return;
    }
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          ...profileData,
          credibility_score: newCredibilityScore,
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
  const handleSaveQuestionnaire = async (answers: QuestionnaireAnswers) => {
    if (!user) return;
    setSaving(true);
    try {
      // Calculate new credibility score including questionnaire
      const newCredibilityScore = calculateCredibilityScore({
        full_name: fullName,
        bio,
        phone_number: phoneNumber,
        age: answers.age,
        skills_offered: skillsOffered,
        skills_wanted: skillsWanted,
        questionnaire_complete: !!answers.age,
      });
      
      // Determine if elderly or youth based on age
      const isElderly = (answers.age ?? 0) >= 40;
      
      // Award 3 credits if user opts for verification and doesn't already have credits
      const isVerified = isElderly ? answers.q_allow_archive : answers.q_open_to_verification;
      const wasVerified = isElderly ? questionnaireAnswers.q_allow_archive : questionnaireAnswers.q_open_to_verification;
      const newCredits = (isVerified && !wasVerified) ? credits + 3 : credits;
      
      const { error } = await supabase
        .from("profiles")
        .update({
          age: answers.age,
          // For elderly: q_skills_to_share stores what they want to share
          // For youth: q_skills_to_share stores what they can teach (q_skill_to_teach)
          q_skills_to_share: isElderly ? answers.q_skills_to_share : answers.q_skill_to_teach,
          q_digital_help_needed: isElderly ? answers.q_digital_help_needed : null,
          q_languages_dialects: isElderly ? answers.q_languages_dialects : null,
          q_cultural_interests: !isElderly ? answers.q_cultural_interests : null,
          q_digital_teaching_skills: !isElderly ? answers.q_digital_teaching_skills : null,
          q_teaching_comfort: !isElderly ? answers.q_teaching_comfort : null,
          q_communication_preference: answers.q_communication_preference,
          q_availability: answers.q_availability,
          q_allow_archive: isElderly ? answers.q_allow_archive : null,
          q_open_to_verification: !isElderly ? answers.q_open_to_verification : null,
          credibility_score: newCredibilityScore,
          credits: newCredits,
        })
        .eq("user_id", user.id);
      if (error) throw error;
      setQuestionnaireAnswers(answers);
      setCredibilityScore(newCredibilityScore);
      setCredits(newCredits);
      if (isVerified && !wasVerified) {
        toast.success("Questionnaire completed! You earned 3 credits for verification!");
      } else {
        toast.success("Questionnaire completed!");
      }
      setShowQuestionnaire(false);
      fetchProfile();
    } catch (error: any) {
      toast.error(error.message || "Failed to save questionnaire");
    } finally {
      setSaving(false);
    }
  };
  const addSkillOffered = (skill?: string) => {
    const newSkill = (skill || skillOffered).trim();
    if (newSkill && !skillsOffered.includes(newSkill)) {
      setSkillsOffered([...skillsOffered, newSkill]);
      // Default new skills to beginner proficiency
      setSkillsProficiency((prev) => ({
        ...prev,
        [newSkill]: "beginner",
      }));
      setSkillOffered("");
    }
  };
  const addSkillWanted = (skill?: string) => {
    const newSkill = (skill || skillWanted).trim();
    if (newSkill && !skillsWanted.includes(newSkill)) {
      setSkillsWanted([...skillsWanted, newSkill]);
      setSkillWanted("");
    }
  };
  const removeSkillOffered = (skill: string) => {
    setSkillsOffered(skillsOffered.filter((s) => s !== skill));
    // Also remove from proficiency map
    setSkillsProficiency((prev) => {
      const updated = {
        ...prev,
      };
      delete updated[skill];
      return updated;
    });
  };
  const handleProficiencyChange = (skill: string, level: ProficiencyLevel) => {
    setSkillsProficiency((prev) => ({
      ...prev,
      [skill]: level,
    }));
  };
  const removeSkillWanted = (skill: string) => {
    setSkillsWanted(skillsWanted.filter((s) => s !== skill));
  };
  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };
  const isQuestionnaireComplete = !!questionnaireAnswers.age;
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

  // Show questionnaire view
  if (showQuestionnaire) {
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
                Gen<span className="text-primary">Bridge</span>SG
              </span>
            </Link>
          </div>
        </header>

        <main className="container py-8 md:py-12">
          <div className="mb-8 text-center">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">Tell Us About Yourself</h1>
            <p className="text-lg text-muted-foreground">
              Answer these questions to help us find your perfect skill matches.
            </p>
          </div>

          <ProfileQuestionnaire
            initialAnswers={questionnaireAnswers}
            onSave={handleSaveQuestionnaire}
            onCancel={() => setShowQuestionnaire(false)}
            saving={saving}
          />
        </main>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-light/30 via-background to-secondary-light/20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="container flex items-center justify-between h-18 py-4">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="GenBridgeSG Logo" className="w-10 h-10 rounded-xl object-cover" />
            <span className="font-display font-bold text-xl text-foreground">
              Gen<span className="text-primary">Bridge</span>SG
            </span>
          </Link>

          <div className="flex items-center gap-3">
            {isAdmin && (
              <Button
                variant="outline"
                size="sm"
                asChild
                className="text-destructive border-destructive/30 hover:bg-destructive/10"
              >
                <Link to="/admin">
                  <Shield className="w-4 h-4 mr-2" />
                  Admin
                </Link>
              </Button>
            )}
            <span className="text-sm text-muted-foreground hidden sm:block">{user?.email}</span>
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
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
                Welcome back, {fullName || "Friend"}! 👋
              </h1>
              <p className="text-lg text-muted-foreground">
                Manage your profile and discover skill matches in your community.
              </p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/20 rounded-xl">
              <Coins className="w-5 h-5 text-amber-500" />
              <span className="font-semibold text-foreground">Credits:</span>
              <span className="font-bold text-amber-600">{credits}</span>
            </div>
          </div>
        </div>

        {/* Profile Completion Check */}
        {(() => {
          const isProfileComplete =
            fullName && skillsOffered.length > 0 && skillsWanted.length > 0 && isQuestionnaireComplete;
          const completionSteps = [
            {
              label: "Add your name",
              done: !!fullName,
            },
            {
              label: "Add skills you can teach",
              done: skillsOffered.length > 0,
            },
            {
              label: "Add skills you want to learn",
              done: skillsWanted.length > 0,
            },
            {
              label: "Complete the questionnaire",
              done: isQuestionnaireComplete,
            },
          ];
          const completedCount = completionSteps.filter((s) => s.done).length;
          const progressPercent = (completedCount / completionSteps.length) * 100;
          if (!isProfileComplete) {
            return (
              <Card className="border-primary/50 bg-gradient-to-br from-primary-light/50 to-secondary-light/30 mb-8">
                <CardHeader>
                  <CardTitle className="font-display text-2xl flex items-center gap-2">
                    <AlertCircle className="w-6 h-6 text-primary" />
                    Complete Your Profile to Start Matching
                  </CardTitle>
                  <CardDescription className="text-base">
                    You need to complete your profile before you can discover skill matches.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Profile completion</span>
                      <span className="text-muted-foreground">
                        {completedCount}/{completionSteps.length} steps
                      </span>
                    </div>
                    <Progress value={progressPercent} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    {completionSteps.map((step, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        {step.done ? (
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border-2 border-muted-foreground" />
                        )}
                        <span className={step.done ? "text-muted-foreground line-through" : "font-medium"}>
                          {step.label}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 mt-4">
                    {!editing && (fullName === "" || skillsOffered.length === 0 || skillsWanted.length === 0) && (
                      <Button variant="hero" onClick={() => setEditing(true)} className="flex-1">
                        <Edit3 className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Button>
                    )}
                    {!isQuestionnaireComplete && (
                      <Button variant="warm" onClick={() => setShowQuestionnaire(true)} className="flex-1">
                        <ClipboardList className="w-4 h-4 mr-2" />
                        Complete Questionnaire
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          }
          return null;
        })()}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Link to Matching Page - Only show if profile is complete */}
            {user && fullName && skillsOffered.length > 0 && skillsWanted.length > 0 && isQuestionnaireComplete && (
              <Card className="shadow-elevated bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
                <CardContent className="py-8">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                      <Heart className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-display text-2xl font-bold mb-2">Find Your Skill Match</h3>
                      <p className="text-muted-foreground">
                        Swipe through potential matches and connect with people who can teach you or learn from you!
                      </p>
                    </div>
                    <Button variant="hero" size="lg" asChild className="px-8">
                      <Link to="/matching">
                        <Heart className="w-5 h-5 mr-2" />
                        Start Matching
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
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
                      <p className="text-lg text-foreground py-3">{fullName || "Not set"}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-base font-medium flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Phone Number
                    </Label>
                    {editing ? (
                      <Input
                        id="phone"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="e.g., +65 9123 4567"
                        className="h-12"
                      />
                    ) : (
                      <p className="text-lg text-foreground py-3">{phoneNumber || "Not set"}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-base font-medium">
                    Age
                  </Label>
                  <p className="text-lg text-foreground py-3">
                    {questionnaireAnswers.age ? `${questionnaireAnswers.age} years old` : "Complete questionnaire"}
                  </p>
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
                    <p className="text-foreground py-3">{bio || "No bio yet"}</p>
                  )}
                </div>

                {/* Skills Offered with Proficiency */}
                <div className="space-y-3">
                  <Label className="text-base font-medium flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    Skills You Can Teach
                  </Label>

                  <SkillProficiencySelector
                    skills={skillsOffered}
                    proficiencies={skillsProficiency}
                    onProficiencyChange={handleProficiencyChange}
                    onRemoveSkill={removeSkillOffered}
                    editing={editing}
                  />

                  {editing && (
                    <SkillSelect
                      value={skillOffered}
                      onChange={setSkillOffered}
                      onAdd={addSkillOffered}
                      placeholder="Search skills you can teach..."
                      existingSkills={skillsOffered}
                    />
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
                          <button onClick={() => removeSkillWanted(skill)} className="ml-2 hover:text-destructive">
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
                    <SkillSelect
                      value={skillWanted}
                      onChange={setSkillWanted}
                      onAdd={addSkillWanted}
                      placeholder="Search skills you want to learn..."
                      existingSkills={skillsWanted}
                    />
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Questionnaire Card */}
            <Card className="shadow-elevated">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="font-display text-2xl flex items-center gap-2">
                    <ClipboardList className="w-6 h-6 text-primary" />
                    Your Questionnaire
                  </CardTitle>
                  <CardDescription>
                    {isQuestionnaireComplete
                      ? "Your answers help us find better matches"
                      : "Complete the questionnaire to improve your matches"}
                  </CardDescription>
                </div>
                <Button
                  variant={isQuestionnaireComplete ? "outline" : "hero"}
                  onClick={() => setShowQuestionnaire(true)}
                >
                  {isQuestionnaireComplete ? (
                    <>
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit
                    </>
                  ) : (
                    <>
                      <ArrowRight className="w-4 h-4 mr-2" />
                      Complete
                    </>
                  )}
                </Button>
              </CardHeader>
              {isQuestionnaireComplete && (
                <CardContent>
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-medium">Questionnaire completed</span>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Credibility Score Card */}
            <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
              <CardHeader className="pb-2">
                <CardTitle className="font-display text-xl flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Credibility Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CredibilityScore score={credibilityScore} />
              </CardContent>
            </Card>

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
                    <span className={fullName ? "text-foreground" : "text-muted-foreground"}>Name added</span>
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
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${isQuestionnaireComplete ? "bg-green-500" : "bg-muted"}`} />
                    <span className={isQuestionnaireComplete ? "text-foreground" : "text-muted-foreground"}>
                      Questionnaire done
                    </span>
                  </div>
                </div>

                {/* Tip */}
                <div className="mt-6 p-4 rounded-lg bg-accent/10 border border-accent/20">
                  <p className="text-sm text-muted-foreground">
                    💡 <strong>Tip:</strong> Complete your profile and questionnaire to find your perfect skill swap
                    matches!
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
