
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Logo from '@/components/Logo';
import { useAuth } from '@/contexts/AuthContext';
import PageNavigation from '@/components/PageNavigation';
import { ArrowLeft, User, Settings } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UserProfile {
  username?: string;
  family_id?: string;
  family_name?: string;
}

const ProfilePage = () => {
  const navigate = useNavigate();
  const { session, signOut, user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        // Fetch user profile data
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('username, family_id')
          .eq('id', user.id)
          .single();
          
        if (profileError && profileError.code !== 'PGRST116') {
          throw profileError;
        }
        
        // If user has a family, fetch family name
        let familyName = null;
        if (profileData?.family_id) {
          const { data: familyData, error: familyError } = await supabase
            .from('families')
            .select('name')
            .eq('id', profileData.family_id)
            .single();
            
          if (familyError && familyError.code !== 'PGRST116') {
            throw familyError;
          }
          
          familyName = familyData?.name;
        }
        
        setProfile({
          username: profileData?.username,
          family_id: profileData?.family_id,
          family_name: familyName
        });
      } catch (error: any) {
        toast.error(`Failed to load profile: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfile();
  }, [user]);
  
  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (profile?.username) {
      return profile.username.substring(0, 2).toUpperCase();
    }
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return 'U';
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
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-pulse p-4 rounded-full bg-koffa-green/10">
              <div className="h-8 w-8 rounded-full border-2 border-koffa-green border-t-transparent animate-spin"></div>
            </div>
          </div>
        ) : (
          <Card className="border-koffa-beige/30 p-6 mb-6 flex items-center">
            <div className="mr-4 w-16 h-16 rounded-full bg-koffa-beige flex items-center justify-center text-2xl font-medium text-koffa-green">
              {getUserInitials()}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-koffa-green">
                {profile?.username || user?.email?.split('@')[0] || 'User'}
              </h2>
              <p className="text-koffa-green-dark">{user?.email}</p>
              {profile?.family_name && (
                <p className="text-sm text-koffa-green-dark mt-1">
                  Family: {profile.family_name}
                </p>
              )}
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
        )}

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
