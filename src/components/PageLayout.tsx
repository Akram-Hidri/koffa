
import React from 'react';
import PageHeader from './PageHeader';
import PageNavigation from './PageNavigation';

interface PageLayoutProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ title, children, icon }) => {
  return (
    <div className="flex flex-col min-h-screen bg-[#f3f3e3] dark:bg-slate-900">
      <PageHeader title={title} icon={icon} />
      <main className="flex-1 max-w-screen-lg mx-auto w-full px-3 sm:px-4 py-3 sm:py-4 pb-20">
        <div className="animate-fade-in">
          {children}
        </div>
      </main>
      <PageNavigation />
    </div>
  );
};

export default PageLayout;
