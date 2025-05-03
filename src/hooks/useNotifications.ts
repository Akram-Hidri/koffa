
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
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function useNotifications() {
  const { user } = useAuth();
  
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["notifications", user?.id],
    queryFn: () => user?.id ? fetchNotifications(user.id) : Promise.resolve([]),
    enabled: !!user?.id
  });
  
  // Subscribe to real-time notifications
  useEffect(() => {
    if (!user?.id) return;
    
    // Subscribe to real-time notifications for this user
    const channel = supabase
      .channel('public:notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('New notification received:', payload);
          refetch();
          
          // Show a toast for the new notification
          const notification = payload.new as Notification;
          toast.info(notification.title, {
            description: notification.body || '',
            action: {
              label: 'View',
              onClick: () => {
                markAsRead(notification.id);
              }
            }
          });
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, refetch]);
  
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
  
  // Group notifications by type
  const groupedNotifications = () => {
    if (!data) return {};
    
    return data.reduce((groups: Record<string, Notification[]>, notification) => {
      const type = notification.type || 'other';
      if (!groups[type]) {
        groups[type] = [];
      }
      groups[type].push(notification);
      return groups;
    }, {});
  };
  
  return {
    notifications: data as Notification[] || [],
    groupedNotifications: groupedNotifications(),
    isLoading,
    error,
    refetch,
    markAsRead,
    markAllAsRead,
    dismiss,
    unreadCount
  };
}
