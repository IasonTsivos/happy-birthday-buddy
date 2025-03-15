
import { useState } from "react";
import { AvatarOption, avatarOptions } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface AvatarSelectionProps {
  selected: string;
  onSelect: (avatar: string) => void;
  className?: string;
}

export default function AvatarSelection({
  selected,
  onSelect,
  className,
}: AvatarSelectionProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <p className="text-sm font-medium text-muted-foreground">Choose an avatar</p>
      <div className="grid grid-cols-4 gap-4">
        {avatarOptions.map((avatar) => (
          <AvatarOption
            key={avatar.id}
            avatar={avatar}
            isSelected={selected === avatar.id}
            onClick={() => onSelect(avatar.id)}
          />
        ))}
      </div>
    </div>
  );
}

interface AvatarOptionProps {
  avatar: AvatarOption;
  isSelected: boolean;
  onClick: () => void;
}

function AvatarOption({ avatar, isSelected, onClick }: AvatarOptionProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative overflow-hidden aspect-square rounded-xl transition-all duration-200",
        isSelected 
          ? "ring-2 ring-primary ring-offset-2 scale-100" 
          : "ring-1 ring-border hover:ring-primary/50 scale-95 hover:scale-100",
        isLoaded ? "bg-transparent" : "bg-muted animate-pulse"
      )}
    >
      <img
        src={avatar.src}
        alt={avatar.label}
        className={cn(
          "h-full w-full object-cover transition-opacity duration-300",
          isLoaded ? "opacity-100" : "opacity-0"
        )}
        onLoad={() => setIsLoaded(true)}
      />
      
      {isSelected && (
        <div className="absolute inset-0 flex items-center justify-center bg-primary/20 backdrop-blur-sm animate-fade-in">
          <Check className="h-6 w-6 text-white drop-shadow-md" />
        </div>
      )}
    </button>
  );
}
