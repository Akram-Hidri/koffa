
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSettings } from '@/contexts/SettingsContext';
import { Button } from '@/components/ui/button';
import { Home, Package, ShoppingCart, Home as SpacesIcon, Users, User, Calendar, ListTodo, BookOpen, Settings } from 'lucide-react';

const PageNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { settings } = useSettings();
  
  // Function to determine if a route is active
  const isActive = (route: string) => {
    if (route === '/home' && (location.pathname === '/' || location.pathname === '/home')) return true;
    return location.pathname.startsWith(route);
  };

  // Map of available navigation items with their icons
  const navIconMap = {
    home: Home,
    pantry: Package,
    shopping: ShoppingCart,
    spaces: SpacesIcon,
    family: Users,
    calendar: Calendar,
    tasks: ListTodo,
    notes: BookOpen,
    settings: Settings
  };

  // Get navigation items from settings or use default
  const navItems = settings?.navItems || ['home', 'pantry', 'shopping', 'spaces', 'family'];

  // Render the icon for a specific navigation item
  const renderNavIcon = (item) => {
    const IconComponent = navIconMap[item];
    const active = isActive(`/${item}`);
    
    return (
      <IconComponent 
        size={24} 
        className={active ? "text-koffa-green" : "text-koffa-green-dark"}
      />
    );
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white rounded-full shadow-lg px-6 py-3 w-[80%] max-w-sm border border-koffa-beige/20 transition-all duration-300 hover:shadow-xl z-40">
      <div className="flex justify-around items-center">
        {/* Show up to 5 navigation items based on settings */}
        {navItems.slice(0, 4).map((item, index) => (
          <Button 
            key={index}
            variant="ghost" 
            className={`p-2 h-auto w-14 hover:bg-koffa-beige-light rounded-full transition-all duration-300 ${
              isActive(`/${item}`) ? 'bg-koffa-beige-light' : ''
            }`}
            onClick={() => navigate(`/${item}`)}
          >
            {renderNavIcon(item)}
          </Button>
        ))}
        
        {/* Profile button is always shown on the right */}
        <Button 
          variant="ghost" 
          className={`p-2 h-auto w-14 hover:bg-koffa-beige-light rounded-full transition-all duration-300 ${
            isActive('/profile') ? 'bg-koffa-beige-light' : ''
          }`}
          onClick={() => navigate('/profile')}
        >
          <div className="w-8 h-8 rounded-full bg-koffa-beige flex items-center justify-center text-sm font-medium text-koffa-green">
            <User size={20} className={isActive('/profile') ? "text-koffa-green" : "text-koffa-green-dark"} />
          </div>
        </Button>
      </div>
    </div>
  );
};

export default PageNavigation;
