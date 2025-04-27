
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import PageLayout from '@/components/PageLayout';
import NotificationItem from '@/components/notifications/NotificationItem';
import { toast } from '@/components/ui/sonner';

// Sample data for notifications
const SAMPLE_NOTIFICATIONS = [
  {
    id: '1',
    title: 'Driver has completed "Weekly Grocery" shopping',
    time: 'Just now',
    type: 'shopping',
    isNew: true
  },
  {
    id: '2',
    title: 'Mother added 3 items to "Ramadan Preparations"',
    time: '5 minutes ago',
    type: 'shopping',
    isNew: true
  },
  {
    id: '3',
    title: 'Task "Clean refrigerator" is due tomorrow',
    time: '30 minutes ago',
    type: 'tasks',
    isNew: false
  },
  {
    id: '4',
    title: 'Rice is running low (1kg remaining)',
    time: '2 hours ago',
    type: 'pantry',
    isNew: false,
    additionalAction: 'Add to List'
  },
  {
    id: '5',
    title: 'Father added "Monthly Deep Clean" task for Saturday',
    time: '5 hours ago',
    type: 'tasks',
    isNew: false
  },
  {
    id: '6',
    title: 'Milk will expire tomorrow',
    time: 'Yesterday',
    type: 'pantry',
    isNew: false
  }
];

const NotificationsPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [notifications, setNotifications] = useState(SAMPLE_NOTIFICATIONS);
  
  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(notification => ({
      ...notification,
      isNew: false
    })));
    
    toast.success('All notifications marked as read');
  };
  
  const handleDismiss = (id: string) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
    toast.success('Notification dismissed');
  };
  
  const handleView = (id: string, type: string) => {
    // Navigate based on notification type
    if (type === 'shopping') {
      navigate('/shopping');
    } else if (type === 'tasks') {
      navigate('/spaces');
    } else if (type === 'pantry') {
      navigate('/pantry');
    }
    
    // Mark as read
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, isNew: false } : notification
    ));
  };
  
  const handleAddToList = (id: string) => {
    toast.success('Item added to shopping list');
    // In a real app, you would add the item to a shopping list
  };
  
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
        <div className="mt-2">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                title={notification.title}
                time={notification.time}
                isNew={notification.isNew}
                additionalAction={notification.additionalAction}
                onView={() => handleView(notification.id, notification.type)}
                onDismiss={() => handleDismiss(notification.id)}
                onAdditionalAction={notification.additionalAction 
                  ? () => handleAddToList(notification.id)
                  : undefined}
              />
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              No notifications to display
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default NotificationsPage;
