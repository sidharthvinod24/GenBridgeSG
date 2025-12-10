import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, ArrowRight, Check, Sparkles, User } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export interface QuestionnaireAnswers {
  age: number | null;
  // Elderly fields (age >= 40)
  q_skills_to_share: string;
  q_skill_proficiency: string;
  q_digital_help_needed: string[];
  q_languages_dialects: string[];
  q_communication_preference: string;
  q_availability: string[];
  q_allow_archive: boolean;
  // Youth fields (age < 40)
  q_skill_to_teach: string;
  q_cultural_interests: string[];
  q_digital_teaching_skills: string[];
  q_teaching_comfort: number;
  q_open_to_verification: boolean;
}

interface ProfileQuestionnaireProps {
  initialAnswers: QuestionnaireAnswers;
  onSave: (answers: QuestionnaireAnswers) => Promise<void>;
  onCancel: () => void;
  saving: boolean;
}

const digitalHelpOptions = [
  "Using smartphone",
  "E-payments",
  "Scam awareness",
  "Social apps",
  "Government digital services",
  "Other",
];

const languageOptions = [
  "English",
  "Mandarin",
  "Malay",
  "Tamil",
  "Hokkien",
  "Teochew",
  "Cantonese",
  "Hakka",
  "Other dialects",
];

const culturalInterestOptions = [
  "Dialects",
  "Traditional crafts",
  "Recipes",
  "SG history",
  "Cultural practices",
];

const digitalTeachingOptions = [
  "Smartphone basics",
  "E-payments",
  "Scam detection",
  "Social apps",
  "Troubleshooting",
  "Government digital services",
];

const availabilityOptions = [
  "Morning",
  "Afternoon",
  "Evening",
  "Weekends only",
];

const communicationOptions = [
  { value: "chat", label: "Chat only" },
  { value: "chat-zoom", label: "Chat first, Zoom if needed" },
];

const proficiencyOptions = [
  { value: "beginner", label: "Beginner - Just started learning" },
  { value: "intermediate", label: "Intermediate - Can do it independently" },
  { value: "advanced", label: "Advanced - Very experienced" },
  { value: "expert", label: "Expert - Can teach others confidently" },
];

