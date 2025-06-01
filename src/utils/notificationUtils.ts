
import { supabase } from '@/integrations/supabase/client';

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  body: string;
  type: string;
  read: boolean;
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
      created_at: item.created_at
    }));
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
};

export const markNotificationAsRead = async (notificationId: string) => {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId);

    if (error) throw error;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

export const markAllNotificationsAsRead = async (userId: string) => {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', userId)
      .eq('read', false);

    if (error) throw error;
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
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
