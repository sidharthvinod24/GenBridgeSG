import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useLanguage } from "@/contexts/LanguageContext";
import ctaBackground from "@/assets/cta-background.jpg";

const CTASection = () => {
  const { ref, isVisible } = useScrollAnimation(0.1);
  const { t } = useLanguage();

  return (
    <section className="py-20">
      <div className="container">
        <div 
          ref={ref}
          className={`relative overflow-hidden rounded-3xl p-8 md:p-16 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{
            backgroundImage: `url(${ctaBackground})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/60 via-primary/50 to-secondary/60" />
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary-foreground/10 rounded-full blur-2xl" />
          
          {/* Floating hearts */}
          <div className="absolute top-10 left-10 opacity-20">
            <Heart className="w-12 h-12 text-primary-foreground float" />
          </div>
          <div className="absolute bottom-10 right-10 opacity-20">
            <Heart className="w-8 h-8 text-primary-foreground float" style={{ animationDelay: '1s' }} />
          </div>
          
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 border border-primary-foreground/20 mb-6">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-primary-foreground">
                {t.cta.button}
              </span>
            </div>

            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6 leading-tight">
              {t.cta.title}
            </h2>
            
            <p className="text-lg md:text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto">
              {t.cta.subtitle}
            </p>

            <Button 
              variant="accent" 
              size="xl" 
              className="w-full sm:w-auto text-base sm:text-lg md:text-xl"
              asChild
            >
              <Link to="/auth">
                {t.cta.button}
                <ArrowRight className="ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
