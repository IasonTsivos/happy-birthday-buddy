
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface BalloonProps {
  className?: string;
}

const balloonColors = [
  "bg-red-400", 
  "bg-blue-400", 
  "bg-green-400", 
  "bg-yellow-400", 
  "bg-purple-400", 
  "bg-pink-400", 
  "bg-orange-400"
];

export default function Balloons({ className }: BalloonProps) {
  const [balloons, setBalloons] = useState<Array<{
    id: number;
    left: string;
    delay: string;
    duration: string;
    size: string;
    color: string;
  }>>([]);

  useEffect(() => {
    // Create 12 random balloons
    const newBalloons = Array.from({ length: 12 }, (_, i) => {
      const left = `${Math.random() * 100}%`;
      const delay = `${Math.random() * 5}s`;
      const duration = `${20 + Math.random() * 30}s`;
      const size = `${30 + Math.random() * 30}px`;
      const colorIndex = Math.floor(Math.random() * balloonColors.length);
      
      return {
        id: i,
        left,
        delay,
        duration,
        size,
        color: balloonColors[colorIndex]
      };
    });
    
    setBalloons(newBalloons);
  }, []);

  return (
    <div className={cn("fixed inset-0 pointer-events-none overflow-hidden z-0", className)}>
      {balloons.map((balloon) => (
        <div
          key={balloon.id}
          className={cn(
            "absolute bottom-0 rounded-full opacity-70",
            balloon.color
          )}
          style={{
            left: balloon.left,
            width: balloon.size,
            height: `calc(${balloon.size} * 1.2)`,
            animation: `float ${balloon.duration} ease-in-out ${balloon.delay} infinite`,
            transform: `translateY(100vh)`,
          }}
        >
          <div 
            className="absolute bottom-0 left-1/2 w-1 h-20 bg-gray-300/50"
            style={{ transform: 'translateX(-50%)' }}
          />
        </div>
      ))}
    </div>
  );
}
