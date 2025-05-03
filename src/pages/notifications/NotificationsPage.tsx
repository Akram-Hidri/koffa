
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Settings, Loader2 } from 'lucide-react';
import PageLayout from '@/components/PageLayout';
import NotificationItem from '@/components/notifications/NotificationItem';
import { toast } from 'sonner';
import useNotifications from '@/hooks/useNotifications';
import { formatNotificationTime } from '@/utils/notificationUtils';

const NotificationsPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  
  const { 
    notifications, 
    isLoading, 
    markAsRead, 
    markAllAsRead,
    dismiss 
  } = useNotifications();
  
  const handleMarkAllAsRead = async () => {
    const success = await markAllAsRead();
    if (success) {
      toast.success('All notifications marked as read');
    }
  };
  
  const handleDismiss = async (id: string) => {
    const success = await dismiss(id);
    if (success) {
      toast.success('Notification dismissed');
    }
  };
  
  const handleView = async (id: string, type: string) => {
    // Mark notification as read
    await markAsRead(id);
    
    // Navigate based on notification type
    if (type === 'shopping') {
      navigate('/shopping');
    } else if (type === 'tasks') {
      navigate('/spaces');
    } else if (type === 'pantry') {
      navigate('/pantry');
    } else if (type === 'calendar') {
      navigate('/calendar');
    }
  };
  
  const handleAddToList = (id: string) => {
    toast.success('Item added to shopping list');
    // In a real app, you would add the item to a shopping list
  };
  
  // Filter notifications based on the active tab
  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 'all') return true;
    return notification.type === activeTab;
  });

  return (
    <PageLayout title="Notifications">
      <div className="space-y-4">
        {/* Tab navigation */}
        <div className="flex items-center border-b overflow-x-auto hide-scrollbar pb-2">
          <Button 
            variant={activeTab === 'all' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('all')}
            className="rounded-full whitespace-nowrap"
          >
            🔔 All
          </Button>
          <Button 
            variant={activeTab === 'tasks' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('tasks')}
            className="rounded-full whitespace-nowrap"
          >
            📋 Tasks
          </Button>
          <Button 
            variant={activeTab === 'shopping' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('shopping')}
            className="rounded-full whitespace-nowrap"
          >
            🛒 Shopping
          </Button>
          <Button 
            variant={activeTab === 'pantry' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('pantry')}
            className="rounded-full whitespace-nowrap"
          >
            📦 Pantry
          </Button>
          <Button 
            variant={activeTab === 'calendar' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('calendar')}
            className="rounded-full whitespace-nowrap"
          >
            📅 Calendar
          </Button>
        </div>
        
        {/* Actions */}
        <div className="flex justify-between items-center">
          <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead}>
            Mark All as Read
          </Button>
          <Button variant="ghost" size="sm" onClick={() => navigate('/settings/notifications')}>
            <Settings className="h-4 w-4 mr-1" />
            Settings
          </Button>
        </div>
        
        {/* Notifications list */}
        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-koffa-green" />
          </div>
        ) : (
          <div className="mt-2">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  id={notification.id}
                  title={notification.title}
                  time={formatNotificationTime(notification.created_at)}
                  isNew={!notification.is_read}
                  type={notification.type}
                  additionalAction={notification.type === 'pantry' ? 'Add to List' : undefined}
                  onView={handleView}
                  onDismiss={handleDismiss}
                  onAdditionalAction={notification.type === 'pantry' ? handleAddToList : undefined}
                />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No notifications to display
              </div>
            )}
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default NotificationsPage;
