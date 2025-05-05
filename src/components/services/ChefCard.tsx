
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
    : 0;

  const initials = chef.name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase();
  
  return (
    <Card className="h-full transition-all hover:shadow-md border-koffa-beige hover:border-koffa-green">
      <CardHeader className="p-4 pb-0">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <Avatar className="w-14 h-14 border-2 border-koffa-beige">
              {chef.profile_image ? (
                <AvatarImage src={chef.profile_image} alt={chef.name} />
              ) : (
                <AvatarFallback className="bg-koffa-green text-white">{initials}</AvatarFallback>
              )}
            </Avatar>
            <div>
              <CardTitle className="text-lg">{chef.name}</CardTitle>
              <CardDescription className="flex items-center mt-0.5">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                {avgRating > 0 ? (
                  <span className="text-xs">{avgRating.toFixed(1)} ({reviews.length} reviews)</span>
                ) : (
                  <span className="text-xs">No reviews yet</span>
                )}
              </CardDescription>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn(
              "rounded-full h-8 w-8", 
              isFavorite(chef.id) && "text-red-500 hover:text-red-500"
            )}
            onClick={() => toggleFavorite(chef.id)}
          >
            <Heart className={cn("h-5 w-5", isFavorite(chef.id) && "fill-red-500")} />
          </Button>
        </div>
        
        <div className="mt-3 flex gap-2 flex-wrap">
          <Badge variant="outline" className="bg-koffa-beige/10">{chef.cuisine_style}</Badge>
          {chef.specialty && (
            <Badge variant="outline" className="bg-koffa-beige/10">
              {chef.specialty}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <p className="text-sm text-gray-600 line-clamp-2">
          {chef.bio || `Professional chef with ${chef.years_experience || 'several'} years of experience specializing in ${chef.cuisine_style} cuisine.`}
        </p>
        
        <div className="mt-3 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">Hourly rate</p>
            <p className="text-lg font-semibold text-koffa-green">
              ${chef.hourly_rate.toFixed(2)}
            </p>
          </div>
          <div>
            {chef.years_experience && (
              <div className="text-right">
                <p className="text-xs text-gray-500">Experience</p>
                <p className="text-sm font-medium">{chef.years_experience} years</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Link to={`/services/chef/${chef.id}`} className="w-full">
          <Button variant="default" className="w-full bg-koffa-green hover:bg-koffa-green-dark">
            View Profile
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};
