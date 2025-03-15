
import { Birthday, getAvatarById } from "@/lib/types";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import { Gift, CalendarIcon, Heart, ChevronRight } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

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
  onClick
}: BirthdayCardProps) {
  const { name, date, avatarId, message } = birthday;
  const avatar = getAvatarById(avatarId);
  const birthdayDate = parseISO(date);

  // Calculate days until next birthday
  const today = new Date();
  const nextBirthday = new Date(today.getFullYear(), birthdayDate.getMonth(), birthdayDate.getDate());
  if (nextBirthday < today) {
    nextBirthday.setFullYear(today.getFullYear() + 1);
  }
  const daysUntil = Math.ceil((nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const daysText = daysUntil === 0 ? "Today!" : daysUntil === 1 ? "Tomorrow!" : `in ${daysUntil} days`;
  
  // Determine background color based on avatar (inspired by the image)
  const bgColors = [
    "bg-pink-100", "bg-purple-100", "bg-blue-100", 
    "bg-yellow-100", "bg-green-100", "bg-orange-100"
  ];
  const bgColorIndex = parseInt(birthday.id.substring(0, 4), 16) % bgColors.length;
  const bgColor = bgColors[bgColorIndex];
  
  const age = calculateAge(birthdayDate);

  if (isHighlighted) {
    return (
      <div 
        className={cn(
          "rounded-2xl overflow-hidden shadow-sm cursor-pointer transition-all duration-300 hover:shadow-md", 
          "bg-gradient-to-r from-purple-100 via-pink-50 to-indigo-100",
          className
        )}
        onClick={onClick}
      >
        <div className="p-6 relative">
          <div className="flex justify-between items-start">
            <div className="flex space-x-4 items-center">
              <Avatar className="h-16 w-16 rounded-xl border-2 border-white shadow-sm">
                <AvatarImage src={avatar.src} alt={name} />
                <AvatarFallback>{name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              
              <div className="space-y-1">
                <h3 className="font-semibold text-lg">{name}</h3>
                <div className="flex items-center text-sm text-muted-foreground">
                  <CalendarIcon className="h-3.5 w-3.5 mr-1.5" />
                  <span className="font-medium">{format(birthdayDate, "dd MMMM")}</span>
                </div>
                {message && (
                  <p className="text-sm text-muted-foreground line-clamp-2 max-w-xs">
                    {message}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex flex-col items-end">
              <div className="bg-white px-3 py-1.5 rounded-full text-lg font-bold text-primary shadow-sm">
                {age} yrs
              </div>
              <div className="text-xs mt-2 text-muted-foreground">
                {daysText}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Non-highlighted card inspired by the image
  return (
    <div 
      className={cn(
        "rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:translate-x-1",
        bgColor,
        className
      )}
      onClick={onClick}
    >
      <div className="p-3 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Avatar className="h-12 w-12 rounded-xl border-2 border-white/80 shadow-sm">
            <AvatarImage src={avatar.src} alt={name} />
            <AvatarFallback>{name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          
          <div>
            <h3 className="font-medium">{name}</h3>
            <div className="flex items-center text-sm text-muted-foreground">
              <span className="font-medium">{format(birthdayDate, "dd")}</span>
              <span className="ml-1">{format(birthdayDate, "MMMM")}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="text-right">
            <div className="font-bold text-lg">{age} yrs</div>
            <div className="text-xs text-muted-foreground">{daysText}</div>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>
    </div>
  );
}

function calculateAge(birthdate: Date): number {
  const today = new Date();
  let age = today.getFullYear() - birthdate.getFullYear();
  const monthDifference = today.getMonth() - birthdate.getMonth();
  if (monthDifference < 0 || monthDifference === 0 && today.getDate() < birthdate.getDate()) {
    age--;
  }
  return age;
}
