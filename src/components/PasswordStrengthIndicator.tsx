import { useMemo } from "react";
import { Check, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface PasswordStrengthIndicatorProps {
  password: string;
}

interface Requirement {
  label: string;
  met: boolean;
}

const PasswordStrengthIndicator = ({ password }: PasswordStrengthIndicatorProps) => {
  const { t } = useLanguage();

  const requirements: Requirement[] = useMemo(() => [
    { label: t.password.minChars, met: password.length >= 8 },
    { label: t.password.uppercase, met: /[A-Z]/.test(password) },
    { label: t.password.lowercase, met: /[a-z]/.test(password) },
    { label: t.password.number, met: /\d/.test(password) },
  ], [password, t]);

  const strength = useMemo(() => {
    const metCount = requirements.filter(r => r.met).length;
    if (metCount === 0) return { level: 0, label: "", color: "" };
    if (metCount === 1) return { level: 1, label: t.password.weak, color: "bg-destructive" };
    if (metCount === 2) return { level: 2, label: t.password.fair, color: "bg-orange-500" };
    if (metCount === 3) return { level: 3, label: t.password.good, color: "bg-yellow-500" };
    return { level: 4, label: t.password.strong, color: "bg-green-500" };
  }, [requirements, t]);

  const isStrong = strength.level === 4;

  if (!password) return null;

  return (
    <div className="space-y-3 mt-3">
      {/* Strength bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">{t.password.strength}</span>
          <span className={`font-medium ${isStrong ? "text-green-600" : "text-muted-foreground"}`}>
            {strength.label}
          </span>
        </div>
        <div className="flex gap-1">
          {[1, 2, 3, 4].map((level) => (
            <div
              key={level}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                level <= strength.level ? strength.color : "bg-muted"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Requirements checklist */}
      <ul className="space-y-1">
        {requirements.map((req, index) => (
          <li
            key={index}
            className={`flex items-center gap-2 text-xs transition-colors ${
              req.met ? "text-green-600" : "text-muted-foreground"
            }`}
          >
            {req.met ? (
              <Check className="w-3.5 h-3.5" />
            ) : (
              <X className="w-3.5 h-3.5" />
            )}
            {req.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PasswordStrengthIndicator;