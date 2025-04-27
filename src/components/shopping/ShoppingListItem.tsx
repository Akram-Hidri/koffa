
import React from 'react';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';

interface ShoppingListItemProps {
  name: string;
  quantity: string;
  note: string;
  priority: 'High' | 'Medium' | 'Low';
  addedBy: string;
  checked: boolean;
  onToggle: () => void;
}

const ShoppingListItem: React.FC<ShoppingListItemProps> = ({
  name,
  quantity,
  note,
  priority,
  addedBy,
  checked,
  onToggle
}) => {
  return (
    <Card className="mb-4 p-4 shadow-sm">
      <div className="flex">
        <div className="mr-3 pt-1">
          <Checkbox checked={checked} onCheckedChange={onToggle} />
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between">
            <h3 className={`font-medium ${checked ? 'line-through text-gray-400' : ''}`}>
              {name} ({quantity})
            </h3>
            <p className="text-sm text-gray-500">Added by: {addedBy}</p>
          </div>
          
          <div className="flex justify-between mt-2">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Note: {note}
            </p>
            <p className={`text-sm font-medium ${
              priority === 'High' 
                ? 'text-red-500' 
                : priority === 'Medium' 
                ? 'text-orange-500' 
                : 'text-blue-500'
            }`}>
              Priority: {priority}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ShoppingListItem;
