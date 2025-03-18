
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface HeaderProps {
  className?: string;
}

export default function Header({ className }: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <header className={cn(
      "sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border/40 transition-all duration-300",
      className
    )}>
      <div className="container-padding flex items-center justify-between py-3">
        <div className="flex items-center">
          {!isHome && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="mr-2 h-8 w-8 rounded-full hover:bg-secondary/80 transition-all duration-200"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
          )}
          <h1 className="text-lg font-medium">
            {isHome ? "Birthday Reminder" : location.pathname === "/gift-recommendations" ? "Gift Ideas" : "Add Birthday"}
          </h1>
        </div>
      </div>
    </header>
  );
}
