import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Star, ArrowRight } from "lucide-react";

const featuredSkills = [
  {
    id: 1,
    title: "Home-cooked Peranakan Dishes",
    provider: "Auntie Mei Lin",
    age: "68",
    location: "Tiong Bahru",
    category: "Cooking",
    seeking: "Help with smartphone & apps",
    rating: 4.9,
    reviews: 23,
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=300&fit=crop",
  },
  {
    id: 2,
    title: "Basic Coding & Web Design",
    provider: "Marcus Tan",
    age: "24",
    location: "Jurong East",
    category: "Technology",
    seeking: "Learn traditional calligraphy",
    rating: 4.8,
    reviews: 15,
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop",
  },
  {
    id: 3,
    title: "Traditional Chinese Painting",
    provider: "Mr. Wong Wei",
    age: "72",
    location: "Toa Payoh",
    category: "Arts & Crafts",
    seeking: "Video calling with family overseas",
    rating: 5.0,
    reviews: 31,
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=300&fit=crop",
  },
  {
    id: 4,
    title: "Guitar Lessons for Beginners",
    provider: "Sarah Lim",
    age: "28",
    location: "Tampines",
    category: "Music",
    seeking: "Home gardening tips",
    rating: 4.7,
    reviews: 18,
    image: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400&h=300&fit=crop",
  },
];

const FeaturedSkills = () => {
  return (
    <section className="py-20">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Featured Skill Swaps
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Discover what your neighbours are offering and find your perfect skill exchange match.
            </p>
          </div>
          <Button variant="outline" className="self-start md:self-auto">
            View All Skills
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredSkills.map((skill) => (
            <Card key={skill.id} hoverable className="overflow-hidden">
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={skill.image}
                  alt={skill.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <Badge 
                  className="absolute top-3 left-3 bg-background/90 text-foreground border-0"
                >
                  {skill.category}
                </Badge>
              </div>

              <CardHeader className="pb-2">
                <h3 className="font-display font-bold text-lg text-foreground line-clamp-2">
                  {skill.title}
                </h3>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="font-medium text-foreground">{skill.provider}</span>
                  <span className="text-sm">• {skill.age} yrs</span>
                </div>
              </CardHeader>

              <CardContent className="pb-3">
                <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                  <MapPin className="w-4 h-4" />
                  {skill.location}
                </div>
                
                <div className="p-3 rounded-lg bg-secondary-light border border-secondary/20">
                  <p className="text-sm font-medium text-foreground mb-1">Looking for:</p>
                  <p className="text-sm text-muted-foreground">{skill.seeking}</p>
                </div>
              </CardContent>

              <CardFooter className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-accent text-accent" />
                  <span className="font-semibold">{skill.rating}</span>
                  <span className="text-sm text-muted-foreground">({skill.reviews})</span>
                </div>
                <Button variant="soft" size="sm">
                  Connect
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedSkills;
