
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Utensils, ShoppingBag, Layers, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSettings } from '@/contexts/SettingsContext';

const PageNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { settings } = useSettings();
  
  // Function to determine if a route is active
  const isActive = (route: string) => {
    if (route === '/home' && (location.pathname === '/' || location.pathname === '/home')) return true;
    return location.pathname.startsWith(route);
  };

  const navItems = [
    { name: 'Home', icon: Home, path: '/home' },
    { name: 'Pantry', icon: Utensils, path: '/pantry' },
    { name: 'Shopping', icon: ShoppingBag, path: '/shopping' },
    { name: 'Spaces', icon: Layers, path: '/spaces' },
    { name: 'Family', icon: Users, path: '/family' }
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white rounded-full shadow-lg px-6 py-3 w-[80%] max-w-sm border border-koffa-beige/20 transition-all duration-300 hover:shadow-xl">
      <div className="flex justify-around items-center">
        <Button 
          variant="ghost" 
          className="p-2 h-auto w-14 hover:bg-koffa-beige-light rounded-full transition-all duration-300"
          onClick={() => navigate('/home')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-koffa-green-dark">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </Button>
        
        {settings?.navItems?.slice(1, 4).map((item, index) => (
          <Button 
            key={index}
            variant="ghost" 
            className={`p-2 h-auto w-14 hover:bg-koffa-beige-light rounded-full transition-all duration-300 ${
              location.pathname.includes(item) ? 'bg-koffa-beige-light' : ''
            }`}
            onClick={() => navigate(`/${item}`)}
          >
            {item === 'pantry' ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-koffa-green-dark">
                <path d="M21 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v3" />
                <path d="M3 8v8a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8" />
                <path d="M10 2v9" />
              </svg>
            ) : item === 'shopping' ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-koffa-green-dark">
                <path d="M8 5h8l2 13H6z" />
                <path d="M5 8l14 1" />
                <path d="M9 3v2" />
                <path d="M15 3v2" />
                <path d="M11 23a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
                <path d="M17 23a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
              </svg>
            ) : item === 'spaces' ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`text-koffa-green${location.pathname.includes('spaces') ? '' : '-dark'}`}>
                <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
                <path d="M3 9V6a2 2 0 0 1 2-2h2" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-koffa-green-dark">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            )}
          </Button>
        ))}
        
        <Button 
          variant="ghost" 
          className="p-2 h-auto w-14 hover:bg-koffa-beige-light rounded-full transition-all duration-300"
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
