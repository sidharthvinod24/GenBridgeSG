import { Shield, AlertTriangle, Users, MessageSquare, Phone, Heart, CheckCircle, XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const SafetyGuidelines = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-primary/5 to-background">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">{t.safety.yourSafetyMatters}</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
              {t.safety.title}
            </h1>
            <p className="text-lg text-muted-foreground">
              {t.safety.intro}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container">
          <div className="max-w-4xl mx-auto space-y-12">
            
            {/* Meeting Safely */}
            <div className="bg-card rounded-2xl p-8 shadow-card">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                    {t.safety.meetingSafely}
                  </h2>
                  <p className="text-muted-foreground">
                    {t.safety.meetingSafelyDesc}
                  </p>
                </div>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">{t.safety.meetPublic}</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">{t.safety.informFamily}</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">{t.safety.startVideo}</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">{t.safety.trustInstincts}</span>
                </li>
              </ul>
            </div>

            {/* Protecting Your Information */}
            <div className="bg-card rounded-2xl p-8 shadow-card">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-secondary/50 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-secondary-foreground" />
                </div>
                <div>
                  <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                    {t.safety.protectingInfo}
                  </h2>
                  <p className="text-muted-foreground">
                    {t.safety.protectingInfoDesc}
                  </p>
                </div>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">{t.safety.neverShareNRIC}</span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">{t.safety.dontShareAddress}</span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">{t.safety.cautiousMoney}</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">{t.safety.useInApp}</span>
                </li>
              </ul>
            </div>

            {/* Recognising Scams */}
            <div className="bg-card rounded-2xl p-8 shadow-card border-2 border-destructive/20">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-6 h-6 text-destructive" />
                </div>
                <div>
                  <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                    {t.safety.recognisingScams}
                  </h2>
                  <p className="text-muted-foreground">
                    {t.safety.recognisingScamsDesc}
                  </p>
                </div>
              </div>
              <div className="bg-destructive/5 rounded-xl p-4 mb-6">
                <p className="text-sm text-foreground font-medium">
                  {t.safety.systemDetects}
                </p>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">{t.safety.moneyRequests}</span>
                </li>
                <li className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">{t.safety.offPlatform}</span>
                </li>
                <li className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">{t.safety.urgentRequests}</span>
                </li>
                <li className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">{t.safety.suspiciousLinks}</span>
                </li>
                <li className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">{t.safety.tooGoodTrue}</span>
                </li>
              </ul>
            </div>

            {/* Communication Guidelines */}
            <div className="bg-card rounded-2xl p-8 shadow-card">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-accent/50 flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-6 h-6 text-accent-foreground" />
                </div>
                <div>
                  <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                    {t.safety.respectfulComm}
                  </h2>
                  <p className="text-muted-foreground">
                    {t.safety.respectfulCommDesc}
                  </p>
                </div>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Heart className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">{t.safety.bePatient}</span>
                </li>
                <li className="flex items-start gap-3">
                  <Heart className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">{t.safety.clearLanguage}</span>
                </li>
                <li className="flex items-start gap-3">
                  <Heart className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">{t.safety.respectPerspectives}</span>
                </li>
                <li className="flex items-start gap-3">
                  <Heart className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">{t.safety.reportBehavior}</span>
                </li>
              </ul>
            </div>

            {/* Reporting Issues */}
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                    {t.safety.needHelp}
                  </h2>
                  <p className="text-muted-foreground">
                    {t.safety.hereToSupport}
                  </p>
                </div>
              </div>
              <p className="text-foreground mb-6">
                {t.safety.encounterSuspicious}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="default" asChild>
                  <Link to="/messages">{t.safety.reportViaMessages}</Link>
                </Button>
                <Button variant="outline">
                  {t.safety.contactSupport}
                </Button>
              </div>
            </div>

            {/* Emergency Contacts */}
            <div className="bg-muted rounded-2xl p-8">
              <h3 className="font-display text-xl font-bold text-foreground mb-4">
                {t.safety.emergencyContacts}
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-background rounded-xl p-4">
                  <p className="font-semibold text-foreground">{t.safety.police}</p>
                  <p className="text-2xl font-bold text-primary">999</p>
                </div>
                <div className="bg-background rounded-xl p-4">
                  <p className="font-semibold text-foreground">{t.safety.antiScamHelpline}</p>
                  <p className="text-2xl font-bold text-primary">1800-722-6688</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SafetyGuidelines;