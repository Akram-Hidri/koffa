
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";

type CalendarEventType = {
  id?: string;
  title: string;
  description?: string;
  start_time: string;
  end_time?: string;
  location?: string;
  category: string;
  color?: string;
  family_id?: string | null;
  is_recurring?: boolean;
  recurrence_pattern?: string;
  all_day?: boolean;
  assigned_to?: string;
};

type EventWithId = CalendarEventType & { id: string };

export async function fetchCalendarEvents(userId: string, familyId?: string | null) {
  try {
    let query = supabase
      .from("calendar_events")
      .select("*");
    
    // If there's a family ID, include events that belong to the family
    if (familyId) {
      query = query.or(`created_by.eq.${userId},family_id.eq.${familyId}`);
    } else {
      query = query.eq("created_by", userId);
    }
    
    const { data, error } = await query
      .order("start_time", { ascending: true });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching calendar events:", error);
    toast.error("Failed to load calendar events");
    return [];
  }
}

export async function createCalendarEvent(event: CalendarEventType, userId: string) {
  try {
    const { data, error } = await supabase
      .from("calendar_events")
      .insert({
        ...event,
        created_by: userId
      })
      .select();
    
    if (error) throw error;
    
    toast.success("Event created successfully");
    return data[0];
  } catch (error) {
    console.error("Error creating calendar event:", error);
    toast.error("Failed to create event");
    return null;
  }
}

export async function updateCalendarEvent(event: EventWithId) {
  try {
    const { error } = await supabase
      .from("calendar_events")
      .update({
        ...event,
        updated_at: new Date().toISOString()
      })
      .eq("id", event.id);
    
    if (error) throw error;
    
    toast.success("Event updated successfully");
    return true;
  } catch (error) {
    console.error("Error updating calendar event:", error);
    toast.error("Failed to update event");
    return false;
  }
}

export async function deleteCalendarEvent(eventId: string) {
  try {
    const { error } = await supabase
      .from("calendar_events")
      .delete()
      .eq("id", eventId);
    
    if (error) throw error;
    
    toast.success("Event deleted successfully");
    return true;
  } catch (error) {
    console.error("Error deleting calendar event:", error);
    toast.error("Failed to delete event");
    return false;
  }
}

export async function createNotification(
  userId: string,
  eventId: string,
  title: string,
  body: string | null,
  type: string,
  scheduledFor?: string
) {
  try {
    const { data, error } = await supabase
      .from("notifications")
      .insert({
        user_id: userId,
        event_id: eventId,
        title,
        body,
        type,
        scheduled_for: scheduledFor
      })
      .select();
    
    if (error) throw error;
    
    return data[0];
  } catch (error) {
    console.error("Error creating notification:", error);
    return null;
  }
}

export function getEventColor(category: string): string {
  // Return Tailwind color classes based on event category
  switch (category.toLowerCase()) {
    case 'birthday':
      return 'bg-pink-100 border-pink-300 text-pink-800';
    case 'medical':
      return 'bg-red-100 border-red-300 text-red-800';
    case 'bill':
      return 'bg-amber-100 border-amber-300 text-amber-800';
    case 'subscription':
      return 'bg-purple-100 border-purple-300 text-purple-800';
    case 'meeting':
      return 'bg-blue-100 border-blue-300 text-blue-800';
    case 'prayer':
      return 'bg-teal-100 border-teal-300 text-teal-800';
    case 'shopping':
      return 'bg-emerald-100 border-emerald-300 text-emerald-800';
    case 'cleaning':
      return 'bg-green-100 border-green-300 text-green-800';
    case 'family':
      return 'bg-indigo-100 border-indigo-300 text-indigo-800';
    default:
      return 'bg-gray-100 border-gray-300 text-gray-800';
  }
}

export function formatEventDate(startTime: string, endTime?: string, allDay?: boolean): string {
  if (allDay) {
    return format(new Date(startTime), 'MMM d, yyyy');
  }
  
  if (endTime) {
    const startDate = format(new Date(startTime), 'MMM d, yyyy');
    const endDate = format(new Date(endTime), 'MMM d, yyyy');
    
    if (startDate === endDate) {
      return `${startDate} · ${format(new Date(startTime), 'h:mm a')} - ${format(new Date(endTime), 'h:mm a')}`;
    }
    
    return `${startDate} ${format(new Date(startTime), 'h:mm a')} - ${endDate} ${format(new Date(endTime), 'h:mm a')}`;
  }
  
  return `${format(new Date(startTime), 'MMM d, yyyy · h:mm a')}`;
}

export const EVENT_SUGGESTIONS = [
  {
    title: "Family Birthday",
    description: "Celebrate a family member's special day",
    category: "birthday",
    icon: "🎂"
  },
  {
    title: "Medical Appointment",
    description: "Doctor, dentist, or other healthcare visits",
    category: "medical",
    icon: "🩺"
  },
  {
    title: "Bill Payment",
    description: "Electricity, water, internet, or other utilities",
    category: "bill",
    icon: "💰"
  },
  {
    title: "Subscription Renewal",
    description: "Streaming services, apps, or memberships",
    category: "subscription",
    icon: "📱"
  },
  {
    title: "Family Meeting",
    description: "Important discussions or planning sessions",
    category: "meeting",
    icon: "👨‍👩‍👧‍👦"
  },
  {
    title: "Prayer Time",
    description: "Regular or special prayer gatherings",
    category: "prayer",
    icon: "🙏"
  },
  {
    title: "Shopping Trip",
    description: "Grocery shopping or other purchases",
    category: "shopping",
    icon: "🛒"
  },
  {
    title: "Home Cleaning",
    description: "Regular cleaning or deep cleaning tasks",
    category: "cleaning",
    icon: "🧹"
  },
  {
    title: "Family Dinner",
    description: "Special meals or gatherings",
    category: "family",
    icon: "🍽️"
  }
];

export const CATEGORY_OPTIONS = [
  { label: "Birthday", value: "birthday" },
  { label: "Medical", value: "medical" },
  { label: "Bill", value: "bill" },
  { label: "Subscription", value: "subscription" },
  { label: "Meeting", value: "meeting" },
  { label: "Prayer", value: "prayer" },
  { label: "Shopping", value: "shopping" },
  { label: "Cleaning", value: "cleaning" },
  { label: "Family", value: "family" },
  { label: "Other", value: "other" }
];
