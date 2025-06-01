
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export type PantryItem = {
  id: string;
  name: string;
  quantity: number | null;
  unit: string | null;
  expiry_date: string | null;
  location: string | null;
  notes: string | null;
  category: string | null;
  image_url: string | null;
  barcode: string | null;
  created_by: string;
  family_id: string;
  created_at: string;
  updated_at: string;
};

export const usePantryItems = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['pantryItems', user?.id],
    queryFn: async () => {
      console.log('Fetching pantry items for user ID:', user?.id);
      
      // First get user's family_id
      const { data: profile } = await supabase
        .from('profiles')
        .select('family_id')
        .eq('id', user?.id)
        .single();
      
      if (!profile?.family_id) {
        console.log('User has no family, returning empty array');
        return [];
      }
      
      const { data, error } = await supabase
        .from('pantry_items')
        .select('*')
        .eq('family_id', profile.family_id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching pantry items:', error);
        throw error;
      }
      
      console.log('Pantry items fetched:', data?.length || 0, 'items');
      return data as PantryItem[];
    },
    enabled: !!user,
  });
};

export const useAddPantryItem = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (item: Omit<PantryItem, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'family_id'>) => {
      if (!user) throw new Error('User must be logged in');
      
      // Get user's family_id
      const { data: profile } = await supabase
        .from('profiles')
        .select('family_id')
        .eq('id', user.id)
        .single();
      
      if (!profile?.family_id) {
        throw new Error('You must be part of a family to add pantry items');
      }
      
      console.log('Adding pantry item for user ID:', user.id);
      console.log('Item data:', item);
      
      const { data, error } = await supabase
        .from('pantry_items')
        .insert({
          ...item,
          created_by: user.id,
          family_id: profile.family_id
        })
        .select();
      
      if (error) {
        console.error('Error adding pantry item:', error);
        throw error;
      }
      
      console.log('New pantry item added:', data);
      return data[0];
    },
    onSuccess: (data) => {
      console.log('Invalidating pantry items query cache');
      queryClient.invalidateQueries({ queryKey: ['pantryItems'] });
      toast.success('Item added to pantry');
    },
    onError: (error: any) => {
      console.error('Failed to add item:', error);
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
        .update({ ...updates, updated_at: new Date().toISOString() })
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
