
import React from 'react';
import { Button } from '@/components/ui/button';
import PantryItemCard from '@/components/pantry/PantryItemCard';
import { PantryItem } from '@/hooks/usePantryItems';

interface PantryListViewProps {
  items: PantryItem[];
  onNavigateToEdit: (id: string) => void;
}

const PantryListView: React.FC<PantryListViewProps> = ({ items, onNavigateToEdit }) => {
  // Helper function to check if item is low stock
  const isLowStock = (item: PantryItem) => {
    return item.quantity !== null && item.quantity <= 2;
  };

  return (
    <div>
      {items.map((item) => (
        <PantryItemCard
          key={item.id}
          id={item.id}
          name={item.name}
          quantity={`${item.quantity} ${item.unit || ''}`}
          expiryDate={item.expiry_date ? new Date(item.expiry_date).toLocaleDateString() : '--'}
          location={item.location || 'Not specified'}
          addedBy="Unknown"
          isLowStock={isLowStock(item)}
          notes={item.notes || ''}
        />
      ))}
      
      {items.length > 10 && (
        <Button variant="outline" className="w-full mt-4">
          Load More...
        </Button>
      )}
    </div>
  );
};

export default PantryListView;
