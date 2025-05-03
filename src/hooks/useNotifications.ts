
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  dismissNotification,
  Notification
} from "@/utils/notificationUtils";
import { useQuery } from "@tanstack/react-query";

export default function useNotifications() {
  const { user } = useAuth();
  
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["notifications", user?.id],
    queryFn: () => user?.id ? fetchNotifications(user.id) : Promise.resolve([]),
    enabled: !!user?.id
  });
  
  const markAsRead = async (notificationId: string) => {
    if (!user?.id) return false;
    const result = await markNotificationAsRead(notificationId);
    if (result) {
      refetch();
    }
    return result;
  };
  
  const markAllAsRead = async () => {
    if (!user?.id) return false;
    const result = await markAllNotificationsAsRead(user.id);
    if (result) {
      refetch();
    }
    return result;
  };
  
  const dismiss = async (notificationId: string) => {
    const result = await dismissNotification(notificationId);
    if (result) {
      refetch();
    }
    return result;
  };
  
  // Count unread notifications
  const unreadCount = data ? data.filter((item) => !item.is_read).length : 0;
  
  return {
    notifications: data as Notification[] || [],
    isLoading,
    error,
    refetch,
    markAsRead,
    markAllAsRead,
    dismiss,
    unreadCount
  };
}
