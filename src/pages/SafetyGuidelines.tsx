import { Shield, AlertTriangle, Users, MessageSquare, Phone, Heart, CheckCircle, XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const SafetyGuidelines = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-primary/5 to-background">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Your Safety Matters</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
              Safety Guidelines
            </h1>
            <p className="text-lg text-muted-foreground">
              At GenBridgeSG, we're committed to creating a safe and respectful environment 
              for intergenerational skill exchange. Please review these guidelines to help 
              keep our community safe.
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
                    Meeting Safely
                  </h2>
                  <p className="text-muted-foreground">
                    Tips for safe in-person skill exchange sessions
                  </p>
                </div>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">Meet in public places like community centres, libraries, or cafes for initial sessions</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">Inform a family member or friend about your meeting plans</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">Start with video calls before meeting in person</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">Trust your instincts — if something feels wrong, leave the situation</span>
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
                    Protecting Your Information
                  </h2>
                  <p className="text-muted-foreground">
                    Keep your personal details safe
                  </p>
                </div>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">Never share your NRIC, bank details, or passwords with anyone</span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">Don't share your home address until you've built trust</span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">Be cautious of requests for money or financial assistance</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">Use the in-app messaging system to communicate</span>
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
                    Recognising Scams
                  </h2>
                  <p className="text-muted-foreground">
                    Warning signs to watch out for
                  </p>
                </div>
              </div>
              <div className="bg-destructive/5 rounded-xl p-4 mb-6">
                <p className="text-sm text-foreground font-medium">
                  ⚠️ Our system automatically detects suspicious messages, but stay vigilant!
                </p>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">Requests for money, gift cards, or financial help</span>
                </li>
                <li className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">Pressure to move conversations off the platform</span>
                </li>
                <li className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">Urgent requests or threats to get you to act quickly</span>
                </li>
                <li className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">Links to unfamiliar websites or requests to download files</span>
                </li>
                <li className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">Stories that seem too good to be true</span>
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
                    Respectful Communication
                  </h2>
                  <p className="text-muted-foreground">
                    Building positive intergenerational connections
                  </p>
                </div>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Heart className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">Be patient and understanding — we all learn at different paces</span>
                </li>
                <li className="flex items-start gap-3">
                  <Heart className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">Use clear, simple language and avoid jargon when teaching</span>
                </li>
                <li className="flex items-start gap-3">
                  <Heart className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">Respect different perspectives and life experiences</span>
                </li>
                <li className="flex items-start gap-3">
                  <Heart className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">Report any inappropriate behaviour immediately</span>
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
                    Need Help?
                  </h2>
                  <p className="text-muted-foreground">
                    We're here to support you
                  </p>
                </div>
              </div>
              <p className="text-foreground mb-6">
                If you encounter any suspicious behaviour or feel unsafe, please report it immediately 
                through our in-app reporting feature or contact us directly. Your safety is our priority.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="default" asChild>
                  <Link to="/messages">Report via Messages</Link>
                </Button>
                <Button variant="outline">
                  Contact Support
                </Button>
              </div>
            </div>

            {/* Emergency Contacts */}
            <div className="bg-muted rounded-2xl p-8">
              <h3 className="font-display text-xl font-bold text-foreground mb-4">
                Singapore Emergency Contacts
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-background rounded-xl p-4">
                  <p className="font-semibold text-foreground">Police</p>
                  <p className="text-2xl font-bold text-primary">999</p>
                </div>
                <div className="bg-background rounded-xl p-4">
                  <p className="font-semibold text-foreground">Anti-Scam Helpline</p>
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