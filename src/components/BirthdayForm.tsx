
import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Birthday } from "@/lib/types";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AvatarSelection from "./AvatarSelection";
import GiftIdeasList from "./GiftIdeasList";
import { addBirthday, updateBirthday } from "@/lib/store";
import { scheduleBirthdayNotifications } from "@/lib/notifications";

// Define the schema with separate day, month, and year fields
const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  day: z.string().min(1, "Day is required"),
  month: z.string().min(1, "Month is required"),
  year: z.string().min(1, "Year is required"),
  avatarId: z.string().min(1, "Please select an avatar"),
  message: z.string().optional(),
  giftIdeas: z.string().optional(),
}).refine((data) => {
  // Validate the date
  const day = parseInt(data.day, 10);
  const month = parseInt(data.month, 10) - 1; // JavaScript months are 0-indexed
  const year = parseInt(data.year, 10);
  
  const date = new Date(year, month, day);
  return date.getFullYear() === year && 
         date.getMonth() === month && 
         date.getDate() === day;
}, {
  message: "Invalid date",
  path: ["day"] // Show error on the day field
});

type FormValues = z.infer<typeof formSchema>;

interface BirthdayFormProps {
  initialData?: Birthday;
  mode?: "add" | "edit";
}

export default function BirthdayForm({ initialData, mode = "add" }: BirthdayFormProps) {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = mode === "edit";
  
  // Generate arrays for day, month, and year options
  const days = useMemo(() => Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0')), []);
  const months = useMemo(() => [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ], []);
  
  const currentYear = new Date().getFullYear();
  const years = useMemo(() => 
    Array.from({ length: 100 }, (_, i) => (currentYear - i).toString()), 
  [currentYear]);

  // Extract date components from initialData if available
  const initialDate = initialData?.date ? new Date(initialData.date) : undefined;
  const initialDay = initialDate ? initialDate.getDate().toString().padStart(2, '0') : undefined;
  const initialMonth = initialDate ? (initialDate.getMonth() + 1).toString().padStart(2, '0') : undefined;
  const initialYear = initialDate ? initialDate.getFullYear().toString() : undefined;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      day: initialDay || "",
      month: initialMonth || "",
      year: initialYear || "",
      avatarId: initialData?.avatarId || "cat",
      message: initialData?.message || "",
      giftIdeas: initialData?.giftIdeas || "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      // Construct date from components
      const date = new Date(
        parseInt(data.year, 10),
        parseInt(data.month, 10) - 1, // JS months are 0-indexed
        parseInt(data.day, 10)
      );
      
      const birthdayData = {
        name: data.name,
        date: date.toISOString(),
        avatarId: data.avatarId,
        message: data.message,
        giftIdeas: data.giftIdeas,
      };
      
      let birthday;
      if (isEditing && initialData) {
        birthday = { ...birthdayData, id: initialData.id };
        updateBirthday(birthday);
        toast("Birthday updated successfully");
      } else {
        birthday = addBirthday(birthdayData);
        toast("Birthday added successfully");
      }
      
      // Schedule notifications for this birthday
      scheduleBirthdayNotifications(birthday);
      
      navigate("/");
    } catch (error) {
      console.error(`Error ${isEditing ? 'updating' : 'adding'} birthday:`, error);
      toast(`Failed to ${isEditing ? 'update' : 'add'} birthday`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const testNotification = () => {
    toast("Sending test notification...");
    const testDate = new Date();
    testDate.setSeconds(testDate.getSeconds() + 5); // 5 seconds from now
    
    const testBirthday = {
      id: "test-notification",
      name: "Test Person",
      date: testDate.toISOString(),
      avatarId: "cake",
      message: "This is a test notification",
    };
    
    scheduleBirthdayNotifications(testBirthday, true);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 animate-fade-in"
      >
        <FormField
          control={form.control}
          name="avatarId"
          render={({ field }) => (
            <FormItem>
              <AvatarSelection
                selected={field.value}
                onSelect={field.onChange}
                className="mt-2"
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter person's name"
                    className="input-field"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="day"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Day</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Day" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="max-h-[200px]">
                      {days.map(day => (
                        <SelectItem key={day} value={day}>{day}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="month"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Month</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Month" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="max-h-[200px]">
                      {months.map(month => (
                        <SelectItem key={month.value} value={month.value}>{month.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Year</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Year" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="max-h-[200px]">
                      {years.map(year => (
                        <SelectItem key={year} value={year}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Birthday Message</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write a birthday message"
                    className="resize-none"
                    rows={3}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="giftIdeas"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gift Ideas</FormLabel>
                <FormControl>
                  <GiftIdeasList 
                    initialGiftIdeas={field.value} 
                    onChange={field.onChange} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-between pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={testNotification}
            className="bg-orange-100 hover:bg-orange-200 border-orange-200"
          >
            Test Notification
          </Button>
          
          <Button
            type="submit"
            className="w-full md:w-auto shadow-subtle transform hover:translate-y-[-2px] transition-all duration-300"
            disabled={isSubmitting}
          >
            {isSubmitting ? (isEditing ? "Updating..." : "Saving...") : (isEditing ? "Update Birthday" : "Save Birthday")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
