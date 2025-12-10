import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import SkillMatches from "@/components/SkillMatches";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { 
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Edit3
} from "lucide-react";
import logo from "@/assets/logo.png";

const Matching = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState("");
  const [skillsOffered, setSkillsOffered] = useState<string[]>([]);
  const [skillsWanted, setSkillsWanted] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
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
        setFullName(data.full_name || "");
        setSkillsOffered(data.skills_offered || []);
        setSkillsWanted(data.skills_wanted || []);
      }
    } catch (error) {
      console.error("Failed to load profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const isProfileComplete = fullName && skillsOffered.length > 0 && skillsWanted.length > 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">{t.common.loading}</p>
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
              <Link to="/dashboard">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <img src={logo} alt="GenBridgeSG Logo" className="w-10 h-10 rounded-xl object-cover" />
              <span className="font-display font-bold text-xl text-foreground">
                {t.matching.title}
              </span>
            </div>
          </div>
          <LanguageSwitcher />
        </div>
      </header>

      <main className="container py-8 md:py-12 max-w-2xl mx-auto">
        {!isProfileComplete ? (
          <Card className="border-primary/50 bg-gradient-to-br from-primary-light/50 to-secondary-light/30">
            <CardHeader>
              <CardTitle className="font-display text-2xl flex items-center gap-2">
                <AlertCircle className="w-6 h-6 text-primary" />
                {t.matching.completeProfileFirst}
              </CardTitle>
              <CardDescription className="text-base">
                {t.matching.completeProfileDesc}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {(() => {
                const completionSteps = [
                  { label: t.matching.addName, done: !!fullName },
                  { label: t.matching.addSkillsTeach, done: skillsOffered.length > 0 },
                  { label: t.matching.addSkillsLearn, done: skillsWanted.length > 0 },
                ];
                const completedCount = completionSteps.filter(s => s.done).length;
                const progressPercent = (completedCount / completionSteps.length) * 100;

                return (
                  <>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{t.matching.profileCompletion}</span>
                        <span className="text-muted-foreground">{completedCount}/{completionSteps.length} {t.matching.steps}</span>
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
                  </>
                );
              })()}
              <Button variant="hero" onClick={() => navigate("/dashboard")} className="w-full mt-4">
                <Edit3 className="w-4 h-4 mr-2" />
                {t.matching.goToProfile}
              </Button>
            </CardContent>
          </Card>
        ) : (
          user && (
            <SkillMatches 
              userSkillsOffered={skillsOffered}
              userSkillsWanted={skillsWanted}
              userId={user.id}
            />
          )
        )}
      </main>
    </div>
  );
};

export default Matching;
