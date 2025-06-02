
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  ShoppingCart, 
  Calendar, 
  Users, 
  CheckSquare, 
  Book,
  Settings,
  Bell,
  ChefHat
} from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';

interface DashboardTileProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  onClick: () => void;
  size?: 'normal' | 'large';
  notifications?: number;
}

const DashboardTile: React.FC<DashboardTileProps> = ({ 
  title, 
  description, 
  icon, 
  color, 
  onClick, 
  size = 'normal',
  notifications = 0
}) => {
  const isLarge = size === 'large';
  
  return (
    <Card 
      className={`
        ${isLarge ? 'col-span-2 h-32' : 'h-28'} 
        p-6 cursor-pointer hover:shadow-lg transition-all duration-200 
        border-l-4 relative overflow-hidden group
        hover:scale-105 transform
      `}
      style={{ borderLeftColor: color }}
      onClick={onClick}
    >
      <div className="flex items-center justify-between h-full">
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-koffa-green mb-1">{title}</h3>
          <p className="text-sm text-koffa-green-dark">{description}</p>
        </div>
        <div className="relative">
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center ml-4 group-hover:scale-110 transition-transform"
            style={{ backgroundColor: `${color}20` }}
          >
            <div style={{ color }}>{icon}</div>
          </div>
          {notifications > 0 && (
            <div className="absolute -top-2 -right-2 bg-koffa-accent-red text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
              {notifications > 9 ? '9+' : notifications}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

const FamilyDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();
  
  const familySize = settings.familyMembers.length + settings.staffMembers.length;
  const pendingTasks = 5; // This would come from actual data
  const upcomingEvents = 3; // This would come from actual data

  const tiles = [
    {
      title: 'Family Spaces',
      description: `Manage ${familySize} family spaces`,
      icon: <Home size={24} />,
      color: '#586b4d',
      onClick: () => navigate('/spaces'),
      size: 'large' as const,
      notifications: 0
    },
    {
      title: 'Shopping Lists',
      description: 'Plan family groceries',
      icon: <ShoppingCart size={24} />,
      color: '#6a798f',
      onClick: () => navigate('/shopping'),
      notifications: 2
    },
    {
      title: 'Family Calendar',
      description: `${upcomingEvents} upcoming events`,
      icon: <Calendar size={24} />,
      color: '#E6A44E',
      onClick: () => navigate('/calendar'),
      notifications: upcomingEvents
    },
    {
      title: 'Family Members',
      description: `${familySize} family members`,
      icon: <Users size={24} />,
      color: '#C05746',
      onClick: () => navigate('/family')
    },
    {
      title: 'Family Tasks',
      description: `${pendingTasks} pending tasks`,
      icon: <CheckSquare size={24} />,
      color: '#98948c',
      onClick: () => navigate('/tasks'),
      notifications: pendingTasks
    },
    {
      title: 'Family Recipes',
      description: 'Share favorite meals',
      icon: <Book size={24} />,
      color: '#586b4d',
      onClick: () => navigate('/recipes')
    },
    {
      title: 'Chef Services',
      description: 'Book family meals',
      icon: <ChefHat size={24} />,
      color: '#6a798f',
      onClick: () => navigate('/services')
    },
    {
      title: 'Notifications',
      description: 'Family updates',
      icon: <Bell size={24} />,
      color: '#E6A44E',
      onClick: () => navigate('/notifications'),
      notifications: 4
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-koffa-green mb-2">
          Welcome to Your Family Hub
        </h1>
        <p className="text-lg text-koffa-green-dark">
          Managing life together, one space at a time
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 max-w-4xl mx-auto">
        {tiles.map((tile, index) => (
          <DashboardTile key={index} {...tile} />
        ))}
      </div>

      <div className="flex justify-center mt-8">
        <Button 
          variant="outline" 
          onClick={() => navigate('/settings')}
          className="border-koffa-green text-koffa-green hover:bg-koffa-beige-light"
        >
          <Settings className="mr-2 h-4 w-4" />
          Family Settings
        </Button>
      </div>
    </div>
  );
};

export default FamilyDashboard;
