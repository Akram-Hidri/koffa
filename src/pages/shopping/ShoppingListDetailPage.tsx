import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, Share2, Download, RefreshCw, ArrowLeft, Save } from 'lucide-react';
import PageLayout from '@/components/PageLayout';
import ShoppingListItem from '@/components/shopping/ShoppingListItem';
import { 
  useShoppingListWithItems, 
  useUpdateShoppingListItem, 
  useAddShoppingList, 
  useAddShoppingListItem, 
  useDeleteShoppingListItem 
} from '@/hooks/useShoppingLists';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { createEventNotification } from '@/utils/notificationUtils';

const ShoppingListDetailPage = () => {
  const { id = 'new' } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [filter, setFilter] = useState('all');
  const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false);
  const [listTitle, setListTitle] = useState('');
  const [newItem, setNewItem] = useState({
    name: '',
    quantity: '',
    note: '',
    priority: 'Medium' as 'High' | 'Medium' | 'Low'
  });
  
  const { 
    data, 
    isLoading, 
    error, 
    refetch
  } = useShoppingListWithItems(id);
  
  const { mutate: updateItem } = useUpdateShoppingListItem();
  const { mutate: addList } = useAddShoppingList();
  const { mutate: addItem } = useAddShoppingListItem();
  const { mutate: deleteItem } = useDeleteShoppingListItem();
  
  React.useEffect(() => {
    if (data?.list?.title && id === 'new') {
      setListTitle(data.list.title);
    } else if (data?.list?.title) {
      setListTitle(data.list.title);
    }
  }, [data?.list?.title, id]);

  if (error) {
    toast.error("Failed to load shopping list details");
  }
  
  const handleToggleItem = (itemId: string, checked: boolean) => {
    if (!id || id === 'new') return;
    
    updateItem({
      id: itemId,
      list_id: id,
      checked: !checked
    });
    
    // Create notification when item is marked as completed
    if (!checked && user) {
      createEventNotification(
        user.id,
        id,
        `Shopping item completed`,
        `An item was marked as completed in your shopping list.`,
        'shopping'
      );
    }
  };
  
  const handleDeleteItem = (itemId: string) => {
    if (!id || id === 'new') return;
    
    if (confirm('Are you sure you want to delete this item?')) {
      deleteItem({ id: itemId, list_id: id });
    }
  };
  
  const handleRefresh = () => {
    refetch();
    toast.success("Shopping list refreshed");
  };
  
  const handleReturn = () => {
    navigate('/shopping');
  };
  
  const handleAddItem = () => {
    setIsAddItemDialogOpen(true);
  };
  
  const handleSaveList = () => {
    if (id === 'new') {
      if (!listTitle.trim()) {
        toast.error("Please enter a list title");
        return;
      }
      
      addList(
        { title: listTitle, assigned_to: null },
        {
          onSuccess: (newList) => {
            toast.success("Shopping list created");
            navigate(`/shopping/list/${newList.id}`);
          }
        }
      );
    } else {
      // Update list title if needed
      toast.success("List updated");
    }
  };
  
  const handleSubmitNewItem = () => {
    if (!newItem.name.trim()) {
      toast.error("Please enter an item name");
      return;
    }
    
    if (id === 'new') {
      // First create the list, then add the item
      addList(
        { title: listTitle || 'New Shopping List', assigned_to: null },
        {
          onSuccess: (newList) => {
            addItem({
              list_id: newList.id,
              name: newItem.name,
              quantity: newItem.quantity || '1',
              note: newItem.note,
              priority: newItem.priority
            });
            
            navigate(`/shopping/list/${newList.id}`);
            setIsAddItemDialogOpen(false);
            setNewItem({
              name: '',
              quantity: '',
              note: '',
              priority: 'Medium'
            });
          }
        }
      );
    } else {
      // Add item to existing list
      addItem({
        list_id: id,
        name: newItem.name,
        quantity: newItem.quantity || '1',
        note: newItem.note,
        priority: newItem.priority
      });
      
      setIsAddItemDialogOpen(false);
      setNewItem({
        name: '',
        quantity: '',
        note: '',
        priority: 'Medium'
      });
    }
  };
  
  const filteredItems = data?.items.filter(item => {
    if (filter === 'all') return true;
    if (filter === 'toBuy') return !item.checked;
    if (filter === 'purchased') return item.checked;
    return true;
  }) || [];
  
  const listDetails = data?.list || {
    title: 'New Shopping List',
    created_by: '',
    assigned_to: 'Unassigned',
    status: 'Not Started'
  };

  const isNewList = id === 'new';

  return (
    <PageLayout title={isNewList ? 'Create Shopping List' : listDetails.title}>
      <div className="space-y-4">
        {/* Back button */}
        <Button variant="ghost" size="sm" onClick={handleReturn} className="mb-2">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Lists
        </Button>
        
        {/* List details */}
        <div className="flex flex-col space-y-2 border-b pb-4">
          {isNewList ? (
            <div className="flex flex-col space-y-2">
              <Label htmlFor="listTitle">List Title</Label>
              <Input
                id="listTitle"
                value={listTitle}
                onChange={(e) => setListTitle(e.target.value)}
                placeholder="Enter list title..."
              />
            </div>
          ) : (
            <p className="text-sm">
              Assigned to: {listDetails.assigned_to || 'Unassigned'} | Status: {listDetails.status}
            </p>
          )}
          
          <div className="flex flex-wrap justify-between items-center gap-2">
            <div className="flex flex-wrap gap-2">
              {!isNewList && (
                <Button variant="outline" size="sm" onClick={handleRefresh}>
                  <RefreshCw 
                    className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`}
                  />
                  Refresh
                </Button>
              )}
              {isNewList ? (
                <Button size="sm" onClick={handleSaveList}>
                  <Save className="h-4 w-4 mr-1" />
                  Save List
                </Button>
              ) : (
                <>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Export
                  </Button>
                </>
              )}
            </div>
            
            <Button size="sm" onClick={handleAddItem}>
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        </div>
        
        {/* Filter controls - Only show for existing lists */}
        {!isNewList && (
          <div className="flex flex-wrap space-x-4 border-b pb-3">
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
        )}
        
        {/* List items */}
        <div className="mt-4">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <p>Loading items...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <Card className="p-8 text-center">
              <div className="flex flex-col items-center gap-2">
                <h3 className="font-medium text-lg">No items found</h3>
                {filter !== 'all' && !isNewList ? (
                  <p className="text-gray-500">Try changing the filter</p>
                ) : (
                  <p className="text-gray-500">Add items to your shopping list</p>
                )}
                <Button 
                  onClick={handleAddItem} 
                  className="mt-4"
                >
                  <Plus className="mr-1 h-4 w-4" />Add First Item
                </Button>
              </div>
            </Card>
          ) : (
            <>
              {filteredItems.map((item) => (
                <ShoppingListItem
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  quantity={item.quantity}
                  note={item.note || ''}
                  priority={item.priority as 'High' | 'Medium' | 'Low' || 'Medium'}
                  addedBy={item.added_by || 'Unknown'}
                  checked={item.checked || false}
                  onToggle={() => handleToggleItem(item.id, item.checked || false)}
                  onDelete={() => handleDeleteItem(item.id)}
                />
              ))}
              
              {filteredItems.length > 10 && (
                <Button variant="outline" className="w-full mt-4">
                  Load More...
                </Button>
              )}
            </>
          )}
        </div>
      </div>
      
      {/* Add Item Dialog */}
      <Dialog open={isAddItemDialogOpen} onOpenChange={setIsAddItemDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Item</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Item
              </Label>
              <Input
                id="name"
                value={newItem.name}
                onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantity" className="text-right">
                Quantity
              </Label>
              <Input
                id="quantity"
                value={newItem.quantity}
                onChange={(e) => setNewItem({...newItem, quantity: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="note" className="text-right">
                Note
              </Label>
              <Input
                id="note"
                value={newItem.note}
                onChange={(e) => setNewItem({...newItem, note: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="priority" className="text-right">
                Priority
              </Label>
              <select
                id="priority"
                value={newItem.priority}
                onChange={(e) => setNewItem({...newItem, priority: e.target.value as 'High' | 'Medium' | 'Low'})}
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddItemDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitNewItem}>Add Item</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default ShoppingListDetailPage;
