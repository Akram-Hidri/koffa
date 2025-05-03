
import React from 'react';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface ShoppingListItemProps {
  id: string;
  name: string;
  quantity: string;
  note: string;
  priority: 'High' | 'Medium' | 'Low';
  addedBy: string;
  checked: boolean;
  onToggle: () => void;
  onDelete: () => void;
}

const ShoppingListItem: React.FC<ShoppingListItemProps> = ({
  id,
  name,
  quantity,
  note,
  priority,
  addedBy,
  checked,
  onToggle,
  onDelete
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
              {name} {quantity && `(${quantity})`}
            </h3>
            <div className="flex items-center gap-2">
              <p className="text-sm text-gray-500">Added by: {addedBy}</p>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-red-500 p-1 h-auto" 
                onClick={onDelete}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex justify-between mt-2">
            {note && (
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Note: {note}
              </p>
            )}
            <p className={`text-sm font-medium ml-auto ${
              priority === 'High' 
                ? 'text-red-500' 
                : priority === 'Medium' 
                ? 'text-orange-500' 
                : 'text-blue-500'
            }`}>
              {priority} Priority
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ShoppingListItem;
