
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Utensils, ShoppingBag, Layers, Users } from 'lucide-react';

const PageNavigation = () => {
  const location = useLocation();

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
    <nav className="fixed bottom-0 left-0 right-0 w-full border-t bg-white dark:bg-slate-800 py-2 px-4 z-10">
      <div className="flex justify-between max-w-screen-md mx-auto">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex flex-col items-center p-2 rounded-lg text-sm ${
              isActive(item.path)
                ? 'text-koffa-green font-medium'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            <item.icon className={`h-5 w-5 mb-1 ${
              isActive(item.path)
                ? 'text-koffa-green dark:text-green-300'
                : 'text-gray-500 dark:text-gray-400'
            }`} />
            <span>{item.name}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default PageNavigation;
