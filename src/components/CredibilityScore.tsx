import { Progress } from "@/components/ui/progress";
import { Award, Shield, TrendingUp, Star } from "lucide-react";

interface CredibilityScoreProps {
  score: number;
  compact?: boolean;
}

const getScoreLevel = (score: number) => {
  if (score >= 80) return { label: "Excellent", color: "text-green-600", bg: "bg-green-100" };
  if (score >= 60) return { label: "Good", color: "text-blue-600", bg: "bg-blue-100" };
  if (score >= 40) return { label: "Building", color: "text-amber-600", bg: "bg-amber-100" };
  if (score >= 20) return { label: "Getting Started", color: "text-orange-600", bg: "bg-orange-100" };
  return { label: "New", color: "text-slate-600", bg: "bg-slate-100" };
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
        <p className="font-medium">How to improve your score:</p>
        <ul className="space-y-0.5 ml-4 list-disc">
          <li>Add more skills you can teach</li>
          <li>Set higher proficiency levels for your skills</li>
          <li>Complete the personality questionnaire</li>
        </ul>
      </div>
    </div>
  );
};

export default CredibilityScore;
export { getScoreLevel };
