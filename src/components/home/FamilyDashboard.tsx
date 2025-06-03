
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
        ${isLarge ? 'col-span-2 h-28 sm:h-32' : 'h-24 sm:h-28'} 
        p-3 sm:p-6 cursor-pointer hover:shadow-lg transition-all duration-200 
        border-l-4 relative overflow-hidden group
        hover:scale-105 transform touch-target
      `}
      style={{ borderLeftColor: color }}
      onClick={onClick}
    >
      <div className="flex items-center justify-between h-full">
        <div className="flex-1 min-w-0 pr-2">
          <h3 className="font-semibold text-sm sm:text-lg text-koffa-green mb-1 truncate">{title}</h3>
          <p className="text-xs sm:text-sm text-koffa-green-dark line-clamp-2">{description}</p>
        </div>
        <div className="relative flex-shrink-0">
          <div 
            className="w-8 h-8 sm:w-12 sm:h-12 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform"
            style={{ backgroundColor: `${color}20` }}
          >
            <div style={{ color }} className="scale-75 sm:scale-100">{icon}</div>
          </div>
          {notifications > 0 && (
            <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-koffa-accent-red text-white text-xs rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center">
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
      icon: <Home size={20} />,
      color: '#586b4d',
      onClick: () => navigate('/spaces'),
      size: 'large' as const,
      notifications: 0
    },
    {
      title: 'Shopping Lists',
      description: 'Plan family groceries',
      icon: <ShoppingCart size={20} />,
      color: '#6a798f',
      onClick: () => navigate('/shopping'),
      notifications: 2
    },
    {
      title: 'Family Calendar',
      description: `${upcomingEvents} upcoming events`,
      icon: <Calendar size={20} />,
      color: '#E6A44E',
      onClick: () => navigate('/calendar'),
      notifications: upcomingEvents
    },
    {
      title: 'Family Members',
      description: `${familySize} family members`,
      icon: <Users size={20} />,
      color: '#C05746',
      onClick: () => navigate('/family')
    },
    {
      title: 'Family Tasks',
      description: `${pendingTasks} pending tasks`,
      icon: <CheckSquare size={20} />,
      color: '#98948c',
      onClick: () => navigate('/tasks'),
      notifications: pendingTasks
    },
    {
      title: 'Family Recipes',
      description: 'Share favorite meals',
      icon: <Book size={20} />,
      color: '#586b4d',
      onClick: () => navigate('/recipes')
    },
    {
      title: 'Chef Services',
      description: 'Book family meals',
      icon: <ChefHat size={20} />,
      color: '#6a798f',
      onClick: () => navigate('/services')
    },
    {
      title: 'Notifications',
      description: 'Family updates',
      icon: <Bell size={20} />,
      color: '#E6A44E',
      onClick: () => navigate('/notifications'),
      notifications: 4
    }
  ];

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 container-mobile">
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-koffa-green mb-2">
          Welcome to Your Family Hub
        </h1>
        <p className="text-base sm:text-lg text-koffa-green-dark px-2">
          Managing life together, one space at a time
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 max-w-4xl mx-auto">
        {tiles.map((tile, index) => (
          <DashboardTile key={index} {...tile} />
        ))}
      </div>

      <div className="flex justify-center mt-6 sm:mt-8">
        <Button 
          variant="outline" 
          onClick={() => navigate('/settings')}
          className="border-koffa-green text-koffa-green hover:bg-koffa-beige-light touch-target w-full sm:w-auto max-w-xs"
        >
          <Settings className="mr-2 h-4 w-4" />
          Family Settings
        </Button>
      </div>
    </div>
  );
};

export default FamilyDashboard;
