
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface EmailNotificationItem {
  id: string;
  label: string;
  description: string;
  defaultEnabled: boolean;
}

const emailNotificationItems: EmailNotificationItem[] = [
  { id: 'weekly-summary', label: 'Weekly summary', description: 'A weekly report of your shopping activities', defaultEnabled: true },
  { id: 'account-updates', label: 'Account updates', description: 'Important information about your account', defaultEnabled: true },
  { id: 'marketing', label: 'Marketing emails', description: 'Promotional offers and newsletters', defaultEnabled: false },
];

const EmailNotificationsCard: React.FC = () => {
  const handleToggleNotification = (type: string) => {
    toast.success(`${type} notifications ${Math.random() > 0.5 ? 'enabled' : 'disabled'}`);
  };

  return (
    <Card className="border-koffa-beige/30 p-6 mb-6">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-lg font-semibold text-koffa-green">Email Notifications</CardTitle>
        <CardDescription>Control how you receive email notifications</CardDescription>
      </CardHeader>
      <CardContent className="px-0 space-y-4">
        {emailNotificationItems.map(item => (
          <div key={item.id} className="flex items-center justify-between">
            <div>
              <Label htmlFor={item.id} className="text-koffa-green">{item.label}</Label>
              <p className="text-xs text-koffa-green-dark">{item.description}</p>
            </div>
            <Switch 
              id={item.id} 
              defaultChecked={item.defaultEnabled}
              onCheckedChange={() => handleToggleNotification(item.label)} 
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default EmailNotificationsCard;
