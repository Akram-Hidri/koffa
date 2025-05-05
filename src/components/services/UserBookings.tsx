
import React from 'react';
import { Link } from 'react-router-dom';
import { useUserBookings } from '@/hooks/useChefs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { ChefHat, Calendar, Clock, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface UserBookingsProps {
  limit?: number;
}

export const UserBookings: React.FC<UserBookingsProps> = ({ limit }) => {
  const { data: bookings = [], isLoading } = useUserBookings();
  
  // Show limited number of bookings if requested
  const displayBookings = limit ? bookings.slice(0, limit) : bookings;
  
  // Status badge color mapping
  const statusColors: Record<string, string> = {
    'pending': 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
    'confirmed': 'bg-green-100 text-green-800 hover:bg-green-200',
    'completed': 'bg-blue-100 text-blue-800 hover:bg-blue-200',
    'cancelled': 'bg-red-100 text-red-800 hover:bg-red-200',
  };
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Your Bookings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <Card key={i} className="animate-pulse border-koffa-beige">
              <CardHeader className="pb-2">
                <div className="h-5 w-1/3 bg-koffa-beige/30 rounded"></div>
                <div className="h-3 w-1/2 bg-koffa-beige/30 rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full bg-koffa-beige/30"></div>
                    <div className="h-4 w-1/3 bg-koffa-beige/30 rounded"></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full bg-koffa-beige/30"></div>
                    <div className="h-4 w-1/2 bg-koffa-beige/30 rounded"></div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="h-9 w-full bg-koffa-beige/30 rounded"></div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }
  
  if (displayBookings.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Your Bookings</h2>
        <Card className="border-koffa-beige border-dashed bg-koffa-beige/5">
          <CardContent className="flex flex-col items-center justify-center py-10">
            <ChefHat className="h-12 w-12 text-koffa-green/40 mb-3" />
            <h3 className="text-lg font-medium">No bookings yet</h3>
            <p className="text-gray-500 mb-4 text-center">You haven't made any chef bookings yet</p>
            <Link to="/services">
              <Button className="bg-koffa-green hover:bg-koffa-green-dark">
                Browse Chefs
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Your Bookings</h2>
        {limit && bookings.length > limit && (
          <Link to="/services/bookings">
            <Button variant="link" className="text-koffa-green">
              View All ({bookings.length})
            </Button>
          </Link>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayBookings.map((booking) => {
          const chef = booking.chefs;
          const initials = chef?.name
            ?.split(' ')
            .map(part => part[0])
            .join('')
            .toUpperCase() || '';
            
          return (
            <Card key={booking.id} className="border-koffa-beige hover:border-koffa-green transition-all">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base">
                      {chef?.name || 'Chef'}
                      <span className="ml-2 text-sm font-normal text-gray-500">
                        ({booking.meal_type})
                      </span>
                    </CardTitle>
                    <CardDescription>
                      {chef?.cuisine_style || 'Various'} Cuisine
                    </CardDescription>
                  </div>
                  <Badge
                    variant="outline"
                    className={cn(
                      statusColors[booking.status] || 'bg-gray-100 text-gray-800',
                    )}
                  >
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-gray-500" />
                    <span>
                      {format(new Date(booking.booking_date), 'PPP')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-gray-500" />
                    <span>
                      {format(new Date(`2000-01-01T${booking.start_time}`), 'h:mm a')} - 
                      {format(new Date(`2000-01-01T${booking.end_time}`), 'h:mm a')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-3.5 w-3.5 text-gray-500" />
                    <span>{booking.guests_count} guests</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0 flex justify-between items-center">
                <div className="flex items-center">
                  <Avatar className="h-6 w-6 mr-2 border border-koffa-beige">
                    {chef?.profile_image ? (
                      <AvatarImage src={chef.profile_image} alt={chef.name} />
                    ) : (
                      <AvatarFallback className="bg-koffa-green text-white text-xs">
                        {initials}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="text-sm font-medium text-koffa-green">
                    ${parseFloat(booking.total_price).toFixed(2).toString()}
                  </div>
                </div>
                <Link to={`/services/chef/${booking.chef_id}`}>
                  <Button 
                    variant="outline"
                    size="sm"
                    className="text-koffa-green border-koffa-beige"
                  >
                    View Chef
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          );
        })}
      </div>
      
      {limit && bookings.length > limit && (
        <div className="text-center">
          <Link to="/services/bookings">
            <Button variant="outline" className="border-koffa-beige text-koffa-green">
              View All Bookings
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};
