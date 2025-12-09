import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import SkillCategories from "@/components/SkillCategories";
import FeaturedSkills from "@/components/FeaturedSkills";
import HowItWorks from "@/components/HowItWorks";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <SkillCategories />
        <FeaturedSkills />
        <HowItWorks />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
