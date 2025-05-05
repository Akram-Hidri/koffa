
import React from 'react';
import { useUserBookings } from '@/hooks/useChefs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UserBookingsProps {
  limit?: number;
}

export const UserBookings: React.FC<UserBookingsProps> = ({ limit }) => {
  const { data: bookings = [], isLoading } = useUserBookings();

  const displayBookings = limit ? bookings.slice(0, limit) : bookings;
  
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-300';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-300';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };
  
  if (isLoading) {
    return (
      <Card className="border-koffa-beige">
        <CardHeader>
          <CardTitle>Your Bookings</CardTitle>
          <CardDescription>Manage all your chef bookings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-koffa-green border-t-transparent mx-auto"></div>
            <p className="mt-2 text-sm text-gray-500">Loading your bookings...</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (displayBookings.length === 0) {
    return (
      <Card className="border-koffa-beige">
        <CardHeader>
          <CardTitle>Your Bookings</CardTitle>
          <CardDescription>You haven't made any bookings yet</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-4">
          <p className="text-gray-500 mb-4">Browse our chefs and book your first cooking experience!</p>
          <Button className="bg-koffa-green hover:bg-koffa-green-dark">Find a Chef</Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="border-koffa-beige">
      <CardHeader>
        <CardTitle>Your Bookings</CardTitle>
        <CardDescription>Manage your upcoming cooking experiences</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayBookings.map(booking => {
            const chefName = booking.chefs?.name || 'Chef';
            const chefImage = booking.chefs?.profile_image;
            const initials = chefName
              .split(' ')
              .map(part => part[0])
              .join('')
              .toUpperCase();
            
            return (
              <div
                key={booking.id}
                className="border border-koffa-beige/30 rounded-lg p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-12 w-12">
                      {chefImage ? (
                        <AvatarImage src={chefImage} alt={chefName} />
                      ) : (
                        <AvatarFallback className="bg-koffa-green text-white">
                          {initials}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    
                    <div>
                      <h4 className="font-medium text-gray-900">{chefName}</h4>
                      <p className="text-sm text-gray-500">
                        {booking.chefs?.cuisine_style} cuisine · {booking.meal_type}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mt-2">
                        <div className="flex items-center text-xs text-gray-500">
                          <Calendar className="h-3 w-3 mr-1" />
                          {format(new Date(booking.booking_date), 'MMM d, yyyy')}
                        </div>
                        
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="h-3 w-3 mr-1" />
                          {format(new Date(`2000-01-01T${booking.start_time}`), 'h:mm a')} - 
                          {format(new Date(`2000-01-01T${booking.end_time}`), 'h:mm a')}
                        </div>
                        
                        <div className="flex items-center text-xs text-gray-500">
                          <Users className="h-3 w-3 mr-1" />
                          {booking.guests_count} guests
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end">
                    <Badge
                      variant="outline"
                      className={`mb-2 ${getStatusColor(booking.status)}`}
                    >
                      {booking.status}
                    </Badge>
                    
                    <div className="text-right">
                      <div className="text-xs text-gray-500">Total</div>
                      <div className="font-medium">${booking.total_price.toFixed(2)}</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {limit && bookings.length > limit && (
          <div className="text-center mt-4">
            <Button variant="link" className="text-koffa-green">
              View all {bookings.length} bookings
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
