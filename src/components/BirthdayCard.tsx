
import { Birthday, getAvatarById } from "@/lib/types";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import { Gift } from "lucide-react";

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
            ? "card-glass p-6 scale-100 hover:scale-[1.02] active:scale-[0.98]"
            : "card-elevated p-4 scale-100 hover:scale-[1.03] active:scale-[0.98]"
        )}
      >
        {/* Background decoration */}
        {isHighlighted && (
          <div className="absolute inset-0 z-0 overflow-hidden opacity-20">
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/20 blur-xl" />
            <div className="absolute -bottom-10 -left-10 h-28 w-28 rounded-full bg-primary/10 blur-xl" />
          </div>
        )}
        
        <div className="relative z-10 flex items-center space-x-4">
          <div className="avatar-container flex-shrink-0 h-16 w-16 border border-border/50 shadow-subtle">
            <img 
              src={avatar.src} 
              alt={avatar.label}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-lg truncate">{name}</h3>
            <div className="flex items-center text-muted-foreground text-sm">
              <span className="truncate">
                {format(birthdayDate, "MMMM d")}
              </span>
              <span className="mx-1.5 h-1 w-1 rounded-full bg-muted-foreground/50"></span>
              <span className="truncate font-medium text-primary">
                {daysText}
              </span>
            </div>
            
            {message && (
              <p className="mt-1.5 text-sm text-muted-foreground truncate">
                <span className="inline-flex items-center">
                  <Gift className="h-3 w-3 mr-1.5 text-primary/70" />
                  {message.length > 35 ? message.substring(0, 35) + "..." : message}
                </span>
              </p>
            )}
          </div>
        </div>
        
        {isHighlighted && (
          <div className="absolute bottom-3 right-3 text-xs font-medium rounded-full px-2 py-0.5 bg-primary/10 text-primary">
            {format(birthdayDate, "yyyy") !== format(new Date(), "yyyy") && 
              `${format(birthdayDate, "yyyy")} · `
            }
            {calculateAge(birthdayDate)} years
          </div>
        )}
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
