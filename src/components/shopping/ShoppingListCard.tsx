
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface ShoppingListCardProps {
  title: string;
  createdDate: string;
  assignedTo: string;
  itemCount: number;
  status: 'Not Started' | 'In Progress' | 'Completed';
  onViewEdit: () => void;
}

const ShoppingListCard: React.FC<ShoppingListCardProps> = ({
  title,
  createdDate,
  assignedTo,
  itemCount,
  status,
  onViewEdit
}) => {
  return (
    <Card className="mb-4 p-4 shadow-sm">
      <div className="flex justify-between">
        <div>
          <h3 className="font-medium">[{title}]</h3>
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
        
        <Button size="sm" onClick={onViewEdit}>
          View/Edit
        </Button>
      </div>
    </Card>
  );
};

export default ShoppingListCard;
