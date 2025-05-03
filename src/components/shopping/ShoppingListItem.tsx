
import React from 'react';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
  
  return (
    <Card className="mb-4 p-3 md:p-4 shadow-sm">
      <div className="flex">
        <div className="mr-2 md:mr-3 pt-1">
          <Checkbox checked={checked} onCheckedChange={onToggle} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className={`flex ${isMobile ? 'flex-col space-y-1' : 'justify-between items-start'}`}>
            <h3 className={`font-medium text-sm md:text-base truncate ${checked ? 'line-through text-gray-400' : ''}`}>
              {name} {quantity && `(${quantity})`}
            </h3>
            <div className={`flex items-center gap-2 ${isMobile ? 'justify-between' : ''}`}>
              <p className="text-xs md:text-sm text-gray-500 truncate">{addedBy && `Added by: ${addedBy}`}</p>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-red-500 p-1 h-auto ml-auto" 
                onClick={onDelete}
              >
                <Trash2 className="h-3 w-3 md:h-4 md:w-4" />
              </Button>
            </div>
          </div>
          
          <div className={`flex ${isMobile ? 'flex-col space-y-1' : 'justify-between'} mt-1 md:mt-2`}>
            {note && (
              <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 truncate">
                Note: {note}
              </p>
            )}
            <p className={`text-xs md:text-sm font-medium ${isMobile ? '' : 'ml-auto'} ${
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
