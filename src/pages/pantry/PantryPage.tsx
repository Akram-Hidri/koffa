
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import PageLayout from '@/components/PageLayout';
import PantryFilters from '@/components/pantry/PantryFilters';
import PantryItemCard from '@/components/pantry/PantryItemCard';

// Sample data for pantry items
const SAMPLE_PANTRY_ITEMS = [
  {
    id: '1',
    name: 'Rice',
    quantity: '5kg',
    expiryDate: '30/10',
    location: 'Kitchen Cabinet',
    addedBy: 'Mother',
    isLowStock: true
  },
  {
    id: '2',
    name: 'Milk',
    quantity: '2 cartons',
    expiryDate: '05/05',
    location: 'Refrigerator',
    addedBy: 'Ahmad',
    isLowStock: false
  },
  {
    id: '3',
    name: 'Olive Oil',
    quantity: '1 bottle',
    expiryDate: '--',
    location: 'Kitchen Shelf',
    addedBy: 'Father',
    isLowStock: true
  }
];

const PantryPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [pantryItems, setPantryItems] = useState(SAMPLE_PANTRY_ITEMS);
  
  const handleAddItem = () => {
    navigate('/pantry/add');
  };
  
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (!term) {
      setPantryItems(SAMPLE_PANTRY_ITEMS);
      return;
    }
    
    const filtered = SAMPLE_PANTRY_ITEMS.filter(item => 
      item.name.toLowerCase().includes(term.toLowerCase())
    );
    setPantryItems(filtered);
  };

  return (
    <PageLayout title="Pantry Management">
      <PantryFilters onAddItem={handleAddItem} onSearch={handleSearch} />
      
      <div className="mt-6">
        {pantryItems.map((item) => (
          <PantryItemCard
            key={item.id}
            name={item.name}
            quantity={item.quantity}
            expiryDate={item.expiryDate}
            location={item.location}
            addedBy={item.addedBy}
            isLowStock={item.isLowStock}
          />
        ))}
        
        {pantryItems.length > 3 && (
          <Button variant="outline" className="w-full mt-4">
            Load More...
          </Button>
        )}
      </div>
    </PageLayout>
  );
};

export default PantryPage;
