import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type Language = "en" | "zh";

interface LanguageSwitcherProps {
  className?: string;
}

const LanguageSwitcher = ({ className }: LanguageSwitcherProps) => {
  const [currentLang, setCurrentLang] = useState<Language>(() => {
    return (localStorage.getItem("app-language") as Language) || "en";
  });

  useEffect(() => {
    localStorage.setItem("app-language", currentLang);
    document.documentElement.lang = currentLang === "zh" ? "zh-CN" : "en";
  }, [currentLang]);

  const languages = [
    { code: "en" as Language, label: "English", flag: "🇬🇧" },
    { code: "zh" as Language, label: "中文", flag: "🇨🇳" },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className={className}>
          <Globe className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setCurrentLang(lang.code)}
            className={currentLang === lang.code ? "bg-primary/10" : ""}
          >
            <span className="mr-2">{lang.flag}</span>
            {lang.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
