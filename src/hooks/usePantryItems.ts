
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export type PantryItem = {
  id: string;
  name: string;
  quantity: string;
  unit: string | null;
  expiry_date: string | null;
  location: string | null;
  low_stock: boolean;
  notes: string | null;
  added_by: string | null;
  user_id: string;
  created_at: string;
};

export const usePantryItems = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['pantryItems', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pantry_items')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as PantryItem[];
    },
    enabled: !!user,
  });
};

export const useAddPantryItem = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (item: Omit<PantryItem, 'id' | 'created_at' | 'user_id'>) => {
      if (!user) throw new Error('User must be logged in');
      
      const { data, error } = await supabase
        .from('pantry_items')
        .insert({
          ...item,
          user_id: user.id
        })
        .select();
      
      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pantryItems'] });
      toast.success('Item added to pantry');
    },
    onError: (error: any) => {
      toast.error(`Failed to add item: ${error.message}`);
    }
  });
};

export const useUpdatePantryItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      id, 
      ...updates 
    }: Partial<PantryItem> & { id: string }) => {
      const { error } = await supabase
        .from('pantry_items')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pantryItems'] });
      toast.success('Item updated');
    },
    onError: (error: any) => {
      toast.error(`Failed to update item: ${error.message}`);
    }
  });
};

export const useDeletePantryItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('pantry_items')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pantryItems'] });
      toast.success('Item removed from pantry');
    },
    onError: (error: any) => {
      toast.error(`Failed to delete item: ${error.message}`);
    }
  });
};
