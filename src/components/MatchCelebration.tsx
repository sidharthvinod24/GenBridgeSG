import { useEffect, useState } from "react";
import { Heart, Sparkles, PartyPopper } from "lucide-react";

interface MatchCelebrationProps {
  matchName: string;
  onComplete: () => void;
}

const MatchCelebration = ({ matchName, onComplete }: MatchCelebrationProps) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onComplete, 500);
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  // Generate confetti particles
  const confetti = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 2 + Math.random() * 2,
    size: 8 + Math.random() * 12,
    color: ['#e11d48', '#f97316', '#fbbf24', '#ec4899', '#a855f7'][Math.floor(Math.random() * 5)],
  }));

  // Generate floating hearts
  const hearts = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    left: 10 + Math.random() * 80,
    delay: Math.random() * 1,
    duration: 2 + Math.random() * 2,
    size: 16 + Math.random() * 24,
  }));

  return (
    <div 
      className={`fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-500 ${
        show ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Confetti */}
      {confetti.map((particle) => (
        <div
          key={particle.id}
          className="absolute top-0 animate-confetti"
          style={{
            left: `${particle.left}%`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
          }}
        >
          <div
            className="rounded-sm rotate-45"
            style={{
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
            }}
          />
        </div>
      ))}

      {/* Floating Hearts */}
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="absolute bottom-0 animate-float-up"
          style={{
            left: `${heart.left}%`,
            animationDelay: `${heart.delay}s`,
            animationDuration: `${heart.duration}s`,
          }}
        >
          <Heart
            className="text-primary fill-primary"
            style={{ width: heart.size, height: heart.size }}
          />
        </div>
      ))}

      {/* Center Content */}
      <div className="relative z-10 text-center animate-celebration-pop">
        <div className="relative mb-6">
          {/* Glowing ring */}
          <div className="absolute inset-0 -m-4 rounded-full bg-gradient-to-r from-primary via-secondary to-accent opacity-30 blur-2xl animate-pulse" />
          
          {/* Icon container */}
          <div className="relative w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-2xl">
            <Heart className="w-16 h-16 text-white fill-white animate-heartbeat" />
          </div>

          {/* Sparkles around */}
          <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-accent animate-spin-slow" />
          <Sparkles className="absolute -bottom-2 -left-2 w-6 h-6 text-accent animate-spin-slow" style={{ animationDelay: "0.5s" }} />
          <PartyPopper className="absolute top-0 -left-4 w-8 h-8 text-secondary animate-bounce" />
          <PartyPopper className="absolute top-0 -right-4 w-8 h-8 text-secondary animate-bounce" style={{ animationDelay: "0.2s", transform: "scaleX(-1)" }} />
        </div>

        <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-3 drop-shadow-lg">
          It's a Match!
        </h2>
        <p className="text-xl text-white/90 mb-2">
          You and <span className="font-bold text-accent">{matchName}</span>
        </p>
        <p className="text-white/70">
          can now exchange skills together! 🎉
        </p>

        <p className="text-white/50 text-sm mt-6 animate-pulse">
          Tap anywhere to continue
        </p>
      </div>

      {/* Click to dismiss */}
      <button 
        className="absolute inset-0 z-20 cursor-pointer" 
        onClick={() => {
          setShow(false);
          setTimeout(onComplete, 500);
        }}
        aria-label="Dismiss celebration"
      />
    </div>
  );
};

export default MatchCelebration;
