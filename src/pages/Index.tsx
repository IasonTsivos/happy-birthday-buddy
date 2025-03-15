
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Gift } from "lucide-react";
import { getUpcomingBirthdays } from "@/lib/store";
import { Birthday } from "@/lib/types";
import Header from "@/components/Header";
import BirthdayCard from "@/components/BirthdayCard";
import { cn } from "@/lib/utils";

export default function Index() {
  const [birthdays, setBirthdays] = useState<Birthday[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Load birthdays on component mount
    const loadBirthdays = () => {
      try {
        const upcoming = getUpcomingBirthdays();
        setBirthdays(upcoming);
      } catch (error) {
        console.error("Failed to load birthdays:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBirthdays();

    // Add event listener for storage changes
    window.addEventListener("storage", loadBirthdays);
    
    // Clean up event listener
    return () => {
      window.removeEventListener("storage", loadBirthdays);
    };
  }, []);

  const handleBirthdayClick = (id: string) => {
    navigate(`/birthday/${id}`);
  };

  return (
    <div className="min-h-screen bg-transparent page-transition">
      <Header />
      
      <main className="container-padding">
        {isLoading ? (
          <div className="h-40 flex items-center justify-center">
            <div className="animate-pulse text-muted-foreground">Loading...</div>
          </div>
        ) : birthdays.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-10 max-w-5xl mx-auto">
            {birthdays[0] && (
              <section>
                <h2 className="text-sm uppercase tracking-wide text-primary mb-3 flex items-center">
                  <Gift className="w-4 h-4 mr-2 opacity-70" />
                  Coming Up
                </h2>
                <BirthdayCard 
                  birthday={birthdays[0]} 
                  isHighlighted={true}
                  onClick={() => handleBirthdayClick(birthdays[0].id)}
                />
              </section>
            )}
            
            {birthdays.length > 1 && (
              <section>
                <h2 className="text-sm uppercase tracking-wide text-primary mb-3 flex items-center">
                  <Calendar className="w-4 h-4 mr-2 opacity-70" />
                  More Birthdays
                </h2>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {birthdays.slice(1).map((birthday) => (
                    <BirthdayCard
                      key={birthday.id}
                      birthday={birthday}
                      onClick={() => handleBirthdayClick(birthday.id)}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

function EmptyState() {
  const navigate = useNavigate();
  
  return (
    <div className={cn(
      "flex flex-col items-center justify-center text-center",
      "py-16 px-4 rounded-2xl border border-dashed border-primary/20",
      "bg-white/50 backdrop-blur-sm animate-fade-in"
    )}>
      <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <Calendar className="h-8 w-8 text-primary" />
      </div>
      <h2 className="text-xl font-medium mb-2">No birthdays yet</h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        Add your first birthday reminder to get started and never miss an important date.
      </p>
      <button
        onClick={() => navigate("/add")}
        className="btn-primary"
      >
        Add Birthday
      </button>
    </div>
  );
}
