
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Home, ArrowLeft, Bell } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const NotificationSettings = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();
  
  const handleToggleNotification = (type: string) => {
    toast.info(`${type} notifications ${Math.random() > 0.5 ? 'enabled' : 'disabled'}`);
  };
  
  return (
    <div className="min-h-screen bg-koffa-beige-light pb-24">
      {/* Header */}
      <div className="bg-koffa-beige-light p-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            className="mr-2 h-8 w-8 p-0" 
            onClick={() => navigate('/settings')}
          >
            <ArrowLeft size={20} className="text-koffa-green" />
          </Button>
          <Logo size="sm" />
        </div>
        
        <h1 className="text-xl font-semibold text-koffa-green">Notifications</h1>
        
        <Button 
          variant="ghost" 
          className="rounded-full p-2 h-auto w-auto"
          onClick={() => navigate('/profile')}
        >
          <div className="w-8 h-8 rounded-full bg-koffa-beige flex items-center justify-center text-sm font-medium text-koffa-green">
            JD
          </div>
        </Button>
      </div>
      
      {/* Tab Navigation */}
      <div className="flex overflow-x-auto hide-scrollbar border-b border-koffa-beige/40">
        <Button 
          variant="ghost" 
          className="px-4 py-2 text-koffa-green-dark"
          onClick={() => navigate('/settings/account')}
        >
          <span className="mr-2">👤</span> Account
        </Button>
        <Button 
          variant="ghost" 
          className="px-4 py-2 text-koffa-green-dark"
          onClick={() => navigate('/home')}
        >
          <span className="mr-2">🏠</span> Home
        </Button>
        <Button 
          variant="ghost" 
          className="px-4 py-2 text-koffa-green-dark"
          onClick={() => navigate('/settings/appearance')}
        >
          <span className="mr-2">🎨</span> Appearance
        </Button>
        <Button 
          variant="ghost" 
          className="px-4 py-2 border-b-2 border-koffa-green text-koffa-green font-medium"
        >
          <span className="mr-2">🔔</span> Notifications
        </Button>
      </div>
      
      {/* Main content */}
      <div className="px-4 py-6">
        <Card className="border-koffa-beige/30 p-6 mb-6">
          <h2 className="text-lg font-semibold text-koffa-green mb-4">Push Notifications</h2>
          
          <div className="space-y-4">
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
          </div>
        </Card>
        
        <Card className="border-koffa-beige/30 p-6 mb-6">
          <h2 className="text-lg font-semibold text-koffa-green mb-4">Email Notifications</h2>
          
          <div className="space-y-4">
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
          </div>
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
      </div>
      
      {/* Floating Navigation */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white rounded-full shadow-lg px-6 py-3 w-[80%] max-w-sm border border-koffa-beige/20 transition-all duration-300 hover:shadow-xl">
        <div className="flex justify-around items-center">
          <Button 
            variant="ghost" 
            className="p-2 h-auto w-14 hover:bg-koffa-beige-light rounded-full transition-all duration-300"
            onClick={() => navigate('/home')}
          >
            <Home size={28} className="text-koffa-green-dark" />
          </Button>
          
          {settings.navItems.slice(1, 4).map((item, index) => {
            const getIcon = () => {
              switch (item) {
                case 'pantry':
                  return <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-koffa-green-dark">
                    <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
                    <path d="M3 9V6a2 2 0 0 1 2-2h2" />
                    <path d="M19 4V2" />
                    <path d="M15 4V2" />
                    <path d="M15 4h-5a2 2 0 0 0-2 2v3" />
                  </svg>;
                case 'shopping':
                  return <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-koffa-green-dark">
                    <path d="M8 3H5a2 2 0 0 0-2 2v3" />
                    <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
                    <path d="M3 16v3a2 2 0 0 0 2 2h3" />
                    <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
                  </svg>;
                default:
                  return <Home size={28} className="text-koffa-green-dark" />;
              }
            };
            
            return (
              <Button 
                key={index}
                variant="ghost" 
                className="p-2 h-auto w-14 hover:bg-koffa-beige-light rounded-full transition-all duration-300"
                onClick={() => navigate(`/${item}`)}
              >
                {getIcon()}
              </Button>
            );
          })}
          
          <Button 
            variant="ghost" 
            className="p-2 h-auto w-14 hover:bg-koffa-beige-light rounded-full transition-all duration-300"
            onClick={() => navigate('/profile')}
          >
            <div className="w-8 h-8 rounded-full bg-koffa-beige flex items-center justify-center text-sm font-medium text-koffa-green">
              JD
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;
