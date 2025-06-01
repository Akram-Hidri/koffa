
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Recipe {
  id: string;
  title: string;
  description: string;
  instructions: string;
  cook_time: number;
  prep_time: number;
  difficulty: string;
  servings: number;
  category: string;
  cuisine: string;
  image_url: string;
  user_id: string;
  created_at: string;
}

export interface RecipeIngredient {
  id: string;
  recipe_id: string;
  name: string;
  quantity: string;
  unit?: string;
  optional?: boolean;
}

export const useRecipeList = () => {
  return useQuery({
    queryKey: ['recipes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};

export const useRecipe = (id: string) => {
  return useQuery({
    queryKey: ['recipe', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
};

export const useRecipeIngredients = (recipeId: string) => {
  return useQuery({
    queryKey: ['recipe-ingredients', recipeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('recipe_ingredients')
        .select('*')
        .eq('recipe_id', recipeId);

      if (error) throw error;
      return data;
    },
    enabled: !!recipeId,
  });
};

export const useCreateRecipe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (recipe: Omit<Recipe, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('recipes')
        .insert(recipe)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
      toast.success('Recipe created successfully!');
    },
    onError: (error) => {
      toast.error('Failed to create recipe');
      console.error(error);
    },
  });
};

export const useUpdateRecipe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...recipe }: Partial<Recipe> & { id: string }) => {
      const { data, error } = await supabase
        .from('recipes')
        .update(recipe)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
      toast.success('Recipe updated successfully!');
    },
    onError: (error) => {
      toast.error('Failed to update recipe');
      console.error(error);
    },
  });
};

export const useDeleteRecipe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('recipes')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
      toast.success('Recipe deleted successfully!');
    },
    onError: (error) => {
      toast.error('Failed to delete recipe');
      console.error(error);
    },
  });
};

// Export as an object with all hooks
export default {
  useRecipeList,
  useRecipe,
  useRecipeIngredients,
  useCreateRecipe,
  useUpdateRecipe,
  useDeleteRecipe,
};
