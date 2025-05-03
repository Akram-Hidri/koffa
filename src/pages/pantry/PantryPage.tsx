
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, Search, RefreshCw } from 'lucide-react';
import PageLayout from '@/components/PageLayout';
import PantryItemCard from '@/components/pantry/PantryItemCard';
import PantryFilters from '@/components/pantry/PantryFilters';
import { usePantryItems, PantryItem } from '@/hooks/usePantryItems';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const PantryPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState<string | null>(null);
  const [categoryFilter, setcategoryFilter] = useState<string | null>(null);
  const [addedByFilter, setAddedByFilter] = useState<string | null>(null);
  
  const { data: pantryItems = [], isLoading, error, refetch } = usePantryItems();
  
  if (error) {
    toast.error("Failed to load pantry items");
  }
  
  const handleAddItem = () => {
    navigate('/pantry/add');
  };
  
  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleLocationFilter = (location: string | null) => {
    setLocationFilter(location);
  };

  const handleCategoryFilter = (category: string | null) => {
    setcategoryFilter(category);
  };
  
  const handleAddedByFilter = (addedBy: string | null) => {
    setAddedByFilter(addedBy);
  };

  const handleRefresh = () => {
    refetch();
    toast.success("Pantry items refreshed");
  };

  // Apply filters
  const filteredItems = pantryItems.filter((item) => {
    // Search filter
    if (searchTerm && !item.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Location filter
    if (locationFilter && item.location !== locationFilter) {
      return false;
    }
    
    // Category filter (assuming we add category field later)
    if (categoryFilter && item.notes?.includes(categoryFilter)) {
      return false;
    }
    
    // Added by filter
    if (addedByFilter && item.added_by !== addedByFilter) {
      return false;
    }
    
    return true;
  });

  return (
    <PageLayout title="Pantry Management">
      <PantryFilters 
        onAddItem={handleAddItem} 
        onSearch={handleSearch}
        onLocationFilter={handleLocationFilter}
        onCategoryFilter={handleCategoryFilter}
        onAddedByFilter={handleAddedByFilter}
      />
      
      <div className="flex justify-between items-center mt-4">
        <p className="text-sm text-gray-500">
          {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''}
        </p>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={handleRefresh}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      
      <div className="mt-4">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <p>Loading pantry items...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="flex flex-col items-center gap-2">
              <h3 className="font-medium text-lg">No pantry items found</h3>
              {searchTerm ? (
                <p className="text-gray-500">Try changing your search or filters</p>
              ) : (
                <p className="text-gray-500">Add items to keep track of your pantry</p>
              )}
              <Button 
                onClick={handleAddItem} 
                className="mt-4"
              >
                <Plus className="mr-1 h-4 w-4" />Add First Item
              </Button>
            </div>
          </Card>
        ) : (
          <>
            {filteredItems.map((item) => (
              <PantryItemCard
                key={item.id}
                id={item.id}
                name={item.name}
                quantity={`${item.quantity} ${item.unit || ''}`}
                expiryDate={item.expiry_date ? new Date(item.expiry_date).toLocaleDateString() : '--'}
                location={item.location || 'Not specified'}
                addedBy={item.added_by || 'Unknown'}
                isLowStock={item.low_stock || false}
                notes={item.notes || ''}
              />
            ))}
            
            {filteredItems.length > 10 && (
              <Button variant="outline" className="w-full mt-4">
                Load More...
              </Button>
            )}
          </>
        )}
      </div>
    </PageLayout>
  );
};

export default PantryPage;
