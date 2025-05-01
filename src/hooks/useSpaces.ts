
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export type Space = {
  id: string;
  name: string;
  created_at: string;
  user_id: string;
};

export const useSpaces = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['spaces', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('spaces')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Space[];
    },
    enabled: !!user,
  });
};

export const useSpaceWithTasks = (spaceId: string) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['space', spaceId, user?.id],
    queryFn: async () => {
      // Get the space details
      const { data: space, error: spaceError } = await supabase
        .from('spaces')
        .select('*')
        .eq('id', spaceId)
        .single();
      
      if (spaceError) throw spaceError;
      
      // Get the tasks for this space
      const { data: tasks, error: tasksError } = await supabase
        .from('space_tasks')
        .select('*')
        .eq('space_id', spaceId)
        .order('created_at', { ascending: false });
      
      if (tasksError) throw tasksError;
      
      return {
        space,
        tasks
      };
    },
    enabled: !!user && !!spaceId,
  });
};
