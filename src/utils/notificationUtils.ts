
import { supabase } from '@/integrations/supabase/client';
import { createFamilyInvitation } from './invitationUtils';

/**
 * Type definition for Notification
 */
export interface Notification {
  id: string;
  title: string;
  body: string | null;
  type: string;
  is_read: boolean;
  user_id: string;
  created_at: string;
  related_item_id?: string | null;
  action_url?: string | null;
}

/**
 * Creates an event notification for a user
 */
export const createEventNotification = async (
  userId: string,
  relatedItemId: string | null,
  title: string,
  body: string,
  type: string,
  actionUrl?: string
) => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        title,
        body,
        type,
        related_item_id: relatedItemId,
        action_url: actionUrl,
        is_read: false
      })
      .select();
    
    if (error) throw error;
    
    return data[0];
  } catch (error) {
    console.error('Error creating notification:', error);
    return null;
  }
};

/**
 * Fetches notifications for a user
 */
export const fetchNotifications = async (userId: string): Promise<Notification[]> => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data as Notification[];
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
};

/**
 * Marks a notification as read
 */
export const markNotificationAsRead = async (notificationId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return false;
  }
};

/**
 * Marks all notifications as read for a user
 */
export const markAllNotificationsAsRead = async (userId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return false;
  }
};

/**
 * Dismisses (deletes) a notification
 */
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

/**
 * Formats notification time for display
 */
export const formatNotificationTime = (createdAt: string): string => {
  const now = new Date();
  const notificationDate = new Date(createdAt);
  const diffInSeconds = Math.floor((now.getTime() - notificationDate.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'Just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days !== 1 ? 's' : ''} ago`;
  } else {
    return notificationDate.toLocaleDateString();
  }
};

/**
 * Sends an email invitation to join a family
 */
export const sendEmailInvitation = async (email: string, familyId: string, inviterId: string) => {
  try {
    const code = await createFamilyInvitation(familyId, inviterId);
    
    // This would integrate with an email service
    console.log(`Would send invitation email to ${email} with code ${code}`);
    
    return { success: true, code };
  } catch (error) {
    console.error('Error sending email invitation:', error);
    throw error;
  }
};

/**
 * Sends an SMS invitation to join a family
 */
export const sendSMSInvitation = async (phoneNumber: string, familyId: string, inviterId: string) => {
  try {
    const code = await createFamilyInvitation(familyId, inviterId);
    
    // This would integrate with an SMS service
    console.log(`Would send invitation SMS to ${phoneNumber} with code ${code}`);
    
    return { success: true, code };
  } catch (error) {
    console.error('Error sending SMS invitation:', error);
    throw error;
  }
};
