
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Clock, Users, ChefHat, Trash2, Edit, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
import useRecipes, { useRecipe, useRecipeIngredients, useDeleteRecipe } from '@/hooks/useRecipes';
import { useAuth } from '@/contexts/AuthContext';

const RecipeDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const { data: recipe, isLoading, error } = useRecipe(id!);
  const { data: ingredients = [] } = useRecipeIngredients(id!);
  const deleteRecipe = useDeleteRecipe();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-koffa-beige-light flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-koffa-green"></div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="min-h-screen bg-koffa-beige-light flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-koffa-green mb-2">Recipe Not Found</h2>
          <Button onClick={() => navigate('/recipes')} className="bg-koffa-green hover:bg-koffa-green-dark">
            Back to Recipes
          </Button>
        </div>
      </div>
    );
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      try {
        await deleteRecipe.mutateAsync(recipe.id);
        navigate('/recipes');
      } catch (error) {
        toast.error('Failed to delete recipe');
      }
    }
  };

  const handleAddToShoppingList = async () => {
    if (!user) {
      toast.error('Please sign in to add ingredients to shopping list');
      return;
    }

    try {
      // For now, just show a success message
      // In a real app, you would create shopping list items
      toast.success('Ingredients added to shopping list!');
    } catch (error) {
      toast.error('Failed to add ingredients to shopping list');
    }
  };

  const isOwner = user?.id === recipe.user_id;

  return (
    <div className="min-h-screen bg-koffa-beige-light">
      {/* Header */}
      <div className="bg-white border-b border-koffa-beige p-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            className="mr-2 h-8 w-8 p-0" 
            onClick={() => navigate('/recipes')}
          >
            <ArrowLeft size={20} className="text-koffa-green" />
          </Button>
          <h1 className="text-xl font-semibold text-koffa-green truncate">{recipe.title}</h1>
        </div>
        
        {isOwner && (
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate(`/recipes/edit/${recipe.id}`)}
            >
              <Edit size={16} className="mr-1" />
              Edit
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleDelete}
              className="text-koffa-red border-koffa-red hover:bg-koffa-red hover:text-white"
            >
              <Trash2 size={16} />
            </Button>
          </div>
        )}
      </div>

      <div className="p-4 space-y-6">
        {/* Recipe Image */}
        {recipe.image_url && (
          <div className="aspect-video rounded-lg overflow-hidden">
            <img 
              src={recipe.image_url} 
              alt={recipe.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          </div>
        )}

        {/* Recipe Info */}
        <Card className="p-6">
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex items-center text-koffa-green-dark">
              <Clock size={16} className="mr-1" />
              <span className="text-sm">{recipe.prep_time + recipe.cook_time} min</span>
            </div>
            <div className="flex items-center text-koffa-green-dark">
              <Users size={16} className="mr-1" />
              <span className="text-sm">{recipe.servings} servings</span>
            </div>
            <div className="flex items-center text-koffa-green-dark">
              <ChefHat size={16} className="mr-1" />
              <span className="text-sm">{recipe.difficulty}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="secondary">{recipe.category}</Badge>
            <Badge variant="outline">{recipe.cuisine}</Badge>
          </div>

          {recipe.description && (
            <p className="text-koffa-green-dark mb-4">{recipe.description}</p>
          )}

          <div className="flex gap-2">
            <Button 
              onClick={handleAddToShoppingList}
              className="bg-koffa-green hover:bg-koffa-green-dark flex-1"
            >
              <ShoppingCart size={16} className="mr-2" />
              Add to Shopping List
            </Button>
          </div>
        </Card>

        {/* Ingredients */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-koffa-green mb-4">Ingredients</h2>
          <div className="space-y-2">
            {ingredients.map((ingredient) => (
              <div key={ingredient.id} className="flex justify-between items-center py-2 border-b border-koffa-beige last:border-b-0">
                <span className="text-koffa-green">{ingredient.name}</span>
                <span className="text-koffa-green-dark text-sm">
                  {ingredient.quantity} {ingredient.unit}
                  {ingredient.optional && <span className="text-koffa-green-dark ml-1">(optional)</span>}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Instructions */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-koffa-green mb-4">Instructions</h2>
          <div className="prose prose-sm max-w-none">
            <div className="whitespace-pre-wrap text-koffa-green-dark">
              {recipe.instructions}
            </div>
          </div>
        </Card>

        {/* Recipe Meta */}
        <Card className="p-4">
          <div className="text-sm text-koffa-green-dark">
            <p>Prep time: {recipe.prep_time} minutes</p>
            <p>Cook time: {recipe.cook_time} minutes</p>
            <p>Created: {new Date(recipe.created_at).toLocaleDateString()}</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RecipeDetailPage;
