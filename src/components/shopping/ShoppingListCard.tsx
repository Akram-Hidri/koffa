
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';

interface ShoppingListCardProps {
  id: string;
  title: string;
  createdDate: string;
  assignedTo: string;
  itemCount: number;
  status: 'Not Started' | 'In Progress' | 'Completed';
  onViewEdit: () => void;
}

const ShoppingListCard: React.FC<ShoppingListCardProps> = ({
  id,
  title,
  createdDate,
  assignedTo,
  itemCount,
  status,
  onViewEdit
}) => {
  const isMobile = useIsMobile();
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (confirm('Are you sure you want to delete this shopping list?')) {
      toast.success("Shopping list deleted");
      // Ideally we'd call a mutation function here
    }
  };
  
  return (
    <Card 
      className="mb-4 p-3 md:p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
      onClick={onViewEdit}
    >
      <div className={`flex ${isMobile ? 'flex-col space-y-2' : 'justify-between'}`}>
        <div>
          <h3 className="font-medium text-sm md:text-base">{title}</h3>
          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300">Assigned to: {assignedTo}</p>
        </div>
        <div className={`${isMobile ? '' : 'text-right'}`}>
          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300">Created: {createdDate}</p>
          <p className="text-xs md:text-sm">Items: {itemCount}</p>
        </div>
      </div>
      
      <div className={`flex ${isMobile ? 'flex-col space-y-2' : 'justify-between items-center'} mt-2 pt-2 border-t`}>
        <span className={`text-xs md:text-sm font-medium ${
          status === 'Completed' 
            ? 'text-green-600 dark:text-green-400' 
            : status === 'In Progress'
            ? 'text-blue-600 dark:text-blue-400'
            : 'text-gray-600 dark:text-gray-400'
        } ${isMobile ? 'mb-2' : ''}`}>
          Status: {status}
        </span>
        
        <div className={`flex gap-2 ${isMobile ? 'w-full' : ''}`}>
          <Button 
            size="sm" 
            onClick={onViewEdit}
            className={isMobile ? 'flex-1' : ''}
          >
            View/Edit
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="text-red-500 border-red-200 hover:bg-red-50"
            onClick={handleDelete}
          >
            <Trash2 className="h-3 w-3 md:h-4 md:w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ShoppingListCard;
