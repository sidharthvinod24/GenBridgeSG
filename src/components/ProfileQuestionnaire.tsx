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
  q_learning_style: string;
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

const countWords = (text: string): number => {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
};

const extractKeywords = (text: string): string => {
  // Remove common stop words and keep meaningful keywords
  const stopWords = new Set([
    'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'your', 'yours',
    'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', 'her', 'hers', 'herself',
    'it', 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves', 'what', 'which',
    'who', 'whom', 'this', 'that', 'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be',
    'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'a', 'an',
    'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until', 'while', 'of', 'at', 'by',
    'for', 'with', 'about', 'against', 'between', 'into', 'through', 'during', 'before',
    'after', 'above', 'below', 'to', 'from', 'up', 'down', 'in', 'out', 'on', 'off', 'over',
    'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why',
    'how', 'all', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not',
    'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just',
    'don', 'should', 'now', 'also', 'like', 'really', 'always', 'often', 'sometimes',
    'usually', 'never', 'ever', 'always', 'help', 'ask', 'friends', 'years', 'spent',
    'something', 'one', 'thing', 'things', 'way', 'people', 'make', 'made', 'good', 'well'
  ]);

  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, '') // Remove punctuation
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.has(word));

  // Get unique keywords
  const uniqueKeywords = [...new Set(words)];
  
  // Return top keywords (max 10)
  return uniqueKeywords.slice(0, 10).join(', ');
};

const ProfileQuestionnaire = ({ initialAnswers, onSave, onCancel, saving }: ProfileQuestionnaireProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<QuestionnaireAnswers>(initialAnswers);

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  const handleAnswer = (value: string) => {
    // For text inputs, extract keywords before saving
    if (currentQuestion.type === "text") {
      const keywords = extractKeywords(value);
      setAnswers(prev => ({
        ...prev,
        [currentQuestion.id]: keywords || value, // Keep original if no keywords extracted
      }));
    } else {
      setAnswers(prev => ({
        ...prev,
        [currentQuestion.id]: value,
      }));
    }
  };

  const handleTextChange = (value: string) => {
    const wordCount = countWords(value);
    if (wordCount <= 200) {
      setAnswers(prev => ({
        ...prev,
        [currentQuestion.id]: value,
      }));
    }
  };

  const currentAnswer = answers[currentQuestion.id as keyof QuestionnaireAnswers] || "";
  const wordCount = currentQuestion.type === "text" ? countWords(currentAnswer) : 0;

  const canProceed = currentAnswer.trim().length > 0;

  const handleNext = () => {
    // Extract keywords before moving to next question for text answers
    if (currentQuestion.type === "text" && currentAnswer) {
      const keywords = extractKeywords(currentAnswer);
      setAnswers(prev => ({
        ...prev,
        [currentQuestion.id]: keywords || currentAnswer,
      }));
    }
    
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
    // Extract keywords for the last text answer if needed
    const finalAnswers = { ...answers };
    if (currentQuestion.type === "text" && currentAnswer) {
      const keywords = extractKeywords(currentAnswer);
      finalAnswers[currentQuestion.id as keyof QuestionnaireAnswers] = keywords || currentAnswer;
    }
    await onSave(finalAnswers);
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
          <div className="space-y-2">
            <Textarea
              value={currentAnswer}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder={currentQuestion.placeholder}
              className="min-h-[120px] text-base"
            />
            <p className={`text-sm text-right ${wordCount > 180 ? "text-amber-600" : "text-muted-foreground"}`}>
              {wordCount}/200 words
            </p>
          </div>
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
