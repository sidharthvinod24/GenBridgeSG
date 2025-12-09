import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";

const SKILL_OPTIONS = [
  // Technology
  "Web Development", "Mobile App Development", "Python Programming", "JavaScript", "Data Analysis",
  "Machine Learning", "Graphic Design", "UI/UX Design", "Video Editing", "Photography",
  "3D Modeling", "Game Development", "Cybersecurity", "Cloud Computing", "Database Management",
  
  // Languages
  "English", "Mandarin Chinese", "Malay", "Tamil", "Japanese", "Korean", "French", "Spanish", "German",
  
  // Music & Arts
  "Piano", "Guitar", "Violin", "Drums", "Singing", "Music Production", "Drawing", "Painting",
  "Calligraphy", "Pottery", "Sculpture", "Dance", "Ballet", "Hip Hop Dance",
  
  // Cooking & Food
  "Cooking", "Baking", "Chinese Cuisine", "Western Cuisine", "Indian Cuisine", "Malay Cuisine",
  "Pastry Making", "Coffee Brewing", "Wine Tasting", "Meal Prep",
  
  // Sports & Fitness
  "Swimming", "Tennis", "Badminton", "Basketball", "Football", "Yoga", "Pilates", "Running",
  "Cycling", "Golf", "Martial Arts", "Boxing", "Weight Training",
  
  // Life Skills
  "Financial Planning", "Public Speaking", "Writing", "Resume Writing", "Interview Skills",
  "Time Management", "Project Management", "Leadership", "Negotiation", "Networking",
  
  // Crafts & DIY
  "Sewing", "Knitting", "Woodworking", "Home Repair", "Gardening", "Interior Design",
  "Flower Arrangement", "Jewelry Making", "Origami",
  
  // Traditional Skills
  "Traditional Chinese Medicine", "Acupuncture", "Massage Therapy", "Feng Shui",
  "Meditation", "Tai Chi", "Qigong",
  
  // Academic
  "Mathematics", "Physics", "Chemistry", "Biology", "History", "Economics", "Accounting",
];

interface SkillSelectProps {
  value: string;
  onChange: (value: string) => void;
  onAdd: () => void;
  placeholder?: string;
  existingSkills?: string[];
}

const SkillSelect = ({ 
  value, 
  onChange, 
  onAdd, 
  placeholder = "Search or type a skill...",
  existingSkills = []
}: SkillSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (value.trim()) {
      const filtered = SKILL_OPTIONS.filter(
        skill => 
          skill.toLowerCase().includes(value.toLowerCase()) &&
          !existingSkills.includes(skill)
      ).slice(0, 8);
      setFilteredOptions(filtered);
    } else {
      setFilteredOptions(
        SKILL_OPTIONS.filter(skill => !existingSkills.includes(skill)).slice(0, 8)
      );
    }
  }, [value, existingSkills]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (skill: string) => {
    onChange(skill);
    setIsOpen(false);
    setTimeout(() => onAdd(), 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (value.trim()) {
        onAdd();
        setIsOpen(false);
      }
    }
  };

  const showCustomOption = value.trim() && 
    !SKILL_OPTIONS.some(s => s.toLowerCase() === value.toLowerCase()) &&
    !existingSkills.includes(value.trim());

  return (
    <div ref={containerRef} className="relative flex gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <Input
          ref={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="h-12 pl-10 pr-10"
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronDown className={cn("w-4 h-4 transition-transform", isOpen && "rotate-180")} />
        </button>

        {isOpen && (filteredOptions.length > 0 || showCustomOption) && (
          <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-lg max-h-[240px] overflow-y-auto">
            {showCustomOption && (
              <button
                type="button"
                onClick={() => handleSelect(value.trim())}
                className="w-full px-4 py-3 text-left hover:bg-accent flex items-center gap-2 text-sm border-b border-border"
              >
                <Plus className="w-4 h-4 text-primary" />
                <span>Add "{value.trim()}"</span>
              </button>
            )}
            {filteredOptions.map((skill) => (
              <button
                key={skill}
                type="button"
                onClick={() => handleSelect(skill)}
                className="w-full px-4 py-3 text-left hover:bg-accent text-sm transition-colors"
              >
                {skill}
              </button>
            ))}
          </div>
        )}
      </div>
      <Button type="button" variant="outline" onClick={onAdd} className="h-12">
        <Plus className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default SkillSelect;
