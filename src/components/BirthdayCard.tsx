
import { Birthday, getAvatarById } from "@/lib/types";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import { Gift, CalendarIcon, Heart, ChevronRight } from "lucide-react";

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
  
  // Determine background color based on days until
  const bgColors = [
    "bg-pink-200", "bg-purple-200", "bg-blue-200", 
    "bg-yellow-200", "bg-green-200", "bg-orange-200"
  ];
  const bgColorIndex = parseInt(birthday.id?.substring(0, 4) || "0", 16) % bgColors.length;
  const bgColor = bgColors[bgColorIndex];
  
  const age = calculateAge(birthdayDate);

  if (isHighlighted) {
    return (
      <div 
        className={cn(
          "rounded-2xl overflow-hidden shadow-sm cursor-pointer transition-all duration-300 hover:shadow-md", 
          "bg-gradient-to-r from-blue-200 via-orange-100 to-red-200 border border-white",
          className
        )}
        onClick={onClick}
      >
        <div className="p-6 relative">
          <div className="flex justify-between items-start">
            <div className="flex space-x-4 items-center">
              <div className="h-16 w-16 rounded-xl border-2 border-white shadow-sm flex items-center justify-center text-4xl bg-white">
                {avatar.emoji}
              </div>
              
              <div className="space-y-1">
                <h3 className="font-semibold text-lg">{name}</h3>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Gift className="h-5 w-5 mr-1.5" />
                  <span className="font-medium">{format(birthdayDate, "dd MMMM")}</span>
                </div>
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
  
  // Non-highlighted card
  return (
    <div 
      className={cn(
        "rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:translate-x-1 border border-white",
        bgColor,
        className
      )}
      onClick={onClick}
    >
      <div className="p-3 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="h-12 w-12 rounded-xl border-2 border-white/80 shadow-sm flex items-center justify-center text-3xl bg-white">
            {avatar.emoji}
          </div>
          
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
    age;
  }
  return age;
}
