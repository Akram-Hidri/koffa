
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';
import { toast } from 'sonner';
import { useSettings } from '@/contexts/SettingsContext';
import SettingsLayout from '@/components/SettingsLayout';

const NotificationSettings = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();
  
  const handleToggleNotification = (type: string) => {
    toast.success(`${type} notifications ${Math.random() > 0.5 ? 'enabled' : 'disabled'}`);
  };
  
  return (
    <SettingsLayout title="Notification Settings" activeTab="notifications">
      <Card className="border-koffa-beige/30 p-6 mb-6">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-lg font-semibold text-koffa-green">Push Notifications</CardTitle>
          <CardDescription>Control how you receive push notifications</CardDescription>
        </CardHeader>
        <CardContent className="px-0 space-y-4">
          {[
            { id: 'groceries', label: 'Grocery reminders', description: 'Get notified when items are running low' },
            { id: 'specials', label: 'Special offers', description: 'Notifications about discounts and deals' },
            { id: 'list-updates', label: 'Shopping list updates', description: 'When family members update shared lists' },
            { id: 'reminders', label: 'Calendar reminders', description: 'Important date and event reminders' },
          ].map(item => (
            <div key={item.id} className="flex items-center justify-between">
              <div>
                <Label htmlFor={item.id} className="text-koffa-green">{item.label}</Label>
                <p className="text-xs text-koffa-green-dark">{item.description}</p>
              </div>
              <Switch 
                id={item.id} 
                defaultChecked={true}
                onCheckedChange={() => handleToggleNotification(item.label)} 
              />
            </div>
          ))}
        </CardContent>
      </Card>
        
      <Card className="border-koffa-beige/30 p-6 mb-6">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-lg font-semibold text-koffa-green">Email Notifications</CardTitle>
          <CardDescription>Control how you receive email notifications</CardDescription>
        </CardHeader>
        <CardContent className="px-0 space-y-4">
          {[
            { id: 'weekly-summary', label: 'Weekly summary', description: 'A weekly report of your shopping activities' },
            { id: 'account-updates', label: 'Account updates', description: 'Important information about your account' },
            { id: 'marketing', label: 'Marketing emails', description: 'Promotional offers and newsletters' },
          ].map(item => (
            <div key={item.id} className="flex items-center justify-between">
              <div>
                <Label htmlFor={item.id} className="text-koffa-green">{item.label}</Label>
                <p className="text-xs text-koffa-green-dark">{item.description}</p>
              </div>
              <Switch 
                id={item.id} 
                defaultChecked={item.id !== 'marketing'}
                onCheckedChange={() => handleToggleNotification(item.label)} 
              />
            </div>
          ))}
        </CardContent>
      </Card>
        
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
