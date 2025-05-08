
import React from 'react';

interface PantryItemStatusProps {
  isLowStock: boolean;
  addedBy: string;
}

const PantryItemStatus: React.FC<PantryItemStatusProps> = ({
  isLowStock,
  addedBy
}) => {
  return (
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
  );
};

export default PantryItemStatus;
