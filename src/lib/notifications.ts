import { Birthday } from "./types";
import { formatDistanceToNow } from "date-fns";
import { LocalNotifications } from '@capacitor/local-notifications';

// Check if we're in a Capacitor environment
const isCapacitor = 'Capacitor' in window;

// Request notification permission on page load
export async function requestNotificationPermission() {
  if (isCapacitor) {
    try {
      const { display } = await LocalNotifications.checkPermissions();
      if (display === 'granted') return true;
      
      const result = await LocalNotifications.requestPermissions();
      return result.display === 'granted';
    } catch (error) {
      console.error("Error requesting Capacitor notification permissions:", error);
      return false;
    }
  } else {
    // Web fallback
    if (!("Notification" in window)) {
      console.log("This browser does not support notifications");
      return false;
    }

    if (Notification.permission === "granted") {
      return true;
    }

    if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission();
      return permission === "granted";
    }

    return false;
  }
}

// Calculate next birthday date
export function getNextBirthdayDate(birthday: Birthday): Date {
  const birthdayDate = new Date(birthday.date);
  const today = new Date();
  
  // Create date for this year's birthday
  const thisYearBirthday = new Date(
    today.getFullYear(),
    birthdayDate.getMonth(),
    birthdayDate.getDate()
  );
  
  // If birthday has already passed this year, use next year's date
  if (thisYearBirthday < today) {
    thisYearBirthday.setFullYear(today.getFullYear() + 1);
  }
  
  return thisYearBirthday;
}

// Schedule notifications for a birthday
export async function scheduleBirthdayNotifications(birthday: Birthday, isTest = false) {
  const granted = await requestNotificationPermission();
  if (!granted) {
    console.log("Notification permission not granted");
    return;
  }
  
  if (isTest) {
    // For testing: show notification after 5 seconds
    if (isCapacitor) {
      await LocalNotifications.schedule({
        notifications: [
          {
            id: 999,
            title: "🎂 Birthday Reminder Test",
            body: `This is a test notification for ${birthday.name}'s birthday.`,
            schedule: { at: new Date(Date.now() + 5000) }
          }
        ]
      });
    } else {
      setTimeout(() => {
        showWebNotification(
          "🎂 Birthday Reminder Test",
          `This is a test notification for ${birthday.name}'s birthday.`
        );
      }, 5000);
    }
    return;
  }
  
  const nextBirthday = getNextBirthdayDate(birthday);
  
  // Calculate the day before
  const dayBefore = new Date(nextBirthday);
  dayBefore.setDate(dayBefore.getDate() - 1);
  
  if (isCapacitor) {
    // Schedule Capacitor notifications
    const notifications = [];
    
    // Add notification for the day before
    if (dayBefore > new Date()) {
      notifications.push({
        id: parseInt(birthday.id.substring(0, 8), 16) + 1, // Generate a unique ID
        title: "🎁 Birthday Tomorrow!",
        body: `${birthday.name}'s birthday is tomorrow!`,
        schedule: { at: dayBefore }
      });
    }
    
    // Add notification for the birthday itself
    if (nextBirthday > new Date()) {
      notifications.push({
        id: parseInt(birthday.id.substring(0, 8), 16) + 2, // Generate a unique ID
        title: "🎂 Happy Birthday!",
        body: `Today is ${birthday.name}'s birthday!`,
        schedule: { at: nextBirthday }
      });
    }
    
    if (notifications.length > 0) {
      try {
        await LocalNotifications.schedule({ notifications });
        console.log(`Capacitor notifications scheduled for ${birthday.name}`);
      } catch (error) {
        console.error("Error scheduling Capacitor notifications:", error);
      }
    }
  } else {
    // Web fallback: Store notification info in localStorage
    const notifications = getScheduledNotifications();
    
    // Add notification for the day before
    if (dayBefore > new Date()) {
      notifications.push({
        id: `${birthday.id}-day-before`,
        birthday: birthday,
        date: dayBefore.toISOString(),
        title: "🎁 Birthday Tomorrow!",
        body: `${birthday.name}'s birthday is tomorrow!`,
      });
    }
    
    // Add notification for the birthday itself
    if (nextBirthday > new Date()) {
      notifications.push({
        id: `${birthday.id}-day-of`,
        birthday: birthday,
        date: nextBirthday.toISOString(),
        title: "🎂 Happy Birthday!",
        body: `Today is ${birthday.name}'s birthday!`,
      });
    }
    
    // Save notifications to localStorage
    saveScheduledNotifications(notifications);
    
    // Start checking for notifications
    scheduleDailyCheck();
  }
  
  // Calculate time until next birthday
  const timeUntil = formatDistanceToNow(nextBirthday, { addSuffix: true });
  console.log(`Notification scheduled for ${birthday.name}'s birthday ${timeUntil}`);
}

