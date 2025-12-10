import { Card, CardContent } from "@/components/ui/card";
import { 
  Users, 
  Heart, 
  Shield, 
  Sparkles
} from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useLanguage } from "@/contexts/LanguageContext";

const WhyUseUs = () => {
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation(0.1);
  const { ref: cardsRef, isVisible: cardsVisible } = useScrollAnimation(0.1);
  const { t } = useLanguage();

  const benefits = [
    {
      icon: Users,
      title: t.whyUseUs.feature1Title,
      description: t.whyUseUs.feature1Desc,
      color: "bg-blue-50 text-blue-600 border-blue-200",
    },
    {
      icon: Heart,
      title: t.whyUseUs.feature2Title,
      description: t.whyUseUs.feature2Desc,
      color: "bg-rose-50 text-rose-600 border-rose-200",
    },
    {
      icon: Shield,
      title: t.whyUseUs.feature3Title,
      description: t.whyUseUs.feature3Desc,
      color: "bg-green-50 text-green-600 border-green-200",
    },
    {
      icon: Sparkles,
      title: t.whyUseUs.feature4Title,
      description: t.whyUseUs.feature4Desc,
      color: "bg-amber-50 text-amber-600 border-amber-200",
    },
  ];

  return (
    <section id="why-use" className="py-20 bg-muted/30">
      <div className="container">
        <div 
          ref={headerRef}
          className={`text-center mb-12 transition-all duration-700 ${
            headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t.whyUseUs.title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t.whyUseUs.subtitle}
          </p>
        </div>

        <div 
          ref={cardsRef}
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-700 delay-200 ${
            cardsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
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
