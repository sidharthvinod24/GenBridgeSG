import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Languages, Volume2, VolumeX, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface MessageActionsProps {
  content: string;
  onTranslate: (translatedText: string) => void;
}

const MessageActions = ({ content, onTranslate }: MessageActionsProps) => {
  const [isTranslating, setIsTranslating] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showOriginal, setShowOriginal] = useState(true);
  const [translatedContent, setTranslatedContent] = useState("");

  const detectLanguage = (text: string): "en" | "zh" => {
    // Simple detection - if contains Chinese characters, it's Chinese
    const chineseRegex = /[\u4e00-\u9fff]/;
    return chineseRegex.test(text) ? "zh" : "en";
  };

  const handleTranslate = async () => {
    if (translatedContent && !showOriginal) {
      setShowOriginal(true);
      onTranslate(content);
      return;
    }

    if (translatedContent) {
      setShowOriginal(false);
      onTranslate(translatedContent);
      return;
    }

    setIsTranslating(true);
    try {
      const sourceLang = detectLanguage(content);
      const targetLang = sourceLang === "en" ? "zh" : "en";
      const targetLangName = targetLang === "zh" ? "Chinese (Simplified)" : "English";

      const { data, error } = await supabase.functions.invoke("translate-message", {
        body: { text: content, targetLanguage: targetLangName },
      });

      if (error) throw error;

      if (data?.translatedText) {
        setTranslatedContent(data.translatedText);
        setShowOriginal(false);
        onTranslate(data.translatedText);
      }
    } catch (error) {
      console.error("Translation error:", error);
      toast.error("Failed to translate message");
    } finally {
      setIsTranslating(false);
    }
  };

  const handleReadAloud = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const textToRead = showOriginal ? content : translatedContent || content;
    const utterance = new SpeechSynthesisUtterance(textToRead);
    
    // Detect language for speech
    const lang = detectLanguage(textToRead);
    utterance.lang = lang === "zh" ? "zh-CN" : "en-US";
    
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => {
      setIsSpeaking(false);
      toast.error("Failed to read message aloud");
    };

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="flex items-center gap-1 mt-1">
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6"
        onClick={handleTranslate}
        disabled={isTranslating}
        title={showOriginal && translatedContent ? "Show translation" : translatedContent ? "Show original" : "Translate"}
      >
        {isTranslating ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : (
          <Languages className={`h-3 w-3 ${!showOriginal ? "text-primary" : ""}`} />
        )}
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6"
        onClick={handleReadAloud}
        title={isSpeaking ? "Stop reading" : "Read aloud"}
      >
        {isSpeaking ? (
          <VolumeX className="h-3 w-3 text-primary" />
        ) : (
          <Volume2 className="h-3 w-3" />
        )}
      </Button>
    </div>
  );
};

export default MessageActions;
