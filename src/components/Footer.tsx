
import { Home, Plus, Gift } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Footer() {
  const navigate = useNavigate();
  const location = useLocation();
  
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t border-border/40 z-10">
      <div className="container max-w-screen-xl mx-auto grid grid-cols-3 items-center py-3 px-4">
        <div className="flex justify-center">
          <Button 
            onClick={() => navigate("/")}
            variant="ghost" 
            size="icon"
            className={cn(
              "rounded-full h-10 w-10",
              location.pathname === "/" && "bg-primary/10 text-primary"
            )}
          >
            <Home className="h-5 w-5" />
            <span className="sr-only">Home</span>
          </Button>
        </div>
        
        <div className="flex justify-center">
          <Button
            onClick={() => navigate("/add")}
            size="icon"
            className="h-14 w-14 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-lg text-white hover:scale-105 transition-transform duration-200"
          >
            <Plus className="h-6 w-6" />
            <span className="sr-only">Add Birthday</span>
          </Button>
        </div>
        
        <div className="flex justify-center">
          <Button 
            onClick={() => navigate("/gift-recommendations")}
            variant="ghost" 
            size="icon"
            className={cn(
              "rounded-full h-10 w-10",
              location.pathname === "/gift-recommendations" && "bg-primary/10 text-primary"
            )}
          >
            <Gift className="h-5 w-5" />
            <span className="sr-only">Gift Recommendations</span>
          </Button>
        </div>
      </div>
    </footer>
  );
}
