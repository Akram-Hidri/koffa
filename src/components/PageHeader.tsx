
import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, Settings } from 'lucide-react';
import Logo from './Logo';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

interface PageHeaderProps {
  title: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title }) => {
  const { signOut } = useAuth();

  return (
    <header className="bg-white dark:bg-slate-800 sticky top-0 z-10 border-b">
      <div className="max-w-screen-md mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <Link to="/home" className="flex items-center">
            <Logo size="sm" />
          </Link>
          <h1 className="text-xl font-semibold text-koffa-green-dark dark:text-green-300">{title}</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <Link to="/notifications" className="text-gray-600 dark:text-gray-300" aria-label="Notifications">
            <Bell className="h-5 w-5" />
          </Link>
          <Link to="/settings" className="text-gray-600 dark:text-gray-300" aria-label="Settings">
            <Settings className="h-5 w-5" />
          </Link>
          <Button variant="ghost" size="sm" onClick={signOut}>
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  );
};

export default PageHeader;
