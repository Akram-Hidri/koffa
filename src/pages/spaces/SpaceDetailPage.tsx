
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, ArrowLeft, RefreshCw } from 'lucide-react';
import PageLayout from '@/components/PageLayout';
import SpaceTask from '@/components/spaces/SpaceTask';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createEventNotification } from '@/utils/notificationUtils';

interface Task {
  id: string;
  task: string;
  due_date: string | null;
  assigned_to: string | null;
  recurrence: string | null;
  completed: boolean;
}

const SpaceDetailPage = () => {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('tasks');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [spaceName, setSpaceName] = useState('Loading...');
  const [isLoading, setIsLoading] = useState(true);
  const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    task: '',
    due_date: '',
    assigned_to: '',
    recurrence: ''
  });
  
  const fetchSpaceDetails = async () => {
    if (!id || !user) return;
    
    setIsLoading(true);
    try {
      // Get space details
      const { data: spaceData, error: spaceError } = await supabase
        .from('spaces')
        .select('*')
        .eq('id', id)
        .single();
      
      if (spaceError) throw spaceError;
      
      setSpaceName(spaceData.name);
      
      // Get space tasks
      const { data: tasksData, error: tasksError } = await supabase
        .from('space_tasks')
        .select('*')
        .eq('space_id', id)
        .order('created_at', { ascending: false });
      
      if (tasksError) throw tasksError;
      
      setTasks(tasksData || []);
    } catch (error: any) {
      console.error("Error fetching space details:", error);
      toast.error(`Failed to load space: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchSpaceDetails();
  }, [id, user]);
  
  const handleToggleTask = async (taskId: string) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;
      
      const newCompletedState = !task.completed;
      
      const { error } = await supabase
        .from('space_tasks')
        .update({ completed: newCompletedState })
        .eq('id', taskId);
      
      if (error) throw error;
      
      // Update local state
      setTasks(prevTasks => 
        prevTasks.map(t => 
          t.id === taskId ? { ...t, completed: newCompletedState } : t
        )
      );
      
      // Create notification for completed tasks
      if (newCompletedState && user) {
        createEventNotification(
          user.id,
          taskId,
          `Task completed in ${spaceName}`,
          `"${task.task}" was marked as complete.`,
          'space'
        );
      }
    } catch (error: any) {
      toast.error(`Failed to update task: ${error.message}`);
    }
  };
  
  const handleRefresh = () => {
    fetchSpaceDetails();
    toast.success("Space data refreshed");
  };
  
  const handleReturn = () => {
    navigate('/spaces');
  };
  
  const handleAddTask = () => {
    setIsAddTaskDialogOpen(true);
  };
  
  const handleSubmitNewTask = async () => {
    if (!newTask.task.trim() || !user || !id) {
      toast.error("Please enter a task description");
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('space_tasks')
        .insert({
          task: newTask.task.trim(),
          due_date: newTask.due_date || null,
          assigned_to: newTask.assigned_to || null,
          recurrence: newTask.recurrence || null,
          space_id: id,
          user_id: user.id,
          completed: false
        })
        .select();
      
      if (error) throw error;
      
      // Add new task to the list
      if (data?.[0]) {
        setTasks(prev => [data[0], ...prev]);
      }
      
      toast.success("Task added successfully!");
      setIsAddTaskDialogOpen(false);
      setNewTask({
        task: '',
        due_date: '',
        assigned_to: '',
        recurrence: ''
      });
      
    } catch (error: any) {
      toast.error(`Failed to add task: ${error.message}`);
    }
  };
  
  const renderTabContent = () => {
    switch (activeTab) {
      case 'tasks':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Tasks</h3>
              <Button size="sm" onClick={handleAddTask}>
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center py-12">
                <p>Loading tasks...</p>
              </div>
            ) : tasks.length === 0 ? (
              <Card className="p-8 text-center">
                <div className="flex flex-col items-center gap-2">
                  <h3 className="font-medium text-lg">No tasks yet</h3>
                  <p className="text-gray-500">Add tasks to manage this space</p>
                  <Button 
                    onClick={handleAddTask} 
                    className="mt-4"
                  >
                    <Plus className="mr-1 h-4 w-4" />Add First Task
                  </Button>
                </div>
              </Card>
            ) : (
              tasks.map((task) => (
                <SpaceTask
                  key={task.id}
                  task={task.task}
                  dueDate={task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No due date'}
                  assignedTo={task.assigned_to || 'Unassigned'}
                  recurrence={task.recurrence || 'One-time'}
                  completed={task.completed}
                  onToggle={() => handleToggleTask(task.id)}
                />
              ))
            )}
          </div>
        );
      
      case 'inventory':
        return (
          <Card className="p-4">
            <h3 className="text-lg font-medium mb-3">{spaceName} Inventory & Equipment</h3>
            <p className="text-gray-500 text-center py-8">
              Inventory management is coming soon
            </p>
          </Card>
        );
      
      case 'maintenance':
        return (
          <div className="text-center p-8">
            <p className="text-gray-500">Maintenance schedule coming soon</p>
          </div>
        );
      
      case 'notes':
        return (
          <Card className="p-4">
            <h3 className="text-lg font-medium mb-3">{spaceName} Notes</h3>
            <p className="text-gray-500 text-center py-8">
              Notes feature coming soon
            </p>
          </Card>
        );
      
      default:
        return null;
    }
  };

  return (
    <PageLayout title={spaceName}>
      <div className="space-y-6">
        {/* Back button and refresh */}
        <div className="flex justify-between items-center">
          <Button variant="ghost" size="sm" onClick={handleReturn}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Spaces
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh} 
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
        
        {/* Tab navigation */}
        <div className="flex items-center border-b overflow-x-auto hide-scrollbar pb-2">
          <Button 
            variant={activeTab === 'tasks' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('tasks')}
            className="rounded-full whitespace-nowrap"
          >
            📋 Tasks
          </Button>
          <Button 
            variant={activeTab === 'inventory' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('inventory')}
            className="rounded-full whitespace-nowrap"
          >
            📦 Inventory
          </Button>
          <Button 
            variant={activeTab === 'maintenance' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('maintenance')}
            className="rounded-full whitespace-nowrap"
          >
            🔧 Maintenance
          </Button>
          <Button 
            variant={activeTab === 'notes' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('notes')}
            className="rounded-full whitespace-nowrap"
          >
            📝 Notes
          </Button>
        </div>
        
        {/* Tab content */}
        {renderTabContent()}
        
        {/* Add Task Dialog */}
        <Dialog open={isAddTaskDialogOpen} onOpenChange={setIsAddTaskDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="task">Task Description</Label>
                <Input
                  id="task"
                  value={newTask.task}
                  onChange={(e) => setNewTask({...newTask, task: e.target.value})}
                  placeholder="e.g., Clean refrigerator"
                  autoFocus
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="due-date">Due Date (optional)</Label>
                <Input
                  id="due-date"
                  type="date"
                  value={newTask.due_date}
                  onChange={(e) => setNewTask({...newTask, due_date: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="assigned-to">Assigned To (optional)</Label>
                <Input
                  id="assigned-to"
                  value={newTask.assigned_to}
                  onChange={(e) => setNewTask({...newTask, assigned_to: e.target.value})}
                  placeholder="e.g., Mom, Dad, Child"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="recurrence">Recurrence (optional)</Label>
                <select
                  id="recurrence"
                  value={newTask.recurrence}
                  onChange={(e) => setNewTask({...newTask, recurrence: e.target.value})}
                  className="w-full rounded-md border border-input p-2 bg-background"
                >
                  <option value="">One-time task</option>
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddTaskDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmitNewTask}>Add Task</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PageLayout>
  );
};

export default SpaceDetailPage;
