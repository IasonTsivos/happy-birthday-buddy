
import { useState } from "react";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Birthday } from "@/lib/types";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import AvatarSelection from "./AvatarSelection";
import { addBirthday, updateBirthday } from "@/lib/store";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  date: z.date({
    required_error: "Birthdate is required",
  }),
  avatarId: z.string().min(1, "Please select an avatar"),
  message: z.string().optional(),
  giftIdeas: z.string().optional(),
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

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      date: initialData?.date ? new Date(initialData.date) : undefined,
      avatarId: initialData?.avatarId || "cat",
      message: initialData?.message || "",
      giftIdeas: initialData?.giftIdeas || "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const birthdayData = {
        name: data.name,
        date: data.date.toISOString(),
        avatarId: data.avatarId,
        message: data.message,
        giftIdeas: data.giftIdeas,
      };
      
      if (isEditing && initialData) {
        updateBirthday({ ...birthdayData, id: initialData.id });
        toast("Birthday updated successfully");
      } else {
        addBirthday(birthdayData);
        toast("Birthday added successfully");
      }
      
      navigate("/");
    } catch (error) {
      console.error(`Error ${isEditing ? 'updating' : 'adding'} birthday:`, error);
      toast(`Failed to ${isEditing ? 'update' : 'add'} birthday`);
    } finally {
      setIsSubmitting(false);
    }
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

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Birthdate</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "input-field pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "MMMM d, yyyy")
                        ) : (
                          <span>Select date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                      captionLayout="dropdown-buttons"
                      fromYear={1920}
                      toYear={new Date().getFullYear()}
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
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
                  <Textarea
                    placeholder="Add gift ideas (optional)"
                    className="resize-none"
                    rows={3}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end pt-4">
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
