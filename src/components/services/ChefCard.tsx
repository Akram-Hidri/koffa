
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Star } from 'lucide-react';
import { Chef, useChefFavorites, useChefReviews } from '@/hooks/useChefs';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface ChefCardProps {
  chef: Chef;
}

export const ChefCard: React.FC<ChefCardProps> = ({ chef }) => {
  const { data: reviews = [], isLoading: loadingReviews } = useChefReviews(chef.id);
  const { isFavorite, toggleFavorite } = useChefFavorites();
  const avgRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 4.5; // Default rating for sample data

  const initials = chef.name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase();
  
  return (
    <Card className="h-full transition-all hover:shadow-md border-koffa-beige hover:border-koffa-green">
      <CardHeader className="p-3 sm:p-4 pb-0">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <Avatar className="w-12 h-12 sm:w-14 sm:h-14 border-2 border-koffa-beige flex-shrink-0">
              {chef.profile_image ? (
                <AvatarImage src={chef.profile_image} alt={chef.name} />
              ) : (
                <AvatarFallback className="bg-koffa-green text-white text-sm sm:text-base">{initials}</AvatarFallback>
              )}
            </Avatar>
            <div className="min-w-0 flex-1">
              <CardTitle className="text-sm sm:text-lg truncate">{chef.name}</CardTitle>
              <CardDescription className="flex items-center mt-0.5">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1 flex-shrink-0" />
                <span className="text-xs truncate">
                  {avgRating.toFixed(1)} ({reviews.length || '5+'} reviews)
                </span>
              </CardDescription>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn(
              "rounded-full h-8 w-8 touch-target flex-shrink-0", 
              isFavorite(chef.id) && "text-red-500 hover:text-red-500"
            )}
            onClick={() => toggleFavorite(chef.id)}
          >
            <Heart className={cn("h-4 w-4", isFavorite(chef.id) && "fill-red-500")} />
          </Button>
        </div>
        
        <div className="mt-2 sm:mt-3 flex gap-1 sm:gap-2 flex-wrap">
          <Badge variant="outline" className="bg-koffa-beige/10 text-xs">{chef.cuisine_style}</Badge>
          {chef.specialty && (
            <Badge variant="outline" className="bg-koffa-beige/10 text-xs truncate max-w-[120px]">
              {chef.specialty}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-3 sm:p-4">
        <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 mb-3">
          {chef.bio || `Professional chef with ${chef.years_experience || 'several'} years of experience specializing in ${chef.cuisine_style} cuisine.`}
        </p>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">Hourly rate</p>
            <p className="text-base sm:text-lg font-semibold text-koffa-green">
              ${chef.hourly_rate.toFixed(2)}
            </p>
          </div>
          <div>
            {chef.years_experience && (
              <div className="text-right">
                <p className="text-xs text-gray-500">Experience</p>
                <p className="text-xs sm:text-sm font-medium">{chef.years_experience} years</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-3 sm:p-4 pt-0">
        <Link to={`/services/chef/${chef.id}`} className="w-full">
          <Button variant="default" className="w-full bg-koffa-green hover:bg-koffa-green-dark touch-target text-sm">
            View Profile
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};
