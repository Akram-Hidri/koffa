
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Chef } from '@/hooks/useChefs';
import { ChefHat, Search, X } from 'lucide-react';

interface ChefFilterProps {
  chefs: Chef[];
  onFilter: (filtered: Chef[]) => void;
  onCuisineChange: (cuisine: string) => void;
  selectedCuisine: string;
}

export const ChefFilter: React.FC<ChefFilterProps> = ({ 
  chefs, 
  onFilter, 
  onCuisineChange,
  selectedCuisine
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [mealType, setMealType] = useState<string>('all');

  const uniqueCuisines = Array.from(new Set(chefs.map(chef => chef.cuisine_style)));
  
  const mealTypes = ['all', 'breakfast', 'lunch', 'dinner', 'dessert'];

  const applyFilters = () => {
    let filtered = [...chefs];
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(chef => 
        chef.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        chef.specialty?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chef.bio?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply price range filter
    filtered = filtered.filter(chef => 
      chef.hourly_rate >= priceRange[0] && chef.hourly_rate <= priceRange[1]
    );
    
    onFilter(filtered);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setPriceRange([0, 200]);
    setMealType('all');
    onCuisineChange('all');
    onFilter(chefs);
  };

  // Apply filters when any filter criteria changes
  React.useEffect(() => {
    applyFilters();
  }, [searchQuery, priceRange, mealType]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-koffa-beige/30 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search chefs..."
            className="pl-9"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1 h-8 w-8 p-0"
              onClick={() => setSearchQuery('')}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Cuisine Filter */}
        <Select 
          value={selectedCuisine} 
          onValueChange={onCuisineChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Cuisine style" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Cuisines</SelectItem>
            {uniqueCuisines.map(cuisine => (
              <SelectItem key={cuisine} value={cuisine}>{cuisine}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Meal Type Filter */}
        <Select value={mealType} onValueChange={setMealType}>
          <SelectTrigger>
            <SelectValue placeholder="Meal type" />
          </SelectTrigger>
          <SelectContent>
            {mealTypes.map(type => (
              <SelectItem key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Reset Filters */}
        <Button 
          variant="outline" 
          onClick={resetFilters}
          className="border-koffa-beige hover:bg-koffa-beige/20"
        >
          <X className="mr-2 h-4 w-4" /> Reset Filters
        </Button>
      </div>

      {/* Price Range Slider */}
      <div className="mt-4">
        <div className="flex justify-between mb-2">
          <span className="text-sm text-gray-500">Price range</span>
          <span className="text-sm font-medium">${priceRange[0]} - ${priceRange[1]}/hour</span>
        </div>
        <Slider
          defaultValue={[0, 200]}
          max={200}
          step={5}
          value={priceRange}
          onValueChange={(value) => setPriceRange(value as [number, number])}
          className="mb-2"
        />
      </div>
    </div>
  );
};
