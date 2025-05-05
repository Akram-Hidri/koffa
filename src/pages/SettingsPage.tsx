
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Logo from '@/components/Logo';
import PageNavigation from '@/components/PageNavigation';
import { 
  ArrowLeft, 
  Moon, 
  UserCircle2, 
  Bell, 
  Accessibility, 
  Globe, 
  LogOut,
  LayoutGrid,
  ChefHat
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const SettingsPage = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  
  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };
  
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
            <ArrowLeft size={20} className="text-koffa-green" />
          </Button>
          <Logo size="sm" />
        </div>
        
        <h1 className="text-xl font-semibold text-koffa-green">Settings</h1>
        
        <div className="w-8"></div> {/* Spacer for alignment */}
      </div>
      
      {/* Main content */}
      <div className="px-4 py-6">
        <h2 className="text-koffa-green font-medium mb-4">Features</h2>
        
        <Card className="border-koffa-beige/30 p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <ChefHat size={20} className="text-koffa-green mr-3" />
              <span className="text-koffa-green">Chef Services</span>
            </div>
            <Button 
              variant="ghost" 
              onClick={() => navigate('/services')}
              className="p-2 h-8 w-8"
            >
              <ArrowLeft size={16} className="rotate-180 text-koffa-green" />
            </Button>
          </div>
        </Card>

        <h2 className="text-koffa-green font-medium mb-4">Preferences</h2>
        
        <Card className="border-koffa-beige/30 p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Moon size={20} className="text-koffa-green mr-3" />
              <span className="text-koffa-green">Appearance</span>
            </div>
            <Button 
              variant="ghost" 
              onClick={() => navigate('/settings/appearance')}
              className="p-2 h-8 w-8"
            >
              <ArrowLeft size={16} className="rotate-180 text-koffa-green" />
            </Button>
          </div>
        </Card>
        
        <Card className="border-koffa-beige/30 p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <UserCircle2 size={20} className="text-koffa-green mr-3" />
              <span className="text-koffa-green">Account</span>
            </div>
            <Button 
              variant="ghost" 
              onClick={() => navigate('/settings/account')}
              className="p-2 h-8 w-8"
            >
              <ArrowLeft size={16} className="rotate-180 text-koffa-green" />
            </Button>
          </div>
        </Card>
        
        <Card className="border-koffa-beige/30 p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Bell size={20} className="text-koffa-green mr-3" />
              <span className="text-koffa-green">Notifications</span>
            </div>
            <Button 
              variant="ghost" 
              onClick={() => navigate('/settings/notifications')}
              className="p-2 h-8 w-8"
            >
              <ArrowLeft size={16} className="rotate-180 text-koffa-green" />
            </Button>
          </div>
        </Card>

        <Card className="border-koffa-beige/30 p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <LayoutGrid size={20} className="text-koffa-green mr-3" />
              <span className="text-koffa-green">Navigation Bar</span>
            </div>
            <Button 
              variant="ghost" 
              onClick={() => navigate('/settings/navigation')}
              className="p-2 h-8 w-8"
            >
              <ArrowLeft size={16} className="rotate-180 text-koffa-green" />
            </Button>
          </div>
        </Card>
        
        <h2 className="text-koffa-green font-medium mb-4 mt-6">Accessibility & Languages</h2>
        
        <Card className="border-koffa-beige/30 p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Accessibility size={20} className="text-koffa-green mr-3" />
              <span className="text-koffa-green">Accessibility</span>
            </div>
            <Button 
              variant="ghost" 
              onClick={() => navigate('/settings/accessibility')}
              className="p-2 h-8 w-8"
            >
              <ArrowLeft size={16} className="rotate-180 text-koffa-green" />
            </Button>
          </div>
        </Card>
        
        <Card className="border-koffa-beige/30 p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Globe size={20} className="text-koffa-green mr-3" />
              <span className="text-koffa-green">Language & Dialect</span>
            </div>
            <Button 
              variant="ghost" 
              onClick={() => navigate('/settings/dialect')}
              className="p-2 h-8 w-8"
            >
              <ArrowLeft size={16} className="rotate-180 text-koffa-green" />
            </Button>
          </div>
        </Card>
        
        <Button 
          variant="outline" 
          className="w-full border-koffa-red text-koffa-red"
          onClick={handleSignOut}
        >
          <LogOut size={16} className="mr-2" /> Sign Out
        </Button>
      </div>
      
      {/* Navigation */}
      <PageNavigation />
    </div>
  );
};

export default SettingsPage;
