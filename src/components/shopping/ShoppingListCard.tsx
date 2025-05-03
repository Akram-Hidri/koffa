
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Trash2, Edit, ExternalLink } from 'lucide-react';
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
        <span className={`text-xs md:text-sm font-medium px-2 py-0.5 rounded-full ${
          status === 'Completed' 
            ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' 
            : status === 'In Progress'
            ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
            : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
        } ${isMobile ? 'self-start' : ''}`}>
          Status: {status}
        </span>
        
        <div className={`flex gap-2 ${isMobile ? 'w-full' : ''}`}>
          <Button 
            size="sm" 
            className={isMobile ? 'flex-1' : ''}
            onClick={onViewEdit}
          >
            <ExternalLink className="h-3 w-3 md:h-4 md:w-4 mr-1" />
            View List
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="text-red-500 border-red-200 hover:bg-red-50 dark:hover:bg-red-950"
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
