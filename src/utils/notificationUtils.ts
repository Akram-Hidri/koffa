
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

export type Notification = {
  id: string;
  title: string;
  body?: string | null;
  type: string;
  is_read: boolean | null;
  created_at: string;
  user_id: string;
  event_id?: string | null;
  scheduled_for?: string | null;
};

export async function fetchNotifications(userId: string) {
  try {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }
}

export async function markNotificationAsRead(notificationId: string) {
  try {
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", notificationId);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return false;
  }
}

export async function markAllNotificationsAsRead(userId: string) {
  try {
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", userId);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    return false;
  }
}

export async function dismissNotification(notificationId: string) {
  try {
    const { error } = await supabase
      .from("notifications")
      .delete()
      .eq("id", notificationId);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error dismissing notification:", error);
    return false;
  }
}

export function formatNotificationTime(timestamp: string): string {
  try {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  } catch (error) {
    console.error("Error formatting time:", error);
    return "Unknown time";
  }
}

export async function createEventNotification(
  userId: string,
  eventId: string,
  title: string,
  body: string | null,
  type: string = "calendar",
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
      })
      .select();
    
    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error("Error creating notification:", error);
    return null;
  }
}
