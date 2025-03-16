
import { useState } from "react";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface GiftIdeasListProps {
  initialGiftIdeas?: string;
  onChange: (value: string) => void;
}

export default function GiftIdeasList({ initialGiftIdeas = "", onChange }: GiftIdeasListProps) {
  const [giftIdeas, setGiftIdeas] = useState<string[]>(
    initialGiftIdeas ? initialGiftIdeas.split('\n').filter(Boolean) : []
  );
  const [currentIdea, setCurrentIdea] = useState("");

  const addGiftIdea = () => {
    if (currentIdea.trim()) {
      const newGiftIdeas = [...giftIdeas, currentIdea.trim()];
      setGiftIdeas(newGiftIdeas);
      setCurrentIdea("");
      
      // Call the onChange prop with the updated string
      onChange(newGiftIdeas.join('\n'));
    }
  };

  const removeGiftIdea = (index: number) => {
    const newGiftIdeas = giftIdeas.filter((_, i) => i !== index);
    setGiftIdeas(newGiftIdeas);
    
    // Call the onChange prop with the updated string
    onChange(newGiftIdeas.join('\n'));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addGiftIdea();
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          value={currentIdea}
          onChange={(e) => setCurrentIdea(e.target.value)}
          placeholder="Add a gift idea"
          onKeyDown={handleKeyDown}
        />
        <Button 
          type="button" 
          onClick={addGiftIdea}
          variant="outline"
          size="icon"
          className="shrink-0"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      
      {giftIdeas.length > 0 && (
        <ul className="space-y-2 mt-2">
          {giftIdeas.map((idea, index) => (
            <li key={index} className="flex items-center justify-between bg-background rounded-md border px-3 py-2">
              <span>{idea}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeGiftIdea(index)}
                className="h-6 w-6 rounded-full hover:bg-destructive/10"
              >
                <X className="h-3 w-3" />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
