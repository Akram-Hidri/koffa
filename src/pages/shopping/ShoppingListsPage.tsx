
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw, Grid3x3 } from 'lucide-react';
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
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
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

  // Group lists by category for grid view
  const categorizedLists = () => {
    // Using assigned_to as categories
    const categories: Record<string, ShoppingList[]> = {};
    
    filteredLists.forEach(list => {
      const category = list.assigned_to || 'Unassigned';
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(list);
    });
    
    return categories;
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
            <span className="text-sm mr-2 whitespace-nowrap">View:</span>
            <Button 
              variant={viewMode === 'list' ? 'secondary' : 'outline'} 
              size="sm"
              onClick={() => setViewMode('list')}
              className="h-8 px-2"
            >
              List
            </Button>
            <Button 
              variant={viewMode === 'grid' ? 'secondary' : 'outline'} 
              size="sm"
              onClick={() => setViewMode('grid')}
              className="h-8 px-2"
            >
              <Grid3x3 className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
              className="ml-2"
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
          ) : viewMode === 'list' ? (
            // List view
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
          ) : (
            // Grid view - grouped by categories
            <div>
              {Object.entries(categorizedLists()).map(([category, lists]) => (
                <div key={category} className="mb-6">
                  <h3 className="text-lg font-medium mb-3">{category}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {lists.map(list => (
                      <Card 
                        key={list.id}
                        className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => handleViewList(list.id)}
                      >
                        <h4 className="font-medium truncate">{list.title}</h4>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(list.created_at)}
                        </p>
                        <div className="flex justify-between items-center mt-2 pt-2 border-t">
                          <span className={`text-xs font-medium ${
                            list.status === 'Completed' 
                              ? 'text-green-600 dark:text-green-400' 
                              : list.status === 'In Progress'
                              ? 'text-blue-600 dark:text-blue-400'
                              : 'text-gray-600 dark:text-gray-400'
                          }`}>
                            {list.status}
                          </span>
                          <span className="text-xs">
                            {getItemCount(list)} items
                          </span>
                        </div>
                      </Card>
                    ))}
                    {/* Add new list card */}
                    <Card 
                      className="p-4 cursor-pointer hover:shadow-md transition-shadow border-dashed flex flex-col items-center justify-center text-center min-h-[120px]"
                      onClick={handleCreateNewList}
                    >
                      <Plus className="h-8 w-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500">Add New List</span>
                    </Card>
                  </div>
                </div>
              ))}
              
              {/* If no categories yet, show add new list button */}
              {Object.keys(categorizedLists()).length === 0 && (
                <Card 
                  className="p-8 text-center cursor-pointer hover:shadow-md transition-shadow border-dashed"
                  onClick={handleCreateNewList}
                >
                  <div className="flex flex-col items-center gap-2">
                    <Plus className="h-10 w-10 text-gray-400 mb-2" />
                    <h3 className="font-medium text-lg">No lists found</h3>
                    <p className="text-gray-500">Create your first shopping list</p>
                  </div>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default ShoppingListsPage;
