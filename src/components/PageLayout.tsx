
import React from 'react';
import PageHeader from './PageHeader';
import PageNavigation from './PageNavigation';

interface PageLayoutProps {
  title: string;
  children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ title, children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-[#f3f3e3] dark:bg-slate-900">
      <PageHeader title={title} />
      <main className="flex-1 max-w-screen-md mx-auto w-full px-4 py-4 pb-20">
        {children}
      </main>
      <PageNavigation />
    </div>
  );
};

export default PageLayout;