const ProfileQuestionnaire = ({ initialAnswers, onSave, onCancel, saving }: ProfileQuestionnaireProps) => {
  const { t } = useLanguage();
  const [step, setStep] = useState<"age" | "questionnaire">("age");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<QuestionnaireAnswers>(initialAnswers);
  const [ageInput, setAgeInput] = useState(initialAnswers.age?.toString() || "");

  // Translated options
  const digitalHelpOptionsTranslated = [
    { value: "Using smartphone", label: t.questionnaire.usingSmartphone },
    { value: "E-payments", label: t.questionnaire.ePayments },
    { value: "Scam awareness", label: t.questionnaire.scamAwareness },
    { value: "Social apps", label: t.questionnaire.socialApps },
    { value: "Government digital services", label: t.questionnaire.govDigitalServices },
    { value: "Other", label: t.questionnaire.other },
  ];

  const languageOptionsTranslated = [
    { value: "English", label: t.questionnaire.english },
    { value: "Mandarin", label: t.questionnaire.mandarin },
    { value: "Malay", label: t.questionnaire.malay },
    { value: "Tamil", label: t.questionnaire.tamil },
    { value: "Hokkien", label: t.questionnaire.hokkien },
    { value: "Teochew", label: t.questionnaire.teochew },
    { value: "Cantonese", label: t.questionnaire.cantonese },
    { value: "Hakka", label: t.questionnaire.hakka },
    { value: "Other dialects", label: t.questionnaire.otherDialects },
  ];

  const culturalInterestOptionsTranslated = [
    { value: "Dialects", label: t.questionnaire.dialects },
    { value: "Traditional crafts", label: t.questionnaire.traditionalCrafts },
    { value: "Recipes", label: t.questionnaire.recipes },
    { value: "SG history", label: t.questionnaire.sgHistory },
    { value: "Cultural practices", label: t.questionnaire.culturalPractices },
  ];

  const digitalTeachingOptionsTranslated = [
    { value: "Smartphone basics", label: t.questionnaire.smartphoneBasics },
    { value: "E-payments", label: t.questionnaire.ePayments },
    { value: "Scam detection", label: t.questionnaire.scamDetection },
    { value: "Social apps", label: t.questionnaire.socialApps },
    { value: "Troubleshooting", label: t.questionnaire.troubleshooting },
    { value: "Government digital services", label: t.questionnaire.govDigitalServices },
  ];

  const availabilityOptionsTranslated = [
    { value: "Morning", label: t.questionnaire.morning },
    { value: "Afternoon", label: t.questionnaire.afternoon },
    { value: "Evening", label: t.questionnaire.evening },
    { value: "Weekends only", label: t.questionnaire.weekendsOnly },
  ];

  const communicationOptionsTranslated = [
    { value: "chat", label: t.questionnaire.chatOnly },
    { value: "chat-zoom", label: t.questionnaire.chatZoom },
  ];

  const proficiencyOptionsTranslated = [
    { value: "beginner", label: t.questionnaire.proficiencyBeginner },
    { value: "intermediate", label: t.questionnaire.proficiencyIntermediate },
    { value: "advanced", label: t.questionnaire.proficiencyAdvanced },
    { value: "expert", label: t.questionnaire.proficiencyExpert },
  ];

  const isElderly = (answers.age ?? 0) >= 40;

  // Define questions based on age group
  const elderlyQuestions = [
    "skills_to_share",
    "skill_proficiency",
    "digital_help",
    "languages",
    "communication",
    "availability",
    "archive",
  ];

  const youthQuestions = [
    "skill_to_teach",
    "skill_proficiency",
    "cultural_interests",
    "digital_teaching",
    "teaching_comfort",
    "communication",
    "availability",
    "verification",
  ];

  const questions = isElderly ? elderlyQuestions : youthQuestions;
  const totalSteps = questions.length + 1; // +1 for age step
  const progress = step === "age" ? (1 / totalSteps) * 100 : ((currentQuestion + 2) / totalSteps) * 100;

  const handleAgeSubmit = () => {
    const age = parseInt(ageInput);
    if (age && age > 0 && age < 120) {
      setAnswers(prev => ({ ...prev, age }));
      setStep("questionnaire");
      setCurrentQuestion(0);
    }
  };

  const handleMultiSelect = (field: keyof QuestionnaireAnswers, value: string) => {
    const current = (answers[field] as string[]) || [];
    if (current.includes(value)) {
      setAnswers(prev => ({
        ...prev,
        [field]: current.filter(v => v !== value),
      }));
    } else {
      setAnswers(prev => ({
        ...prev,
        [field]: [...current, value],
      }));
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    } else {
      setStep("age");
    }
  };

  const handleSubmit = async () => {
    await onSave(answers);
  };

  const canProceed = () => {
    if (step === "age") {
      const age = parseInt(ageInput);
      return age && age > 0 && age < 120;
    }

    const q = questions[currentQuestion];
    if (isElderly) {
      switch (q) {
        case "skills_to_share":
          return answers.q_skills_to_share?.trim().length > 0;
        case "skill_proficiency":
          return !!answers.q_skill_proficiency;
        case "digital_help":
          return answers.q_digital_help_needed?.length > 0;
        case "languages":
          return answers.q_languages_dialects?.length > 0;
        case "communication":
          return !!answers.q_communication_preference;
        case "availability":
          return answers.q_availability?.length > 0;
        case "archive":
          return true; // Boolean always valid
        default:
          return true;
      }
    } else {
      switch (q) {
        case "skill_to_teach":
          return answers.q_skill_to_teach?.trim().length > 0;
        case "skill_proficiency":
          return !!answers.q_skill_proficiency;
        case "cultural_interests":
          return answers.q_cultural_interests?.length > 0;
        case "digital_teaching":
          return answers.q_digital_teaching_skills?.length > 0;
        case "teaching_comfort":
          return answers.q_teaching_comfort > 0;
        case "communication":
          return !!answers.q_communication_preference;
        case "availability":
          return answers.q_availability?.length > 0;
        case "verification":
          return true; // Boolean always valid
        default:
          return true;
      }
    }
  };

  const isLastStep = currentQuestion === questions.length - 1;

  // Render age step
  if (step === "age") {
    return (
      <Card className="shadow-elevated max-w-2xl mx-auto">
        <CardHeader className="text-center pb-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4 mx-auto">
            <User className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">{t.questionnaire.step} 1</span>
          </div>
          <Progress value={progress} className="h-2 mb-4" />
          <CardTitle className="font-display text-xl md:text-2xl leading-relaxed">
            {t.questionnaire.ageTitle}
          </CardTitle>
          <CardDescription className="text-base">
            {t.questionnaire.ageDesc}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <Input
              type="number"
              value={ageInput}
              onChange={(e) => setAgeInput(e.target.value)}
              placeholder={t.questionnaire.enterAge}
              className="text-center text-2xl h-16 w-40 font-bold"
              min={1}
              max={120}
            />
          </div>

          <div className="flex items-center justify-between pt-4">
            <Button variant="ghost" onClick={onCancel}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t.questionnaire.cancel}
            </Button>

            <Button
              variant="hero"
              onClick={handleAgeSubmit}
              disabled={!canProceed()}
              size="lg"
            >
              {t.questionnaire.continue}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Render questionnaire based on age group
  const renderQuestion = () => {
    const q = questions[currentQuestion];

    if (isElderly) {
      switch (q) {
        case "skills_to_share":
          return (
            <div className="space-y-4">
              <CardTitle className="font-display text-xl md:text-2xl leading-relaxed text-center">
                {t.questionnaire.skillsToShareTitle}
              </CardTitle>
              <CardDescription className="text-center text-base mb-4">
                {t.questionnaire.skillsToShareDesc}
              </CardDescription>
              <Textarea
                value={answers.q_skills_to_share || ""}
                onChange={(e) => setAnswers(prev => ({ ...prev, q_skills_to_share: e.target.value }))}
                placeholder={t.questionnaire.skillsToSharePlaceholder}
                className="min-h-[120px] text-lg"
              />
            </div>
          );

        case "skill_proficiency":
          return (
            <div className="space-y-4">
              <CardTitle className="font-display text-xl md:text-2xl leading-relaxed text-center">
                {t.questionnaire.proficiencyTitle}
              </CardTitle>
              <CardDescription className="text-center text-base mb-4">
                {t.questionnaire.proficiencyDesc}
              </CardDescription>
              <RadioGroup
                value={answers.q_skill_proficiency || ""}
                onValueChange={(value) => setAnswers(prev => ({ ...prev, q_skill_proficiency: value }))}
                className="space-y-3 mt-6"
              >
                {proficiencyOptionsTranslated.map((option) => (
                  <div
                    key={option.value}
                    className={`flex items-center gap-4 p-5 rounded-xl border-2 cursor-pointer transition-all ${
                      answers.q_skill_proficiency === option.value
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => setAnswers(prev => ({ ...prev, q_skill_proficiency: option.value }))}
                  >
                    <RadioGroupItem value={option.value} id={`proficiency-${option.value}`} className="h-6 w-6" />
                    <Label htmlFor={`proficiency-${option.value}`} className="text-lg cursor-pointer">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          );

        case "digital_help":
          return (
            <div className="space-y-4">
              <CardTitle className="font-display text-xl md:text-2xl leading-relaxed text-center">
                {t.questionnaire.digitalHelpTitle}
              </CardTitle>
              <CardDescription className="text-center text-base mb-4">
                {t.questionnaire.selectAllApply}
              </CardDescription>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {digitalHelpOptionsTranslated.map((option) => (
                  <div
                    key={option.value}
                    onClick={() => handleMultiSelect("q_digital_help_needed", option.value)}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      answers.q_digital_help_needed?.includes(option.value)
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <Checkbox
                      checked={answers.q_digital_help_needed?.includes(option.value)}
                      className="h-6 w-6"
                    />
                    <span className="text-lg">{option.label}</span>
                  </div>
                ))}
              </div>
            </div>
          );

        case "languages":
          return (
            <div className="space-y-4">
              <CardTitle className="font-display text-xl md:text-2xl leading-relaxed text-center">
                {t.questionnaire.languagesTitle}
              </CardTitle>
              <CardDescription className="text-center text-base mb-4">
                {t.questionnaire.selectAllApply}
              </CardDescription>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {languageOptionsTranslated.map((option) => (
                  <div
                    key={option.value}
                    onClick={() => handleMultiSelect("q_languages_dialects", option.value)}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      answers.q_languages_dialects?.includes(option.value)
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <Checkbox
                      checked={answers.q_languages_dialects?.includes(option.value)}
                      className="h-5 w-5"
                    />
                    <span className="text-base">{option.label}</span>
                  </div>
                ))}
              </div>
            </div>
          );

        case "communication":
          return (
            <div className="space-y-4">
              <CardTitle className="font-display text-xl md:text-2xl leading-relaxed text-center">
                {t.questionnaire.communicationTitle}
              </CardTitle>
              <RadioGroup
                value={answers.q_communication_preference || ""}
                onValueChange={(value) => setAnswers(prev => ({ ...prev, q_communication_preference: value }))}
                className="space-y-3 mt-6"
              >
                {communicationOptionsTranslated.map((option) => (
                  <div
                    key={option.value}
                    className={`flex items-center gap-4 p-5 rounded-xl border-2 cursor-pointer transition-all ${
                      answers.q_communication_preference === option.value
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => setAnswers(prev => ({ ...prev, q_communication_preference: option.value }))}
                  >
                    <RadioGroupItem value={option.value} id={option.value} className="h-6 w-6" />
                    <Label htmlFor={option.value} className="text-lg cursor-pointer">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          );

        case "availability":
          return (
            <div className="space-y-4">
              <CardTitle className="font-display text-xl md:text-2xl leading-relaxed text-center">
                {t.questionnaire.availabilityTitle}
              </CardTitle>
              <CardDescription className="text-center text-base mb-4">
                {t.questionnaire.selectAllApply}
              </CardDescription>
              <div className="grid grid-cols-2 gap-3">
                {availabilityOptionsTranslated.map((option) => (
                  <div
                    key={option.value}
                    onClick={() => handleMultiSelect("q_availability", option.value)}
                    className={`flex items-center justify-center gap-3 p-5 rounded-xl border-2 cursor-pointer transition-all text-center ${
                      answers.q_availability?.includes(option.value)
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <Checkbox
                      checked={answers.q_availability?.includes(option.value)}
                      className="h-6 w-6"
                    />
                    <span className="text-lg font-medium">{option.label}</span>
                  </div>
                ))}
              </div>
            </div>
          );

        case "archive":
          return (
            <div className="space-y-4">
              <CardTitle className="font-display text-xl md:text-2xl leading-relaxed text-center">
                {t.questionnaire.archiveTitle}
              </CardTitle>
              <RadioGroup
                value={answers.q_allow_archive ? "yes" : "no"}
                onValueChange={(value) => setAnswers(prev => ({ ...prev, q_allow_archive: value === "yes" }))}
                className="space-y-3 mt-6"
              >
                {[
                  { value: "yes", label: t.questionnaire.archiveYes },
                  { value: "no", label: t.questionnaire.archiveNo },
                ].map((option) => (
                  <div
                    key={option.value}
                    className={`flex items-center gap-4 p-5 rounded-xl border-2 cursor-pointer transition-all ${
                      (answers.q_allow_archive ? "yes" : "no") === option.value
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => setAnswers(prev => ({ ...prev, q_allow_archive: option.value === "yes" }))}
                  >
                    <RadioGroupItem value={option.value} id={`archive-${option.value}`} className="h-6 w-6" />
                    <Label htmlFor={`archive-${option.value}`} className="text-lg cursor-pointer">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          );
      }
    } else {
      // Youth questions
      switch (q) {
        case "skill_to_teach":
          return (
            <div className="space-y-4">
              <CardTitle className="font-display text-xl md:text-2xl leading-relaxed text-center">
                {t.questionnaire.skillToTeachTitle}
              </CardTitle>
              <Textarea
                value={answers.q_skill_to_teach || ""}
                onChange={(e) => setAnswers(prev => ({ ...prev, q_skill_to_teach: e.target.value }))}
                placeholder={t.questionnaire.skillToTeachPlaceholder}
                className="min-h-[120px] text-base"
              />
            </div>
          );

        case "skill_proficiency":
          return (
            <div className="space-y-4">
              <CardTitle className="font-display text-xl md:text-2xl leading-relaxed text-center">
                {t.questionnaire.proficiencyTitle}
              </CardTitle>
              <CardDescription className="text-center text-base mb-4">
                {t.questionnaire.proficiencyDesc}
              </CardDescription>
              <RadioGroup
                value={answers.q_skill_proficiency || ""}
                onValueChange={(value) => setAnswers(prev => ({ ...prev, q_skill_proficiency: value }))}
                className="space-y-3 mt-6"
              >
                {proficiencyOptionsTranslated.map((option) => (
                  <div
                    key={option.value}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      answers.q_skill_proficiency === option.value
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => setAnswers(prev => ({ ...prev, q_skill_proficiency: option.value }))}
                  >
                    <RadioGroupItem value={option.value} id={`youth-proficiency-${option.value}`} />
                    <Label htmlFor={`youth-proficiency-${option.value}`} className="text-base cursor-pointer">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          );

        case "cultural_interests":
          return (
            <div className="space-y-4">
              <CardTitle className="font-display text-xl md:text-2xl leading-relaxed text-center">
                {t.questionnaire.culturalInterestsTitle}
              </CardTitle>
              <CardDescription className="text-center text-base mb-4">
                {t.questionnaire.selectAllInterest}
              </CardDescription>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {culturalInterestOptionsTranslated.map((option) => (
                  <div
                    key={option.value}
                    onClick={() => handleMultiSelect("q_cultural_interests", option.value)}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      answers.q_cultural_interests?.includes(option.value)
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <Checkbox
                      checked={answers.q_cultural_interests?.includes(option.value)}
                      className="h-5 w-5"
                    />
                    <span className="text-base">{option.label}</span>
                  </div>
                ))}
              </div>
            </div>
          );

        case "digital_teaching":
          return (
            <div className="space-y-4">
              <CardTitle className="font-display text-xl md:text-2xl leading-relaxed text-center">
                {t.questionnaire.digitalTeachingTitle}
              </CardTitle>
              <CardDescription className="text-center text-base mb-4">
                {t.questionnaire.selectAllApply}
              </CardDescription>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {digitalTeachingOptionsTranslated.map((option) => (
                  <div
                    key={option.value}
                    onClick={() => handleMultiSelect("q_digital_teaching_skills", option.value)}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      answers.q_digital_teaching_skills?.includes(option.value)
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <Checkbox
                      checked={answers.q_digital_teaching_skills?.includes(option.value)}
                      className="h-5 w-5"
                    />
                    <span className="text-base">{option.label}</span>
                  </div>
                ))}
              </div>
            </div>
          );

        case "teaching_comfort":
          return (
            <div className="space-y-6">
              <CardTitle className="font-display text-xl md:text-2xl leading-relaxed text-center">
                {t.questionnaire.teachingComfortTitle}
              </CardTitle>
              <CardDescription className="text-center text-base mb-4">
                {t.questionnaire.teachingComfortDesc}
              </CardDescription>
              <div className="px-4 py-8">
                <Slider
                  value={[answers.q_teaching_comfort || 3]}
                  onValueChange={(value) => setAnswers(prev => ({ ...prev, q_teaching_comfort: value[0] }))}
                  min={1}
                  max={5}
                  step={1}
                  className="py-4"
                />
                <div className="flex justify-between mt-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      onClick={() => setAnswers(prev => ({ ...prev, q_teaching_comfort: num }))}
                      className={`w-12 h-12 rounded-full text-lg font-bold transition-all ${
                        answers.q_teaching_comfort === num
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted hover:bg-muted/80"
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );

        case "communication":
          return (
            <div className="space-y-4">
              <CardTitle className="font-display text-xl md:text-2xl leading-relaxed text-center">
                {t.questionnaire.communicationTitle}
              </CardTitle>
              <RadioGroup
                value={answers.q_communication_preference || ""}
                onValueChange={(value) => setAnswers(prev => ({ ...prev, q_communication_preference: value }))}
                className="space-y-3 mt-6"
              >
                {communicationOptionsTranslated.map((option) => (
                  <div
                    key={option.value}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      answers.q_communication_preference === option.value
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => setAnswers(prev => ({ ...prev, q_communication_preference: option.value }))}
                  >
                    <RadioGroupItem value={option.value} id={`youth-${option.value}`} />
                    <Label htmlFor={`youth-${option.value}`} className="text-base cursor-pointer">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          );

        case "availability":
          return (
            <div className="space-y-4">
              <CardTitle className="font-display text-xl md:text-2xl leading-relaxed text-center">
                {t.questionnaire.availabilityTitle}
              </CardTitle>
              <CardDescription className="text-center text-base mb-4">
                {t.questionnaire.selectAllApply}
              </CardDescription>
              <div className="grid grid-cols-2 gap-3">
                {availabilityOptionsTranslated.map((option) => (
                  <div
                    key={option.value}
                    onClick={() => handleMultiSelect("q_availability", option.value)}
                    className={`flex items-center justify-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      answers.q_availability?.includes(option.value)
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <Checkbox
                      checked={answers.q_availability?.includes(option.value)}
                      className="h-5 w-5"
                    />
                    <span className="font-medium">{option.label}</span>
                  </div>
                ))}
              </div>
            </div>
          );

        case "verification":
          return (
            <div className="space-y-4">
              <CardTitle className="font-display text-xl md:text-2xl leading-relaxed text-center">
                {t.questionnaire.verificationTitle}
              </CardTitle>
              <RadioGroup
                value={answers.q_open_to_verification ? "yes" : "no"}
                onValueChange={(value) => setAnswers(prev => ({ ...prev, q_open_to_verification: value === "yes" }))}
                className="space-y-3 mt-6"
              >
                {[
                  { value: "yes", label: t.questionnaire.verificationYes },
                  { value: "no", label: t.questionnaire.verificationNo },
                ].map((option) => (
                  <div
                    key={option.value}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      (answers.q_open_to_verification ? "yes" : "no") === option.value
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => setAnswers(prev => ({ ...prev, q_open_to_verification: option.value === "yes" }))}
                  >
                    <RadioGroupItem value={option.value} id={`verify-${option.value}`} />
                    <Label htmlFor={`verify-${option.value}`} className="text-base cursor-pointer">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          );
      }
    }

    return null;
  };

  return (
    <Card className="shadow-elevated max-w-2xl mx-auto">
      <CardHeader className="text-center pb-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4 mx-auto">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">
            {isElderly ? "Senior" : "Youth"} • Question {currentQuestion + 1} of {questions.length}
          </span>
        </div>
        <Progress value={progress} className="h-2 mb-4" />
      </CardHeader>

      <CardContent className="space-y-6">
        {renderQuestion()}

        <div className="flex items-center justify-between pt-6">
          <Button
            variant="ghost"
            onClick={handlePrevious}
            disabled={saving}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t.questionnaire.previous}
          </Button>

          {isLastStep ? (
            <Button
              variant="hero"
              onClick={handleSubmit}
              disabled={!canProceed() || saving}
              size="lg"
            >
              {saving ? t.questionnaire.saving : t.questionnaire.finish}
              <Check className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              variant="hero"
              onClick={handleNext}
              disabled={!canProceed()}
              size="lg"
            >
              {t.questionnaire.next}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileQuestionnaire;
