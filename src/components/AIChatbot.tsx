import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { MessageCircle, Send, X, Bot, User, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface PredefinedAnswer {
  keywords: string[];
  responseKey: string;
}

const predefinedAnswers: PredefinedAnswer[] = [
  { keywords: ["how", "matching", "work", "match", "如何", "匹配", "工作"], responseKey: "matchingHow" },
  { keywords: ["perfect", "match", "完美"], responseKey: "perfectMatchDesc" },
  { keywords: ["profile", "setup", "create", "complete", "资料", "设置", "创建", "完善"], responseKey: "profileSetup" },
  { keywords: ["start", "conversation", "message", "chat", "contact", "开始", "对话", "消息", "聊天", "联系"], responseKey: "startConvoDesc" },
  { keywords: ["skill", "add", "offer", "teach", "learn", "技能", "添加", "教", "学"], responseKey: "skillManage" },
  { keywords: ["browse", "find", "search", "discover", "浏览", "找", "搜索", "发现"], responseKey: "browseDesc" },
  { keywords: ["safe", "safety", "trust", "secure", "安全", "信任"], responseKey: "safetyTips" },
  { keywords: ["free", "cost", "pay", "price", "money", "免费", "费用", "付费", "价格", "钱"], responseKey: "freeInfo" },
  { keywords: ["singapore", "location", "where", "area", "新加坡", "位置", "哪里", "地区"], responseKey: "locationInfo" },
  { keywords: ["generation", "elderly", "senior", "young", "bridge", "代际", "老年", "长者", "年轻", "桥梁"], responseKey: "generationInfo" },
  { keywords: ["hello", "hi", "hey", "good morning", "good afternoon", "good evening", "你好", "您好", "早上好", "下午好", "晚上好"], responseKey: "helloResponse" },
  { keywords: ["thank", "thanks", "appreciate", "谢谢", "感谢"], responseKey: "thanksResponse" },
  { keywords: ["help", "support", "assist", "帮助", "支持", "协助"], responseKey: "helpResponse" },
];

const AIChatbot = () => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize greeting when language changes or component mounts
  useEffect(() => {
    setMessages([{ role: "assistant", content: t.chatbot.greeting }]);
  }, [t.chatbot.greeting]);

  const quickReplies = [
    t.chatbot.quickReply1,
    t.chatbot.quickReply2,
    t.chatbot.quickReply3,
    t.chatbot.quickReply4,
  ];

  const fallbackResponses = [
    t.chatbot.fallback1,
    t.chatbot.fallback2,
    t.chatbot.fallback3,
  ];

  const findPredefinedAnswer = (inputText: string): string | null => {
    const lowerInput = inputText.toLowerCase();
    
    for (const qa of predefinedAnswers) {
      const matchCount = qa.keywords.filter(keyword => 
        lowerInput.includes(keyword.toLowerCase())
      ).length;
      
      if (matchCount > 0) {
        return (t.chatbot as Record<string, string>)[qa.responseKey] || null;
      }
    }
    
    return null;
  };

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

    setTimeout(() => {
      const answer = findPredefinedAnswer(messageText);
      const response = answer || fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
      
      setMessages(prev => [...prev, { role: "assistant", content: response }]);
    }, 500);
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
                <h3 className="font-display font-semibold">{t.chatbot.assistant}</h3>
                <p className="text-xs opacity-80">{t.chatbot.quickAnswers}</p>
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
                placeholder={t.chatbot.askQuestion}
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