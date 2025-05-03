
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw } from 'lucide-react';
import PageLayout from '@/components/PageLayout';
import ShoppingListCard from '@/components/shopping/ShoppingListCard';
import { useShoppingLists, ShoppingList } from '@/hooks/useShoppingLists';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

const ShoppingListsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('active');
  const { data: shoppingLists = [], isLoading, error, refetch } = useShoppingLists();
  
  if (error) {
    toast.error("Failed to load shopping lists");
  }

  const handleCreateNewList = () => {
    navigate('/shopping/new');
  };
  
  const handleViewList = (id: string) => {
    navigate(`/shopping/list/${id}`);
  };
  
  const handleRefresh = () => {
    refetch();
    toast.success("Shopping lists refreshed");
  };
  
  // Filter lists based on active tab
  const filteredLists = shoppingLists.filter((list) => {
    if (activeTab === 'active') {
      return list.status !== 'Completed';
    } else if (activeTab === 'completed') {
      return list.status === 'Completed';
    } else if (activeTab === 'auto') {
      // Assume auto-generated lists have a specific naming pattern
      return list.title.includes('Auto-generated');
    }
    return true;
  });
  
  // Format date
  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (e) {
      return dateString;
    }
  };
  
  // Count items for each list
  const getItemCount = (list: ShoppingList) => {
    // This would ideally come from the API, but for now we'll show a placeholder
    return Math.floor(Math.random() * 20) + 1;
  };

  return (
    <PageLayout title="Shopping Lists">
      <div className="space-y-4">
        {/* Tab navigation */}
        <div className="flex items-center overflow-x-auto hide-scrollbar pb-2 border-b">
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
        <div className="flex flex-wrap justify-between items-center gap-2">
          <Button onClick={handleCreateNewList} className="whitespace-nowrap">
            <Plus className="mr-1 h-4 w-4" />
            Create New List
          </Button>
          
          <div className="flex items-center gap-2">
            <span className="text-sm mr-2 whitespace-nowrap">Sort by:</span>
            <select className="text-sm rounded-md border px-2 py-1 bg-white dark:bg-slate-800">
              <option value="date">▼ Date</option>
              <option value="name">Name</option>
              <option value="items">Items</option>
            </select>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
        
        {/* Shopping lists */}
        <div className="mt-4">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <p>Loading shopping lists...</p>
            </div>
          ) : filteredLists.length === 0 ? (
            <Card className="p-8 text-center">
              <div className="flex flex-col items-center gap-2">
                <h3 className="font-medium text-lg">
                  {activeTab === 'active' ? 'No active shopping lists' : 
                   activeTab === 'completed' ? 'No completed shopping lists' :
                   'No auto-generated shopping lists'}
                </h3>
                <p className="text-gray-500">
                  {activeTab === 'active' ? 'Create a new shopping list to get started' : 
                   activeTab === 'completed' ? 'Completed lists will appear here' :
                   'Auto-generated lists will appear here'}
                </p>
                {activeTab === 'active' && (
                  <Button 
                    onClick={handleCreateNewList} 
                    className="mt-4"
                  >
                    <Plus className="mr-1 h-4 w-4" />Create First List
                  </Button>
                )}
              </div>
            </Card>
          ) : (
            filteredLists.map((list) => (
              <ShoppingListCard
                key={list.id}
                id={list.id}
                title={list.title}
                createdDate={formatDate(list.created_at)}
                assignedTo={list.assigned_to || 'Unassigned'}
                itemCount={getItemCount(list)}
                status={list.status as 'Not Started' | 'In Progress' | 'Completed'}
                onViewEdit={() => handleViewList(list.id)}
              />
            ))
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default ShoppingListsPage;
