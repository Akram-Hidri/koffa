
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useSettings } from '@/contexts/SettingsContext';
import SettingsLayout from '@/components/SettingsLayout';
import PushNotificationsCard from '@/components/settings/notifications/PushNotificationsCard';
import EmailNotificationsCard from '@/components/settings/notifications/EmailNotificationsCard';

const NotificationSettings = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();
  
  return (
    <SettingsLayout title="Notification Settings" activeTab="notifications">
      <PushNotificationsCard />
      <EmailNotificationsCard />
        
      <Button 
        className="w-full bg-koffa-green hover:bg-koffa-green-dark text-white"
        onClick={() => {
          toast.success("Notification settings saved");
          navigate('/settings');
        }}
      >
        Save Changes
      </Button>
    </SettingsLayout>
  );
};

export default NotificationSettings;
