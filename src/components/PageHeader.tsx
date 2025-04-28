
import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, Settings } from 'lucide-react';
import Logo from './Logo';

interface PageHeaderProps {
  title: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title }) => {
  return (
    <header className="bg-white dark:bg-slate-800 sticky top-0 z-10 border-b">
      <div className="max-w-screen-md mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <Link to="/home" className="flex items-center">
            <Logo size="sm" />
          </Link>
          <h1 className="text-xl font-semibold">{title}</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <Link to="/notifications" className="text-gray-600 dark:text-gray-300" aria-label="Notifications">
            <Bell className="h-5 w-5" />
          </Link>
          <Link to="/settings" className="text-gray-600 dark:text-gray-300" aria-label="Settings">
            <Settings className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default PageHeader;
