import { Progress } from "@/components/ui/progress";
import { Shield, Star } from "lucide-react";

interface CredibilityScoreProps {
  score: number;
  compact?: boolean;
}

const getScoreLevel = (score: number) => {
  if (score >= 90) return { label: "Excellent", color: "text-green-600", bg: "bg-green-100" };
  if (score >= 70) return { label: "Good", color: "text-blue-600", bg: "bg-blue-100" };
  if (score >= 50) return { label: "Average", color: "text-amber-600", bg: "bg-amber-100" };
  if (score >= 30) return { label: "Below Average", color: "text-orange-600", bg: "bg-orange-100" };
  return { label: "Needs Improvement", color: "text-red-600", bg: "bg-red-100" };
};

// Calculate credibility score based on profile completeness
export const calculateCredibilityScore = (profile: {
  full_name?: string | null;
  bio?: string | null;
  phone_number?: string | null;
  age_group?: string | null;
  skills_offered?: string[];
  skills_wanted?: string[];
  q_joining_reason?: string | null;
}) => {
  let score = 0;
  
  // Full name: 15 points
  if (profile.full_name && profile.full_name.trim()) score += 15;
  
  // Bio: 15 points
  if (profile.bio && profile.bio.trim()) score += 15;
  
  // Phone number: 10 points
  if (profile.phone_number && profile.phone_number.trim()) score += 10;
  
  // Age group: 10 points
  if (profile.age_group) score += 10;
  
  // Skills offered: up to 25 points (5 points per skill, max 5 skills)
  const offeredCount = Math.min(profile.skills_offered?.length || 0, 5);
  score += offeredCount * 5;
  
  // Skills wanted: up to 25 points (5 points per skill, max 5 skills)
  const wantedCount = Math.min(profile.skills_wanted?.length || 0, 5);
  score += wantedCount * 5;
  
  return Math.min(score, 100);
};

const CredibilityScore = ({ score, compact = false }: CredibilityScoreProps) => {
  const scoreLevel = getScoreLevel(score);

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
            <p className="text-sm font-medium text-foreground">Credibility Score</p>
            <p className={`text-xs ${scoreLevel.color}`}>{scoreLevel.label}</p>
          </div>
        </div>
        <div className={`text-2xl font-bold ${scoreLevel.color}`}>{score}</div>
      </div>

      <Progress value={score} className="h-2" />

      <div className="text-xs text-muted-foreground space-y-1">
        <div className="flex items-center gap-1">
          <Star className="w-3 h-3" />
          <p className="font-medium">Score based on profile completeness</p>
        </div>
        <p className="ml-4">Complete your profile details and add skills to increase your score!</p>
      </div>
    </div>
  );
};

export default CredibilityScore;
export { getScoreLevel };
