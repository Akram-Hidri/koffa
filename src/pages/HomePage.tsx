
import React from 'react';
import PageLayout from '@/components/PageLayout';
import FamilyDashboard from '@/components/home/FamilyDashboard';

const HomePage = () => {
  return (
    <PageLayout title="Family Hub">
      <FamilyDashboard />
    </PageLayout>
  );
};

export default HomePage;
