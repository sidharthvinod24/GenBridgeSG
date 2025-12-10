import { Progress } from "@/components/ui/progress";
import { Shield, Star } from "lucide-react";

interface CredibilityScoreProps {
  score: number;
  compact?: boolean;
  translations?: {
    credibilityScore: string;
    scoreExcellent: string;
    scoreGood: string;
    scoreAverage: string;
    scoreBelowAverage: string;
    scoreNeedsImprovement: string;
    scoreBasedOn: string;
    completeToIncrease: string;
  };
}

const getScoreLevel = (score: number, translations?: CredibilityScoreProps['translations']) => {
  const labels = {
    excellent: translations?.scoreExcellent || "Excellent",
    good: translations?.scoreGood || "Good",
    average: translations?.scoreAverage || "Average",
    belowAverage: translations?.scoreBelowAverage || "Below Average",
    needsImprovement: translations?.scoreNeedsImprovement || "Needs Improvement",
  };

  if (score >= 90) return { label: labels.excellent, color: "text-green-600", bg: "bg-green-100" };
  if (score >= 70) return { label: labels.good, color: "text-blue-600", bg: "bg-blue-100" };
  if (score >= 50) return { label: labels.average, color: "text-amber-600", bg: "bg-amber-100" };
  if (score >= 30) return { label: labels.belowAverage, color: "text-orange-600", bg: "bg-orange-100" };
  return { label: labels.needsImprovement, color: "text-red-600", bg: "bg-red-100" };
};

// Calculate credibility score based on profile completeness
export const calculateCredibilityScore = (profile: {
  full_name?: string | null;
  bio?: string | null;
  phone_number?: string | null;
  age?: number | null;
  skills_offered?: string[] | null;
  skills_wanted?: string[] | null;
  questionnaire_complete?: boolean;
}) => {
  let score = 0;
  
  // Full name: 15 points
  if (profile.full_name && profile.full_name.trim()) score += 15;
  
  // Bio: 10 points
  if (profile.bio && profile.bio.trim()) score += 10;
  
  // Phone number: 15 points
  if (profile.phone_number && profile.phone_number.trim()) score += 15;
  
  // Age: 10 points
  if (profile.age) score += 10;
  
  // Skills offered (at least 1): 15 points
  if (profile.skills_offered && profile.skills_offered.length > 0) score += 15;
  
  // Skills wanted (at least 1): 15 points
  if (profile.skills_wanted && profile.skills_wanted.length > 0) score += 15;
  
  // Questionnaire completed: 20 points
  if (profile.questionnaire_complete) score += 20;
  
  return Math.round(Math.min(score, 100));
};

const CredibilityScore = ({ score, compact = false, translations }: CredibilityScoreProps) => {
  const scoreLevel = getScoreLevel(score, translations);

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full ${scoreLevel.bg}`}>
          <Shield className={`w-3.5 h-3.5 ${scoreLevel.color}`} />
          <span className={`text-sm font-semibold ${scoreLevel.color}`}>{score}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-lg ${scoreLevel.bg}`}>
            <Shield className={`w-5 h-5 ${scoreLevel.color}`} />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">{translations?.credibilityScore || "Credibility Score"}</p>
            <p className={`text-xs ${scoreLevel.color}`}>{scoreLevel.label}</p>
          </div>
        </div>
        <div className={`text-2xl font-bold ${scoreLevel.color}`}>{score}</div>
      </div>

      <Progress value={score} className="h-2" />

      <div className="text-xs text-muted-foreground space-y-1">
        <div className="flex items-center gap-1">
          <Star className="w-3 h-3" />
          <p className="font-medium">{translations?.scoreBasedOn || "Score based on profile completeness"}</p>
        </div>
        <p className="ml-4">{translations?.completeToIncrease || "Complete your profile details and add skills to increase your score!"}</p>
      </div>
    </div>
  );
};

export default CredibilityScore;
export { getScoreLevel };
