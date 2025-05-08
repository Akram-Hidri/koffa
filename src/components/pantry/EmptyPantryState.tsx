
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface EmptyPantryStateProps {
  onAddItem: () => void;
  hasSearchFilters: boolean;
}

const EmptyPantryState: React.FC<EmptyPantryStateProps> = ({ 
  onAddItem, 
  hasSearchFilters 
}) => {
  return (
    <Card className="p-8 text-center">
      <div className="flex flex-col items-center gap-2">
        <h3 className="font-medium text-lg">No pantry items found</h3>
        {hasSearchFilters ? (
          <p className="text-gray-500">Try changing your search or filters</p>
        ) : (
          <p className="text-gray-500">Add items to keep track of your pantry</p>
        )}
        <Button 
          onClick={onAddItem} 
          className="mt-4"
        >
          <Plus className="mr-1 h-4 w-4" />Add First Item
        </Button>
      </div>
    </Card>
  );
};

export default EmptyPantryState;
