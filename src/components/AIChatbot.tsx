import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { MessageCircle, Send, X, Bot, User, Sparkles } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface PredefinedAnswer {
  keywords: string[];
  response: string;
}

const predefinedAnswers: PredefinedAnswer[] = [
  {
    keywords: ["how", "matching", "work", "match"],
    response: "Our matching system finds people whose skills complement yours! When your **offered skills** match what someone else **wants to learn**, and vice versa, you get matched. A **Perfect Match** ✨ happens when both of you can teach each other something!",
  },
  {
    keywords: ["perfect", "match"],
    response: "A **Perfect Match** ✨ is when both users can help each other! For example, if you teach cooking and want to learn guitar, and someone teaches guitar and wants to learn cooking - that's a Perfect Match! These are the best opportunities for skill exchange.",
  },
  {
    keywords: ["profile", "setup", "create", "complete"],
    response: "To complete your profile:\n\n1. **Add your name** - so others know who you are\n2. **List skills you can teach** - what are you good at?\n3. **List skills you want to learn** - what interests you?\n4. **Complete the questionnaire** - help us match you better!\n\nThe more complete your profile, the better your matches! 🎯",
  },
  {
    keywords: ["start", "conversation", "message", "chat", "contact"],
    response: "To start a conversation:\n\n1. Go to the **Matching** page\n2. Find someone you'd like to connect with\n3. Swipe right or tap the **heart icon** ❤️\n4. Once matched, you can message them!\n\nTip: Introduce yourself and mention which skills you're interested in exchanging.",
  },
  {
    keywords: ["skill", "add", "offer", "teach", "learn"],
    response: "You can manage your skills in your **Dashboard**:\n\n• **Skills you can teach**: Things you're good at and willing to share\n• **Skills you want to learn**: Things you'd like others to teach you\n\nExamples: Cooking, Guitar, Photography, Languages, Tech skills, Gardening, and more! 🌟",
  },
  {
    keywords: ["browse", "find", "search", "discover"],
    response: "You can discover skills in two ways:\n\n1. **Browse page** - Search and filter all available skills by category, location, or age group\n2. **Matching page** - See personalized matches based on your skill preferences\n\nBoth are great ways to find your next skill swap partner! 🔍",
  },
  {
    keywords: ["safe", "safety", "trust", "secure"],
    response: "Your safety is important! Here are some tips:\n\n• Meet in public places for skill exchanges\n• Start with video calls if you prefer\n• Trust your instincts\n• Report any suspicious behavior\n\nOur community is built on mutual respect and learning together! 🤝",
  },
  {
    keywords: ["free", "cost", "pay", "price", "money"],
    response: "GenBridgeSG is a **free** skill exchange platform! 🎉\n\nThe concept is simple: you teach something you know, and learn something new in return. No money changes hands - just knowledge and skills!\n\nIt's a win-win for everyone in the community.",
  },
  {
    keywords: ["singapore", "location", "where", "area"],
    response: "GenBridgeSG is designed for the **Singapore community**! 🇸🇬\n\nYou can add your location (like Tampines, Jurong, etc.) to find matches nearby. This makes it easier to meet up for skill exchange sessions!",
  },
  {
    keywords: ["generation", "elderly", "senior", "young", "bridge"],
    response: "GenBridgeSG bridges generations! 🌉\n\nWe connect **young adults** with **seniors** to exchange skills and wisdom. Seniors can share traditional knowledge and life experience, while younger members can help with technology and modern skills.\n\nIt's about building meaningful connections across age groups!",
  },
  {
    keywords: ["hello", "hi", "hey", "good morning", "good afternoon", "good evening"],
    response: "Hello! 👋 Welcome to GenBridgeSG! I'm here to help you find skill matches and answer your questions. What would you like to know about?",
  },
  {
    keywords: ["thank", "thanks", "appreciate"],
    response: "You're welcome! 😊 Happy to help! If you have any more questions about skill swapping, feel free to ask. Good luck with your skill exchange journey! 🌟",
  },
  {
    keywords: ["help", "support", "assist"],
    response: "I'm here to help! Here are some things I can assist with:\n\n• How matching works\n• Setting up your profile\n• Starting conversations\n• Finding skills to learn or teach\n• Tips for successful skill exchanges\n\nJust ask me anything! 💡",
  },
];

const quickReplies = [
  "How does matching work?",
  "What's a Perfect Match?",
  "How do I complete my profile?",
  "How do I message someone?",
];

const findPredefinedAnswer = (input: string): string | null => {
  const lowerInput = input.toLowerCase();
  
  for (const qa of predefinedAnswers) {
    const matchCount = qa.keywords.filter(keyword => 
      lowerInput.includes(keyword.toLowerCase())
    ).length;
    
    // Match if at least one keyword is found
    if (matchCount > 0) {
      return qa.response;
    }
  }
  
  return null;
};

const fallbackResponses = [
  "I'm not sure I understand that question. Could you try asking about:\n\n• How matching works\n• Setting up your profile\n• Starting conversations\n• Finding skills to learn\n\nOr click one of the quick reply buttons below! 💡",
  "Hmm, I don't have an answer for that specific question. Try asking about skill matching, profiles, or how to connect with others! 🤔",
  "I'm a simple assistant focused on GenBridgeSG basics. Ask me about matching, profiles, or messaging and I'll be happy to help! 😊",
];

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I'm the GenBridgeSG Assistant 👋 I can help you understand how skill matching works and guide you through the platform. What would you like to know?",
    },
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText) return;

    const userMessage: Message = { role: "user", content: messageText };
    setMessages(prev => [...prev, userMessage]);
    setInput("");

    // Find predefined answer or use fallback
    setTimeout(() => {
      const answer = findPredefinedAnswer(messageText);
      const response = answer || fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
      
      setMessages(prev => [...prev, { role: "assistant", content: response }]);
    }, 500); // Small delay for natural feel
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleQuickReply = (reply: string) => {
    sendMessage(reply);
  };

  return (
    <>
      {/* Chat Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg bg-gradient-to-br from-primary to-secondary hover:scale-105 transition-transform ${isOpen ? "hidden" : ""}`}
        size="icon"
      >
        <MessageCircle className="w-6 h-6 text-primary-foreground" />
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 z-50 w-[380px] h-[520px] flex flex-col shadow-2xl border-primary/20 overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary to-secondary text-primary-foreground">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-semibold">GenBridgeSG Assistant</h3>
                <p className="text-xs opacity-80">Quick answers & help</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="text-primary-foreground hover:bg-primary-foreground/20"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.role === "assistant" && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-primary" />
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-line ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-muted text-foreground rounded-bl-md"
                    }`}
                  >
                    {message.content}
                  </div>
                  {message.role === "user" && (
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                  )}
                </div>
              ))}

              {/* Quick Replies - show after assistant messages */}
              {messages[messages.length - 1]?.role === "assistant" && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {quickReplies.map((reply, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickReply(reply)}
                      className="text-xs h-8 rounded-full border-primary/30 hover:bg-primary/10 hover:border-primary"
                    >
                      {reply}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t border-border bg-background">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask a question..."
                className="flex-1"
              />
              <Button
                onClick={() => sendMessage()}
                disabled={!input.trim()}
                size="icon"
                className="bg-primary hover:bg-primary/90"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  );
};

export default AIChatbot;
