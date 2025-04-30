
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSettings } from '@/contexts/SettingsContext';
import { Button } from '@/components/ui/button';

const PageNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { settings } = useSettings();
  
  // Function to determine if a route is active
  const isActive = (route: string) => {
    if (route === '/home' && (location.pathname === '/' || location.pathname === '/home')) return true;
    return location.pathname.startsWith(route);
  };

  const renderIcon = (item: string) => {
    switch (item) {
      case 'home':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`text-koffa-green${isActive('/home') ? '' : '-dark'}`}>
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        );
      case 'pantry':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`text-koffa-green${isActive('/pantry') ? '' : '-dark'}`}>
            <path d="M21 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v3" />
            <path d="M3 8v8a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8" />
            <path d="M10 2v9" />
          </svg>
        );
      case 'shopping':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`text-koffa-green${isActive('/shopping') ? '' : '-dark'}`}>
            <path d="M8 5h8l2 13H6z" />
            <path d="M5 8l14 1" />
            <path d="M9 3v2" />
            <path d="M15 3v2" />
            <path d="M11 23a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
            <path d="M17 23a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
          </svg>
        );
      case 'spaces':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`text-koffa-green${isActive('/spaces') ? '' : '-dark'}`}>
            <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
            <path d="M3 9V6a2 2 0 0 1 2-2h2" />
          </svg>
        );
      case 'family':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`text-koffa-green${isActive('/family') ? '' : '-dark'}`}>
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-koffa-green-dark">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        );
    }
  };

  // Default navigation items if settings are not loaded yet
  const navItems = settings?.navItems || ['home', 'pantry', 'shopping', 'spaces', 'family'];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white rounded-full shadow-lg px-6 py-3 w-[80%] max-w-sm border border-koffa-beige/20 transition-all duration-300 hover:shadow-xl">
      <div className="flex justify-around items-center">
        {/* Home button is always first */}
        <Button 
          variant="ghost" 
          className={`p-2 h-auto w-14 hover:bg-koffa-beige-light rounded-full transition-all duration-300 ${
            isActive('/home') ? 'bg-koffa-beige-light' : ''
          }`}
          onClick={() => navigate('/home')}
        >
          {renderIcon('home')}
        </Button>
        
        {/* Show 3 additional navigation items based on settings */}
        {navItems.slice(1, 4).map((item, index) => (
          <Button 
            key={index}
            variant="ghost" 
            className={`p-2 h-auto w-14 hover:bg-koffa-beige-light rounded-full transition-all duration-300 ${
              isActive(`/${item}`) ? 'bg-koffa-beige-light' : ''
            }`}
            onClick={() => navigate(`/${item}`)}
          >
            {renderIcon(item)}
          </Button>
        ))}
        
        {/* Profile button is always last */}
        <Button 
          variant="ghost" 
          className={`p-2 h-auto w-14 hover:bg-koffa-beige-light rounded-full transition-all duration-300 ${
            isActive('/profile') ? 'bg-koffa-beige-light' : ''
          }`}
          onClick={() => navigate('/profile')}
        >
          <div className="w-8 h-8 rounded-full bg-koffa-beige flex items-center justify-center text-sm font-medium text-koffa-green">
            JD
          </div>
        </Button>
      </div>
    </div>
  );
};

export default PageNavigation;
