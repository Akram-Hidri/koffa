
import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/PageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { 
  UserCircle2, 
  Bell, 
  Moon, 
  Accessibility, 
  Globe, 
  LogOut,
  LayoutGrid,
  ChefHat,
  ArrowRight,
  Shield
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Separator } from '@/components/ui/separator';

const SettingsPage = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  
  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };
  
  const settingsGroups = [
    {
      title: "Features",
      items: [
        { 
          title: "Chef Services", 
          description: "Browse and book services from local chefs",
          icon: <ChefHat className="w-5 h-5 text-koffa-green" />, 
          path: '/services' 
        }
      ]
    },
    {
      title: "Account & Preferences",
      items: [
        { 
          title: "Personal Information", 
          description: "Update your profile and account details",
          icon: <UserCircle2 className="w-5 h-5 text-koffa-green" />, 
          path: '/settings/account' 
        },
        { 
          title: "Security", 
          description: "Password, two-factor authentication, and more",
          icon: <Shield className="w-5 h-5 text-koffa-green" />, 
          path: '/settings/account?tab=security' 
        },
        { 
          title: "Notifications", 
          description: "Manage how and when you receive notifications",
          icon: <Bell className="w-5 h-5 text-koffa-green" />, 
          path: '/settings/notifications' 
        },
        { 
          title: "Appearance", 
          description: "Change theme, colors, and display options",
          icon: <Moon className="w-5 h-5 text-koffa-green" />, 
          path: '/settings/appearance' 
        },
        { 
          title: "Navigation Bar", 
          description: "Customize the items in your navigation bar",
          icon: <LayoutGrid className="w-5 h-5 text-koffa-green" />, 
          path: '/settings/navigation' 
        }
      ]
    },
    {
      title: "Accessibility & Languages",
      items: [
        { 
          title: "Accessibility", 
          description: "Adjust font size, contrast, and other accessibility settings",
          icon: <Accessibility className="w-5 h-5 text-koffa-green" />, 
          path: '/settings/accessibility' 
        },
        { 
          title: "Language & Dialect", 
          description: "Change your preferred language and regional settings",
          icon: <Globe className="w-5 h-5 text-koffa-green" />, 
          path: '/settings/dialect' 
        }
      ]
    }
  ];
  
  return (
    <PageLayout title="Settings">
      <div className="container max-w-3xl mx-auto px-4 py-6">
        {settingsGroups.map((group, index) => (
          <div key={index} className="mb-8">
            <h2 className="text-xl font-medium text-koffa-green mb-4">{group.title}</h2>
            <div className="space-y-3">
              {group.items.map((item, itemIndex) => (
                <Card 
                  key={itemIndex} 
                  className="border-koffa-beige/30 hover:border-koffa-green/30 hover:bg-koffa-beige-light/50 transition-colors"
                  onClick={() => navigate(item.path)}
                >
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 p-2 bg-koffa-beige/50 rounded-full">
                        {item.icon}
                      </div>
                      <div>
                        <h3 className="font-medium text-koffa-green">{item.title}</h3>
                        <p className="text-sm text-koffa-green-dark">{item.description}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-koffa-green-dark" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
        
        <Separator className="my-6" />
        
        <Button 
          variant="outline" 
          className="w-full border-koffa-accent-red text-koffa-accent-red hover:bg-red-50"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" /> Sign Out
        </Button>
      </div>
    </PageLayout>
  );
};

export default SettingsPage;
