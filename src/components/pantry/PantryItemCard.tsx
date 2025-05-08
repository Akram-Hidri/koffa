
import React from 'react';
import { Card } from '@/components/ui/card';
import { useDeletePantryItem } from '@/hooks/usePantryItems';
import { useNavigate } from 'react-router-dom';
import PantryItemInfo from './cards/PantryItemInfo';
import PantryItemStatus from './cards/PantryItemStatus';
import PantryItemActions from './cards/PantryItemActions';

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
  const { mutate: deleteItem, isPending: isDeleting } = useDeletePantryItem();
  
  const handleEdit = () => {
    navigate(`/pantry/edit/${id}`);
  };
  
  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this item?')) {
      deleteItem(id);
    }
  };

  return (
    <Card className="p-4 mb-4 shadow-sm transition-shadow hover:shadow-md">
      <PantryItemInfo 
        name={name}
        quantity={quantity}
        location={location}
        expiryDate={expiryDate}
        notes={notes}
      />
      
      <div className="flex justify-between items-center mt-2 pt-2 border-t">
        <PantryItemStatus 
          isLowStock={isLowStock}
          addedBy={addedBy}
        />
        
        <PantryItemActions
          id={id}
          name={name}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isDeleting={isDeleting}
        />
      </div>
    </Card>
  );
};

export default PantryItemCard;
