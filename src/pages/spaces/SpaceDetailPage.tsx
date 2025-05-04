
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, ArrowLeft, RefreshCw } from 'lucide-react';
import PageLayout from '@/components/PageLayout';
import SpaceTask from '@/components/spaces/SpaceTask';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSpaceWithTasks, useAddTask, useToggleTaskCompletion } from '@/hooks/useSpaces';
import { Icon } from '@/components/ui/icon';
import { cn } from '@/lib/utils';

interface Task {
  id: string;
  task: string;
  due_date: string | null;
  assigned_to: string | null;
  recurrence: string | null;
  completed: boolean;
}

// Common task templates by space type
const COMMON_TASKS = {
  'Living Room': ['Vacuum carpet', 'Dust furniture', 'Clean windows', 'Organize books'],
  'Kitchen': ['Clean counters', 'Wash dishes', 'Mop floor', 'Take out trash', 'Clean refrigerator'],
  'Bedroom': ['Change bed sheets', 'Vacuum floor', 'Dust surfaces', 'Organize wardrobe'],
  'Bathroom': ['Clean toilet', 'Clean shower', 'Wash sink', 'Replace towels', 'Refill soap dispensers'],
  'Garden': ['Water plants', 'Mow lawn', 'Remove weeds', 'Trim bushes'],
  'Garage': ['Organize tools', 'Sweep floor', 'Check oil levels', 'Clean car'],
  'Yacht': ['Check engine', 'Clean deck', 'Inspect safety equipment', 'Refill fuel'],
  'Majlis': ['Vacuum carpet', 'Dust furniture', 'Arrange cushions', 'Clean coffee table'],
  'General': ['Clean floors', 'Dust surfaces', 'Organize items', 'Empty trash']
};

const SpaceDetailPage = () => {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('tasks');
  const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false);
  const [showCommonTasks, setShowCommonTasks] = useState(false);
  const [newTask, setNewTask] = useState({
    task: '',
    due_date: '',
    assigned_to: '',
    recurrence: ''
  });
  
  const { 
    data: spaceData,
    isLoading,
    refetch
  } = useSpaceWithTasks(id);

  const addTask = useAddTask();
  const toggleTaskCompletion = useToggleTaskCompletion();
  
  const fetchSpaceDetails = () => {
    refetch();
  };
  
  useEffect(() => {
    fetchSpaceDetails();
  }, [id]);
  
  const handleToggleTask = async (taskId: string, completed: boolean) => {
    if (!id) return;
    
    try {
      await toggleTaskCompletion.mutateAsync({ taskId, completed, spaceId: id });
    } catch (error) {
      // Error is handled by the mutation
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
    if (!newTask.task.trim() || !id) {
      toast.error("Please enter a task description");
      return;
    }
    
    try {
      await addTask.mutateAsync({
        task: newTask.task,
        space_id: id,
        due_date: newTask.due_date || undefined,
        assigned_to: newTask.assigned_to || undefined,
        recurrence: newTask.recurrence || undefined
      });
      
      setIsAddTaskDialogOpen(false);
      setNewTask({
        task: '',
        due_date: '',
        assigned_to: '',
        recurrence: ''
      });
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const handleAddCommonTask = async (task: string) => {
    if (!id) return;
    
    try {
      await addTask.mutateAsync({
        task,
        space_id: id
      });
      
      toast.success(`"${task}" task added`);
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  // Find relevant common tasks
  const getCommonTasks = () => {
    const spaceName = spaceData?.space?.name || '';
    
    // Try to match space name directly
    for (const [key, tasks] of Object.entries(COMMON_TASKS)) {
      if (spaceName.toLowerCase().includes(key.toLowerCase())) {
        return tasks;
      }
    }
    
    // Default to general tasks
    return COMMON_TASKS['General'];
  };
  
  const renderTasksTab = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center py-12">
          <p>Loading tasks...</p>
        </div>
      );
    }

    const tasks = spaceData?.tasks || [];
    const spaceName = spaceData?.space?.name || '';
    const spaceColor = spaceData?.space?.color || '#586b4d';
    const spaceIcon = spaceData?.space?.icon || 'layout-grid';
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div 
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center mr-2",
                "bg-opacity-20"
              )}
              style={{ backgroundColor: `${spaceColor}30` }}
            >
              <Icon 
                name={spaceIcon}
                className="h-4 w-4"
                style={{ color: spaceColor }}
              />
            </div>
            <h3 className="text-lg font-medium">{spaceName} Tasks</h3>
          </div>
          
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setShowCommonTasks(!showCommonTasks)}
            >
              {showCommonTasks ? 'Hide Suggestions' : 'Show Suggestions'}
            </Button>
            <Button size="sm" onClick={handleAddTask}>
              <Plus className="h-4 w-4 mr-1" />
              Add Task
            </Button>
          </div>
        </div>
        
        {/* Common Task Suggestions */}
        {showCommonTasks && (
          <Card className="p-4 bg-gray-50 dark:bg-gray-800/50 mb-4">
            <h4 className="font-medium mb-2">Common Tasks for {spaceName}</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {getCommonTasks().map((task, index) => (
                <Button 
                  key={index} 
                  variant="outline" 
                  className="justify-start text-left h-auto py-2"
                  onClick={() => handleAddCommonTask(task)}
                >
                  <Plus className="h-3 w-3 mr-2 flex-shrink-0" />
                  <span className="truncate">{task}</span>
                </Button>
              ))}
            </div>
          </Card>
        )}
        
        {tasks.length === 0 ? (
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
          <div>
            <h4 className="font-medium mb-2 text-gray-600">Active Tasks</h4>
            {tasks.filter(task => !task.completed).map((task) => (
              <SpaceTask
                key={task.id}
                task={task.task}
                dueDate={task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No due date'}
                assignedTo={task.assigned_to || 'Unassigned'}
                recurrence={task.recurrence || 'One-time'}
                completed={task.completed}
                onToggle={() => handleToggleTask(task.id, !task.completed)}
              />
            ))}
            
            {tasks.some(task => task.completed) && (
              <>
                <h4 className="font-medium my-2 text-gray-600">Completed Tasks</h4>
                {tasks.filter(task => task.completed).map((task) => (
                  <SpaceTask
                    key={task.id}
                    task={task.task}
                    dueDate={task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No due date'}
                    assignedTo={task.assigned_to || 'Unassigned'}
                    recurrence={task.recurrence || 'One-time'}
                    completed={task.completed}
                    onToggle={() => handleToggleTask(task.id, !task.completed)}
                  />
                ))}
              </>
            )}
          </div>
        )}
      </div>
    );
  };
  
  const renderTabContent = () => {
    switch (activeTab) {
      case 'tasks':
        return renderTasksTab();
      
      case 'inventory':
        return (
          <Card className="p-4">
            <h3 className="text-lg font-medium mb-3">{spaceData?.space?.name} Inventory & Equipment</h3>
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
            <h3 className="text-lg font-medium mb-3">{spaceData?.space?.name} Notes</h3>
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
    <PageLayout title={spaceData?.space?.name || "Space Details"}>
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
              <Button 
                onClick={handleSubmitNewTask}
                disabled={addTask.isPending}
              >
                {addTask.isPending ? "Adding..." : "Add Task"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PageLayout>
  );
};

export default SpaceDetailPage;
