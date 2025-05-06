
import React from 'react';
import { useLocation } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SettingsLayout from '@/components/SettingsLayout';
import ProfileTab from '@/components/settings/account/ProfileTab';
import SecurityTab from '@/components/settings/account/SecurityTab';

const AccountSettings = () => {
  const location = useLocation();
  
  // Get the tab from URL query params
  const urlParams = new URLSearchParams(location.search);
  const tabFromUrl = urlParams.get('tab') || 'profile';

  return (
    <SettingsLayout title="Account Settings" activeTab="profile">
      <Tabs defaultValue={tabFromUrl} className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger 
            value="profile" 
            className="data-[state=active]:bg-koffa-green data-[state=active]:text-white"
          >
            Profile
          </TabsTrigger>
          <TabsTrigger 
            value="security"
            className="data-[state=active]:bg-koffa-green data-[state=active]:text-white"
          >
            Security
          </TabsTrigger>
        </TabsList>
        
        {/* Profile Tab */}
        <TabsContent value="profile">
          <ProfileTab />
        </TabsContent>
        
        {/* Security Tab */}
        <TabsContent value="security">
          <SecurityTab />
        </TabsContent>
      </Tabs>
    </SettingsLayout>
  );
};

export default AccountSettings;
