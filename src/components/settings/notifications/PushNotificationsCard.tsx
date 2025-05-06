
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface PushNotificationItem {
  id: string;
  label: string;
  description: string;
}

const pushNotificationItems: PushNotificationItem[] = [
  { id: 'groceries', label: 'Grocery reminders', description: 'Get notified when items are running low' },
  { id: 'specials', label: 'Special offers', description: 'Notifications about discounts and deals' },
  { id: 'list-updates', label: 'Shopping list updates', description: 'When family members update shared lists' },
  { id: 'reminders', label: 'Calendar reminders', description: 'Important date and event reminders' },
];

const PushNotificationsCard: React.FC = () => {
  const handleToggleNotification = (type: string) => {
    toast.success(`${type} notifications ${Math.random() > 0.5 ? 'enabled' : 'disabled'}`);
  };

  return (
    <Card className="border-koffa-beige/30 p-6 mb-6">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-lg font-semibold text-koffa-green">Push Notifications</CardTitle>
        <CardDescription>Control how you receive push notifications</CardDescription>
      </CardHeader>
      <CardContent className="px-0 space-y-4">
        {pushNotificationItems.map(item => (
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
  );
};

export default PushNotificationsCard;
