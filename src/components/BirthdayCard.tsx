
import { Birthday, getAvatarById } from "@/lib/types";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import { Gift, CalendarIcon, Heart } from "lucide-react";

interface BirthdayCardProps {
  birthday: Birthday;
  isHighlighted?: boolean;
  className?: string;
  onClick?: () => void;
}

export default function BirthdayCard({
  birthday,
  isHighlighted = false,
  className,
  onClick,
}: BirthdayCardProps) {
  const { name, date, avatarId, message } = birthday;
  const avatar = getAvatarById(avatarId);
  const birthdayDate = parseISO(date);
  
  // Calculate days until next birthday
  const today = new Date();
  const nextBirthday = new Date(
    today.getFullYear(),
    birthdayDate.getMonth(),
    birthdayDate.getDate()
  );
  
  if (nextBirthday < today) {
    nextBirthday.setFullYear(today.getFullYear() + 1);
  }
  
  const daysUntil = Math.ceil(
    (nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  const daysText = daysUntil === 0 
    ? "Today!" 
    : daysUntil === 1 
      ? "Tomorrow!" 
      : `In ${daysUntil} days`;

  // Determine gradient based on days until
  const gradientClass = daysUntil <= 7 
    ? "from-pink-300 via-purple-300 to-indigo-300" 
    : daysUntil <= 30 
      ? "from-indigo-300 via-purple-300 to-pink-300" 
      : "from-purple-200 via-indigo-200 to-blue-200";
      
  return (
    <div
      className={cn(
        "group transition-all duration-300 cursor-pointer",
        isHighlighted ? "animate-float" : "",
        className
      )}
      onClick={onClick}
    >
      <div
        className={cn(
          "relative overflow-hidden transition-all duration-300 transform",
          isHighlighted
            ? "rounded-2xl bg-gradient-to-r p-0.5 scale-100 hover:scale-[1.02] active:scale-[0.98]",
            gradientClass
            : "rounded-xl bg-gradient-to-r p-0.5 scale-100 hover:scale-[1.03] active:scale-[0.98]",
            gradientClass
        )}
      >
        <div className={cn(
          "h-full w-full rounded-[inherit] p-5",
          isHighlighted ? "bg-white/90 backdrop-blur-lg" : "bg-white/95"
        )}>
          {/* Background decoration */}
          {isHighlighted && (
            <div className="absolute inset-0 z-0 overflow-hidden opacity-20">
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/20 blur-xl" />
              <div className="absolute -bottom-10 -left-10 h-28 w-28 rounded-full bg-primary/10 blur-xl" />
            </div>
          )}
          
          <div className="relative z-10 flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <div className="avatar-container flex-shrink-0 h-16 w-16 shadow-subtle">
                <img 
                  src={avatar.src} 
                  alt={avatar.label}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              
              <div className={cn(
                "px-3 py-1 rounded-full text-xs font-medium",
                daysUntil <= 7 ? "bg-pink-100 text-pink-700" :
                daysUntil <= 30 ? "bg-indigo-100 text-indigo-700" :
                "bg-purple-50 text-purple-700"
              )}>
                {daysText}
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-lg">{name}</h3>
              <div className="flex items-center gap-1 text-muted-foreground text-sm mt-1">
                <CalendarIcon className="h-3.5 w-3.5" />
                <span>
                  {format(birthdayDate, "MMMM d")}
                </span>
                {!isHighlighted && (
                  <span className="inline-flex ml-2 items-center">
                    <Heart className="h-3 w-3 mr-1 text-pink-500 fill-pink-500" />
                    {calculateAge(birthdayDate)} years
                  </span>
                )}
              </div>
              
              {message && (
                <p className="mt-3 text-sm text-muted-foreground border-t border-gray-100 pt-3 flex items-start">
                  <Gift className="h-3.5 w-3.5 mr-2 text-primary flex-shrink-0 mt-0.5" />
                  <span className="line-clamp-2">
                    {message}
                  </span>
                </p>
              )}
            </div>
            
            {isHighlighted && (
              <div className="absolute bottom-5 right-5 text-xs font-medium rounded-full px-3 py-1 bg-primary/10 text-primary flex items-center">
                <Heart className="h-3 w-3 mr-1.5 fill-pink-500 text-pink-500" />
                {format(birthdayDate, "yyyy") !== format(new Date(), "yyyy") && 
                  `${format(birthdayDate, "yyyy")} · `
                }
                {calculateAge(birthdayDate)} years
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function calculateAge(birthdate: Date): number {
  const today = new Date();
  let age = today.getFullYear() - birthdate.getFullYear();
  const monthDifference = today.getMonth() - birthdate.getMonth();
  
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthdate.getDate())) {
    age--;
  }
  
  return age;
}
