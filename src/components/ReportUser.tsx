import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Flag, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface ChatPartner {
  user_id: string;
  full_name: string | null;
}

interface ReportUserProps {
  chatPartners: ChatPartner[];
}

const MAX_WORDS = 200;

const countWords = (text: string): number => {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
};

const ReportUser = ({ chatPartners }: ReportUserProps) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const wordCount = countWords(description);
  const isOverLimit = wordCount > MAX_WORDS;

  const handleSubmit = async () => {
    if (!user || !selectedUserId || !description.trim()) {
      toast.error(t.report.selectAndDescribe);
      return;
    }

    if (isOverLimit) {
      toast.error(`${t.report.shortenDesc} ${MAX_WORDS} ${t.report.wordsOrLess}`);
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from("reports").insert({
        reporter_id: user.id,
        reported_user_id: selectedUserId,
        description: description.trim(),
      });

      if (error) throw error;

      toast.success(t.report.reportSuccess);
      setOpen(false);
      setSelectedUserId("");
      setDescription("");
    } catch (error: any) {
      console.error("Error submitting report:", error);
      toast.error(t.report.reportFailed);
    } finally {
      setSubmitting(false);
    }
  };

  if (chatPartners.length === 0) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive">
          <Flag className="w-4 h-4 mr-2" />
          {t.report.reportUser}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            {t.report.reportAUser}
          </DialogTitle>
          <DialogDescription>
            {t.report.reportDesc}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="user-select">{t.report.whoReporting}</Label>
            <Select value={selectedUserId} onValueChange={setSelectedUserId}>
              <SelectTrigger id="user-select">
                <SelectValue placeholder={t.report.selectUser} />
              </SelectTrigger>
              <SelectContent>
                {chatPartners.map((partner) => (
                  <SelectItem key={partner.user_id} value={partner.user_id}>
                    {partner.full_name || t.report.anonymousUser}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="description">{t.report.whatHappened}</Label>
              <span className={`text-xs ${isOverLimit ? "text-destructive font-medium" : "text-muted-foreground"}`}>
                {wordCount}/{MAX_WORDS} {t.report.words}
              </span>
            </div>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t.report.descPlaceholder}
              className={`min-h-[150px] resize-none ${isOverLimit ? "border-destructive focus-visible:ring-destructive" : ""}`}
            />
            {isOverLimit && (
              <p className="text-xs text-destructive">
                {t.report.shortenDesc} {MAX_WORDS} {t.report.wordsOrLess}
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={submitting}>
            {t.report.cancel}
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleSubmit} 
            disabled={submitting || !selectedUserId || !description.trim() || isOverLimit}
          >
            {submitting ? t.report.submitting : t.report.submitReport}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReportUser;