
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import PageLayout from '@/components/PageLayout';
import SpaceTask from '@/components/spaces/SpaceTask';
import { Card } from '@/components/ui/card';

// Sample data for space tasks
const SAMPLE_SPACE_TASKS = [
  {
    id: '1',
    task: 'Clean refrigerator',
    dueDate: 'Tomorrow',
    assignedTo: 'Ahmad',
    recurrence: 'Weekly',
    completed: false
  },
  {
    id: '2',
    task: 'Organize pantry shelves',
    dueDate: 'Saturday',
    assignedTo: 'Mother',
    recurrence: 'Monthly',
    completed: false
  }
];

const SAMPLE_EQUIPMENT = [
  { name: 'Microwave', status: 'Needs repair' },
  { name: 'Water dispenser', status: 'Working' },
  { name: 'Dishwasher', status: 'Working' }
];

const SAMPLE_NOTES = [
  "Don't use the third burner on stove",
  "Maid comes to deep clean on Thursdays"
];

const SpaceDetailPage = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('tasks');
  const [tasks, setTasks] = useState(SAMPLE_SPACE_TASKS);
  
  // Determine space name based on ID (in a real app, fetch from API)
  const spaceName = id === '1' ? 'Kitchen Space' : 'Space Details';
  
  const handleToggleTask = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };
  
  const renderTabContent = () => {
    switch (activeTab) {
      case 'tasks':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Tasks</h3>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
            
            {tasks.map((task) => (
              <SpaceTask
                key={task.id}
                task={task.task}
                dueDate={task.dueDate}
                assignedTo={task.assignedTo}
                recurrence={task.recurrence}
                completed={task.completed}
                onToggle={() => handleToggleTask(task.id)}
              />
            ))}
          </div>
        );
      
      case 'inventory':
        return (
          <Card className="p-4">
            <h3 className="text-lg font-medium mb-3">Kitchen Inventory & Equipment</h3>
            <ul className="space-y-2">
              {SAMPLE_EQUIPMENT.map((item, index) => (
                <li key={index} className="flex justify-between">
                  <span>• {item.name}</span>
                  <span className={item.status === 'Working' ? 'text-green-600' : 'text-amber-600'}>
                    {item.status}
                  </span>
                </li>
              ))}
            </ul>
            <Button variant="outline" className="w-full mt-4">
              View All Equipment
            </Button>
          </Card>
        );
      
      case 'maintenance':
        return (
          <div className="text-center p-8">
            <p className="text-gray-500">No maintenance scheduled</p>
          </div>
        );
      
      case 'notes':
        return (
          <Card className="p-4">
            <h3 className="text-lg font-medium mb-3">Kitchen Notes</h3>
            <ul className="space-y-2">
              {SAMPLE_NOTES.map((note, index) => (
                <li key={index} className="flex">
                  <span className="mr-2">•</span>
                  <span>{note}</span>
                </li>
              ))}
            </ul>
            <Button variant="outline" className="w-full mt-4">
              Add Note
            </Button>
          </Card>
        );
      
      default:
        return null;
    }
  };

  return (
    <PageLayout title={spaceName}>
      <div className="space-y-6">
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
      </div>
    </PageLayout>
  );
};

export default SpaceDetailPage;
