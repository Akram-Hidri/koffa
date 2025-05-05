
import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from './PageLayout';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface SettingsLayoutProps {
  children: React.ReactNode;
  title: string;
  activeTab: 'profile' | 'security' | 'notifications' | 'navigation' | 'appearance' | 'accessibility' | 'dialect';
}

const SettingsLayout: React.FC<SettingsLayoutProps> = ({ children, title, activeTab }) => {
  const navigate = useNavigate();
  
  return (
    <PageLayout title={title}>
      <div className="container max-w-3xl mx-auto px-4 py-6">
        <Tabs defaultValue={activeTab} className="w-full mb-6" onValueChange={(value) => {
          switch(value) {
            case 'profile':
              navigate('/settings/account');
              break;
            case 'security':
              navigate('/settings/account?tab=security');
              break;
            case 'notifications':
              navigate('/settings/notifications');
              break;
            case 'navigation':
              navigate('/settings/navigation');
              break;
            case 'appearance':
              navigate('/settings/appearance');
              break;
            case 'accessibility':
              navigate('/settings/accessibility');
              break;
            case 'dialect':
              navigate('/settings/dialect');
              break;
          }
        }}>
          <TabsList className="grid grid-cols-4 w-full mb-4 bg-koffa-beige/50">
            <TabsTrigger value="profile" className="data-[state=active]:bg-koffa-green data-[state=active]:text-white">
              Profile
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-koffa-green data-[state=active]:text-white">
              Security
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-koffa-green data-[state=active]:text-white">
              Notifications
            </TabsTrigger>
            <TabsTrigger value="more" className="data-[state=active]:bg-koffa-green data-[state=active]:text-white">
              More
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        {children}
      </div>
    </PageLayout>
  );
};

export default SettingsLayout;
