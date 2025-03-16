
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
  const isAdd = location.pathname === "/add";
  const isEdit = location.pathname.includes("/birthday/");

  return (
    <header className={cn(
      "sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border/40 transition-all duration-300",
      isAdd || isEdit ? "bg-gradient-to-r from-purple-100 to-pink-100" : "",
      className
    )}>
      <div className="container-padding flex items-center justify-between">
        <div className="flex items-center">
          {!isHome && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="mr-2 rounded-full hover:bg-secondary/80 transition-all duration-200"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back</span>
            </Button>
          )}
          <h1 className={cn(
            "text-xl font-medium",
            (isAdd || isEdit) && "bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent"
          )}>
            {isHome ? "Birthday Reminder" : isAdd ? "Add Birthday" : "Edit Birthday"}
          </h1>
        </div>
      </div>
    </header>
  );
}
