import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Heart } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <div className="container">
        <div className="max-w-4xl mx-auto text-center stagger-children">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-light border border-primary/20 mb-8">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">
              Singapore's Skill Exchange Community
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight mb-6">
            Share Your Skills,{" "}
            <span className="text-gradient-hero">Grow Together</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Connect with neighbours across generations. Teach what you know, 
            learn what you love — no money needed, just skills and community spirit.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button variant="hero" size="xl" className="w-full sm:w-auto pulse-soft">
              Start Swapping Skills
              <ArrowRight className="ml-2" />
            </Button>
            <Button variant="outline" size="xl" className="w-full sm:w-auto">
              Browse Available Skills
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-12 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Users className="w-6 h-6 text-primary" />
                <span className="font-display text-3xl md:text-4xl font-bold text-foreground">
                  2,500+
                </span>
              </div>
              <p className="text-muted-foreground text-sm md:text-base">Active Members</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="font-display text-3xl md:text-4xl font-bold text-foreground">
                  150+
                </span>
              </div>
              <p className="text-muted-foreground text-sm md:text-base">Skills Available</p>
            </div>
            <div className="text-center col-span-2 md:col-span-1">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Heart className="w-6 h-6 text-secondary" />
                <span className="font-display text-3xl md:text-4xl font-bold text-foreground">
                  5,000+
                </span>
              </div>
              <p className="text-muted-foreground text-sm md:text-base">Successful Swaps</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
