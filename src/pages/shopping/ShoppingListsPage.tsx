
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import PageLayout from '@/components/PageLayout';
import ShoppingListCard from '@/components/shopping/ShoppingListCard';

// Sample data for shopping lists
const SAMPLE_SHOPPING_LISTS = [
  {
    id: '1',
    title: 'Weekly Grocery',
    createdDate: 'Yesterday',
    assignedTo: 'Driver',
    itemCount: 12,
    status: 'In Progress' as const
  },
  {
    id: '2',
    title: 'Ramadan Preparations',
    createdDate: '05/05',
    assignedTo: 'Everyone',
    itemCount: 25,
    status: 'Not Started' as const
  },
  {
    id: '3',
    title: 'Household Supplies',
    createdDate: '01/05',
    assignedTo: 'Mother',
    itemCount: 5,
    status: 'In Progress' as const
  }
];

const ShoppingListsPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('active');
  
  const handleCreateNewList = () => {
    navigate('/shopping/new');
  };
  
  const handleViewList = (id: string) => {
    navigate(`/shopping/list/${id}`);
  };

  return (
    <PageLayout title="Shopping Lists">
      <div className="space-y-4">
        {/* Tab navigation */}
        <div className="flex items-center border-b overflow-x-auto hide-scrollbar pb-2">
          <Button 
            variant={activeTab === 'active' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('active')}
            className="rounded-full whitespace-nowrap"
          >
            📋 Active Lists
          </Button>
          <Button 
            variant={activeTab === 'completed' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('completed')}
            className="rounded-full whitespace-nowrap"
          >
            ✅ Completed Lists
          </Button>
          <Button 
            variant={activeTab === 'auto' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('auto')}
            className="rounded-full whitespace-nowrap"
          >
            🛒 Auto-generated
          </Button>
        </div>
        
        {/* Create new list and sort controls */}
        <div className="flex justify-between items-center">
          <Button onClick={handleCreateNewList}>
            <Plus className="mr-1 h-4 w-4" />
            Create New List
          </Button>
          
          <div className="flex items-center">
            <span className="text-sm mr-2">Sort by:</span>
            <select className="text-sm rounded-md border px-2 py-1 bg-white dark:bg-slate-800">
              <option value="date">▼ Date</option>
              <option value="name">Name</option>
              <option value="items">Items</option>
            </select>
          </div>
        </div>
        
        {/* Shopping lists */}
        <div className="mt-4">
          {SAMPLE_SHOPPING_LISTS.map((list) => (
            <ShoppingListCard
              key={list.id}
              title={list.title}
              createdDate={list.createdDate}
              assignedTo={list.assignedTo}
              itemCount={list.itemCount}
              status={list.status}
              onViewEdit={() => handleViewList(list.id)}
            />
          ))}
        </div>
      </div>
    </PageLayout>
  );
};

export default ShoppingListsPage;
