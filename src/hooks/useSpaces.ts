
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export type Space = {
  id: string;
  name: string;
  created_at: string;
  user_id: string;
  icon?: string;
  color?: string;
  type?: string;
};

export type SpaceTask = {
  id: string;
  task: string;
  due_date: string | null;
  assigned_to: string | null;
  recurrence: string | null;
  completed: boolean;
  space_id: string;
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
      
      if (error) {
        toast.error(`Failed to load spaces: ${error.message}`);
        throw error;
      }
      return data as Space[];
    },
    enabled: !!user,
  });
};

export const useCreateSpace = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (newSpace: { 
      name: string;
      icon?: string;
      color?: string;
      type?: string;
    }) => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('spaces')
        .insert({
          name: newSpace.name,
          user_id: user.id,
          icon: newSpace.icon || null,
          color: newSpace.color || null,
          type: newSpace.type || null
        })
        .select();
      
      if (error) throw error;
      return data[0] as Space;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['spaces'] });
      toast.success(`${data.name} space created successfully!`);
      
      // Create notification for family members
      createFamilyNotification(data.name);
    },
    onError: (error: any) => {
      toast.error(`Failed to create space: ${error.message}`);
    }
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
      
      if (spaceError) {
        toast.error(`Failed to load space: ${spaceError.message}`);
        throw spaceError;
      }
      
      // Get the tasks for this space
      const { data: tasks, error: tasksError } = await supabase
        .from('space_tasks')
        .select('*')
        .eq('space_id', spaceId)
        .order('created_at', { ascending: false });
      
      if (tasksError) {
        toast.error(`Failed to load tasks: ${tasksError.message}`);
        throw tasksError;
      }
      
      return {
        space,
        tasks: tasks || []
      };
    },
    enabled: !!user && !!spaceId,
  });
};

export const useAddTask = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (newTask: {
      task: string;
      space_id: string;
      due_date?: string;
      assigned_to?: string;
      recurrence?: string;
    }) => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('space_tasks')
        .insert({
          task: newTask.task,
          space_id: newTask.space_id,
          user_id: user.id,
          due_date: newTask.due_date || null,
          assigned_to: newTask.assigned_to || null,
          recurrence: newTask.recurrence || null,
          completed: false
        })
        .select();
      
      if (error) throw error;
      return data[0] as SpaceTask;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['space', variables.space_id] });
      toast.success('Task added successfully!');
    },
    onError: (error: any) => {
      toast.error(`Failed to add task: ${error.message}`);
    }
  });
};

export const useToggleTaskCompletion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      taskId, 
      completed,
      spaceId 
    }: { 
      taskId: string; 
      completed: boolean;
      spaceId: string;
    }) => {
      const { data, error } = await supabase
        .from('space_tasks')
        .update({ completed })
        .eq('id', taskId)
        .select();
      
      if (error) throw error;
      return { task: data[0] as SpaceTask, spaceId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['space', data.spaceId] });
      const status = data.task.completed ? 'completed' : 'reopened';
      toast.success(`Task ${status}!`);
    },
    onError: (error: any) => {
      toast.error(`Failed to update task: ${error.message}`);
    }
  });
};

// Helper function to create notifications for family members
const createFamilyNotification = async (spaceName: string) => {
  const { user } = useAuth();
  if (!user) return;
  
  try {
    // Get user's family
    const { data: profileData } = await supabase
      .from('profiles')
      .select('family_id')
      .eq('id', user.id)
      .single();
    
    if (!profileData?.family_id) return;
    
    // Get family members
    const { data: familyMembers } = await supabase
      .from('family_members')
      .select('user_id')
      .eq('family_id', profileData.family_id)
      .neq('user_id', user.id);
    
    if (!familyMembers || familyMembers.length === 0) return;
    
    // Create notification for each family member
    const notifications = familyMembers.map(member => ({
      user_id: member.user_id,
      title: 'New Space Created',
      body: `${spaceName} space has been created by a family member`,
      type: 'space'
    }));
    
    await supabase.from('notifications').insert(notifications);
  } catch (err) {
    console.error("Error creating notifications:", err);
  }
};
