
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { PantryItem } from '@/hooks/usePantryItems';

interface PantryGridViewProps {
  items: PantryItem[];
  onAddItem: () => void;
  onNavigateToEdit: (id: string) => void;
}

const PantryGridView: React.FC<PantryGridViewProps> = ({ items, onAddItem, onNavigateToEdit }) => {
  // Group items by location
  const categorizedItems = () => {
    const categories: Record<string, PantryItem[]> = {};
    
    items.forEach(item => {
      const category = item.location || 'Unassigned';
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(item);
    });
    
    return categories;
  };

  return (
    <div>
      {Object.entries(categorizedItems()).map(([location, locationItems]) => (
        <div key={location} className="mb-6">
          <h3 className="text-lg font-medium mb-3">{location}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {locationItems.map(item => (
              <Card 
                key={item.id}
                className="p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between">
                  <h4 className="font-medium truncate">{item.name}</h4>
                  <span className="font-medium text-sm">{item.quantity} {item.unit || ''}</span>
                </div>
                
                {item.notes && (
                  <p className="text-xs text-gray-600 mt-1 truncate">{item.notes}</p>
                )}
                
                <div className="flex justify-between mt-2 pt-2 border-t">
                  <span className={`text-xs font-medium ${
                    item.low_stock ? 'text-amber-500' : 'text-green-500'
                  }`}>
                    {item.low_stock ? '⚠️ LOW' : '✓ IN STOCK'}
                  </span>
                  
                  <span className="text-xs text-gray-500">
                    {item.expiry_date ? new Date(item.expiry_date).toLocaleDateString() : '--'}
                  </span>
                </div>
                
                <div className="flex justify-end mt-2 gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 px-2"
                    onClick={() => onNavigateToEdit(item.id)}
                  >
                    Edit
                  </Button>
                </div>
              </Card>
            ))}
            
            {/* Add new item card */}
            <Card 
              className="p-4 cursor-pointer hover:shadow-md transition-shadow border-dashed flex flex-col items-center justify-center text-center min-h-[120px]"
              onClick={onAddItem}
            >
              <Plus className="h-8 w-8 text-gray-400 mb-2" />
              <span className="text-sm text-gray-500">Add New Item</span>
            </Card>
          </div>
        </div>
      ))}
      
      {/* Ensure we always show at least one card if there are no categories */}
      {Object.keys(categorizedItems()).length === 0 && (
        <Card 
          className="p-8 text-center cursor-pointer hover:shadow-md transition-shadow border-dashed"
          onClick={onAddItem}
        >
          <div className="flex flex-col items-center gap-2">
            <Plus className="h-10 w-10 text-gray-400 mb-2" />
            <h3 className="font-medium text-lg">No pantry items found</h3>
            <p className="text-gray-500">Add your first item</p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default PantryGridView;
