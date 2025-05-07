
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export type RecipeIngredient = {
  id?: string;
  name: string;
  quantity: string;
  unit?: string;
  optional?: boolean;
};

export type Recipe = {
  id?: string;
  title: string;
  description?: string;
  instructions?: string;
  cook_time?: number;
  prep_time?: number;
  difficulty?: string;
  servings?: number;
  category?: string;
  cuisine?: string;
  image_url?: string;
  created_at?: string;
  ingredients?: RecipeIngredient[];
};

export const useRecipes = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const fetchRecipes = async () => {
    console.log('Fetching recipes for user:', user?.id);
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching recipes:', error);
      throw error;
    }

    return data || [];
  };

  const fetchRecipeWithIngredients = async (recipeId: string) => {
    const { data: recipe, error: recipeError } = await supabase
      .from('recipes')
      .select('*')
      .eq('id', recipeId)
      .single();

    if (recipeError) throw recipeError;

    const { data: ingredients, error: ingredientsError } = await supabase
      .from('recipe_ingredients')
      .select('*')
      .eq('recipe_id', recipeId);

    if (ingredientsError) throw ingredientsError;

    return {
      ...recipe,
      ingredients: ingredients || []
    };
  };

  const createRecipe = async (recipe: Recipe) => {
    if (!user) throw new Error('User must be logged in');
    
    // Extract ingredients before inserting recipe
    const { ingredients, ...recipeData } = recipe;
    
    // Insert the recipe first
    const { data: newRecipe, error: recipeError } = await supabase
      .from('recipes')
      .insert({ ...recipeData, user_id: user.id })
      .select()
      .single();

    if (recipeError) throw recipeError;

    // If there are ingredients, insert them with the recipe ID
    if (ingredients && ingredients.length > 0) {
      const ingredientsWithRecipeId = ingredients.map(ingredient => ({
        ...ingredient,
        recipe_id: newRecipe.id
      }));

      const { error: ingredientsError } = await supabase
        .from('recipe_ingredients')
        .insert(ingredientsWithRecipeId);

      if (ingredientsError) throw ingredientsError;
    }

    return newRecipe;
  };

  const updateRecipe = async (recipe: Recipe) => {
    if (!user) throw new Error('User must be logged in');
    if (!recipe.id) throw new Error('Recipe ID is required');
    
    // Extract ingredients to handle them separately
    const { ingredients, id, ...recipeData } = recipe;
    
    // Update recipe data
    const { error: recipeError } = await supabase
      .from('recipes')
      .update({ ...recipeData, updated_at: new Date() })
      .eq('id', id);

    if (recipeError) throw recipeError;

    // Handle ingredients if provided
    if (ingredients && ingredients.length > 0) {
      // First delete all existing ingredients
      const { error: deleteError } = await supabase
        .from('recipe_ingredients')
        .delete()
        .eq('recipe_id', id);
      
      if (deleteError) throw deleteError;

      // Then insert the new ingredients
      const ingredientsWithRecipeId = ingredients.map(ingredient => ({
        ...ingredient,
        recipe_id: id
      }));

      const { error: insertError } = await supabase
        .from('recipe_ingredients')
        .insert(ingredientsWithRecipeId);

      if (insertError) throw insertError;
    }
  };

  const deleteRecipe = async (id: string) => {
    const { error } = await supabase
      .from('recipes')
      .delete()
      .eq('id', id);

    if (error) throw error;
  };

  return {
    useRecipeList: () => useQuery({
      queryKey: ['recipes', user?.id],
      queryFn: fetchRecipes,
      enabled: !!user,
    }),
    
    useRecipe: (id?: string) => useQuery({
      queryKey: ['recipe', id],
      queryFn: () => fetchRecipeWithIngredients(id as string),
      enabled: !!id && !!user,
    }),
    
    useCreateRecipe: () => useMutation({
      mutationFn: createRecipe,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['recipes'] });
        toast.success('Recipe created successfully');
      },
      onError: (error: any) => {
        toast.error(`Failed to create recipe: ${error.message}`);
      }
    }),
    
    useUpdateRecipe: () => useMutation({
      mutationFn: updateRecipe,
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['recipes'] });
        queryClient.invalidateQueries({ queryKey: ['recipe', variables.id] });
        toast.success('Recipe updated successfully');
      },
      onError: (error: any) => {
        toast.error(`Failed to update recipe: ${error.message}`);
      }
    }),
    
    useDeleteRecipe: () => useMutation({
      mutationFn: deleteRecipe,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['recipes'] });
        toast.success('Recipe deleted successfully');
      },
      onError: (error: any) => {
        toast.error(`Failed to delete recipe: ${error.message}`);
      }
    })
  };
};
