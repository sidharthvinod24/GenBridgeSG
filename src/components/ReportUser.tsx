import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
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
  const [open, setOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const wordCount = countWords(description);
  const isOverLimit = wordCount > MAX_WORDS;

  const handleSubmit = async () => {
    if (!user || !selectedUserId || !description.trim()) {
      toast.error("Please select a user and describe what happened");
      return;
    }

    if (isOverLimit) {
      toast.error(`Description must be ${MAX_WORDS} words or less`);
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

      toast.success("Report submitted successfully");
      setOpen(false);
      setSelectedUserId("");
      setDescription("");
    } catch (error: any) {
      console.error("Error submitting report:", error);
      toast.error("Failed to submit report");
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
          Report User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            Report a User
          </DialogTitle>
          <DialogDescription>
            Report inappropriate behavior or policy violations. Your report will be reviewed by our team.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="user-select">Who are you reporting?</Label>
            <Select value={selectedUserId} onValueChange={setSelectedUserId}>
              <SelectTrigger id="user-select">
                <SelectValue placeholder="Select a user" />
              </SelectTrigger>
              <SelectContent>
                {chatPartners.map((partner) => (
                  <SelectItem key={partner.user_id} value={partner.user_id}>
                    {partner.full_name || "Anonymous User"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="description">What happened?</Label>
              <span className={`text-xs ${isOverLimit ? "text-destructive font-medium" : "text-muted-foreground"}`}>
                {wordCount}/{MAX_WORDS} words
              </span>
            </div>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please describe what happened in detail..."
              className={`min-h-[150px] resize-none ${isOverLimit ? "border-destructive focus-visible:ring-destructive" : ""}`}
            />
            {isOverLimit && (
              <p className="text-xs text-destructive">
                Please shorten your description to {MAX_WORDS} words or less.
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleSubmit} 
            disabled={submitting || !selectedUserId || !description.trim() || isOverLimit}
          >
            {submitting ? "Submitting..." : "Submit Report"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReportUser;
