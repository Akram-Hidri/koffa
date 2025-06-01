
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { useAddShoppingList, useAddShoppingListItem } from '@/hooks/useShoppingLists';
import { toast } from 'sonner';
import PageLayout from '@/components/PageLayout';

const NewShoppingListPage = () => {
  const navigate = useNavigate();
  const addShoppingList = useAddShoppingList();
  const addShoppingListItem = useAddShoppingListItem();
  
  const [listTitle, setListTitle] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [items, setItems] = useState<Array<{
    name: string;
    quantity: string;
    note?: string;
    priority?: string;
  }>>([]);
  const [currentItem, setCurrentItem] = useState({
    name: '',
    quantity: '1',
    note: '',
    priority: 'medium'
  });

  const addItemToList = () => {
    if (!currentItem.name.trim()) {
      toast.error('Please enter an item name');
      return;
    }

    setItems([...items, { ...currentItem }]);
    setCurrentItem({
      name: '',
      quantity: '1',
      note: '',
      priority: 'medium'
    });
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!listTitle.trim()) {
      toast.error('Please enter a list title');
      return;
    }

    try {
      // Create the shopping list
      const newList = await addShoppingList.mutateAsync({
        title: listTitle.trim(),
        assigned_to: assignedTo || null
      });

      // Add all items to the list
      if (items.length > 0) {
        for (const item of items) {
          await addShoppingListItem.mutateAsync({
            list_id: newList.id,
            name: item.name,
            quantity: item.quantity,
            note: item.note || undefined,
            priority: item.priority
          });
        }
      }

      toast.success('Shopping list created successfully!');
      navigate(`/shopping/list/${newList.id}`);
    } catch (error) {
      console.error('Error creating shopping list:', error);
      toast.error('Failed to create shopping list');
    }
  };

  return (
    <PageLayout title="Create Shopping List">
      <div className="max-w-2xl mx-auto space-y-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/shopping')}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Shopping Lists
        </Button>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* List Details */}
          <Card>
            <CardHeader>
              <CardTitle>List Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">List Title *</Label>
                <Input
                  id="title"
                  value={listTitle}
                  onChange={(e) => setListTitle(e.target.value)}
                  placeholder="e.g., Weekly Groceries, Party Supplies"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="assignedTo">Assigned To (Optional)</Label>
                <Input
                  id="assignedTo"
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  placeholder="e.g., John, Mom, Everyone"
                />
              </div>
            </CardContent>
          </Card>

          {/* Add Items */}
          <Card>
            <CardHeader>
              <CardTitle>Add Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Item Name</Label>
                  <Input
                    value={currentItem.name}
                    onChange={(e) => setCurrentItem({...currentItem, name: e.target.value})}
                    placeholder="e.g., Milk, Bread, Apples"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItemToList())}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Quantity</Label>
                  <Input
                    value={currentItem.quantity}
                    onChange={(e) => setCurrentItem({...currentItem, quantity: e.target.value})}
                    placeholder="e.g., 2 lbs, 1 gallon"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Note (Optional)</Label>
                <Input
                  value={currentItem.note}
                  onChange={(e) => setCurrentItem({...currentItem, note: e.target.value})}
                  placeholder="e.g., Organic, Brand preference"
                />
              </div>

              <Button type="button" onClick={addItemToList} className="w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                Add Item
              </Button>
            </CardContent>
          </Card>

          {/* Items List */}
          {items.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Items ({items.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{item.name}</span>
                          <span className="text-gray-500">({item.quantity})</span>
                        </div>
                        {item.note && (
                          <p className="text-sm text-gray-600">{item.note}</p>
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Submit Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/shopping')}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={addShoppingList.isPending}
              className="flex-1"
            >
              {addShoppingList.isPending ? 'Creating...' : 'Create Shopping List'}
            </Button>
          </div>
        </form>
      </div>
    </PageLayout>
  );
};

export default NewShoppingListPage;
