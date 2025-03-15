
import { Birthday } from "./types";
import { toast } from "sonner";

// Local storage key
const STORAGE_KEY = "birthday-reminder-app";

// Get all birthdays from localStorage
export function getBirthdays(): Birthday[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (error) {
    console.error("Failed to retrieve birthdays:", error);
    return [];
  }
}

// Save all birthdays to localStorage
export function saveBirthdays(birthdays: Birthday[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(birthdays));
  } catch (error) {
    console.error("Failed to save birthdays:", error);
    toast("Failed to save birthdays");
  }
}

// Add a new birthday
export function addBirthday(birthday: Omit<Birthday, "id">): Birthday {
  const birthdays = getBirthdays();
  const newBirthday = {
    ...birthday,
    id: crypto.randomUUID(),
  };
  
  saveBirthdays([...birthdays, newBirthday]);
  toast("Birthday added successfully");
  return newBirthday;
}

// Update an existing birthday
export function updateBirthday(birthday: Birthday): void {
  const birthdays = getBirthdays();
  const index = birthdays.findIndex((b) => b.id === birthday.id);
  
  if (index !== -1) {
    birthdays[index] = birthday;
    saveBirthdays(birthdays);
    toast("Birthday updated successfully");
  }
}

// Delete a birthday
export function deleteBirthday(id: string): void {
  const birthdays = getBirthdays();
  const filtered = birthdays.filter((b) => b.id !== id);
  
  if (filtered.length !== birthdays.length) {
    saveBirthdays(filtered);
    toast("Birthday deleted successfully");
  }
}

// Sort birthdays by upcoming date (next occurrence based on current year)
export function getUpcomingBirthdays(): Birthday[] {
  const birthdays = getBirthdays();
  const today = new Date();
  
  // Calculate days until next birthday
  return birthdays.map(birthday => {
    const birthdayDate = new Date(birthday.date);
    const nextBirthday = new Date(
      today.getFullYear(),
      birthdayDate.getMonth(),
      birthdayDate.getDate()
    );
    
    // If the birthday already occurred this year, calculate for next year
    if (nextBirthday < today) {
      nextBirthday.setFullYear(today.getFullYear() + 1);
    }
    
    // Calculate days until birthday
    const daysUntil = Math.ceil(
      (nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    return { ...birthday, daysUntil };
  })
  // Sort by upcoming (closest first)
  .sort((a: any, b: any) => a.daysUntil - b.daysUntil);
}
