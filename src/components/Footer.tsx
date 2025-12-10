import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-foreground text-background py-16">
      <div className="container">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img src={logo} alt="GenBridgeSG Logo" className="w-10 h-10 rounded-xl object-cover" />
              <span className="font-display font-bold text-xl">
                Gen<span className="text-primary">Bridge</span>SG
              </span>
            </Link>
            <p className="text-background/70 mb-6">{t.footer.tagline}</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-bold text-lg mb-4">{t.footer.quickLinks}</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/browse" className="text-background/70 hover:text-primary transition-colors">
                  {t.footer.browse}
                </Link>
              </li>
              <li>
                <Link to="/" className="text-background/70 hover:text-primary transition-colors">
                  {t.howItWorks.title}
                </Link>
              </li>
              <li>
                <Link to="/safety" className="text-background/70 hover:text-primary transition-colors">
                  {t.footer.safety}
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-display font-bold text-lg mb-4">{t.footer.support}</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-background/70 hover:text-primary transition-colors">
                  {t.footer.helpCenter}
                </Link>
              </li>
              <li>
                <Link to="/" className="text-background/70 hover:text-primary transition-colors">
                  {t.footer.contactUs}
                </Link>
              </li>
              <li>
                <Link to="/" className="text-background/70 hover:text-primary transition-colors">
                  {t.footer.faq}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-background/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-background/50 text-sm">© 2025 GenBridgeSG. {t.footer.rights}</p>
          <div className="flex items-center gap-6">
            <span className="text-background/50 text-sm">🇸🇬 Proudly Singaporean</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
