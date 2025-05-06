
import React from 'react';
import PageLayout from '@/components/PageLayout';
import { Button } from '@/components/ui/button';
import { Plus, Search, Utensils } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';

const RecipesPage = () => {
  const navigate = useNavigate();
  
  return (
    <PageLayout title="Recipes" icon={<Utensils className="text-koffa-green" />}>
      <div className="space-y-6">
        {/* Search and filter */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-koffa-green h-4 w-4" />
            <Input 
              placeholder="Search recipes..." 
              className="pl-10 border-koffa-beige focus:border-koffa-green"
            />
          </div>
          <Button 
            className="bg-koffa-green hover:bg-koffa-green-dark text-white"
            onClick={() => navigate('/recipes/create')}
          >
            <Plus className="mr-2 h-4 w-4" /> Create Recipe
          </Button>
        </div>
        
        {/* Category filters */}
        <div className="flex flex-wrap gap-2">
          {['All', 'Breakfast', 'Lunch', 'Dinner', 'Desserts', 'Snacks', 'Drinks'].map(
            (category) => (
              <Button
                key={category}
                variant="outline"
                className="border-koffa-beige hover:bg-koffa-beige-light"
              >
                {category}
              </Button>
            )
          )}
        </div>
        
        {/* Cuisine filters */}
        <div>
          <h3 className="text-koffa-green font-medium mb-2">Cuisine</h3>
          <div className="flex flex-wrap gap-2">
            {['Middle Eastern', 'Mediterranean', 'Italian', 'Asian', 'American', 'Indian'].map(
              (cuisine) => (
                <Button
                  key={cuisine}
                  variant="outline"
                  className="border-koffa-beige hover:bg-koffa-beige-light"
                >
                  {cuisine}
                </Button>
              )
            )}
          </div>
        </div>
        
        {/* Recipe cards placeholder */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div 
              key={item}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-koffa-beige/30"
              onClick={() => navigate(`/recipes/${item}`)}
            >
              <div className="h-40 bg-koffa-beige-light flex items-center justify-center">
                <Utensils size={48} className="text-koffa-green/30" />
              </div>
              <div className="p-4">
                <h3 className="text-koffa-green font-medium">Recipe Placeholder {item}</h3>
                <p className="text-koffa-green-dark text-sm mt-1">Coming soon - Click to see more details</p>
                <div className="flex mt-2 gap-2">
                  <span className="px-2 py-1 bg-koffa-beige-light text-xs rounded-full">30 min</span>
                  <span className="px-2 py-1 bg-koffa-beige-light text-xs rounded-full">Easy</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
};

export default RecipesPage;
