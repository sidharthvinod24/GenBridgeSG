import { Card, CardContent } from "@/components/ui/card";
import { UserPlus, Search, MessageCircle, Handshake } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    step: "1",
    title: "Create Your Profile",
    description: "Share your skills and what you want to learn.",
  },
  {
    icon: Search,
    step: "2",
    title: "Find Your Match",
    description: "Get matched with compatible community members.",
  },
  {
    icon: MessageCircle,
    step: "3",
    title: "Connect & Arrange",
    description: "Chat and set up a time to meet.",
  },
  {
    icon: Handshake,
    step: "4",
    title: "Swap & Grow",
    description: "Exchange skills and build connections.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 bg-gradient-to-b from-background to-primary-light/30">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            How GenBridgeSG Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Four simple steps to start exchanging skills with your community.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {steps.map((step, index) => (
            <div key={step.step} className="relative">
              {/* Connector line (hidden on mobile and last item) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary/30 to-transparent" />
              )}
              
              <Card className="relative bg-card border-2 border-transparent hover:border-primary/20 transition-all duration-300">
                <CardContent className="pt-8 pb-6 px-6 text-center">
                  {/* Step number */}
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-display font-bold text-lg shadow-elevated">
                    {step.step}
                  </div>

                  {/* Icon */}
                  <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-primary-light flex items-center justify-center">
                    <step.icon className="w-8 h-8 text-primary" />
                  </div>

                  {/* Content */}
                  <h3 className="font-display font-bold text-xl text-foreground mb-3">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
