
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import PageLayout from '@/components/PageLayout';
import { ChefCard } from '@/components/services/ChefCard';
import { ChefFilter } from '@/components/services/ChefFilter';
import { UserBookings } from '@/components/services/UserBookings';
import { Chef, useChefs } from '@/hooks/useChefs';
import { ChefHat, Calendar, Utensils, Cake } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

const ServicesPage: React.FC = () => {
  const { session } = useAuth();
  const [selectedCuisine, setSelectedCuisine] = useState<string>('all');
  const { data: allChefs = [], isLoading } = useChefs(selectedCuisine);
  const [filteredChefs, setFilteredChefs] = useState<Chef[]>([]);
  
  useEffect(() => {
    if (allChefs) {
      setFilteredChefs(allChefs);
    }
  }, [allChefs]);
  
  const handleFilterChange = (filtered: Chef[]) => {
    setFilteredChefs(filtered);
  };
  
  const handleCuisineChange = (cuisine: string) => {
    setSelectedCuisine(cuisine);
  };
  
  const mealCategories = [
    { name: "Breakfast", icon: <Calendar className="h-5 w-5 text-yellow-500" />, color: "bg-yellow-50" },
    { name: "Lunch", icon: <Utensils className="h-5 w-5 text-green-500" />, color: "bg-green-50" },
    { name: "Dinner", icon: <ChefHat className="h-5 w-5 text-blue-500" />, color: "bg-blue-50" },
    { name: "Dessert", icon: <Cake className="h-5 w-5 text-pink-500" />, color: "bg-pink-50" },
  ];
  
  return (
    <PageLayout title="Services">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-koffa-green">Rent a Chef</h1>
          {session && (
            <Link to="/services/bookings">
              <Button variant="outline" className="border-koffa-green text-koffa-green">
                My Bookings
              </Button>
            </Link>
          )}
        </div>
        
        {/* Categories */}
        <div className="grid grid-cols-4 gap-4">
          {mealCategories.map((category, index) => (
            <Card key={index} className="border-koffa-beige hover:border-koffa-green transition-colors">
              <CardContent className={`p-4 flex flex-col items-center justify-center text-center ${category.color} rounded-md`}>
                <div className="p-3 rounded-full bg-white shadow-sm mb-2">
                  {category.icon}
                </div>
                <h3 className="font-medium">{category.name}</h3>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* User Bookings (if logged in) */}
        {session && <UserBookings limit={2} />}
        
        {/* Filtering */}
        <ChefFilter 
          chefs={allChefs} 
          onFilter={handleFilterChange} 
          onCuisineChange={handleCuisineChange}
          selectedCuisine={selectedCuisine}
        />
        
        {/* Chef Grid */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Available Chefs</h2>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredChefs.map((chef) => (
                <ChefCard key={chef.id} chef={chef} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border border-dashed border-koffa-beige rounded-lg">
              <ChefHat className="mx-auto h-12 w-12 text-koffa-green/40" />
              <h3 className="mt-4 text-lg font-medium">No chefs found</h3>
              <p className="mt-1 text-gray-500">Try adjusting your filters or search criteria</p>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default ServicesPage;