// Show a web notification
function showWebNotification(title: string, body: string) {
  if (!("Notification" in window)) return;
  
  // Request permission again just to be safe
  requestNotificationPermission().then(granted => {
    if (!granted) return;
    
    try {
      new Notification(title, {
        body: body,
        icon: "/favicon.ico",
      });
    } catch (error) {
      console.error("Error showing web notification:", error);
    }
  });
}

// Schedule daily check for web notifications
function scheduleDailyCheck() {
  // Only needed for web notifications
  if (isCapacitor) return;
  
  // Check if we've already set up the daily check
  if (localStorage.getItem("notification-check-scheduled") === "true") {
    return;
  }
  
  // Set a flag so we don't schedule multiple checks
  localStorage.setItem("notification-check-scheduled", "true");
  
  // Check for notifications immediately
  checkScheduledNotifications();
  
  // Set up interval to check notifications every hour
  setInterval(() => {
    checkScheduledNotifications();
  }, 60 * 60 * 1000); // Check every hour
}

// Get scheduled notifications from localStorage (web only)
function getScheduledNotifications(): NotificationItem[] {
  try {
    const stored = localStorage.getItem("scheduled-notifications");
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (error) {
    console.error("Failed to get scheduled notifications:", error);
    return [];
  }
}

// Save scheduled notifications to localStorage (web only)
function saveScheduledNotifications(notifications: NotificationItem[]) {
  try {
    localStorage.setItem("scheduled-notifications", JSON.stringify(notifications));
  } catch (error) {
    console.error("Failed to save scheduled notifications:", error);
  }
}

// Check for web notifications that need to be shown
function checkScheduledNotifications() {
  if (isCapacitor) return; // No need on mobile
  
  console.log("Checking scheduled web notifications...");
  const now = new Date();
  const notifications = getScheduledNotifications();
  
  // Find notifications that should be shown (date is in the past but within the last day)
  const toShow = notifications.filter((notif) => {
    const notifDate = new Date(notif.date);
    const oneDayAgo = new Date(now);
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    
    return notifDate <= now && notifDate >= oneDayAgo;
  });
  
  // Show notifications
  toShow.forEach((notif) => {
    showWebNotification(notif.title, notif.body);
  });
  
  // Remove shown notifications and very old ones
  const updatedNotifications = notifications.filter((notif) => {
    const notifDate = new Date(notif.date);
    const oneDayAgo = new Date(now);
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    
    // Keep if date is in the future or not shown yet
    return notifDate > oneDayAgo;
  });
  
  // Save updated notifications
  saveScheduledNotifications(updatedNotifications);
}

// Reschedule all birthday notifications
export async function rescheduleAllNotifications() {
  if (isCapacitor) {
    // Clear existing notifications
    try {
      const pendingNotifications = await LocalNotifications.getPending();
      if (pendingNotifications.notifications.length > 0) {
        const ids = pendingNotifications.notifications.map(n => n.id);
        await LocalNotifications.cancel({ notifications: ids.map(id => ({ id })) });
      }
    } catch (error) {
      console.error("Error clearing existing notifications:", error);
    }
  } else {
    // Web: clear scheduled notifications
    saveScheduledNotifications([]);
  }
  
  // Then, get all birthdays and schedule notifications for them
  const birthdays = JSON.parse(localStorage.getItem("birthday-reminder-app") || "[]");
  for (const birthday of birthdays) {
    await scheduleBirthdayNotifications(birthday);
  }
}

// Interface for notification items (web only)
interface NotificationItem {
  id: string;
  birthday: Birthday;
  date: string; // ISO string
  title: string;
  body: string;
}
