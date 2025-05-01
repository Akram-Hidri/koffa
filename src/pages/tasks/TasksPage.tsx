import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, ListTodo, CheckCircle } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import PageLayout from '@/components/PageLayout';

interface Task {
  id: string;
  task: string;
  due_date: string | null;
  completed: boolean;
  space_id: string | null;
  space_name?: string;
}

const TasksPage = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    const fetchTasks = async () => {
      setIsLoading(true);
      try {
        // Query tasks with their space names
        const { data, error } = await supabase
          .from('space_tasks')
          .select(`
            id, 
            task,
            due_date,
            completed,
            space_id,
            spaces:space_id (name)
          `)
          .order('due_date', { ascending: true });
        
        if (error) throw error;
        
        // Transform data to include space_name
        const formattedTasks = data.map((task: any) => ({
          id: task.id,
          task: task.task,
          due_date: task.due_date,
          completed: task.completed,
          space_id: task.space_id,
          space_name: task.spaces?.name
        }));
        
        setTasks(formattedTasks);
      } catch (error: any) {
        toast.error(`Failed to load tasks: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTasks();
  }, [user]);
  
  const toggleTaskCompletion = async (taskId: string, completed: boolean) => {
    try {
      const { error } = await supabase
        .from('space_tasks')
        .update({ completed })
        .eq('id', taskId);
        
      if (error) throw error;
      
      // Update local state
      setTasks(prev => 
        prev.map(task => 
          task.id === taskId ? { ...task, completed } : task
        )
      );
      
      toast.success(completed ? "Task completed!" : "Task marked as incomplete");
    } catch (error: any) {
      toast.error(`Failed to update task: ${error.message}`);
    }
  };
  
  const handleAddTask = () => {
    // Redirect to task creation page
    window.location.href = '/spaces'; // For now redirect to spaces
  };
  
  const formatDueDate = (dateString: string | null) => {
    if (!dateString) return 'No due date';
    
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const dateFormatter = new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric'
    });
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return dateFormatter.format(date);
    }
  };
  
  return (
    <PageLayout title="Tasks">
      <div className="space-y-6">
        {/* Header with icon */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <ListTodo className="h-6 w-6 mr-2 text-[#586b4d]" />
            <h1 className="text-lg font-semibold">Tasks & To-dos</h1>
          </div>
          
          <Button onClick={handleAddTask} className="bg-[#586b4d] hover:bg-[#586b4d]/90">
            <Plus className="mr-1 h-4 w-4" />
            Add Task
          </Button>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <p>Loading tasks...</p>
          </div>
        ) : tasks.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="flex flex-col items-center gap-2">
              <ListTodo className="h-12 w-12 text-gray-400" />
              <h3 className="font-medium text-lg">No tasks yet</h3>
              <p className="text-gray-500">Create tasks for your spaces to keep track of chores and maintenance</p>
              <Button onClick={handleAddTask} className="mt-4 bg-[#586b4d] hover:bg-[#586b4d]/90">
                <Plus className="mr-1 h-4 w-4" />
                Add Your First Task
              </Button>
            </div>
          </Card>
        ) : (
          <div className="space-y-3">
            {/* Completed tasks section */}
            {tasks.some(task => task.completed) && (
              <div className="mt-6">
                <h2 className="text-md font-medium flex items-center mb-2">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  Completed
                </h2>
                {tasks.filter(task => task.completed).map(task => (
                  <Card key={task.id} className="p-3 mb-2 bg-gray-50">
                    <div className="flex items-center">
                      <Checkbox
                        checked={task.completed}
                        onCheckedChange={(checked) => toggleTaskCompletion(task.id, checked === true)}
                        className="mr-3"
                      />
                      <div className="flex-1">
                        <p className="text-gray-500 line-through">{task.task}</p>
                        <div className="flex gap-2 items-center mt-1 text-xs text-gray-400">
                          {task.space_name && <span>{task.space_name}</span>}
                          {task.due_date && <span>• {formatDueDate(task.due_date)}</span>}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
            
            {/* Pending tasks section */}
            {tasks.some(task => !task.completed) && (
              <div>
                <h2 className="text-md font-medium mb-2">To Do</h2>
                {tasks.filter(task => !task.completed).map(task => (
                  <Card key={task.id} className="p-3 mb-2">
                    <div className="flex items-center">
                      <Checkbox
                        checked={task.completed}
                        onCheckedChange={(checked) => toggleTaskCompletion(task.id, checked === true)}
                        className="mr-3"
                      />
                      <div className="flex-1">
                        <p>{task.task}</p>
                        <div className="flex gap-2 items-center mt-1 text-xs text-gray-500">
                          {task.space_name && <span>{task.space_name}</span>}
                          {task.due_date && <span>• {formatDueDate(task.due_date)}</span>}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default TasksPage;
