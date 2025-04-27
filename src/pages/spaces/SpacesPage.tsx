
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import PageLayout from '@/components/PageLayout';
import SpaceCard from '@/components/spaces/SpaceCard';
import { Card } from '@/components/ui/card';

// Sample data for spaces
const SAMPLE_SPACES = [
  {
    id: '1',
    name: 'Kitchen',
    tasksCount: 2,
    allTasksDone: false
  },
  {
    id: '2',
    name: 'Majlis',
    tasksCount: 0,
    allTasksDone: true
  },
  {
    id: '3',
    name: "Children's Rooms",
    tasksCount: 1,
    allTasksDone: false
  },
  {
    id: '4',
    name: 'Master Bedroom',
    tasksCount: 0,
    allTasksDone: false
  },
  {
    id: '5',
    name: 'Bathrooms',
    tasksCount: 3,
    allTasksDone: false
  },
  {
    id: '6',
    name: 'Garden',
    tasksCount: 1,
    allTasksDone: false
  }
];

const UPCOMING_MAINTENANCE = [
  { task: 'AC Filter Cleaning', due: 'Due in 5 days' },
  { task: 'Monthly Deep Clean', due: 'This weekend' }
];

const SpacesPage = () => {
  const navigate = useNavigate();
  
  const handleAddSpace = () => {
    navigate('/spaces/new');
  };

  return (
    <PageLayout title="Home Spaces">
      <div className="space-y-6">
        {/* Header controls */}
        <div className="flex justify-between items-center">
          <select className="text-sm rounded-md border px-3 py-1 bg-white dark:bg-slate-800">
            <option value="all">Manage ▼ All Spaces</option>
            <option value="living">Living Areas</option>
            <option value="bedrooms">Bedrooms</option>
            <option value="outdoor">Outdoor</option>
          </select>
          
          <Button onClick={handleAddSpace}>
            <Plus className="mr-1 h-4 w-4" />
            Add New Space
          </Button>
        </div>
        
        {/* Spaces grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {SAMPLE_SPACES.map((space) => (
            <SpaceCard
              key={space.id}
              id={space.id}
              name={space.name}
              tasksCount={space.tasksCount}
              allTasksDone={space.allTasksDone}
            />
          ))}
        </div>
        
        {/* Upcoming maintenance */}
        <Card className="p-4">
          <h3 className="text-lg font-semibold text-center mb-3">Upcoming Maintenance</h3>
          <ul className="space-y-2">
            {UPCOMING_MAINTENANCE.map((item, index) => (
              <li key={index} className="flex">
                <span className="mr-2">•</span>
                <span>{item.task} - <span className="text-amber-600 dark:text-amber-400">{item.due}</span></span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </PageLayout>
  );
};

export default SpacesPage;
