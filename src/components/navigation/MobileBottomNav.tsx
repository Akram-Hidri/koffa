
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  ShoppingCart, 
  Calendar, 
  Users, 
  Settings,
  Package
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  gradient: string;
}

const MobileBottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems: NavItem[] = [
    {
      id: 'home',
      label: 'Home',
      icon: <Home size={24} />,
      path: '/home',
      gradient: 'gradient-green'
    },
    {
      id: 'shopping',
      label: 'Shopping',
      icon: <ShoppingCart size={24} />,
      path: '/shopping',
      gradient: 'gradient-blue'
    },
    {
      id: 'pantry',
      label: 'Pantry',
      icon: <Package size={24} />,
      path: '/pantry',
      gradient: 'gradient-orange'
    },
    {
      id: 'calendar',
      label: 'Calendar',
      icon: <Calendar size={24} />,
      path: '/calendar',
      gradient: 'gradient-purple'
    },
    {
      id: 'family',
      label: 'Family',
      icon: <Users size={24} />,
      path: '/family',
      gradient: 'gradient-red'
    }
  ];

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bottom-nav-safe">
      <div className="bg-white/95 backdrop-blur-lg border-t border-gray-200/50 shadow-mobile-xl">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.map((item) => {
            const active = isActive(item.path);
            
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={cn(
                  "flex flex-col items-center justify-center mobile-touch rounded-2xl transition-all duration-200 min-w-16 relative group",
                  "hover:bg-gray-50 active:scale-95"
                )}
              >
                <div 
                  className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center mb-1 transition-all duration-200",
                    active 
                      ? `${item.gradient} text-white shadow-mobile transform scale-110` 
                      : "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
                  )}
                >
                  {item.icon}
                </div>
                <span 
                  className={cn(
                    "text-xs font-semibold transition-all duration-200",
                    active ? "text-gray-900" : "text-gray-500"
                  )}
                >
                  {item.label}
                </span>
                
                {/* Active indicator */}
                {active && (
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full shadow-sm" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MobileBottomNav;
