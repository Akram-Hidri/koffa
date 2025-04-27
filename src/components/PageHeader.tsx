
import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, Settings } from 'lucide-react';
import Logo from './Logo';

interface PageHeaderProps {
  title: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title }) => {
  return (
    <div className="bg-white dark:bg-slate-800 sticky top-0 z-10 border-b">
      <div className="max-w-screen-md mx-auto flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-3">
          <Link to="/home">
            <Logo size="sm" />
          </Link>
          <h1 className="text-xl font-semibold">{title}</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <Link to="/profile" className="text-sm font-medium">
            👤 User
          </Link>
          <Link to="/notifications" className="text-gray-600 dark:text-gray-300">
            <Bell className="h-5 w-5" />
          </Link>
          <Link to="/settings" className="text-gray-600 dark:text-gray-300">
            <Settings className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
