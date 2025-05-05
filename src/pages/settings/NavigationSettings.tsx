
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { NavItem, useSettings } from '@/contexts/SettingsContext';
import { 
  Home, 
  Package, 
  ShoppingCart, 
  LayoutGrid as SpacesIcon, 
  Users, 
  Calendar, 
  ListTodo, 
  BookOpen, 
  Settings 
} from 'lucide-react';
import { toast } from 'sonner';
import SettingsLayout from '@/components/SettingsLayout';

const NavigationSettings = () => {
  const navigate = useNavigate();
  const { settings, updateSettings } = useSettings();
  
  // Initialize selected items from settings or defaults
  const [selectedItems, setSelectedItems] = useState<NavItem[]>(
    settings?.navItems || ['home', 'pantry', 'shopping', 'spaces', 'family']
  );

  // Available navigation items with their icons and labels
  const availableNavItems = [
    { id: 'home', label: 'Home', icon: <Home size={20} /> },
    { id: 'pantry', label: 'Pantry', icon: <Package size={20} /> },
    { id: 'shopping', label: 'Shopping', icon: <ShoppingCart size={20} /> },
    { id: 'spaces', label: 'Spaces', icon: <SpacesIcon size={20} /> },
    { id: 'family', label: 'Family', icon: <Users size={20} /> },
    { id: 'calendar', label: 'Calendar', icon: <Calendar size={20} /> },
    { id: 'tasks', label: 'Tasks', icon: <ListTodo size={20} /> },
    { id: 'notes', label: 'Notes', icon: <BookOpen size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> }
  ];

  // Filter available items to only show those not already selected
  const availableItems = availableNavItems.filter(
    item => !selectedItems.includes(item.id as NavItem)
  );

  // Handle drag and drop for reordering nav items
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const items = Array.from(selectedItems);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setSelectedItems(items);
  };

  // Add item to navigation bar (if less than 5 items already)
  const addNavItem = (item: NavItem) => {
    if (selectedItems.length >= 5) {
      toast.error("Maximum items reached. Remove an item first.");
      return;
    }
    
    setSelectedItems([...selectedItems, item]);
  };

  // Remove item from navigation bar
  const removeNavItem = (itemToRemove: NavItem) => {
    if (selectedItems.length <= 1) {
      toast.error("You need at least one navigation item.");
      return;
    }
    
    setSelectedItems(selectedItems.filter(item => item !== itemToRemove));
  };

  // Save settings changes
  const saveSettings = () => {
    updateSettings({ navItems: selectedItems });
    toast.success("Navigation bar updated");
    navigate('/settings');
  };

  return (
    <SettingsLayout title="Navigation Settings" activeTab="navigation">
      <Card className="border-koffa-beige/30 p-4 mb-6">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="font-semibold text-koffa-green">Customize Navigation Bar</CardTitle>
          <CardDescription>
            Drag and drop items to reorder. Select up to 5 items to display in your navigation bar.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="px-0">
          <h3 className="font-medium text-koffa-green mb-2">Selected Items ({selectedItems.length}/5)</h3>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="selected-nav-items">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="mb-6 border rounded-md p-2 min-h-[100px]"
                >
                  {selectedItems.length > 0 ? (
                    selectedItems.map((itemId, index) => {
                      const item = availableNavItems.find(navItem => navItem.id === itemId);
                      return (
                        <Draggable key={itemId} draggableId={itemId} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="flex items-center justify-between p-3 mb-2 bg-white rounded-md shadow-sm"
                            >
                              <div className="flex items-center">
                                <div className="mr-3 text-koffa-green">
                                  {item?.icon}
                                </div>
                                <span className="text-koffa-green">{item?.label}</span>
                              </div>
                              <Button 
                                variant="ghost"
                                size="sm"
                                onClick={() => removeNavItem(itemId as NavItem)}
                                className="text-red-500 hover:text-red-700"
                              >
                                Remove
                              </Button>
                            </div>
                          )}
                        </Draggable>
                      );
                    })
                  ) : (
                    <div className="flex items-center justify-center h-[100px] text-koffa-green-dark">
                      No items selected
                    </div>
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          
          <h3 className="font-medium text-koffa-green mb-2">Available Items</h3>
          <div className="border rounded-md p-2">
            {availableItems.length > 0 ? (
              availableItems.map((item) => (
                <div 
                  key={item.id}
                  className="flex items-center justify-between p-3 mb-2 bg-white rounded-md shadow-sm"
                >
                  <div className="flex items-center">
                    <div className="mr-3 text-koffa-green">
                      {item.icon}
                    </div>
                    <span className="text-koffa-green">{item.label}</span>
                  </div>
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => addNavItem(item.id as NavItem)}
                    className="border-koffa-green text-koffa-green"
                    disabled={selectedItems.length >= 5}
                  >
                    Add
                  </Button>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-[100px] text-koffa-green-dark">
                No more items available
              </div>
            )}
          </div>
          
          <Button 
            className="w-full mt-6 bg-koffa-green text-white hover:bg-koffa-green-dark"
            onClick={saveSettings}
          >
            Save Navigation Settings
          </Button>
        </CardContent>
      </Card>
    </SettingsLayout>
  );
};

export default NavigationSettings;
