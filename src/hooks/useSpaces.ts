
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Space {
  id: string;
  name: string;
  icon?: string;
  color?: string;
  type?: string;
  user_id: string;
  created_at: string;
}

export interface SpaceTask {
  id: string;
  task: string;
  due_date?: string;
  assigned_to?: string;
  recurrence?: string;
  completed: boolean;
  space_id: string;
  user_id: string;
  created_at: string;
}

export const useSpaces = () => {
  return useQuery({
    queryKey: ['spaces'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('spaces')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};

export const useCreateSpace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (space: Omit<Space, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('spaces')
        .insert(space)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spaces'] });
      toast.success('Space created successfully!');
    },
    onError: (error) => {
      toast.error('Failed to create space');
      console.error(error);
    },
  });
};

export const useSpaceTasks = (spaceId: string) => {
  return useQuery({
    queryKey: ['space-tasks', spaceId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('space_tasks')
        .select('*')
        .eq('space_id', spaceId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!spaceId,
  });
};

export default useSpaces;
