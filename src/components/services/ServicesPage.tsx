
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Star, Clock, Users, MapPin, Heart, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useChefs } from '@/hooks/useChefs';
import PageLayout from '@/components/PageLayout';

const ServicesPage = () => {
  const navigate = useNavigate();
  const { data: chefs = [], isLoading } = useChefs();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<string | null>(null);

  // Filter chefs based on search and filters
  const filteredChefs = chefs.filter(chef => {
    const matchesSearch = !searchQuery || 
      chef.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chef.cuisine_style.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chef.specialty?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCuisine = !selectedCuisine || chef.cuisine_style === selectedCuisine;
    
    const matchesPrice = !priceRange || 
      (priceRange === 'budget' && chef.hourly_rate <= 50) ||
      (priceRange === 'mid' && chef.hourly_rate > 50 && chef.hourly_rate <= 100) ||
      (priceRange === 'premium' && chef.hourly_rate > 100);
    
    return matchesSearch && matchesCuisine && matchesPrice;
  });

  const cuisines = [...new Set(chefs.map(chef => chef.cuisine_style))];

  if (isLoading) {
    return (
      <PageLayout title="Chef Services">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded-t-lg"></div>
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Chef Services">
      <div className="space-y-4 sm:space-y-6">
        {/* Search and Filters */}
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search chefs by name, cuisine, or specialty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter Options */}
          <div className="space-y-3">
            {/* Cuisine Filter */}
            <div>
              <h4 className="text-sm font-medium mb-2">Cuisine Style</h4>
              <div className="flex flex-wrap gap-2">
                <Badge 
                  variant={!selectedCuisine ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedCuisine(null)}
                >
                  All
                </Badge>
                {cuisines.map((cuisine) => (
                  <Badge
                    key={cuisine}
                    variant={selectedCuisine === cuisine ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setSelectedCuisine(cuisine)}
                  >
                    {cuisine}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div>
              <h4 className="text-sm font-medium mb-2">Price Range</h4>
              <div className="flex flex-wrap gap-2">
                <Badge 
                  variant={!priceRange ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setPriceRange(null)}
                >
                  All Prices
                </Badge>
                <Badge
                  variant={priceRange === 'budget' ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setPriceRange('budget')}
                >
                  Budget ($0-50)
                </Badge>
                <Badge
                  variant={priceRange === 'mid' ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setPriceRange('mid')}
                >
                  Mid-range ($51-100)
                </Badge>
                <Badge
                  variant={priceRange === 'premium' ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setPriceRange('premium')}
                >
                  Premium ($100+)
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="text-sm text-gray-600">
          {filteredChefs.length} chef{filteredChefs.length !== 1 ? 's' : ''} found
        </div>

        {/* Chefs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredChefs.map((chef) => (
            <ChefCard 
              key={chef.id} 
              chef={chef} 
              onClick={() => navigate(`/services/chef/${chef.id}`)} 
            />
          ))}
        </div>

        {filteredChefs.length === 0 && (
          <Card className="p-8 text-center">
            <div className="flex flex-col items-center gap-2">
              <Search className="h-12 w-12 text-gray-400" />
              <h3 className="font-medium text-lg">No chefs found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          </Card>
        )}
      </div>
    </PageLayout>
  );
};

// Chef Card Component with improved mobile responsiveness
const ChefCard = ({ chef, onClick }: { chef: any; onClick: () => void }) => {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={onClick}>
      {/* Chef Image */}
      <div className="h-32 sm:h-48 bg-gradient-to-br from-blue-100 to-purple-100 relative flex items-center justify-center">
        {chef.profile_image ? (
          <img 
            src={chef.profile_image} 
            alt={chef.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : null}
        <div className={`absolute inset-0 flex items-center justify-center ${chef.profile_image ? 'hidden' : ''}`}>
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
            <span className="text-lg sm:text-xl font-bold text-gray-700">
              {getInitials(chef.name)}
            </span>
          </div>
        </div>
        
        {/* Favorite Button */}
        <Button 
          variant="ghost" 
          size="sm" 
          className="absolute top-2 right-2 bg-white/80 hover:bg-white"
          onClick={(e) => {
            e.stopPropagation();
            // Handle favorite logic here
          }}
        >
          <Heart className="h-4 w-4" />
        </Button>
      </div>

      <CardContent className="p-3 sm:p-4">
        <div className="space-y-2 sm:space-y-3">
          {/* Chef Name and Rating */}
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-sm sm:text-base truncate">{chef.name}</h3>
            <div className="flex items-center gap-1 ml-2">
              <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-xs sm:text-sm font-medium">4.8</span>
            </div>
          </div>

          {/* Cuisine and Specialty */}
          <div className="space-y-1">
            <Badge variant="secondary" className="text-xs">
              {chef.cuisine_style}
            </Badge>
            {chef.specialty && (
              <p className="text-xs text-gray-600 truncate">{chef.specialty}</p>
            )}
          </div>

          {/* Experience and Rate */}
          <div className="flex justify-between items-center text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{chef.years_experience || 0}+ years</span>
            </div>
            <div className="font-semibold text-green-600">
              ${chef.hourly_rate}/hr
            </div>
          </div>

          {/* Bio (truncated) */}
          {chef.bio && (
            <p className="text-xs text-gray-600 line-clamp-2">
              {chef.bio}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ServicesPage;
