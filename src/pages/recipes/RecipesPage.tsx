import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Search, Utensils, Clock, ChefHat, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useRecipeList } from '@/hooks/useRecipes';
import { Skeleton } from '@/components/ui/skeleton';

const RecipesPage = () => {
  const navigate = useNavigate();
  const { data: recipes, isLoading, error } = useRecipeList();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedCuisine, setSelectedCuisine] = useState<string | null>(null);
  
  const categories = ['Breakfast', 'Lunch', 'Dinner', 'Desserts', 'Snacks', 'Drinks'];
  const cuisines = ['Middle Eastern', 'Mediterranean', 'Italian', 'Asian', 'American', 'Indian'];
  
  const filteredRecipes = recipes?.filter(recipe => {
    // Filter by search query
    const matchesSearch = !searchQuery || 
      recipe.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by category
    const matchesCategory = !selectedCategory || recipe.category === selectedCategory;
    
    // Filter by cuisine
    const matchesCuisine = !selectedCuisine || recipe.cuisine === selectedCuisine;
    
    return matchesSearch && matchesCategory && matchesCuisine;
  });

  return (
    <div className="space-y-6">
      {/* Search and filter */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-koffa-green h-4 w-4" />
          <Input 
            placeholder="Search recipes..." 
            className="pl-10 border-koffa-beige focus:border-koffa-green"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button 
          className="bg-koffa-green hover:bg-koffa-green-dark text-white flex-shrink-0"
          onClick={() => navigate('/recipes/create')}
        >
          <Plus className="mr-2 h-4 w-4" /> Create Recipe
        </Button>
      </div>
      
      {/* Filter toolbar - only visible on larger screens */}
      <div className="hidden md:block">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="h-4 w-4 text-koffa-green" />
          <h3 className="text-koffa-green font-medium">Filters</h3>
        </div>
        
        <div className="space-y-4">
          {/* Category filters */}
          <div>
            <h4 className="text-sm text-koffa-green-dark mb-2">Category</h4>
            <div className="flex flex-wrap gap-2">
              <Badge 
                className={`cursor-pointer ${!selectedCategory ? 'bg-koffa-green text-white' : 'bg-white text-koffa-green border border-koffa-green'}`}
                onClick={() => setSelectedCategory(null)}
              >
                All
              </Badge>
              {categories.map((category) => (
                <Badge
                  key={category}
                  className={`cursor-pointer ${selectedCategory === category ? 'bg-koffa-green text-white' : 'bg-white text-koffa-green border border-koffa-green'}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>
          
          {/* Cuisine filters */}
          <div>
            <h4 className="text-sm text-koffa-green-dark mb-2">Cuisine</h4>
            <div className="flex flex-wrap gap-2">
              <Badge 
                className={`cursor-pointer ${!selectedCuisine ? 'bg-koffa-green text-white' : 'bg-white text-koffa-green border border-koffa-green'}`}
                onClick={() => setSelectedCuisine(null)}
              >
                All
              </Badge>
              {cuisines.map((cuisine) => (
                <Badge
                  key={cuisine}
                  className={`cursor-pointer ${selectedCuisine === cuisine ? 'bg-koffa-green text-white' : 'bg-white text-koffa-green border border-koffa-green'}`}
                  onClick={() => setSelectedCuisine(cuisine)}
                >
                  {cuisine}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile filters - accordion style */}
      <div className="md:hidden">
        <details className="group">
          <summary className="flex items-center justify-between cursor-pointer border-b pb-2">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-koffa-green" />
              <h3 className="text-koffa-green font-medium">Filters</h3>
            </div>
            <div className="transition-transform group-open:rotate-180">▼</div>
          </summary>
          <div className="pt-4 space-y-4">
            {/* Category filters */}
            <div>
              <h4 className="text-sm text-koffa-green-dark mb-2">Category</h4>
              <div className="flex flex-wrap gap-2">
                <Badge 
                  className={`cursor-pointer ${!selectedCategory ? 'bg-koffa-green text-white' : 'bg-white text-koffa-green border border-koffa-green'}`}
                  onClick={() => setSelectedCategory(null)}
                >
                  All
                </Badge>
                {categories.map((category) => (
                  <Badge
                    key={category}
                    className={`cursor-pointer ${selectedCategory === category ? 'bg-koffa-green text-white' : 'bg-white text-koffa-green border border-koffa-green'}`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
            
            {/* Cuisine filters */}
            <div>
              <h4 className="text-sm text-koffa-green-dark mb-2">Cuisine</h4>
              <div className="flex flex-wrap gap-2">
                <Badge 
                  className={`cursor-pointer ${!selectedCuisine ? 'bg-koffa-green text-white' : 'bg-white text-koffa-green border border-koffa-green'}`}
                  onClick={() => setSelectedCuisine(null)}
                >
                  All
                </Badge>
                {cuisines.map((cuisine) => (
                  <Badge
                    key={cuisine}
                    className={`cursor-pointer ${selectedCuisine === cuisine ? 'bg-koffa-green text-white' : 'bg-white text-koffa-green border border-koffa-green'}`}
                    onClick={() => setSelectedCuisine(cuisine)}
                  >
                    {cuisine}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </details>
      </div>
      
      {/* Recipe cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Card key={item} className="overflow-hidden hover:shadow-lg transition-shadow border border-koffa-beige/30">
              <Skeleton className="h-40" />
              <CardContent className="p-4">
                <Skeleton className="h-6 w-2/3 mb-2" />
                <Skeleton className="h-4 w-full" />
                <div className="flex mt-2 gap-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <div className="text-center p-8 bg-red-50 text-red-600 rounded-md">
          Error loading recipes. Please try again later.
        </div>
      ) : filteredRecipes?.length === 0 ? (
        <div className="text-center p-8 bg-koffa-beige-light rounded-md">
          <Utensils size={48} className="text-koffa-green mx-auto mb-3" />
          <h3 className="text-koffa-green font-medium text-lg">No recipes found</h3>
          <p className="text-koffa-green-dark mt-1">Try adjusting your filters or create a new recipe</p>
          <Button 
            className="mt-4 bg-koffa-green hover:bg-koffa-green-dark text-white"
            onClick={() => navigate('/recipes/create')}
          >
            <Plus className="mr-2 h-4 w-4" /> Create Recipe
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRecipes?.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} onClick={() => navigate(`/recipes/${recipe.id}`)} />
          ))}
        </div>
      )}
    </div>
  );
};

interface RecipeCardProps {
  recipe: any;
  onClick: () => void;
}

const RecipeCard = ({ recipe, onClick }: RecipeCardProps) => {
  return (
    <Card 
      className="overflow-hidden hover:shadow-lg transition-shadow border border-koffa-beige/30 cursor-pointer"
      onClick={onClick}
    >
      <div className="h-40 bg-koffa-beige-light flex items-center justify-center relative">
        {recipe.image_url ? (
          <img 
            src={recipe.image_url} 
            alt={recipe.title} 
            className="w-full h-full object-cover"
          />
        ) : (
          <Utensils size={48} className="text-koffa-green/30" />
        )}
        {recipe.category && (
          <Badge className="absolute top-2 right-2 bg-koffa-green text-white">{recipe.category}</Badge>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="text-koffa-green font-medium truncate">{recipe.title}</h3>
        {recipe.description && (
          <p className="text-koffa-green-dark text-sm mt-1 line-clamp-2">{recipe.description}</p>
        )}
      </CardContent>
      <CardFooter className="px-4 pb-4 pt-0 flex flex-wrap gap-2">
        {recipe.prep_time && (
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="h-3 w-3" /> {recipe.prep_time} min
          </Badge>
        )}
        {recipe.difficulty && (
          <Badge variant="outline" className="flex items-center gap-1">
            <ChefHat className="h-3 w-3" /> {recipe.difficulty}
          </Badge>
        )}
      </CardFooter>
    </Card>
  );
};

export default RecipesPage;
