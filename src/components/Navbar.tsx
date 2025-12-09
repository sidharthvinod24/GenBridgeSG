import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Heart } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <nav className="container flex items-center justify-between h-18 py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-md">
            <Heart className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-xl text-foreground">
            Gen<span className="text-primary">Bridge</span>SG
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link 
            to="/browse" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Browse Skills
          </Link>
          <button 
            onClick={() => scrollToSection("how-it-works")}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            How It Works
          </button>
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <Button variant="hero" size="default" asChild>
              <Link to="/dashboard">My Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button variant="ghost" size="default" asChild>
                <Link to="/auth">Sign In</Link>
              </Button>
              <Button variant="hero" size="default" asChild>
                <Link to="/auth">Get Started</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-foreground"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-background border-b border-border animate-slide-down">
          <div className="container py-6 flex flex-col gap-4">
            <Link 
              to="/browse" 
              className="text-lg font-medium text-foreground py-3 border-b border-border"
              onClick={() => setIsOpen(false)}
            >
              Browse Skills
            </Link>
            <button 
              onClick={() => scrollToSection("how-it-works")}
              className="text-lg font-medium text-foreground py-3 border-b border-border text-left"
            >
              How It Works
            </button>
            <div className="flex flex-col gap-3 pt-4">
              {user ? (
                <Button variant="hero" size="lg" className="w-full" asChild>
                  <Link to="/dashboard" onClick={() => setIsOpen(false)}>My Dashboard</Link>
                </Button>
              ) : (
                <>
                  <Button variant="outline" size="lg" className="w-full" asChild>
                    <Link to="/auth" onClick={() => setIsOpen(false)}>Sign In</Link>
                  </Button>
                  <Button variant="hero" size="lg" className="w-full" asChild>
                    <Link to="/auth" onClick={() => setIsOpen(false)}>Get Started</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;