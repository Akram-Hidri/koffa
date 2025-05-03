
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export type ShoppingList = {
  id: string;
  title: string;
  status: string;
  assigned_to: string | null;
  user_id: string;
  created_at: string;
};

export type ShoppingListItem = {
  id: string;
  list_id: string;
  name: string;
  quantity: string;
  note: string | null;
  checked: boolean;
  priority: string | null;
  added_by: string | null;
  user_id: string;
  created_at: string;
};

export const useShoppingLists = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['shoppingLists', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('shopping_lists')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as ShoppingList[];
    },
    enabled: !!user,
  });
};

export const useShoppingListWithItems = (listId: string) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['shoppingList', listId, user?.id],
    queryFn: async () => {
      // For new lists, return empty data structure instead of attempting a database fetch
      if (!listId || listId === 'new') {
        return {
          list: {
            id: '',
            title: 'New Shopping List',
            assigned_to: null,
            status: 'Not Started',
            user_id: user?.id || '',
            created_at: new Date().toISOString()
          },
          items: []
        };
      }
      
      try {
        // Get the list details
        const { data: list, error: listError } = await supabase
          .from('shopping_lists')
          .select('*')
          .eq('id', listId)
          .maybeSingle();
        
        if (listError) throw listError;
        
        // Get the items for this list
        const { data: items, error: itemsError } = await supabase
          .from('shopping_list_items')
          .select('*')
          .eq('list_id', listId)
          .order('created_at', { ascending: false });
        
        if (itemsError) throw itemsError;
        
        return {
          list: list || {
            id: '',
            title: 'Shopping List',
            assigned_to: null,
            status: 'Not Started',
            user_id: user?.id || '',
            created_at: new Date().toISOString()
          },
          items: items || []
        };
      } catch (error) {
        console.error('Error fetching shopping list:', error);
        throw error;
      }
    },
    enabled: !!user,
    retry: 1,
  });
};

export const useAddShoppingList = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (list: Pick<ShoppingList, 'title' | 'assigned_to'>) => {
      if (!user) throw new Error('User must be logged in');
      
      const { data, error } = await supabase
        .from('shopping_lists')
        .insert({
          ...list,
          user_id: user.id
        })
        .select();
      
      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shoppingLists'] });
      toast.success('Shopping list created');
    },
    onError: (error: any) => {
      toast.error(`Failed to create list: ${error.message}`);
    }
  });
};

export const useAddShoppingListItem = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (item: {
      list_id: string;
      name: string;
      quantity: string;
      note?: string;
      priority?: string;
    }) => {
      if (!user) throw new Error('User must be logged in');
      
      const { data, error } = await supabase
        .from('shopping_list_items')
        .insert({
          ...item,
          user_id: user.id,
          added_by: user.email || 'Anonymous'
        })
        .select();
      
      if (error) throw error;
      return data[0];
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['shoppingList', variables.list_id] });
      toast.success('Item added to shopping list');
    },
    onError: (error: any) => {
      toast.error(`Failed to add item: ${error.message}`);
    }
  });
};

export const useUpdateShoppingListItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, list_id, ...updates }: Partial<ShoppingListItem> & { 
      id: string;
      list_id: string;
    }) => {
      const { error } = await supabase
        .from('shopping_list_items')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
      
      return { id, list_id };
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['shoppingList', result.list_id] });
    },
    onError: (error: any) => {
      toast.error(`Failed to update item: ${error.message}`);
    }
  });
};

export const useDeleteShoppingListItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, list_id }: { id: string; list_id: string }) => {
      const { error } = await supabase
        .from('shopping_list_items')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      return { list_id };
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['shoppingList', result.list_id] });
      toast.success('Item removed from shopping list');
    },
    onError: (error: any) => {
      toast.error(`Failed to delete item: ${error.message}`);
    }
  });
};
