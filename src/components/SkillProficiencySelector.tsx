import { Badge } from "@/components/ui/badge";
import { X, Award } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type ProficiencyLevel = "beginner" | "intermediate" | "advanced" | "expert";

interface SkillWithProficiency {
  skill: string;
  proficiency: ProficiencyLevel;
}

interface SkillProficiencySelectorProps {
  skills: string[];
  proficiencies: Record<string, ProficiencyLevel>;
  onProficiencyChange: (skill: string, level: ProficiencyLevel) => void;
  onRemoveSkill: (skill: string) => void;
  editing: boolean;
}

const PROFICIENCY_LEVELS: { value: ProficiencyLevel; label: string; description: string; color: string }[] = [
  { value: "beginner", label: "Beginner", description: "Learning the basics", color: "bg-slate-100 text-slate-700 border-slate-200" },
  { value: "intermediate", label: "Intermediate", description: "Can teach fundamentals", color: "bg-blue-100 text-blue-700 border-blue-200" },
  { value: "advanced", label: "Advanced", description: "Deep expertise", color: "bg-purple-100 text-purple-700 border-purple-200" },
  { value: "expert", label: "Expert", description: "Master level", color: "bg-amber-100 text-amber-700 border-amber-200" },
];

const getProficiencyStyle = (level: ProficiencyLevel) => {
  const proficiency = PROFICIENCY_LEVELS.find(p => p.value === level);
  return proficiency?.color || PROFICIENCY_LEVELS[0].color;
};

const getProficiencyLabel = (level: ProficiencyLevel) => {
  const proficiency = PROFICIENCY_LEVELS.find(p => p.value === level);
  return proficiency?.label || "Beginner";
};

const SkillProficiencySelector = ({
  skills,
  proficiencies,
  onProficiencyChange,
  onRemoveSkill,
  editing,
}: SkillProficiencySelectorProps) => {
  if (skills.length === 0) {
    return <span className="text-muted-foreground">No skills added yet</span>;
  }

  return (
    <div className="space-y-3">
      {skills.map((skill) => {
        const currentProficiency = proficiencies[skill] || "beginner";
        
        return (
          <div
            key={skill}
            className="flex flex-col sm:flex-row sm:items-center gap-2 p-3 rounded-lg border border-border bg-card"
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Badge
                variant="secondary"
                className="px-3 py-1.5 text-sm bg-primary-light text-primary border-primary/20 shrink-0"
              >
                {skill}
              </Badge>
              {editing && (
                <button
                  onClick={() => onRemoveSkill(skill)}
                  className="text-muted-foreground hover:text-destructive transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              {editing ? (
                <Select
                  value={currentProficiency}
                  onValueChange={(value) => onProficiencyChange(skill, value as ProficiencyLevel)}
                >
                  <SelectTrigger className="w-[160px] h-9">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROFICIENCY_LEVELS.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        <div className="flex items-center gap-2">
                          <Award className="w-3 h-3" />
                          <span>{level.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Badge
                  variant="outline"
                  className={`px-3 py-1 text-xs font-medium ${getProficiencyStyle(currentProficiency)}`}
                >
                  <Award className="w-3 h-3 mr-1" />
                  {getProficiencyLabel(currentProficiency)}
                </Badge>
              )}
            </div>
          </div>
        );
      })}

      {editing && (
        <div className="text-xs text-muted-foreground mt-2 p-3 bg-accent/30 rounded-lg">
          <strong>Proficiency Levels:</strong>
          <ul className="mt-1 space-y-1">
            <li><span className="font-medium">Beginner:</span> Learning the basics, can share what you've learned</li>
            <li><span className="font-medium">Intermediate:</span> Comfortable teaching fundamentals to others</li>
            <li><span className="font-medium">Advanced:</span> Deep expertise, can teach complex concepts</li>
            <li><span className="font-medium">Expert:</span> Master level with years of experience</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default SkillProficiencySelector;
export { PROFICIENCY_LEVELS, getProficiencyStyle, getProficiencyLabel };
