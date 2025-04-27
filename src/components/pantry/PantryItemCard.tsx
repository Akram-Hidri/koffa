
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Edit } from 'lucide-react';

interface PantryItemProps {
  name: string;
  quantity: string;
  expiryDate: string;
  location: string;
  addedBy: string;
  isLowStock: boolean;
}

const PantryItemCard: React.FC<PantryItemProps> = ({
  name,
  quantity,
  expiryDate,
  location,
  addedBy,
  isLowStock
}) => {
  return (
    <Card className="p-4 mb-4 shadow-sm">
      <div className="flex justify-between">
        <div>
          <h3 className="font-medium">[{name}]</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm">Location: {location}</p>
        </div>
        <div className="text-right">
          <p className="font-medium">{quantity} remaining</p>
          <p className="text-gray-600 dark:text-gray-300 text-sm">Expires: {expiryDate}</p>
        </div>
      </div>
      
      <div className="flex justify-between items-center mt-2 pt-2 border-t">
        <div className="flex items-center">
          {isLowStock ? (
            <span className="text-amber-500 dark:text-amber-400 text-sm font-medium">
              [⚠️ LOW]
            </span>
          ) : (
            <span className="text-green-600 dark:text-green-400 text-sm font-medium">
              [OK]
            </span>
          )}
          <span className="ml-4 text-sm text-gray-500">Added by: {addedBy}</span>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm">
            <Edit className="h-4 w-4 mr-1" /> Edit
          </Button>
          <Button variant="ghost" size="sm">
            <ShoppingCart className="h-4 w-4 mr-1" /> Add
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default PantryItemCard;
