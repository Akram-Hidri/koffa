
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
  ChefHat,
  Plus
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
        ${isLarge ? 'col-span-2 h-32 sm:h-36' : 'h-28 sm:h-32'} 
        p-4 sm:p-6 cursor-pointer hover:shadow-xl transition-all duration-300 
        border-l-4 relative overflow-hidden group bg-gradient-to-br from-white to-gray-50
        hover:scale-[1.02] transform touch-target active:scale-[0.98]
        rounded-xl border border-gray-100
      `}
      style={{ borderLeftColor: color }}
      onClick={onClick}
    >
      <div className="flex items-center justify-between h-full">
        <div className="flex-1 min-w-0 pr-3">
          <h3 className="font-bold text-base sm:text-lg text-koffa-green mb-1 truncate leading-tight">
            {title}
          </h3>
          <p className="text-sm sm:text-base text-koffa-green-dark line-clamp-2 leading-snug">
            {description}
          </p>
        </div>
        <div className="relative flex-shrink-0">
          <div 
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg"
            style={{ backgroundColor: `${color}20` }}
          >
            <div style={{ color }} className="scale-90 sm:scale-100">{icon}</div>
          </div>
          {notifications > 0 && (
            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg animate-pulse">
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
  const pendingTasks = 5;
  const upcomingEvents = 3;

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
      icon: <ShoppingCart size={22} />,
      color: '#6a798f',
      onClick: () => navigate('/shopping'),
      notifications: 2
    },
    {
      title: 'Family Calendar',
      description: `${upcomingEvents} upcoming events`,
      icon: <Calendar size={22} />,
      color: '#E6A44E',
      onClick: () => navigate('/calendar'),
      notifications: upcomingEvents
    },
    {
      title: 'Family Members',
      description: `${familySize} family members`,
      icon: <Users size={22} />,
      color: '#C05746',
      onClick: () => navigate('/family')
    },
    {
      title: 'Family Tasks',
      description: `${pendingTasks} pending tasks`,
      icon: <CheckSquare size={22} />,
      color: '#98948c',
      onClick: () => navigate('/tasks'),
      notifications: pendingTasks
    },
    {
      title: 'Family Recipes',
      description: 'Share favorite meals',
      icon: <Book size={22} />,
      color: '#586b4d',
      onClick: () => navigate('/recipes')
    },
    {
      title: 'Chef Services',
      description: 'Book family meals',
      icon: <ChefHat size={22} />,
      color: '#6a798f',
      onClick: () => navigate('/services')
    },
    {
      title: 'Notifications',
      description: 'Family updates',
      icon: <Bell size={22} />,
      color: '#E6A44E',
      onClick: () => navigate('/notifications'),
      notifications: 4
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-koffa-beige-light via-white to-koffa-beige">
      {/* Mobile header with safe area */}
      <div className="safe-area-top bg-gradient-to-r from-koffa-green to-koffa-green-dark"></div>
      
      <div className="px-4 sm:px-6 py-6 sm:py-8 container-mobile">
        {/* Welcome section - mobile optimized */}
        <div className="text-center mb-8 sm:mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-koffa-green mb-3 leading-tight">
            Welcome Home
          </h1>
          <p className="text-lg sm:text-xl text-koffa-green-dark px-4 leading-relaxed">
            Managing life together, one space at a time
          </p>
        </div>

        {/* Quick actions - mobile first */}
        <div className="mb-8">
          <div className="flex justify-center">
            <Button 
              onClick={() => navigate('/pantry/add')}
              className="bg-koffa-green hover:bg-koffa-green-dark text-white px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200 touch-target text-base font-semibold"
            >
              <Plus className="mr-2 h-5 w-5" />
              Quick Add Item
            </Button>
          </div>
        </div>

        {/* Dashboard tiles - mobile optimized grid */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto mb-8">
          {tiles.map((tile, index) => (
            <DashboardTile key={index} {...tile} />
          ))}
        </div>

        {/* Settings button - mobile optimized */}
        <div className="flex justify-center">
          <Button 
            variant="outline" 
            onClick={() => navigate('/settings')}
            className="border-2 border-koffa-green text-koffa-green hover:bg-koffa-green hover:text-white touch-target w-full sm:w-auto max-w-xs h-14 text-base font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Settings className="mr-2 h-5 w-5" />
            Family Settings
          </Button>
        </div>
      </div>
      
      {/* Safe area bottom */}
      <div className="safe-area-bottom"></div>
    </div>
  );
};

export default FamilyDashboard;
