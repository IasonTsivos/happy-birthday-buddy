
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Gift, Plus } from "lucide-react";
import { getUpcomingBirthdays } from "@/lib/store";
import { Birthday } from "@/lib/types";
import Header from "@/components/Header";
import BirthdayCard from "@/components/BirthdayCard";
import Balloons from "@/components/Balloons";
import { cn } from "@/lib/utils";
import { requestNotificationPermission, rescheduleAllNotifications } from "@/lib/notifications";

export default function Index() {
  const [birthdays, setBirthdays] = useState<Birthday[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Request notification permission when the app loads
    requestNotificationPermission();
    
    // Load birthdays on component mount
    const loadBirthdays = () => {
      try {
        const upcoming = getUpcomingBirthdays();
        setBirthdays(upcoming);
        
        // Reschedule notifications for all birthdays
        rescheduleAllNotifications();
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
      <Balloons />
      
      <main className="container max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {isLoading ? (
          <div className="h-40 flex items-center justify-center">
            <div className="animate-pulse text-muted-foreground">Loading...</div>
          </div>
        ) : birthdays.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-8">
            <section>
              <h2 className="text-base font-medium text-primary/90 mb-3 flex items-center">
                <Gift className="w-4 h-4 mr-2 opacity-70" />
                Upcoming birthdays
              </h2>
              <div className="space-y-3">
                {birthdays.slice(0, Math.min(3, birthdays.length)).map((birthday, index) => (
                  <BirthdayCard
                    key={birthday.id}
                    birthday={birthday}
                    isHighlighted={index === 0}
                    onClick={() => handleBirthdayClick(birthday.id)}
                  />
                ))}
              </div>
            </section>
            
            {birthdays.length > 3 && (
              <section>
                <h2 className="text-base font-medium text-primary/90 mb-3 flex items-center">
                  <Calendar className="w-4 h-4 mr-2 opacity-70" />
                  More Birthdays
                </h2>
                <div className="space-y-3">
                  {birthdays.slice(3).map((birthday) => (
                    <BirthdayCard
                      key={birthday.id}
                      birthday={birthday}
                      onClick={() => handleBirthdayClick(birthday.id)}
                    />
                  ))}
                </div>
              </section>
            )}
            
            <div className="fixed bottom-6 right-6">
              <button
                onClick={() => navigate("/add")}
                className="h-14 w-14 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-lg text-white hover:scale-105 transition-transform duration-200"
              >
                <Plus className="h-6 w-6" />
              </button>
            </div>
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
