
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { getBirthdayById, updateBirthday, deleteBirthday } from "@/lib/store";
import { Birthday } from "@/lib/types";
import Header from "@/components/Header";
import BirthdayForm from "@/components/BirthdayForm";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function EditBirthday() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [birthday, setBirthday] = useState<Birthday | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      navigate("/");
      return;
    }

    try {
      const foundBirthday = getBirthdayById(id);
      if (foundBirthday) {
        setBirthday(foundBirthday);
      } else {
        toast("Birthday not found");
        navigate("/");
      }
    } catch (error) {
      console.error("Failed to load birthday:", error);
      toast("Error loading birthday");
      navigate("/");
    } finally {
      setIsLoading(false);
    }
  }, [id, navigate]);

  const handleDelete = () => {
    if (!id) return;
    
    try {
      deleteBirthday(id);
      toast("Birthday deleted successfully");
      navigate("/");
    } catch (error) {
      console.error("Failed to delete birthday:", error);
      toast("Error deleting birthday");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background page-transition">
        <Header />
        <main className="container-padding">
          <div className="flex items-center justify-center h-64">
            <div className="animate-pulse text-muted-foreground">Loading...</div>
          </div>
        </main>
      </div>
    );
  }

  if (!birthday) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background page-transition">
      <Header />
      
      <main className="container-padding">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-medium">Edit Birthday</h1>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="icon" className="text-destructive hover:bg-destructive/10">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete this birthday.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          
          <BirthdayForm initialData={birthday} mode="edit" />
        </div>
      </main>
    </div>
  );
}
