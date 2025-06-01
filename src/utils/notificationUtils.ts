
import { supabase } from '@/integrations/supabase/client';

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  body: string;
  type: string;
  read: boolean;
  is_read: boolean; // Add this for compatibility
  created_at: string;
}

export const createNotification = async (
  userId: string,
  title: string,
  body: string,
  type: string = 'info'
) => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        title,
        body,
        type,
        read: false
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

// Add the missing createEventNotification function
export const createEventNotification = async (
  userId: string,
  eventId: string,
  title: string,
  body: string,
  type: string = 'info'
) => {
  return createNotification(userId, title, body, type);
};

// Add the missing fetchNotifications function
export const fetchNotifications = async (userId: string): Promise<Notification[]> => {
  return getUserNotifications(userId);
};

export const getUserNotifications = async (userId: string): Promise<Notification[]> => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    // Transform data to match our interface
    return (data || []).map(item => ({
      id: item.id,
      user_id: item.user_id,
      title: item.title,
      body: item.body,
      type: item.type,
      read: item.read,
      is_read: item.read, // Add for compatibility
      created_at: item.created_at
    }));
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
};

export const markNotificationAsRead = async (notificationId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return false;
  }
};

export const markAllNotificationsAsRead = async (userId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', userId)
      .eq('read', false);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return false;
  }
};

// Add the missing dismissNotification function
export const dismissNotification = async (notificationId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error dismissing notification:', error);
    return false;
  }
};

// Add the missing formatNotificationTime function
export const formatNotificationTime = (timestamp: string): string => {
  const now = new Date();
  const notificationTime = new Date(timestamp);
  const diffInMinutes = Math.floor((now.getTime() - notificationTime.getTime()) / (1000 * 60));

  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;
  
  return notificationTime.toLocaleDateString();
};

// Helper function to create common notification types
export const createPantryNotification = (userId: string, itemName: string, type: 'expiring' | 'low_stock') => {
  const notifications = {
    expiring: {
      title: 'Item Expiring Soon',
      body: `${itemName} is expiring soon. Check your pantry!`,
      type: 'warning'
    },
    low_stock: {
      title: 'Low Stock Alert',
      body: `${itemName} is running low. Consider restocking.`,
      type: 'info'
    }
  };

  const notification = notifications[type];
  return createNotification(userId, notification.title, notification.body, notification.type);
};
