
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, Share2, Download, RefreshCcw } from 'lucide-react';
import PageLayout from '@/components/PageLayout';
import ShoppingListItem from '@/components/shopping/ShoppingListItem';

// Sample data for shopping list items
const SAMPLE_SHOPPING_ITEMS = [
  {
    id: '1',
    name: 'Rice',
    quantity: '5kg',
    note: 'Basmati preferred',
    priority: 'High' as const,
    addedBy: 'Mother',
    checked: false
  },
  {
    id: '2',
    name: 'Eggs',
    quantity: '30',
    note: 'Organic',
    priority: 'Medium' as const,
    addedBy: 'Father',
    checked: true
  },
  {
    id: '3',
    name: 'Chicken',
    quantity: '2kg',
    note: 'Fresh, not frozen',
    priority: 'High' as const,
    addedBy: 'Ahmad',
    checked: false
  },
  {
    id: '4',
    name: 'Laundry Detergent',
    quantity: '',
    note: 'Regular size',
    priority: 'Medium' as const,
    addedBy: 'Auto-list',
    checked: false
  }
];

const ShoppingListDetailPage = () => {
  const { id } = useParams();
  const [filter, setFilter] = useState('all');
  const [items, setItems] = useState(SAMPLE_SHOPPING_ITEMS);
  
  // Sample list details
  const listDetails = {
    title: 'Weekly Grocery List',
    createdBy: 'Ahmad',
    assignedTo: 'Driver',
    dueDate: 'Tomorrow'
  };
  
  const handleToggleItem = (itemId: string) => {
    setItems(items.map(item => 
      item.id === itemId ? { ...item, checked: !item.checked } : item
    ));
  };
  
  const filteredItems = items.filter(item => {
    if (filter === 'all') return true;
    if (filter === 'toBuy') return !item.checked;
    if (filter === 'purchased') return item.checked;
    return true;
  });

  return (
    <PageLayout title={listDetails.title}>
      <div className="space-y-4">
        {/* List details */}
        <div className="flex flex-col space-y-2 border-b pb-4">
          <p className="text-sm">
            Created by: {listDetails.createdBy} | Assigned to: {listDetails.assignedTo} | Due: {listDetails.dueDate}
          </p>
          
          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <RefreshCcw className="h-4 w-4 mr-1" />
                Reassign
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-1" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
            </div>
            
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        </div>
        
        {/* Filter controls */}
        <div className="flex space-x-4 border-b pb-3">
          <label className="flex items-center space-x-2">
            <input 
              type="radio" 
              name="filter" 
              checked={filter === 'all'} 
              onChange={() => setFilter('all')}
              className="rounded-full h-4 w-4"
            />
            <span>Show All</span>
          </label>
          
          <label className="flex items-center space-x-2">
            <input 
              type="radio" 
              name="filter" 
              checked={filter === 'toBuy'} 
              onChange={() => setFilter('toBuy')}
              className="rounded-full h-4 w-4"
            />
            <span>To Buy</span>
          </label>
          
          <label className="flex items-center space-x-2">
            <input 
              type="radio" 
              name="filter" 
              checked={filter === 'purchased'} 
              onChange={() => setFilter('purchased')}
              className="rounded-full h-4 w-4"
            />
            <span>Purchased</span>
          </label>
        </div>
        
        {/* List items */}
        <div className="mt-4">
          {filteredItems.map((item) => (
            <ShoppingListItem
              key={item.id}
              name={item.name}
              quantity={item.quantity}
              note={item.note}
              priority={item.priority}
              addedBy={item.addedBy}
              checked={item.checked}
              onToggle={() => handleToggleItem(item.id)}
            />
          ))}
          
          {filteredItems.length > 4 && (
            <Button variant="outline" className="w-full mt-4">
              Load More...
            </Button>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default ShoppingListDetailPage;
