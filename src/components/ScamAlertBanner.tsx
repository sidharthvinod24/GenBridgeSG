import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, X, ShieldAlert } from "lucide-react";

const SCAM_TIPS = [
  "Never share personal bank account or credit card details",
  "Be cautious of requests to pay upfront for skill sessions",
  "Don't click on suspicious links sent by others",
  "Meet in public places for in-person skill exchanges",
  "Trust your instincts - if something feels off, report it",
];

const ScamAlertBanner = () => {
  const [dismissed, setDismissed] = useState(false);
  const [expanded, setExpanded] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-3 mb-4">
      <div className="flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className="font-semibold text-amber-800 dark:text-amber-200 text-sm">
              Stay Safe from Scams
            </h4>
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 text-xs text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900"
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? "Less" : "Tips"}
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900"
                onClick={() => setDismissed(true)}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </div>
          
          {!expanded ? (
            <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
              Never share personal financial info or pay before exchanging skills.
            </p>
          ) : (
            <ul className="mt-2 space-y-1.5">
              {SCAM_TIPS.map((tip, index) => (
                <li key={index} className="text-xs text-amber-700 dark:text-amber-300 flex items-start gap-2">
                  <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                  {tip}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScamAlertBanner;
