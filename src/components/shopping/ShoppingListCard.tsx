
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';

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
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (confirm('Are you sure you want to delete this shopping list?')) {
      toast.success("Shopping list deleted");
      // Ideally we'd call a mutation function here
    }
  };
  
  return (
    <Card 
      className="mb-4 p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
      onClick={onViewEdit}
    >
      <div className="flex justify-between">
        <div>
          <h3 className="font-medium">{title}</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm">Assigned to: {assignedTo}</p>
        </div>
        <div className="text-right">
          <p className="text-gray-600 dark:text-gray-300 text-sm">Created: {createdDate}</p>
          <p className="text-sm">Items: {itemCount}</p>
        </div>
      </div>
      
      <div className="flex justify-between items-center mt-2 pt-2 border-t">
        <span className={`text-sm font-medium ${
          status === 'Completed' 
            ? 'text-green-600 dark:text-green-400' 
            : status === 'In Progress'
            ? 'text-blue-600 dark:text-blue-400'
            : 'text-gray-600 dark:text-gray-400'
        }`}>
          Status: {status}
        </span>
        
        <div className="flex gap-2">
          <Button size="sm" onClick={onViewEdit}>
            View/Edit
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="text-red-500 border-red-200 hover:bg-red-50"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ShoppingListCard;
