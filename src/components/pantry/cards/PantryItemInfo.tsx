
import React from 'react';

interface PantryItemInfoProps {
  name: string;
  quantity: string;
  location: string;
  expiryDate: string;
  notes?: string;
}

const PantryItemInfo: React.FC<PantryItemInfoProps> = ({
  name,
  quantity,
  location,
  expiryDate,
  notes
}) => {
  const expiryWarning = 
    expiryDate !== '--' && 
    new Date(expiryDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) &&
    new Date(expiryDate) >= new Date();

  return (
    <>
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
    </>
  );
};

export default PantryItemInfo;
