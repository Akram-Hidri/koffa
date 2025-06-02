
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import PageLayout from '@/components/PageLayout';
import { ChefCard } from '@/components/services/ChefCard';
import { ChefFilter } from '@/components/services/ChefFilter';
import { UserBookings } from '@/components/services/UserBookings';
import { Chef, useChefs } from '@/hooks/useChefs';
import { ChefHat, Calendar, Utensils, Cake, Filter } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

const ServicesPage: React.FC = () => {
  const { session } = useAuth();
  const [selectedCuisine, setSelectedCuisine] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const { data: allChefs = [], isLoading } = useChefs(selectedCuisine);
  const [filteredChefs, setFilteredChefs] = useState<Chef[]>([]);
  
  // Sample data to populate more chefs with diverse cuisines
  const sampleChefs: Chef[] = [
    {
      id: 'sample-1',
      name: 'Maria Rodriguez',
      cuisine_style: 'Mexican',
      specialty: 'Authentic Tacos & Mole',
      bio: 'Passionate about traditional Mexican flavors with a modern twist. 15 years of experience in fine dining.',
      hourly_rate: 75,
      years_experience: 15,
      profile_image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
      created_at: new Date().toISOString(),
      user_id: null
    },
    {
      id: 'sample-2',
      name: 'Chef Hiroshi Tanaka',
      cuisine_style: 'Japanese',
      specialty: 'Sushi & Ramen',
      bio: 'Tokyo-trained sushi master specializing in fresh, seasonal ingredients and traditional techniques.',
      hourly_rate: 120,
      years_experience: 20,
      profile_image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
      created_at: new Date().toISOString(),
      user_id: null
    },
    {
      id: 'sample-3',
      name: 'Giovanni Rossi',
      cuisine_style: 'Italian',
      specialty: 'Handmade Pasta & Pizza',
      bio: 'From the heart of Tuscany, bringing authentic Italian family recipes to your kitchen.',
      hourly_rate: 85,
      years_experience: 12,
      profile_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
      created_at: new Date().toISOString(),
      user_id: null
    },
    {
      id: 'sample-4',
      name: 'Chef Amara Singh',
      cuisine_style: 'Indian',
      specialty: 'Spices & Curries',
      bio: 'Expert in regional Indian cuisines with focus on aromatic spices and vegetarian specialties.',
      hourly_rate: 65,
      years_experience: 10,
      profile_image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
      created_at: new Date().toISOString(),
      user_id: null
    },
    {
      id: 'sample-5',
      name: 'Chef Claire Dubois',
      cuisine_style: 'French',
      specialty: 'Fine Dining & Pastries',
      bio: 'Classically trained in Lyon, specializing in elegant French cuisine and artisanal desserts.',
      hourly_rate: 110,
      years_experience: 18,
      profile_image: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400&h=400&fit=crop&crop=face',
      created_at: new Date().toISOString(),
      user_id: null
    },
    {
      id: 'sample-6',
      name: 'Chef Omar Hassan',
      cuisine_style: 'Mediterranean',
      specialty: 'Grilled Seafood & Mezze',
      bio: 'Bringing the fresh flavors of the Mediterranean coast with emphasis on healthy, seasonal cooking.',
      hourly_rate: 80,
      years_experience: 14,
      profile_image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
      created_at: new Date().toISOString(),
      user_id: null
    }
  ];
  
  // Combine real chefs with sample data
  const combinedChefs = [...allChefs, ...sampleChefs];
  
  useEffect(() => {
    let filtered = combinedChefs;
    
    // Filter by cuisine
    if (selectedCuisine !== 'all') {
      filtered = filtered.filter(chef => chef.cuisine_style.toLowerCase() === selectedCuisine.toLowerCase());
    }
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(chef => 
        chef.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chef.cuisine_style.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chef.specialty?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredChefs(filtered);
  }, [allChefs, selectedCuisine, searchTerm]);
  
  const mealCategories = [
    { name: "Breakfast", icon: <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />, color: "bg-yellow-50" },
    { name: "Lunch", icon: <Utensils className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />, color: "bg-green-50" },
    { name: "Dinner", icon: <ChefHat className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />, color: "bg-blue-50" },
    { name: "Dessert", icon: <Cake className="h-4 w-4 sm:h-5 sm:w-5 text-pink-500" />, color: "bg-pink-50" },
  ];
  
  const uniqueCuisines = [...new Set(combinedChefs.map(chef => chef.cuisine_style))];
  
  return (
    <PageLayout title="Services">
      <div className="space-y-4 sm:space-y-6 container-mobile">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-xl sm:text-2xl font-bold text-koffa-green">Rent a Chef</h1>
          {session && (
            <Link to="/services/bookings">
              <Button variant="outline" className="border-koffa-green text-koffa-green w-full sm:w-auto touch-target">
                My Bookings
              </Button>
            </Link>
          )}
        </div>
        
        {/* Search and Filter */}
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              placeholder="Search chefs, cuisine, or specialty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 h-12"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowFilters(!showFilters)}
              className="touch-target border-koffa-green text-koffa-green"
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Cuisine Filter */}
          {showFilters && (
            <Card className="p-4">
              <div className="space-y-3">
                <h4 className="font-medium">Filter by Cuisine</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge 
                    variant={selectedCuisine === 'all' ? "default" : "outline"}
                    className="cursor-pointer touch-target"
                    onClick={() => setSelectedCuisine('all')}
                  >
                    All Cuisines
                  </Badge>
                  {uniqueCuisines.map((cuisine) => (
                    <Badge
                      key={cuisine}
                      variant={selectedCuisine === cuisine ? "default" : "outline"}
                      className="cursor-pointer touch-target"
                      onClick={() => setSelectedCuisine(cuisine)}
                    >
                      {cuisine}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>
          )}
        </div>
        
        {/* Categories */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {mealCategories.map((category, index) => (
            <Card key={index} className="border-koffa-beige hover:border-koffa-green transition-colors">
              <CardContent className={`p-3 sm:p-4 flex flex-col items-center justify-center text-center ${category.color} rounded-md min-h-[80px] sm:min-h-[100px]`}>
                <div className="p-2 sm:p-3 rounded-full bg-white shadow-sm mb-2">
                  {category.icon}
                </div>
                <h3 className="font-medium text-xs sm:text-sm">{category.name}</h3>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* User Bookings (if logged in) */}
        {session && <UserBookings limit={2} />}
        
        {/* Results Count */}
        <div className="text-sm text-gray-600">
          {filteredChefs.length} chef{filteredChefs.length !== 1 ? 's' : ''} found
        </div>
        
        {/* Chef Grid */}
        <div>
          <h2 className="text-base sm:text-lg font-semibold mb-4">Available Chefs</h2>
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="h-80 animate-pulse border-koffa-beige">
                  <div className="p-4">
                    <div className="flex gap-4 items-center">
                      <div className="w-14 h-14 rounded-full bg-koffa-beige/30"></div>
                      <div className="w-1/2 h-5 bg-koffa-beige/30 rounded"></div>
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="h-4 bg-koffa-beige/30 rounded"></div>
                      <div className="h-4 w-3/4 bg-koffa-beige/30 rounded"></div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : filteredChefs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredChefs.map((chef) => (
                <ChefCard key={chef.id} chef={chef} />
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <div className="flex flex-col items-center gap-2">
                <ChefHat className="h-12 w-12 text-koffa-green/40" />
                <h3 className="font-medium text-lg">No chefs found</h3>
                <p className="text-gray-500 text-sm">Try adjusting your search or filters</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default ServicesPage;
