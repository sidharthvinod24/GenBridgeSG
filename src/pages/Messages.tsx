import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Send, MessageCircle, Flag, AlertTriangle, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { validateMessage } from "@/lib/validation";
import { detectScamPatterns, ScamWarning } from "@/lib/scamDetection";
import ReportUser from "@/components/ReportUser";
import ScamAlertBanner from "@/components/ScamAlertBanner";
import MessageActions from "@/components/MessageActions";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import logo from "@/assets/logo.png";

interface Conversation {
  id: string;
  participant_one: string;
  participant_two: string;
  created_at: string;
  updated_at: string;
  otherUser: {
    user_id: string;
    full_name: string | null;
    avatar_url: string | null;
  } | null;
  lastMessage?: {
    content: string;
    created_at: string;
  };
}

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  read_at: string | null;
}

const Messages = () => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [translatedMessages, setTranslatedMessages] = useState<Record<string, string>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.id);
      markMessagesAsRead(selectedConversation.id);
      
      const channel = supabase
        .channel(`messages-${selectedConversation.id}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `conversation_id=eq.${selectedConversation.id}`
          },
          (payload) => {
            const newMsg = payload.new as Message;
            setMessages(prev => [...prev, newMsg]);
            if (newMsg.sender_id !== user?.id) {
              markMessagesAsRead(selectedConversation.id);
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [selectedConversation]);

  const markMessagesAsRead = async (conversationId: string) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from("messages")
        .update({ read_at: new Date().toISOString() })
        .eq("conversation_id", conversationId)
        .neq("sender_id", user.id)
        .is("read_at", null);
      
      if (error) {
        console.error("Error marking messages as read:", error);
      }
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchConversations = async () => {
    if (!user) return;

    try {
      const { data: convos, error } = await supabase
        .from("conversations")
        .select("*")
        .or(`participant_one.eq.${user.id},participant_two.eq.${user.id}`)
        .order("updated_at", { ascending: false });

      if (error) throw error;

      const enrichedConvos = await Promise.all(
        (convos || []).map(async (convo) => {
          const otherUserId = convo.participant_one === user.id 
            ? convo.participant_two 
            : convo.participant_one;

          const { data: profileData } = await supabase
            .rpc("get_public_profile", { target_user_id: otherUserId });
          
          const profile = profileData?.[0] ? {
            user_id: profileData[0].user_id,
            full_name: profileData[0].full_name,
            avatar_url: profileData[0].avatar_url
          } : null;

          const { data: lastMsg } = await supabase
            .from("messages")
            .select("content, created_at")
            .eq("conversation_id", convo.id)
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();

          return {
            ...convo,
            otherUser: profile,
            lastMessage: lastMsg || undefined,
          };
        })
      );

      setConversations(enrichedConvos);
    } catch (error: any) {
      console.error("Error fetching conversations:", error);
      toast.error("Failed to load conversations");
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error: any) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to load messages");
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedConversation || !newMessage.trim()) return;

    const validation = validateMessage(newMessage.trim());
    if (!validation.success) {
      const errorMessage = validation.error.errors[0]?.message || "Invalid message";
      toast.error(errorMessage);
      return;
    }

    setSending(true);
    try {
      const { error } = await supabase.from("messages").insert({
        conversation_id: selectedConversation.id,
        sender_id: user.id,
        content: validation.data.content,
      });

      if (error) throw error;
      setNewMessage("");
    } catch (error: any) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const getInitials = (name: string | null) => {
    if (!name) return "?";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return t.common.yesterday;
    } else if (days < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">{t.messages.loadingMessages}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-light/30 via-background to-secondary-light/20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="container flex items-center justify-between h-18 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/dashboard">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="GenBridgeSG Logo" className="w-10 h-10 rounded-xl object-cover" />
              <span className="font-display font-bold text-xl text-foreground">
                {t.messages.title}
              </span>
            </Link>
          </div>
          
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ReportUser
              chatPartners={conversations.map(c => ({
                user_id: c.otherUser?.user_id || "",
                full_name: c.otherUser?.full_name || null
              })).filter(p => p.user_id)}
            />
          </div>
        </div>
      </header>

      <main className="container py-6">
        <div className="grid md:grid-cols-3 gap-6 h-[calc(100vh-140px)]">
          {/* Conversations List */}
          <Card className="md:col-span-1 overflow-hidden">
            <CardHeader className="border-b">
              <CardTitle className="font-display text-lg flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-primary" />
                {t.messages.conversations}
              </CardTitle>
            </CardHeader>
            <ScrollArea className="h-[calc(100%-70px)]">
              <CardContent className="p-2">
                {conversations.length === 0 ? (
                  <div className="text-center py-8 px-4">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                      <MessageCircle className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{t.messages.noConversations}</h3>
                    <p className="text-muted-foreground text-sm">
                      {t.messages.startConversation}
                    </p>
                    <Button variant="hero" className="mt-4" asChild>
                      <Link to="/dashboard">{t.messages.findMatches}</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {conversations.map((convo) => (
                      <button
                        key={convo.id}
                        onClick={() => setSelectedConversation(convo)}
                        className={`w-full p-3 rounded-lg text-left transition-colors ${
                          selectedConversation?.id === convo.id
                            ? "bg-primary-light border border-primary/20"
                            : "hover:bg-muted"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10 border-2 border-primary/20">
                            <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-primary-foreground text-sm font-bold">
                              {getInitials(convo.otherUser?.full_name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="font-medium truncate">
                                {convo.otherUser?.full_name || t.common.anonymous}
                              </p>
                              {convo.lastMessage && (
                                <span className="text-xs text-muted-foreground">
                                  {formatTime(convo.lastMessage.created_at)}
                                </span>
                              )}
                            </div>
                            {convo.lastMessage && (
                              <p className="text-sm text-muted-foreground truncate">
                                {convo.lastMessage.content}
                              </p>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </ScrollArea>
          </Card>

          {/* Chat Area */}
          <Card className="md:col-span-2 flex flex-col overflow-hidden">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <CardHeader className="border-b py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10 border-2 border-primary/20">
                        <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-primary-foreground text-sm font-bold">
                          {getInitials(selectedConversation.otherUser?.full_name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-display font-bold">
                          {selectedConversation.otherUser?.full_name || t.common.anonymous}
                        </h3>
                        <p className="text-xs text-muted-foreground">{t.messages.skillExchangePartner}</p>
                      </div>
                    </div>
                    
                    {selectedConversation.otherUser?.user_id && (
                      <ReportUser 
                        chatPartners={[{
                          user_id: selectedConversation.otherUser.user_id,
                          full_name: selectedConversation.otherUser.full_name
                        }]}
                      />
                    )}
                  </div>
                </CardHeader>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    <ScamAlertBanner />
                    
                    {messages.map((message) => {
                      const isMe = message.sender_id === user?.id;
                      const scamWarning: ScamWarning = !isMe ? detectScamPatterns(message.content) : { isScammy: false, severity: 'low', reasons: [] };
                      
                      return (
                        <div key={message.id}>
                          <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                            <div className="flex flex-col max-w-[70%]">
                              <div
                                className={`rounded-2xl px-4 py-2 ${
                                  isMe
                                    ? "bg-primary text-primary-foreground rounded-br-md"
                                    : scamWarning.isScammy
                                      ? "bg-amber-100 dark:bg-amber-900/50 border border-amber-300 dark:border-amber-700 rounded-bl-md"
                                      : "bg-muted rounded-bl-md"
                                }`}
                              >
                                <p className="text-sm whitespace-pre-wrap break-words">
                                  {translatedMessages[message.id] || message.content}
                                </p>
                                <p className={`text-xs mt-1 ${isMe ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                                  {formatTime(message.created_at)}
                                </p>
                              </div>
                              <MessageActions
                                content={message.content}
                                onTranslate={(text) => 
                                  setTranslatedMessages(prev => ({ ...prev, [message.id]: text }))
                                }
                              />
                            </div>
                          </div>
                          
                          {scamWarning.isScammy && (
                            <div className={`flex justify-start mt-2 ml-2`}>
                              <div className={`flex items-start gap-2 p-2 rounded-lg text-xs max-w-[70%] ${
                                scamWarning.severity === 'high' 
                                  ? 'bg-destructive/10 text-destructive border border-destructive/20' 
                                  : scamWarning.severity === 'medium'
                                    ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-800'
                                    : 'bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-300'
                              }`}>
                                <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                <div>
                                  <p className="font-semibold">
                                    {scamWarning.severity === 'high' ? `⚠️ ${t.messages.scamWarning}` : t.messages.scamWarning}
                                  </p>
                                  <ul className="mt-1 space-y-0.5">
                                    {scamWarning.reasons.map((reason, idx) => (
                                      <li key={idx}>• {reason}</li>
                                    ))}
                                  </ul>
                                  <p className="mt-1 opacity-80">{t.messages.neverShare}</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* Message Input */}
                <form onSubmit={sendMessage} className="border-t p-4">
                  <div className="flex gap-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder={t.messages.typeMessage}
                      className="flex-1 h-12"
                      disabled={sending}
                    />
                    <Button type="submit" variant="hero" size="icon" disabled={sending || !newMessage.trim()}>
                      <Send className="w-5 h-5" />
                    </Button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                    <MessageCircle className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <h3 className="font-display font-bold text-xl mb-2">{t.messages.conversations}</h3>
                  <p className="text-muted-foreground">
                    {t.messages.startConversation}
                  </p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Messages;
