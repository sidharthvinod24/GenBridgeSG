import { Card, CardContent } from "@/components/ui/card";
import { 
  Users, 
  Heart, 
  Shield, 
  Sparkles
} from "lucide-react";

const benefits = [
  {
    icon: Users,
    title: "Bridge Generations",
    description: "Connect young adults with seniors to share knowledge and build meaningful relationships across age groups.",
    color: "bg-blue-50 text-blue-600 border-blue-200",
  },
  {
    icon: Heart,
    title: "Community First",
    description: "Join a supportive community where everyone has something valuable to teach and learn.",
    color: "bg-rose-50 text-rose-600 border-rose-200",
  },
  {
    icon: Shield,
    title: "Safe & Trusted",
    description: "Verified profiles and a respectful environment ensure positive experiences for all users.",
    color: "bg-green-50 text-green-600 border-green-200",
  },
  {
    icon: Sparkles,
    title: "Free to Use",
    description: "No fees or subscriptions — just genuine skill exchange between community members.",
    color: "bg-amber-50 text-amber-600 border-amber-200",
  },
];

const WhyUseUs = () => {
  return (
    <section id="why-use" className="py-20 bg-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Why Use GenBridgeSG?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            More than just skill swapping — we're building bridges between generations 
            and strengthening our community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit) => (
            <Card 
              key={benefit.title} 
              hoverable
              className="group"
            >
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 border ${benefit.color} transition-transform group-hover:scale-110`}>
                  <benefit.icon className="w-7 h-7" />
                </div>
                <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                  {benefit.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {benefit.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUseUs;
