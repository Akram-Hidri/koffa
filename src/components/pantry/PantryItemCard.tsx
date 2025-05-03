
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Edit, Trash } from 'lucide-react';
import { useDeletePantryItem, useUpdatePantryItem } from '@/hooks/usePantryItems';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { createEventNotification } from '@/utils/notificationUtils';

interface PantryItemProps {
  id: string;
  name: string;
  quantity: string;
  expiryDate: string;
  location: string;
  addedBy: string;
  isLowStock: boolean;
  notes?: string;
}

const PantryItemCard: React.FC<PantryItemProps> = ({
  id,
  name,
  quantity,
  expiryDate,
  location,
  addedBy,
  isLowStock,
  notes
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { mutate: deleteItem, isPending: isDeleting } = useDeletePantryItem();
  const { mutate: updateItem, isPending: isUpdating } = useUpdatePantryItem();
  
  const handleEdit = () => {
    navigate(`/pantry/edit/${id}`);
  };
  
  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this item?')) {
      deleteItem(id);
    }
  };
  
  const handleAddToShoppingList = async () => {
    if (!user) return;
    
    toast.success("Item added to shopping list");
    
    // Create a notification for this action
    await createEventNotification(
      user.id,
      id,
      `Added ${name} to shopping list`,
      `${name} was added to the shopping list from your pantry.`,
      'pantry'
    );
  };
  
  const expiryWarning = 
    expiryDate !== '--' && 
    new Date(expiryDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) &&
    new Date(expiryDate) >= new Date();

  return (
    <Card className="p-4 mb-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex flex-wrap justify-between gap-2">
        <div>
          <h3 className="font-medium text-base">{name}</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm">Location: {location}</p>
        </div>
        <div className="text-right">
          <p className="font-medium">{quantity}</p>
          <p className={`text-sm ${expiryWarning ? 'text-amber-500' : 'text-gray-600 dark:text-gray-300'}`}>
            {expiryWarning ? '⚠️ ' : ''}Expires: {expiryDate}
          </p>
        </div>
      </div>
      
      {notes && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 border-t pt-2">
          Notes: {notes}
        </p>
      )}
      
      <div className="flex justify-between items-center mt-2 pt-2 border-t">
        <div className="flex items-center">
          {isLowStock ? (
            <span className="text-amber-500 dark:text-amber-400 text-sm font-medium">
              ⚠️ LOW STOCK
            </span>
          ) : (
            <span className="text-green-600 dark:text-green-400 text-sm font-medium">
              ✓ IN STOCK
            </span>
          )}
          <span className="ml-4 text-sm text-gray-500">Added by: {addedBy}</span>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm">
            <Edit className="h-4 w-4 mr-1" onClick={handleEdit} /> Edit
          </Button>
          <Button variant="ghost" size="sm" onClick={handleAddToShoppingList}>
            <ShoppingCart className="h-4 w-4 mr-1" /> Add
          </Button>
          <Button variant="ghost" size="sm" className="text-red-500" onClick={handleDelete} disabled={isDeleting}>
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default PantryItemCard;
