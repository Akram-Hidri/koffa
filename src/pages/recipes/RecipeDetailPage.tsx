
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Clock, Users, ChefHat, Edit, Trash2, ShoppingCart } from 'lucide-react';
import { useRecipes, Recipe } from '@/hooks/useRecipes';
import { toast } from 'sonner';
import PageLayout from '@/components/PageLayout';

const RecipeDetailPage = () => {
  const { recipeId } = useParams<{ recipeId: string }>();
  const navigate = useNavigate();
  const { data: recipes = [], deleteRecipe } = useRecipes();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (recipeId && recipes.length > 0) {
      const foundRecipe = recipes.find(r => r.id === recipeId);
      setRecipe(foundRecipe || null);
      setIsLoading(false);
    } else if (recipes.length === 0) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [recipeId, recipes]);

  const handleDelete = async () => {
    if (!recipe) return;
    
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      try {
        await deleteRecipe.mutateAsync(recipe.id);
        toast.success('Recipe deleted successfully');
        navigate('/recipes');
      } catch (error) {
        toast.error('Failed to delete recipe');
      }
    }
  };

  const handleAddToShoppingList = () => {
    // Mock functionality for now since recipe_ingredients table might not have data
    toast.success('Ingredients added to shopping list (demo)');
  };

  if (isLoading) {
    return (
      <PageLayout title="Loading Recipe">
        <div className="flex justify-center py-12">
          <p>Loading recipe...</p>
        </div>
      </PageLayout>
    );
  }

  if (!recipe) {
    return (
      <PageLayout title="Recipe Not Found">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-4">Recipe not found</h2>
          <Button onClick={() => navigate('/recipes')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Recipes
          </Button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title={recipe.title}>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/recipes')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Recipes
          </Button>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => navigate(`/recipes/${recipe.id}/edit`)}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>

        {/* Recipe Header */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h1 className="text-3xl font-bold mb-4">{recipe.title}</h1>
                {recipe.description && (
                  <p className="text-gray-600 mb-4">{recipe.description}</p>
                )}
                
                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                  {recipe.prep_time && (
                    <div className="flex items-center">
                      <Clock className="mr-1 h-4 w-4" />
                      Prep: {recipe.prep_time} min
                    </div>
                  )}
                  {recipe.cook_time && (
                    <div className="flex items-center">
                      <ChefHat className="mr-1 h-4 w-4" />
                      Cook: {recipe.cook_time} min
                    </div>
                  )}
                  {recipe.servings && (
                    <div className="flex items-center">
                      <Users className="mr-1 h-4 w-4" />
                      Serves: {recipe.servings}
                    </div>
                  )}
                  {recipe.difficulty && (
                    <div className="flex items-center">
                      <span className="mr-1">📊</span>
                      Difficulty: {recipe.difficulty}
                    </div>
                  )}
                </div>
              </div>
              
              {recipe.image_url && (
                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                  <img 
                    src={recipe.image_url} 
                    alt={recipe.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.svg';
                    }}
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Ingredients */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Ingredients</CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleAddToShoppingList}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Shopping List
            </Button>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">Ingredients list will be available when recipe ingredients are added.</p>
          </CardContent>
        </Card>

        {/* Instructions */}
        {recipe.instructions && (
          <Card>
            <CardHeader>
              <CardTitle>Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                {recipe.instructions.split('\n').map((step, index) => (
                  <div key={index} className="mb-3">
                    <span className="font-semibold text-blue-600 mr-2">
                      {index + 1}.
                    </span>
                    {step}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recipe Info */}
        <Card>
          <CardHeader>
            <CardTitle>Recipe Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {recipe.category && (
                <div>
                  <span className="font-semibold">Category:</span> {recipe.category}
                </div>
              )}
              {recipe.cuisine && (
                <div>
                  <span className="font-semibold">Cuisine:</span> {recipe.cuisine}
                </div>
              )}
              <div>
                <span className="font-semibold">Created:</span> {new Date(recipe.created_at).toLocaleDateString()}
              </div>
              {recipe.updated_at !== recipe.created_at && (
                <div>
                  <span className="font-semibold">Updated:</span> {new Date(recipe.updated_at).toLocaleDateString()}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default RecipeDetailPage;
