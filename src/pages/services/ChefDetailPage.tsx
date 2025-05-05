
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageLayout from '@/components/PageLayout';
import { useChefDetails, useChefFavorites } from '@/hooks/useChefs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChefReview } from '@/components/services/ChefReview';
import { BookingForm } from '@/components/services/BookingForm';
import { Heart, ChefHat, Star, Clock, ArrowLeft } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

const ChefDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: chef, isLoading } = useChefDetails(id);
  const { isFavorite, toggleFavorite } = useChefFavorites();
  const [activeTab, setActiveTab] = useState<string>('details');
  
  if (isLoading) {
    return (
      <PageLayout>
        <div className="animate-pulse space-y-6">
          <div className="flex justify-between">
            <div className="h-8 w-40 bg-koffa-beige/30 rounded"></div>
            <div className="h-8 w-8 bg-koffa-beige/30 rounded-full"></div>
          </div>
          <div className="h-64 bg-koffa-beige/30 rounded-lg"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-80 bg-koffa-beige/30 rounded-lg"></div>
            <div className="h-80 bg-koffa-beige/30 rounded-lg"></div>
          </div>
        </div>
      </PageLayout>
    );
  }
  
  if (!chef) {
    return (
      <PageLayout>
        <div className="text-center py-16">
          <ChefHat className="mx-auto h-16 w-16 text-koffa-green/40 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Chef Not Found</h2>
          <p className="text-gray-500 mb-6">The chef you're looking for doesn't exist or has been removed.</p>
          <Button 
            onClick={() => navigate('/services')}
            className="bg-koffa-green hover:bg-koffa-green-dark"
          >
            Browse All Chefs
          </Button>
        </div>
      </PageLayout>
    );
  }
  
  // Generate chef's initials for the avatar fallback
  const initials = chef.name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase();
  
  return (
    <PageLayout>
      <div className="space-y-6">
        {/* Back button and actions */}
        <div className="flex justify-between items-center">
          <Button 
            variant="outline" 
            className="flex items-center text-koffa-green border-koffa-beige"
            onClick={() => navigate('/services')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Chefs
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn(
              "rounded-full h-10 w-10", 
              isFavorite(chef.id) && "text-red-500 hover:text-red-500"
            )}
            onClick={() => toggleFavorite(chef.id)}
          >
            <Heart className={cn("h-5 w-5", isFavorite(chef.id) && "fill-red-500")} />
          </Button>
        </div>
        
        {/* Chef Hero Section */}
        <Card className="border-koffa-beige overflow-hidden">
          <div className="relative h-48 bg-gradient-to-r from-koffa-green/80 to-koffa-green-dark/80">
            <div className="absolute inset-0 flex items-center justify-center opacity-10">
              <ChefHat className="h-48 w-48" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h1 className="text-2xl font-bold">{chef.name}</h1>
              <p className="flex items-center">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                <span>Top Chef • {chef.cuisine_style} Cuisine</span>
              </p>
            </div>
          </div>
          
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-3 mb-4">
              <Badge variant="outline" className="bg-koffa-beige/10">
                {chef.cuisine_style}
              </Badge>
              {chef.specialty && (
                <Badge variant="outline" className="bg-koffa-beige/10">
                  {chef.specialty}
                </Badge>
              )}
              {chef.years_experience && (
                <Badge variant="outline" className="bg-koffa-beige/10 flex items-center">
                  <Clock className="mr-1 h-3 w-3" />
                  {chef.years_experience} years experience
                </Badge>
              )}
            </div>
            
            <p className="text-gray-700">
              {chef.bio || `Professional chef with ${chef.years_experience || 'several'} years of experience specializing in ${chef.cuisine_style} cuisine. Available for private events, family dinners, and special occasions.`}
            </p>
          </CardContent>
        </Card>
        
        {/* Tabs and Content */}
        <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="details">Details & Reviews</TabsTrigger>
            <TabsTrigger value="booking">Make a Booking</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Chef Info Card */}
              <Card className="border-koffa-beige">
                <CardHeader>
                  <CardTitle>About the Chef</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center">
                    <Avatar className="h-16 w-16 mr-4 border-2 border-koffa-beige">
                      {chef.profile_image ? (
                        <AvatarImage src={chef.profile_image} alt={chef.name} />
                      ) : (
                        <AvatarFallback className="bg-koffa-green text-white text-lg">
                          {initials}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg">{chef.name}</h3>
                      <p className="text-sm text-gray-500">
                        {chef.years_experience
                          ? `${chef.years_experience} years of experience`
                          : "Professional chef"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-koffa-beige/30">
                    <h4 className="font-medium mb-2">Specialties</h4>
                    <p className="text-sm text-gray-600">{chef.specialty || `${chef.cuisine_style} cuisine and local specialties`}</p>
                  </div>
                  
                  <div className="pt-4 border-t border-koffa-beige/30">
                    <h4 className="font-medium mb-2">Rate</h4>
                    <p className="text-2xl font-semibold text-koffa-green">${chef.hourly_rate.toFixed(2)}<span className="text-sm font-normal text-gray-500">/hour</span></p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full bg-koffa-green hover:bg-koffa-green-dark"
                    onClick={() => setActiveTab('booking')}
                  >
                    Book Now
                  </Button>
                </CardFooter>
              </Card>
              
              {/* Reviews */}
              <ChefReview chefId={chef.id} />
            </div>
            
            {/* Gallery or additional info could go here */}
            <Card className="border-koffa-beige">
              <CardHeader>
                <CardTitle>Signature Dishes</CardTitle>
                <CardDescription>Sample of the chef's specialty dishes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="aspect-square bg-koffa-beige/20 rounded-md overflow-hidden">
                      {/* Placeholder for dish images */}
                      <div className="h-full flex items-center justify-center text-koffa-green/40">
                        <ChefHat className="h-8 w-8" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="booking" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Booking Form */}
              <BookingForm chef={chef} />
              
              {/* Chef Info for Booking Reference */}
              <Card className="border-koffa-beige h-fit">
                <CardHeader>
                  <CardTitle>Your Chef</CardTitle>
                  <CardDescription>Information about your booking</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center">
                    <Avatar className="h-12 w-12 mr-3 border-2 border-koffa-beige">
                      {chef.profile_image ? (
                        <AvatarImage src={chef.profile_image} alt={chef.name} />
                      ) : (
                        <AvatarFallback className="bg-koffa-green text-white">
                          {initials}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{chef.name}</h3>
                      <p className="text-sm text-gray-500">{chef.cuisine_style} Cuisine</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-1">Rate</h4>
                    <p className="text-lg font-semibold text-koffa-green">${chef.hourly_rate.toFixed(2)}<span className="text-sm font-normal text-gray-500">/hour</span></p>
                  </div>
                  
                  <div className="pt-4 border-t border-koffa-beige/30">
                    <h4 className="text-sm font-medium mb-1">What's included</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Professional chef service for the booked hours</li>
                      <li>• Meal preparation and cooking</li>
                      <li>• Kitchen cleanup after cooking</li>
                      <li>• Expert guidance and tips</li>
                    </ul>
                  </div>
                  
                  <div className="pt-4 border-t border-koffa-beige/30">
                    <h4 className="text-sm font-medium mb-1">Booking notes</h4>
                    <p className="text-sm text-gray-600">
                      Please make sure your kitchen is available and prepared for the chef's arrival. 
                      You can add any dietary restrictions or preferences in the special requests section.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default ChefDetailPage;
