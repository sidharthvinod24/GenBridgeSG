import { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useAdminRole } from "@/hooks/useAdminRole";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { 
  Heart, 
  ArrowLeft, 
  Shield, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle,
  Clock,
  User,
  Flag,
  Ban,
  MinusCircle
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface Report {
  id: string;
  reporter_id: string;
  reported_user_id: string;
  description: string;
  status: string;
  action_taken: string | null;
  created_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
  reporter_profile?: {
    full_name: string | null;
  };
  reported_profile?: {
    full_name: string | null;
    credibility_score: number | null;
  };
}

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  reviewing: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  resolved: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  dismissed: "bg-muted text-muted-foreground",
};

const STATUS_ICONS: Record<string, React.ReactNode> = {
  pending: <Clock className="w-3 h-3" />,
  reviewing: <AlertTriangle className="w-3 h-3" />,
  resolved: <CheckCircle2 className="w-3 h-3" />,
  dismissed: <XCircle className="w-3 h-3" />,
};

const AdminModeration = () => {
  const { user } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdminRole();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionNote, setActionNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      fetchReports();
    }
  }, [isAdmin]);

  const fetchReports = async () => {
    try {
      const { data, error } = await supabase
        .from("reports")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Fetch reporter and reported user profiles
      const enrichedReports = await Promise.all(
        (data || []).map(async (report) => {
          const [reporterResult, reportedResult] = await Promise.all([
            supabase.from("profiles").select("full_name").eq("user_id", report.reporter_id).maybeSingle(),
            supabase.from("profiles").select("full_name, credibility_score").eq("user_id", report.reported_user_id).maybeSingle(),
          ]);

          return {
            ...report,
            reporter_profile: reporterResult.data || undefined,
            reported_profile: reportedResult.data || undefined,
          };
        })
      );

      setReports(enrichedReports);
    } catch (error) {
      console.error("Error fetching reports:", error);
      toast.error("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (reportId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("reports")
        .update({ 
          status: newStatus,
          reviewed_at: new Date().toISOString(),
          reviewed_by: user?.id 
        })
        .eq("id", reportId);

      if (error) throw error;

      setReports(prev => prev.map(r => 
        r.id === reportId ? { ...r, status: newStatus, reviewed_at: new Date().toISOString() } : r
      ));
      toast.success(`Report marked as ${newStatus}`);
    } catch (error) {
      console.error("Error updating report:", error);
      toast.error("Failed to update report");
    }
  };

  const handleTakeAction = async (action: "warn" | "reduce_score" | "ban") => {
    if (!selectedReport) return;

    setSubmitting(true);
    try {
      let actionDescription = "";

      if (action === "reduce_score") {
        // Reduce credibility score by 20 points
        const currentScore = selectedReport.reported_profile?.credibility_score || 100;
        const newScore = Math.max(0, currentScore - 20);
        
        const { error } = await supabase
          .from("profiles")
          .update({ credibility_score: newScore })
          .eq("user_id", selectedReport.reported_user_id);

        if (error) throw error;
        actionDescription = `Credibility score reduced from ${currentScore} to ${newScore}`;
      } else if (action === "warn") {
        actionDescription = "Warning issued to user";
      } else if (action === "ban") {
        // Set credibility score to 0 (effectively banning from matching)
        const { error } = await supabase
          .from("profiles")
          .update({ credibility_score: 0 })
          .eq("user_id", selectedReport.reported_user_id);

        if (error) throw error;
        actionDescription = "User banned (credibility score set to 0)";
      }

      // Update the report with action taken
      const fullAction = actionNote ? `${actionDescription}. Note: ${actionNote}` : actionDescription;
      
      const { error: reportError } = await supabase
        .from("reports")
        .update({ 
          status: "resolved",
          action_taken: fullAction,
          reviewed_at: new Date().toISOString(),
          reviewed_by: user?.id 
        })
        .eq("id", selectedReport.id);

      if (reportError) throw reportError;

      toast.success("Action taken successfully");
      setActionDialogOpen(false);
      setSelectedReport(null);
      setActionNote("");
      fetchReports();
    } catch (error) {
      console.error("Error taking action:", error);
      toast.error("Failed to take action");
    } finally {
      setSubmitting(false);
    }
  };

  const getInitials = (name: string | null) => {
    if (!name) return "?";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredReports = statusFilter === "all" 
    ? reports 
    : reports.filter(r => r.status === statusFilter);

  // Loading state
  if (adminLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect if not admin
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
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
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-destructive to-amber-500 flex items-center justify-center shadow-md">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-xl text-foreground">
                Admin Moderation
              </span>
            </div>
          </div>
          <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
            <Shield className="w-3 h-3 mr-1" />
            Admin Access
          </Badge>
        </div>
      </header>

      <main className="container py-6 md:py-8 max-w-4xl">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Pending", count: reports.filter(r => r.status === "pending").length, color: "text-amber-600" },
            { label: "Reviewing", count: reports.filter(r => r.status === "reviewing").length, color: "text-blue-600" },
            { label: "Resolved", count: reports.filter(r => r.status === "resolved").length, color: "text-green-600" },
            { label: "Dismissed", count: reports.filter(r => r.status === "dismissed").length, color: "text-muted-foreground" },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardContent className="pt-4 pb-3 text-center">
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.count}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filter */}
        <div className="flex items-center gap-4 mb-6">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Reports</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="reviewing">Reviewing</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="dismissed">Dismissed</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">
            Showing {filteredReports.length} report{filteredReports.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Reports List */}
        {filteredReports.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Flag className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-display font-bold text-xl mb-2">No reports found</h3>
              <p className="text-muted-foreground">
                {statusFilter === "all" ? "No reports have been submitted yet." : `No ${statusFilter} reports.`}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredReports.map((report) => (
              <Card key={report.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Badge className={STATUS_COLORS[report.status]}>
                        {STATUS_ICONS[report.status]}
                        <span className="ml-1 capitalize">{report.status}</span>
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(report.created_at)}
                      </span>
                    </div>
                    
                    {report.status === "pending" || report.status === "reviewing" ? (
                      <div className="flex gap-2">
                        <Select 
                          value={report.status}
                          onValueChange={(value) => handleUpdateStatus(report.id, value)}
                        >
                          <SelectTrigger className="w-32 h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="reviewing">Reviewing</SelectItem>
                            <SelectItem value="dismissed">Dismiss</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => { setSelectedReport(report); setActionDialogOpen(true); }}
                        >
                          Take Action
                        </Button>
                      </div>
                    ) : null}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Users involved */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-primary/20 text-primary text-sm">
                          {getInitials(report.reporter_profile?.full_name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-xs text-muted-foreground">Reporter</p>
                        <p className="font-medium">{report.reporter_profile?.full_name || "Unknown"}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-destructive/5 rounded-lg border border-destructive/10">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-destructive/20 text-destructive text-sm">
                          {getInitials(report.reported_profile?.full_name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground">Reported User</p>
                        <p className="font-medium">{report.reported_profile?.full_name || "Unknown"}</p>
                      </div>
                      {report.reported_profile?.credibility_score !== null && (
                        <Badge variant="outline" className="text-xs">
                          Score: {report.reported_profile?.credibility_score}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <p className="text-sm font-medium mb-1">Report Description</p>
                    <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
                      {report.description}
                    </p>
                  </div>

                  {/* Action taken */}
                  {report.action_taken && (
                    <div className="border-t pt-3">
                      <p className="text-sm font-medium mb-1 text-green-700 dark:text-green-400 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        Action Taken
                      </p>
                      <p className="text-sm text-muted-foreground">{report.action_taken}</p>
                      {report.reviewed_at && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Reviewed on {formatDate(report.reviewed_at)}
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Action Dialog */}
      <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              Take Action on Report
            </DialogTitle>
            <DialogDescription>
              Choose an action to take against {selectedReport?.reported_profile?.full_name || "this user"}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Add a note (optional)</label>
              <Textarea
                value={actionNote}
                onChange={(e) => setActionNote(e.target.value)}
                placeholder="Add any notes about this action..."
                className="resize-none"
              />
            </div>

            <div className="grid gap-3">
              <Button 
                variant="outline" 
                className="justify-start h-auto p-4"
                onClick={() => handleTakeAction("warn")}
                disabled={submitting}
              >
                <AlertTriangle className="w-5 h-5 mr-3 text-amber-600" />
                <div className="text-left">
                  <p className="font-medium">Issue Warning</p>
                  <p className="text-xs text-muted-foreground">Mark as resolved without score penalty</p>
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                className="justify-start h-auto p-4 border-amber-200 hover:bg-amber-50"
                onClick={() => handleTakeAction("reduce_score")}
                disabled={submitting}
              >
                <MinusCircle className="w-5 h-5 mr-3 text-amber-600" />
                <div className="text-left">
                  <p className="font-medium">Reduce Credibility Score</p>
                  <p className="text-xs text-muted-foreground">Reduce score by 20 points</p>
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                className="justify-start h-auto p-4 border-destructive/30 hover:bg-destructive/5"
                onClick={() => handleTakeAction("ban")}
                disabled={submitting}
              >
                <Ban className="w-5 h-5 mr-3 text-destructive" />
                <div className="text-left">
                  <p className="font-medium text-destructive">Ban User</p>
                  <p className="text-xs text-muted-foreground">Set credibility score to 0 (cannot match)</p>
                </div>
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setActionDialogOpen(false)} disabled={submitting}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminModeration;
