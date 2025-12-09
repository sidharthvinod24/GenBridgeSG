import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Check, Sparkles } from "lucide-react";

interface QuestionnaireAnswers {
  q_skill_or_hobby: string;
  q_frustrating_task: string;
  q_talk_topic: string;
  q_learning_style: string;
  q_proud_story: string;
  q_hands_or_screens: string;
  q_explaining_patience: string;
  q_other_generation: string;
  q_conversation_preference: string;
  q_joining_reason: string;
}

interface ProfileQuestionnaireProps {
  initialAnswers: QuestionnaireAnswers;
  onSave: (answers: QuestionnaireAnswers) => Promise<void>;
  onCancel: () => void;
  saving: boolean;
}

const questions = [
  {
    id: "q_skill_or_hobby",
    question: "What is one skill or hobby you have spent years perfecting, or something friends always ask you for help with?",
    type: "text",
    placeholder: "e.g., Cooking traditional dishes, fixing electronics, gardening tips...",
  },
  {
    id: "q_frustrating_task",
    question: "What is a task in your daily life (modern or traditional) that you find frustrating or confusing?",
    type: "text",
    placeholder: "e.g., Using smartphone apps, traditional sewing techniques, online banking...",
  },
  {
    id: "q_talk_topic",
    question: "If you had to give a 30-minute talk right now with no preparation, what topic would you choose?",
    type: "text",
    placeholder: "e.g., My experience in teaching, history of our neighbourhood, mobile photography...",
  },
  {
    id: "q_learning_style",
    question: "When learning something new, do you prefer step-by-step instructions or hearing the story behind it?",
    type: "radio",
    options: [
      { value: "step-by-step", label: "Step-by-step instructions" },
      { value: "story", label: "Hearing the story behind it" },
      { value: "both", label: "A mix of both" },
    ],
  },
  {
    id: "q_proud_story",
    question: "Share a brief story about a problem you solved that made you proud.",
    type: "text",
    placeholder: "Tell us about a time you helped someone or figured something out...",
  },
  {
    id: "q_hands_or_screens",
    question: "Do you feel more comfortable working with your hands or with screens and ideas?",
    type: "radio",
    options: [
      { value: "hands", label: "Working with hands (crafts, repairs, cooking)" },
      { value: "screens", label: "Working with screens and ideas (tech, strategy)" },
      { value: "both", label: "Comfortable with both" },
    ],
  },
  {
    id: "q_explaining_patience",
    question: "How do you react when someone does not understand what you are explaining the first time?",
    type: "radio",
    options: [
      { value: "patient", label: "I stay patient and try a different approach" },
      { value: "show", label: "I prefer to show them by doing it together" },
      { value: "resources", label: "I point them to other resources" },
    ],
  },
  {
    id: "q_other_generation",
    question: "What is something from the other generation (younger or older) that genuinely confuses or intrigues you?",
    type: "text",
    placeholder: "e.g., Why young people use so many apps, how elders remember so many recipes...",
  },
  {
    id: "q_conversation_preference",
    question: "Do you prefer deep 1-on-1 conversations or lively group activities?",
    type: "radio",
    options: [
      { value: "one-on-one", label: "Deep 1-on-1 conversations" },
      { value: "group", label: "Lively group activities" },
      { value: "both", label: "I enjoy both equally" },
    ],
  },
  {
    id: "q_joining_reason",
    question: "Why are you joining GenBridgeSG today?",
    type: "radio",
    options: [
      { value: "save-time", label: "To save time by learning from others" },
      { value: "learn-skill", label: "To learn a new skill" },
      { value: "connect", label: "Just to connect with the community" },
      { value: "teach", label: "To share my knowledge with others" },
    ],
  },
];

const ProfileQuestionnaire = ({ initialAnswers, onSave, onCancel, saving }: ProfileQuestionnaireProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<QuestionnaireAnswers>(initialAnswers);

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  const handleAnswer = (value: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: value,
    }));
  };

  const currentAnswer = answers[currentQuestion.id as keyof QuestionnaireAnswers] || "";

  const canProceed = currentAnswer.trim().length > 0;

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    await onSave(answers);
  };

  const isLastStep = currentStep === questions.length - 1;

  return (
    <Card className="shadow-elevated max-w-2xl mx-auto">
      <CardHeader className="text-center pb-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-light border border-primary/20 mb-4 mx-auto">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">
            Question {currentStep + 1} of {questions.length}
          </span>
        </div>
        <Progress value={progress} className="h-2 mb-4" />
        <CardTitle className="font-display text-xl md:text-2xl leading-relaxed">
          {currentQuestion.question}
        </CardTitle>
        <CardDescription className="text-base">
          Take your time to answer thoughtfully
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {currentQuestion.type === "text" ? (
          <Textarea
            value={currentAnswer}
            onChange={(e) => handleAnswer(e.target.value)}
            placeholder={currentQuestion.placeholder}
            className="min-h-[120px] text-base"
          />
        ) : (
          <RadioGroup
            value={currentAnswer}
            onValueChange={handleAnswer}
            className="space-y-3"
          >
            {currentQuestion.options?.map((option) => (
              <div
                key={option.value}
                className={`flex items-center space-x-3 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                  currentAnswer === option.value
                    ? "border-primary bg-primary-light"
                    : "border-border hover:border-primary/50"
                }`}
                onClick={() => handleAnswer(option.value)}
              >
                <RadioGroupItem value={option.value} id={option.value} />
                <Label htmlFor={option.value} className="text-base cursor-pointer flex-1">
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )}

        <div className="flex items-center justify-between pt-4">
          <Button
            variant="ghost"
            onClick={currentStep === 0 ? onCancel : handlePrevious}
            disabled={saving}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {currentStep === 0 ? "Cancel" : "Previous"}
          </Button>

          {isLastStep ? (
            <Button
              variant="hero"
              onClick={handleSubmit}
              disabled={!canProceed || saving}
            >
              {saving ? "Saving..." : "Complete Profile"}
              <Check className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              variant="hero"
              onClick={handleNext}
              disabled={!canProceed}
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
