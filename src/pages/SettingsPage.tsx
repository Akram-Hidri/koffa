
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { User, Home, Palette, Bell } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';

const SettingsPage = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();
  
  const settingsCategories = [
    {
      title: "Account",
      icon: User,
      description: "Manage your profile, security, and account preferences",
      path: "/settings/account"
    },
    {
      title: "Home",
      icon: Home,
      description: "Customize your home screen layout and widgets",
      path: "/home"
    },
    {
      title: "Appearance",
      icon: Palette,
      description: "Change the look and feel of your app",
      path: "/settings/appearance"
    },
    {
      title: "Notifications",
      icon: Bell,
      description: "Control your notification preferences",
      path: "/settings/notifications"
    }
  ];
  
  return (
    <div className="min-h-screen bg-koffa-beige-light pb-24">
      {/* Header */}
      <div className="bg-koffa-beige-light p-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            className="mr-2 h-8 w-8 p-0" 
            onClick={() => navigate('/home')}
          >
            <Home size={20} className="text-koffa-green" />
          </Button>
          <Logo size="sm" />
        </div>
        
        <h1 className="text-xl font-semibold text-koffa-green">Settings</h1>
        
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
      
      {/* Main content */}
      <div className="px-4 py-6">
        <div className="grid grid-cols-1 gap-4 mb-8">
          {settingsCategories.map((category) => (
            <Card 
              key={category.title}
              className="border-koffa-beige/30 p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(category.path)}
            >
              <div className="flex items-center gap-4">
                <div className="bg-koffa-beige/40 w-12 h-12 rounded-full flex items-center justify-center">
                  <category.icon size={24} className="text-koffa-green" />
                </div>
                <div>
                  <h3 className="font-medium text-koffa-green">{category.title}</h3>
                  <p className="text-sm text-koffa-green-dark">{category.description}</p>
                </div>
              </div>
            </Card>
          ))}
          
          {/* Accessibility card - highlight this special feature */}
          <Card 
            className="border-koffa-beige/30 p-4 hover:shadow-md transition-shadow cursor-pointer bg-gradient-to-r from-koffa-green/10 to-koffa-beige/30"
            onClick={() => navigate('/settings/accessibility')}
          >
            <div className="flex items-center gap-4">
              <div className="bg-koffa-green/20 w-12 h-12 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-koffa-green">
                  <circle cx="16" cy="4" r="1" />
                  <path d="m18 19 1-7-6 1" />
                  <path d="m5 8 3-3 5.5 3-2.36 3.5" />
                  <path d="M4.24 14.5a5 5 0 0 0 6.88 6" />
                  <path d="M13.76 17.5a5 5 0 0 0-6.88-6" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-koffa-green">Accessibility</h3>
                  <span className="text-xs bg-koffa-green/20 text-koffa-green px-2 py-0.5 rounded-full">New</span>
                </div>
                <p className="text-sm text-koffa-green-dark">Customize accessibility settings for a better experience</p>
              </div>
            </div>
          </Card>
        </div>
        
        <div className="text-center mt-12">
          <p className="text-sm text-koffa-green-dark mb-2">App Version: 1.0.0</p>
          <Button 
            variant="link" 
            className="text-koffa-accent-blue text-sm p-0 h-auto"
            onClick={() => window.open('https://lovable.dev', '_blank')}
          >
            Terms of Service
          </Button>
          <span className="text-koffa-green-dark mx-2">•</span>
          <Button 
            variant="link" 
            className="text-koffa-accent-blue text-sm p-0 h-auto"
            onClick={() => window.open('https://lovable.dev', '_blank')}
          >
            Privacy Policy
          </Button>
        </div>
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

export default SettingsPage;
