
import { useEffect, useState } from 'react';

interface Balloon {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  color: string;
  delay: number;
}

export default function Balloons() {
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  
  useEffect(() => {
    // Generate 12 random balloons
    const colors = [
      'rgba(255, 99, 132, 0.7)',
      'rgba(54, 162, 235, 0.7)',
      'rgba(255, 206, 86, 0.7)',
      'rgba(75, 192, 192, 0.7)',
      'rgba(153, 102, 255, 0.7)',
      'rgba(255, 159, 64, 0.7)',
    ];
    
    const newBalloons = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100, // Random position (0-100%)
      y: Math.random() * 100 + 100, // Start below the screen
      size: Math.random() * 30 + 20, // Size between 20px and 50px
      speed: Math.random() * 0.5 + 0.2, // Animation speed
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 15, // Random delay for animation start
    }));
    
    setBalloons(newBalloons);
  }, []);
  
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {balloons.map((balloon) => (
        <div
          key={balloon.id}
          className="absolute rounded-full"
          style={{
            left: `${balloon.x}%`,
            bottom: `-${balloon.y}px`,
            width: `${balloon.size}px`,
            height: `${balloon.size * 1.2}px`,
            background: balloon.color,
            animation: `float ${20 / balloon.speed}s linear infinite`,
            animationDelay: `${balloon.delay}s`,
            // Add a string to make it look like a balloon
            boxShadow: `0 ${balloon.size * 1.5}px 0 -2px rgba(0,0,0,0.15)`,
            transform: `rotate(${Math.random() * 10 - 5}deg)`,
            zIndex: -10,
          }}
        />
      ))}
      
      <style>
        {`
        @keyframes float {
          0% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-150vh) rotate(${Math.random() * 20 - 10}deg);
          }
          100% {
            transform: translateY(-300vh) rotate(${Math.random() * 40 - 20}deg);
          }
        }
        `}
      </style>
    </div>
  );
}
