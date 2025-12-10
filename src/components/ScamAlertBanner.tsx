import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, X, ShieldAlert } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const ScamAlertBanner = () => {
  const { t } = useLanguage();
  const [dismissed, setDismissed] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const scamTips = [
    t.scamAlert.tip1,
    t.scamAlert.tip2,
    t.scamAlert.tip3,
    t.scamAlert.tip4,
    t.scamAlert.tip5,
  ];

  if (dismissed) return null;

  return (
    <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-3 mb-4">
      <div className="flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className="font-semibold text-amber-800 dark:text-amber-200 text-sm">
              {t.scamAlert.staysSafe}
            </h4>
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 text-xs text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900"
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? t.scamAlert.less : t.scamAlert.tips}
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
              {t.scamAlert.quickTip}
            </p>
          ) : (
            <ul className="mt-2 space-y-1.5">
              {scamTips.map((tip, index) => (
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