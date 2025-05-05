
import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/PageLayout';
import { Button } from '@/components/ui/button';
import { UserBookings } from '@/components/services/UserBookings';
import { ArrowLeft } from 'lucide-react';

const UserBookingsPage: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <PageLayout title="My Bookings">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Button 
            variant="outline" 
            className="flex items-center text-koffa-green border-koffa-beige"
            onClick={() => navigate('/services')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Services
          </Button>
        </div>
        
        <UserBookings />
      </div>
    </PageLayout>
  );
};

export default UserBookingsPage;
