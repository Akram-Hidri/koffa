
import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, ShoppingCart, Trash } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { createEventNotification } from '@/utils/notificationUtils';
import { toast } from 'sonner';

interface PantryItemActionsProps {
  id: string;
  name: string;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}

const PantryItemActions: React.FC<PantryItemActionsProps> = ({
  id,
  name,
  onEdit,
  onDelete,
  isDeleting = false
}) => {
  const { user } = useAuth();
  
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

  return (
    <div className="flex space-x-2">
      <Button variant="ghost" size="sm">
        <Edit className="h-4 w-4 mr-1" onClick={() => onEdit(id)} /> Edit
      </Button>
      <Button variant="ghost" size="sm" onClick={handleAddToShoppingList}>
        <ShoppingCart className="h-4 w-4 mr-1" /> Add
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        className="text-red-500" 
        onClick={() => onDelete(id)} 
        disabled={isDeleting}
      >
        <Trash className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default PantryItemActions;
