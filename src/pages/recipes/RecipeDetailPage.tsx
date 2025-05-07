
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRecipes } from '@/hooks/useRecipes';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { ArrowLeft, Clock, Users, ChefHat, Edit, Trash2, Share2, ShoppingCart, Check } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useShoppingLists } from '@/hooks/useShoppingLists';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const RecipeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const { useRecipe, useDeleteRecipe } = useRecipes();
  const { data: recipe, isLoading } = useRecipe(id);
  const { mutateAsync: deleteRecipe } = useDeleteRecipe();
  
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showAddToListDialog, setShowAddToListDialog] = useState(false);
  const [selectedIngredients, setSelectedIngredients] = useState<Record<string, boolean>>({});
  
  const { useShoppingListsList } = useShoppingLists();
  const { data: shoppingLists } = useShoppingListsList();
  const [selectedShoppingList, setSelectedShoppingList] = useState<string | null>(null);
  
  const handleDeleteRecipe = async () => {
    try {
      await deleteRecipe(id as string);
      navigate('/recipes');
    } catch (error) {
      console.error('Error deleting recipe:', error);
    }
  };
  
  const toggleIngredient = (ingredientId: string) => {
    setSelectedIngredients(prev => ({
      ...prev,
      [ingredientId]: !prev[ingredientId]
    }));
  };
  
  const selectAllIngredients = () => {
    const allSelected = recipe?.ingredients?.reduce((acc, ingredient) => {
      acc[ingredient.id as string] = true;
      return acc;
    }, {} as Record<string, boolean>);
    
    setSelectedIngredients(allSelected || {});
  };
  
  const addToShoppingList = async () => {
    if (!selectedShoppingList) {
      toast.error('Please select a shopping list');
      return;
    }
    
    try {
      const selectedItems = recipe?.ingredients?.filter(ingredient => 
        selectedIngredients[ingredient.id as string]
      );
      
      if (!selectedItems || selectedItems.length === 0) {
        toast.error('Please select at least one ingredient');
        return;
      }
      
      // Add items to shopping list
      const shoppingItems = selectedItems.map(ingredient => ({
        recipe_id: recipe.id,
        shopping_list_id: selectedShoppingList,
        ingredient_id: ingredient.id,
        user_id: user?.id
      }));
      
      // Insert into recipe_shopping_items
      const { error } = await supabase
        .from('recipe_shopping_items')
        .insert(shoppingItems);
      
      if (error) throw error;
      
      // Also add to shopping_list_items
      const shoppingListItems = selectedItems.map(ingredient => ({
        list_id: selectedShoppingList,
        user_id: user?.id,
        name: ingredient.name,
        quantity: `${ingredient.quantity} ${ingredient.unit || ''}`,
        note: `From recipe: ${recipe.title}`
      }));
      
      const { error: listError } = await supabase
        .from('shopping_list_items')
        .insert(shoppingListItems);
      
      if (listError) throw listError;
      
      toast.success('Ingredients added to shopping list');
      setShowAddToListDialog(false);
    } catch (error: any) {
      toast.error(`Failed to add to shopping list: ${error.message}`);
      console.error('Error adding to shopping list:', error);
    }
  };
  
  if (isLoading) {
    return <RecipeSkeleton />;
  }
  
  if (!recipe) {
    return (
      <div className="max-w-3xl mx-auto p-4">
        <Button 
          variant="ghost" 
          className="mb-4" 
          onClick={() => navigate('/recipes')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Recipes
        </Button>
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">Recipe Not Found</h2>
            <p>The recipe you're looking for doesn't exist or has been deleted.</p>
            <Button 
              className="mt-4 bg-koffa-green hover:bg-koffa-green-dark text-white"
              onClick={() => navigate('/recipes')}
            >
              Return to Recipes
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/recipes')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Recipes
        </Button>
        
        <div className="flex gap-2">
          <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Share Recipe</DialogTitle>
              </DialogHeader>
              <div className="p-4">
                <p>Sharing functionality will be implemented in a future update.</p>
              </div>
            </DialogContent>
          </Dialog>
          
          <Dialog open={showAddToListDialog} onOpenChange={setShowAddToListDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-koffa-green text-koffa-green hover:bg-koffa-green hover:text-white">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to List
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add Ingredients to Shopping List</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-2">
                {recipe.ingredients && recipe.ingredients.length > 0 ? (
                  <>
                    <div className="flex justify-between mb-2">
                      <h3 className="text-sm font-medium">Select Ingredients</h3>
                      <Button 
                        variant="link" 
                        className="text-koffa-green p-0 h-auto text-sm" 
                        onClick={selectAllIngredients}
                      >
                        Select All
                      </Button>
                    </div>
                    <div className="max-h-60 overflow-y-auto border rounded-md p-2">
                      {recipe.ingredients.map((ingredient: any) => (
                        <div 
                          key={ingredient.id} 
                          className="flex items-center py-2 hover:bg-gray-50 px-2 rounded cursor-pointer"
                          onClick={() => toggleIngredient(ingredient.id)}
                        >
                          <div 
                            className={`w-5 h-5 border rounded mr-3 flex items-center justify-center ${
                              selectedIngredients[ingredient.id] ? 'bg-koffa-green border-koffa-green' : 'border-gray-300'
                            }`}
                          >
                            {selectedIngredients[ingredient.id] && <Check className="h-3 w-3 text-white" />}
                          </div>
                          <span>
                            {ingredient.name} ({ingredient.quantity} {ingredient.unit || ''})
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="space-y-2 mt-4">
                      <h3 className="text-sm font-medium">Select Shopping List</h3>
                      {shoppingLists && shoppingLists.length > 0 ? (
                        <div className="max-h-40 overflow-y-auto border rounded-md p-2">
                          {shoppingLists.map((list) => (
                            <div 
                              key={list.id} 
                              className={`p-2 rounded cursor-pointer ${
                                selectedShoppingList === list.id ? 'bg-koffa-green text-white' : 'hover:bg-gray-50'
                              }`}
                              onClick={() => setSelectedShoppingList(list.id)}
                            >
                              {list.title}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No shopping lists available</p>
                      )}
                    </div>
                    
                    <div className="flex justify-end gap-2 mt-4">
                      <Button 
                        variant="outline" 
                        onClick={() => setShowAddToListDialog(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={addToShoppingList}
                        disabled={!selectedShoppingList || Object.keys(selectedIngredients).length === 0}
                      >
                        Add to List
                      </Button>
                    </div>
                  </>
                ) : (
                  <p className="text-center py-4">No ingredients found for this recipe.</p>
                )}
              </div>
            </DialogContent>
          </Dialog>
          
          <Button 
            variant="outline"
            onClick={() => navigate(`/recipes/edit/${id}`)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          
          <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <Button 
              variant="destructive"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Recipe</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this recipe? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDeleteRecipe}
                  className="bg-red-500 hover:bg-red-600"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      
      <div className="space-y-6">
        <Card>
          <div className="relative">
            {recipe.image_url ? (
              <div className="w-full h-60 overflow-hidden">
                <img 
                  src={recipe.image_url} 
                  alt={recipe.title} 
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-full h-60 bg-koffa-beige-light flex items-center justify-center">
                <ChefHat size={80} className="text-koffa-green/20" />
              </div>
            )}
            {recipe.category && (
              <Badge className="absolute top-4 right-4 bg-koffa-green text-white">
                {recipe.category}
              </Badge>
            )}
          </div>
          <CardHeader>
            <CardTitle className="text-2xl text-koffa-green">{recipe.title}</CardTitle>
            {recipe.description && (
              <p className="mt-2 text-koffa-green-dark">{recipe.description}</p>
            )}
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 mb-6">
              {recipe.cook_time && (
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-koffa-green" />
                  <span>Cook: {recipe.cook_time} min</span>
                </div>
              )}
              {recipe.prep_time && (
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-koffa-green" />
                  <span>Prep: {recipe.prep_time} min</span>
                </div>
              )}
              {recipe.servings && (
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-koffa-green" />
                  <span>Serves: {recipe.servings}</span>
                </div>
              )}
              {recipe.difficulty && (
                <div className="flex items-center gap-2">
                  <ChefHat className="h-5 w-5 text-koffa-green" />
                  <span>Difficulty: {recipe.difficulty}</span>
                </div>
              )}
              {recipe.cuisine && (
                <Badge variant="outline">{recipe.cuisine}</Badge>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-koffa-green">Ingredients</CardTitle>
          </CardHeader>
          <CardContent>
            {recipe.ingredients && recipe.ingredients.length > 0 ? (
              <ul className="space-y-2">
                {recipe.ingredients.map((ingredient: any) => (
                  <li key={ingredient.id} className="flex items-center">
                    <span className="w-2 h-2 bg-koffa-green rounded-full mr-3"></span>
                    <span>
                      <strong>{ingredient.name}</strong> ({ingredient.quantity} {ingredient.unit || ''})
                      {ingredient.optional && <span className="text-gray-500 italic ml-2">optional</span>}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">No ingredients listed for this recipe.</p>
            )}
            
            <Button 
              className="mt-6 bg-koffa-green hover:bg-koffa-green-dark text-white"
              onClick={() => {
                setSelectedIngredients({});
                setShowAddToListDialog(true);
              }}
              disabled={!recipe.ingredients || recipe.ingredients.length === 0}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Shopping List
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-koffa-green">Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            {recipe.instructions ? (
              <div className="prose max-w-none">
                {recipe.instructions.split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No instructions provided for this recipe.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const RecipeSkeleton = () => (
  <div className="max-w-3xl mx-auto">
    <div className="flex justify-between items-center mb-4">
      <Skeleton className="h-10 w-32" />
      <div className="flex gap-2">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
    
    <div className="space-y-6">
      <Card>
        <Skeleton className="w-full h-60" />
        <CardHeader>
          <Skeleton className="h-8 w-3/4 mb-2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-6">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-24" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

export default RecipeDetailPage;
