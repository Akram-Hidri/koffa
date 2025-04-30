
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Logo from '@/components/Logo';
import { useAuth } from '@/contexts/AuthContext';
import PageNavigation from '@/components/PageNavigation';
import { ArrowLeft, User, Settings } from 'lucide-react';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { session, signOut } = useAuth();
  
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
        
        <h1 className="text-xl font-semibold text-koffa-green">Profile</h1>
        
        <Button 
          variant="ghost" 
          className="rounded-full p-2 h-auto w-auto"
          onClick={() => navigate('/settings')}
        >
          <Settings size={20} className="text-koffa-green" />
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
            <p className="text-koffa-green-dark">{session?.user?.email || 'john.doe@example.com'}</p>
            <div className="mt-2 space-x-2">
              <Button 
                size="sm"
                variant="outline" 
                className="border-koffa-green text-koffa-green"
                onClick={() => navigate('/settings/account')}
              >
                Edit Profile
              </Button>
              <Button 
                size="sm"
                variant="outline" 
                className="border-koffa-red text-koffa-red"
                onClick={handleSignOut}
              >
                Sign Out
              </Button>
            </div>
          </div>
        </Card>

        <Card className="border-koffa-beige/30 p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Settings size={20} className="text-koffa-green mr-3" />
              <span className="text-koffa-green">Settings</span>
            </div>
            <Button 
              variant="ghost" 
              onClick={() => navigate('/settings')}
              className="p-2 h-8 w-8"
            >
              <ArrowLeft size={16} className="rotate-180 text-koffa-green" />
            </Button>
          </div>
        </Card>
        
        <Card className="border-koffa-beige/30 p-4">
          <div className="text-center">
            <p className="text-sm text-koffa-green-dark mb-2">App Version: 1.0.0</p>
            <div className="mt-2">
              <Button 
                variant="link" 
                className="text-koffa-accent-blue text-sm p-0 h-auto"
              >
                Terms of Service
              </Button>
              <span className="text-koffa-green-dark mx-2">•</span>
              <Button 
                variant="link" 
                className="text-koffa-accent-blue text-sm p-0 h-auto"
              >
                Privacy Policy
              </Button>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Consistent Navigation */}
      <PageNavigation />
    </div>
  );
};

export default ProfilePage;
