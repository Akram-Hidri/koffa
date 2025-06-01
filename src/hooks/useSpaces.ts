
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

// Add the missing useSpaceWithTasks hook
export const useSpaceWithTasks = (spaceId: string) => {
  return useQuery({
    queryKey: ['space-with-tasks', spaceId],
    queryFn: async () => {
      // Get space details
      const { data: space, error: spaceError } = await supabase
        .from('spaces')
        .select('*')
        .eq('id', spaceId)
        .single();

      if (spaceError) throw spaceError;

      // Get space tasks
      const { data: tasks, error: tasksError } = await supabase
        .from('space_tasks')
        .select('*')
        .eq('space_id', spaceId)
        .order('created_at', { ascending: false });

      if (tasksError) throw tasksError;

      return { space, tasks: tasks || [] };
    },
    enabled: !!spaceId,
  });
};

// Add the missing useAddTask hook
export const useAddTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (task: {
      task: string;
      space_id: string;
      due_date?: string;
      assigned_to?: string;
      recurrence?: string;
    }) => {
      const { data, error } = await supabase
        .from('space_tasks')
        .insert({
          ...task,
          user_id: (await supabase.auth.getUser()).data.user?.id || '',
          completed: false
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['space-tasks', variables.space_id] });
      queryClient.invalidateQueries({ queryKey: ['space-with-tasks', variables.space_id] });
      toast.success('Task added successfully!');
    },
    onError: (error) => {
      toast.error('Failed to add task');
      console.error(error);
    },
  });
};

// Add the missing useToggleTaskCompletion hook
export const useToggleTaskCompletion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ taskId, completed, spaceId }: {
      taskId: string;
      completed: boolean;
      spaceId: string;
    }) => {
      const { data, error } = await supabase
        .from('space_tasks')
        .update({ completed })
        .eq('id', taskId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['space-tasks', variables.spaceId] });
      queryClient.invalidateQueries({ queryKey: ['space-with-tasks', variables.spaceId] });
      toast.success(variables.completed ? 'Task completed!' : 'Task marked as incomplete');
    },
    onError: (error) => {
      toast.error('Failed to update task');
      console.error(error);
    },
  });
};

export default useSpaces;
