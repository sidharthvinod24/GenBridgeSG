import { Card, CardContent } from "@/components/ui/card";
import { 
  Laptop, 
  Utensils, 
  Music, 
  Palette, 
  Dumbbell, 
  BookOpen,
  Camera,
  Wrench
} from "lucide-react";

const categories = [
  {
    icon: Laptop,
    name: "Technology",
    count: 45,
    color: "bg-blue-50 text-blue-600 border-blue-200",
  },
  {
    icon: Utensils,
    name: "Cooking",
    count: 32,
    color: "bg-orange-50 text-orange-600 border-orange-200",
  },
  {
    icon: Music,
    name: "Music",
    count: 28,
    color: "bg-purple-50 text-purple-600 border-purple-200",
  },
  {
    icon: Palette,
    name: "Arts & Crafts",
    count: 24,
    color: "bg-pink-50 text-pink-600 border-pink-200",
  },
  {
    icon: Dumbbell,
    name: "Fitness",
    count: 19,
    color: "bg-green-50 text-green-600 border-green-200",
  },
  {
    icon: BookOpen,
    name: "Languages",
    count: 35,
    color: "bg-yellow-50 text-yellow-700 border-yellow-200",
  },
  {
    icon: Camera,
    name: "Photography",
    count: 15,
    color: "bg-indigo-50 text-indigo-600 border-indigo-200",
  },
  {
    icon: Wrench,
    name: "DIY & Repairs",
    count: 22,
    color: "bg-red-50 text-red-600 border-red-200",
  },
];

const SkillCategories = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Explore Skill Categories
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From traditional crafts to modern tech — find skills that match your 
            interests or share your expertise with the community.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category) => (
            <Card 
              key={category.name} 
              hoverable
              className="group"
            >
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 border ${category.color} transition-transform group-hover:scale-110`}>
                  <category.icon className="w-7 h-7" />
                </div>
                <h3 className="font-display font-semibold text-lg text-foreground mb-1">
                  {category.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {category.count} skills
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillCategories;
