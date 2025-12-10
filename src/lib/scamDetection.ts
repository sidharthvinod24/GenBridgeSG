// Common scam patterns to detect in messages
const SCAM_PATTERNS = [
  // Financial requests
  /\b(bank\s*account|credit\s*card|debit\s*card|account\s*number|routing\s*number)\b/i,
  /\b(paypal|venmo|zelle|wire\s*transfer|western\s*union|moneygram)\b/i,
  /\b(send\s*me\s*money|pay\s*me\s*first|upfront\s*payment|advance\s*fee)\b/i,
  
  // Personal information requests
  /\b(social\s*security|nric|ic\s*number|passport\s*number|singpass)\b/i,
  /\b(mother('s)?\s*maiden|password|pin\s*number|otp|verification\s*code)\b/i,
  
  // Suspicious offers
  /\b(lottery|won\s*a\s*prize|inheritance|million\s*dollars|get\s*rich\s*quick)\b/i,
  /\b(investment\s*opportunity|guaranteed\s*returns|crypto\s*trading)\b/i,
  
  // Urgency tactics
  /\b(urgent|act\s*now|limited\s*time|expires\s*today|don't\s*miss)\b/i,
  
  // External links (suspicious)
  /\b(click\s*(this|here|the)\s*link|bit\.ly|tinyurl|goo\.gl)\b/i,
  
  // Requesting to move off platform
  /\b(whatsapp|telegram|wechat|private\s*email|contact\s*me\s*at)\b/i,
];

export interface ScamWarning {
  isScammy: boolean;
  severity: 'low' | 'medium' | 'high';
  reasons: string[];
}

export const detectScamPatterns = (message: string): ScamWarning => {
  const reasons: string[] = [];
  
  SCAM_PATTERNS.forEach((pattern) => {
    if (pattern.test(message)) {
      const match = message.match(pattern)?.[0];
      if (match) {
        // Categorize the match
        if (/bank|card|account|paypal|venmo|money/i.test(match)) {
          reasons.push("Contains financial/payment requests");
        } else if (/security|nric|passport|password|pin|otp/i.test(match)) {
          reasons.push("Requests sensitive personal information");
        } else if (/lottery|prize|inheritance|rich|investment/i.test(match)) {
          reasons.push("Contains suspicious offers");
        } else if (/urgent|act now|limited|expires/i.test(match)) {
          reasons.push("Uses urgency tactics");
        } else if (/click|bit\.ly|tinyurl/i.test(match)) {
          reasons.push("Contains suspicious links");
        } else if (/whatsapp|telegram|wechat|private/i.test(match)) {
          reasons.push("Attempts to move conversation off-platform");
        }
      }
    }
  });
  
  // Remove duplicates
  const uniqueReasons = [...new Set(reasons)];
  
  const severity = uniqueReasons.length >= 3 ? 'high' : uniqueReasons.length >= 2 ? 'medium' : 'low';
  
  return {
    isScammy: uniqueReasons.length > 0,
    severity,
    reasons: uniqueReasons,
  };
};
