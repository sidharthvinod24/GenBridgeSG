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
  const [step, setStep] = useState<"age" | "questionnaire">("age");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<QuestionnaireAnswers>(initialAnswers);
  const [ageInput, setAgeInput] = useState(initialAnswers.age?.toString() || "");

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
            <span className="text-sm font-medium text-primary">Step 1</span>
          </div>
          <Progress value={progress} className="h-2 mb-4" />
          <CardTitle className="font-display text-xl md:text-2xl leading-relaxed">
            Please tell us your age so we can customise your experience
          </CardTitle>
          <CardDescription className="text-base">
            We'll show you questions tailored to your generation
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <Input
              type="number"
              value={ageInput}
              onChange={(e) => setAgeInput(e.target.value)}
              placeholder="Enter your age"
              className="text-center text-2xl h-16 w-40 font-bold"
              min={1}
              max={120}
            />
          </div>

          <div className="flex items-center justify-between pt-4">
            <Button variant="ghost" onClick={onCancel}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Cancel
            </Button>

            <Button
              variant="hero"
              onClick={handleAgeSubmit}
              disabled={!canProceed()}
              size="lg"
            >
              Continue
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
                What knowledge or skills would you like to share with someone younger?
              </CardTitle>
              <CardDescription className="text-center text-base mb-4">
                Examples: dialects, recipes, traditional crafts, stories
              </CardDescription>
              <Textarea
                value={answers.q_skills_to_share || ""}
                onChange={(e) => setAnswers(prev => ({ ...prev, q_skills_to_share: e.target.value }))}
                placeholder="Share what you'd like to teach..."
                className="min-h-[120px] text-lg"
              />
            </div>
          );

        case "skill_proficiency":
          return (
            <div className="space-y-4">
              <CardTitle className="font-display text-xl md:text-2xl leading-relaxed text-center">
                How proficient are you in this skill?
              </CardTitle>
              <CardDescription className="text-center text-base mb-4">
                Select your experience level
              </CardDescription>
              <RadioGroup
                value={answers.q_skill_proficiency || ""}
                onValueChange={(value) => setAnswers(prev => ({ ...prev, q_skill_proficiency: value }))}
                className="space-y-3 mt-6"
              >
                {proficiencyOptions.map((option) => (
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
                What digital help would you like to receive?
              </CardTitle>
              <CardDescription className="text-center text-base mb-4">
                Select all that apply
              </CardDescription>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {digitalHelpOptions.map((option) => (
                  <div
                    key={option}
                    onClick={() => handleMultiSelect("q_digital_help_needed", option)}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      answers.q_digital_help_needed?.includes(option)
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <Checkbox
                      checked={answers.q_digital_help_needed?.includes(option)}
                      className="h-6 w-6"
                    />
                    <span className="text-lg">{option}</span>
                  </div>
                ))}
              </div>
            </div>
          );

        case "languages":
          return (
            <div className="space-y-4">
              <CardTitle className="font-display text-xl md:text-2xl leading-relaxed text-center">
                Which languages or dialects do you speak well?
              </CardTitle>
              <CardDescription className="text-center text-base mb-4">
                Select all that apply
              </CardDescription>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {languageOptions.map((option) => (
                  <div
                    key={option}
                    onClick={() => handleMultiSelect("q_languages_dialects", option)}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      answers.q_languages_dialects?.includes(option)
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <Checkbox
                      checked={answers.q_languages_dialects?.includes(option)}
                      className="h-5 w-5"
                    />
                    <span className="text-base">{option}</span>
                  </div>
                ))}
              </div>
            </div>
          );

        case "communication":
          return (
            <div className="space-y-4">
              <CardTitle className="font-display text-xl md:text-2xl leading-relaxed text-center">
                How would you like to communicate?
              </CardTitle>
              <RadioGroup
                value={answers.q_communication_preference || ""}
                onValueChange={(value) => setAnswers(prev => ({ ...prev, q_communication_preference: value }))}
                className="space-y-3 mt-6"
              >
                {communicationOptions.map((option) => (
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
                When are you usually free?
              </CardTitle>
              <CardDescription className="text-center text-base mb-4">
                Select all that apply
              </CardDescription>
              <div className="grid grid-cols-2 gap-3">
                {availabilityOptions.map((option) => (
                  <div
                    key={option}
                    onClick={() => handleMultiSelect("q_availability", option)}
                    className={`flex items-center justify-center gap-3 p-5 rounded-xl border-2 cursor-pointer transition-all text-center ${
                      answers.q_availability?.includes(option)
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <Checkbox
                      checked={answers.q_availability?.includes(option)}
                      className="h-6 w-6"
                    />
                    <span className="text-lg font-medium">{option}</span>
                  </div>
                ))}
              </div>
            </div>
          );

        case "archive":
          return (
            <div className="space-y-4">
              <CardTitle className="font-display text-xl md:text-2xl leading-relaxed text-center">
                Do you allow your shared stories or knowledge to be recorded and preserved in our cultural archive?
              </CardTitle>
              <RadioGroup
                value={answers.q_allow_archive ? "yes" : "no"}
                onValueChange={(value) => setAnswers(prev => ({ ...prev, q_allow_archive: value === "yes" }))}
                className="space-y-3 mt-6"
              >
                {[
                  { value: "yes", label: "Yes, I'd like to contribute to the archive" },
                  { value: "no", label: "No, I prefer to keep my knowledge private" },
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
                What skill or hobby can you confidently teach to someone else?
              </CardTitle>
              <Textarea
                value={answers.q_skill_to_teach || ""}
                onChange={(e) => setAnswers(prev => ({ ...prev, q_skill_to_teach: e.target.value }))}
                placeholder="Describe what you can teach..."
                className="min-h-[120px] text-base"
              />
            </div>
          );

        case "skill_proficiency":
          return (
            <div className="space-y-4">
              <CardTitle className="font-display text-xl md:text-2xl leading-relaxed text-center">
                How proficient are you in this skill?
              </CardTitle>
              <CardDescription className="text-center text-base mb-4">
                Select your experience level
              </CardDescription>
              <RadioGroup
                value={answers.q_skill_proficiency || ""}
                onValueChange={(value) => setAnswers(prev => ({ ...prev, q_skill_proficiency: value }))}
                className="space-y-3 mt-6"
              >
                {proficiencyOptions.map((option) => (
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
                What cultural skills or knowledge would you like to learn?
              </CardTitle>
              <CardDescription className="text-center text-base mb-4">
                Select all that interest you
              </CardDescription>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {culturalInterestOptions.map((option) => (
                  <div
                    key={option}
                    onClick={() => handleMultiSelect("q_cultural_interests", option)}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      answers.q_cultural_interests?.includes(option)
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <Checkbox
                      checked={answers.q_cultural_interests?.includes(option)}
                      className="h-5 w-5"
                    />
                    <span className="text-base">{option}</span>
                  </div>
                ))}
              </div>
            </div>
          );

        case "digital_teaching":
          return (
            <div className="space-y-4">
              <CardTitle className="font-display text-xl md:text-2xl leading-relaxed text-center">
                Which digital skills are you confident teaching?
              </CardTitle>
              <CardDescription className="text-center text-base mb-4">
                Select all that apply
              </CardDescription>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {digitalTeachingOptions.map((option) => (
                  <div
                    key={option}
                    onClick={() => handleMultiSelect("q_digital_teaching_skills", option)}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      answers.q_digital_teaching_skills?.includes(option)
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <Checkbox
                      checked={answers.q_digital_teaching_skills?.includes(option)}
                      className="h-5 w-5"
                    />
                    <span className="text-base">{option}</span>
                  </div>
                ))}
              </div>
            </div>
          );

        case "teaching_comfort":
          return (
            <div className="space-y-6">
              <CardTitle className="font-display text-xl md:text-2xl leading-relaxed text-center">
                How comfortable are you teaching someone unfamiliar with technology?
              </CardTitle>
              <div className="px-4 py-8">
                <div className="flex justify-between mb-4 text-sm text-muted-foreground">
                  <span>Not comfortable</span>
                  <span>Very comfortable</span>
                </div>
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
                How would you prefer to communicate?
              </CardTitle>
              <RadioGroup
                value={answers.q_communication_preference || ""}
                onValueChange={(value) => setAnswers(prev => ({ ...prev, q_communication_preference: value }))}
                className="space-y-3 mt-6"
              >
                {communicationOptions.map((option) => (
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
                When are you available?
              </CardTitle>
              <CardDescription className="text-center text-base mb-4">
                Select all time blocks that work for you
              </CardDescription>
              <div className="grid grid-cols-2 gap-3">
                {availabilityOptions.map((option) => (
                  <div
                    key={option}
                    onClick={() => handleMultiSelect("q_availability", option)}
                    className={`flex items-center justify-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      answers.q_availability?.includes(option)
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <Checkbox
                      checked={answers.q_availability?.includes(option)}
                      className="h-5 w-5"
                    />
                    <span className="font-medium">{option}</span>
                  </div>
                ))}
              </div>
            </div>
          );

        case "verification":
          return (
            <div className="space-y-4">
              <CardTitle className="font-display text-xl md:text-2xl leading-relaxed text-center">
                Are you open to optional verification for trust and credibility?
              </CardTitle>
              <CardDescription className="text-center text-base mb-4">
                Verified users get higher visibility in matches
              </CardDescription>
              <RadioGroup
                value={answers.q_open_to_verification ? "yes" : "no"}
                onValueChange={(value) => setAnswers(prev => ({ ...prev, q_open_to_verification: value === "yes" }))}
                className="space-y-3 mt-6"
              >
                {[
                  { value: "yes", label: "Yes, I'm open to verification" },
                  { value: "no", label: "No, not at this time" },
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
            Previous
          </Button>

          {isLastStep ? (
            <Button
              variant="hero"
              onClick={handleSubmit}
              disabled={!canProceed() || saving}
              size="lg"
            >
              {saving ? "Saving..." : "Complete Profile"}
              <Check className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              variant="hero"
              onClick={handleNext}
              disabled={!canProceed()}
              size="lg"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileQuestionnaire;
