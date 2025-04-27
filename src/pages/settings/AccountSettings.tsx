
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Home, ArrowLeft, User } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import { toast } from 'sonner';

const AccountSettings = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();
  
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
        
        <h1 className="text-xl font-semibold text-koffa-green">Account</h1>
        
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
          className="px-4 py-2 border-b-2 border-koffa-green text-koffa-green font-medium"
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
          className="px-4 py-2 text-koffa-green-dark"
          onClick={() => navigate('/settings/notifications')}
        >
          <span className="mr-2">🔔</span> Notifications
        </Button>
      </div>
      
      {/* Main content */}
      <div className="px-4 py-6">
        <Card className="border-koffa-beige/30 p-6 mb-6 flex items-center">
          <div className="mr-4 w-16 h-16 rounded-full bg-koffa-beige flex items-center justify-center text-2xl font-medium text-koffa-green">
            JD
          </div>
          <div>
            <h2 className="text-lg font-semibold text-koffa-green">John Doe</h2>
            <p className="text-koffa-green-dark">john.doe@example.com</p>
            <Button 
              variant="link" 
              className="p-0 h-auto text-koffa-accent-blue text-sm"
              onClick={() => toast.info("Edit profile coming soon")}
            >
              Edit Profile
            </Button>
          </div>
        </Card>
        
        <p className="text-center text-koffa-green-dark">
          Full Account Settings functionality coming soon.
        </p>
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

export default AccountSettings;
