
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileCard } from '@/components/ui/mobile-card';
import { MobileButton } from '@/components/ui/mobile-button';
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
  gradient: 'green' | 'blue' | 'orange' | 'red' | 'purple' | 'yellow';
  onClick: () => void;
  size?: 'normal' | 'large';
  notifications?: number;
}

const DashboardTile: React.FC<DashboardTileProps> = ({ 
  title, 
  description, 
  icon, 
  gradient, 
  onClick, 
  size = 'normal',
  notifications = 0
}) => {
  const isLarge = size === 'large';
  
  return (
    <MobileCard 
      gradient={gradient}
      interactive
      className={`
        ${isLarge ? 'col-span-2 min-h-32' : 'min-h-28'} 
        relative cursor-pointer transform transition-all duration-200
        hover:scale-105 active:scale-95
      `}
      onClick={onClick}
    >
      <div className="flex flex-col h-full justify-between">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg text-white mb-1 truncate">{title}</h3>
            <p className="text-sm text-white/90 line-clamp-2">{description}</p>
          </div>
          <div className="relative flex-shrink-0 ml-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <div className="text-white scale-110">{icon}</div>
            </div>
            {notifications > 0 && (
              <div className="absolute -top-2 -right-2 bg-white text-red-500 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg">
                {notifications > 9 ? '9+' : notifications}
              </div>
            )}
          </div>
        </div>
        
        {isLarge && (
          <div className="mt-4 flex items-center text-white/80">
            <Plus className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">Quick access</span>
          </div>
        )}
      </div>
    </MobileCard>
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
      description: `${familySize} spaces active`,
      icon: <Home size={24} />,
      gradient: 'green' as const,
      onClick: () => navigate('/spaces'),
      size: 'large' as const,
      notifications: 0
    },
    {
      title: 'Shopping',
      description: 'Plan groceries',
      icon: <ShoppingCart size={24} />,
      gradient: 'blue' as const,
      onClick: () => navigate('/shopping'),
      notifications: 2
    },
    {
      title: 'Calendar',
      description: `${upcomingEvents} upcoming`,
      icon: <Calendar size={24} />,
      gradient: 'orange' as const,
      onClick: () => navigate('/calendar'),
      notifications: upcomingEvents
    },
    {
      title: 'Members',
      description: `${familySize} people`,
      icon: <Users size={24} />,
      gradient: 'red' as const,
      onClick: () => navigate('/family')
    },
    {
      title: 'Tasks',
      description: `${pendingTasks} pending`,
      icon: <CheckSquare size={24} />,
      gradient: 'purple' as const,
      onClick: () => navigate('/tasks'),
      notifications: pendingTasks
    },
    {
      title: 'Recipes',
      description: 'Favorite meals',
      icon: <Book size={24} />,
      gradient: 'yellow' as const,
      onClick: () => navigate('/recipes')
    },
    {
      title: 'Chef Services',
      description: 'Book meals',
      icon: <ChefHat size={24} />,
      gradient: 'blue' as const,
      onClick: () => navigate('/services')
    },
    {
      title: 'Updates',
      description: 'Family news',
      icon: <Bell size={24} />,
      gradient: 'green' as const,
      onClick: () => navigate('/notifications'),
      notifications: 4
    }
  ];

  return (
    <div className="mobile-container min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="pt-safe-top pb-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-bring-green to-bring-blue bg-clip-text text-transparent mb-2">
            Welcome Home
          </h1>
          <p className="text-lg text-gray-600">
            Your family hub awaits
          </p>
        </div>

        {/* Quick Stats */}
        <div className="flex justify-between mb-6 gap-3">
          <MobileCard className="flex-1 text-center bg-white/80 backdrop-blur-sm">
            <div className="text-2xl font-bold text-bring-green">{familySize}</div>
            <div className="text-sm text-gray-600">Members</div>
          </MobileCard>
          <MobileCard className="flex-1 text-center bg-white/80 backdrop-blur-sm">
            <div className="text-2xl font-bold text-bring-orange">{pendingTasks}</div>
            <div className="text-sm text-gray-600">Tasks</div>
          </MobileCard>
          <MobileCard className="flex-1 text-center bg-white/80 backdrop-blur-sm">
            <div className="text-2xl font-bold text-bring-blue">{upcomingEvents}</div>
            <div className="text-sm text-gray-600">Events</div>
          </MobileCard>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="mobile-grid max-w-4xl mx-auto mb-8">
        {tiles.map((tile, index) => (
          <DashboardTile key={index} {...tile} />
        ))}
      </div>

      {/* Settings Button */}
      <div className="flex justify-center pb-8">
        <MobileButton 
          variant="outline"
          size="lg"
          onClick={() => navigate('/settings')}
          className="w-full max-w-xs bg-white/90 backdrop-blur-sm border-gray-200"
        >
          <Settings className="w-5 h-5" />
          Family Settings
        </MobileButton>
      </div>
    </div>
  );
};

export default FamilyDashboard;
