
import React, { useState } from 'react';
import PageLayout from '@/components/PageLayout';
import { usePantryItems, PantryItem } from '@/hooks/usePantryItems';
import { toast } from 'sonner';
import PantryFilterBar from '@/components/pantry/PantryFilterBar';
import PantryListView from '@/components/pantry/PantryListView';
import PantryGridView from '@/components/pantry/PantryGridView';
import EmptyPantryState from '@/components/pantry/EmptyPantryState';
import { useNavigate } from 'react-router-dom';

const PantryPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [addedByFilter, setAddedByFilter] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
  
  const { data: pantryItems = [], isLoading, error, refetch } = usePantryItems();
  
  if (error) {
    toast.error("Failed to load pantry items");
  }
  
  const handleAddItem = () => {
    navigate('/pantry/add');
  };
  
  const handleRefresh = () => {
    refetch();
    toast.success("Pantry items refreshed");
  };

  // Filter logic
  const filteredItems = pantryItems.filter((item) => {
    // Search filter
    if (searchTerm && !item.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Location filter
    if (locationFilter && item.location !== locationFilter) {
      return false;
    }
    
    // Category filter
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
      <PantryFilterBar 
        onAddItem={handleAddItem} 
        onSearch={setSearchTerm}
        onLocationFilter={setLocationFilter}
        onCategoryFilter={setCategoryFilter}
        onAddedByFilter={setAddedByFilter}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onRefresh={handleRefresh}
        isRefreshing={isLoading}
        itemCount={filteredItems.length}
      />
      
      <div className="mt-4">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <p>Loading pantry items...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <EmptyPantryState onAddItem={handleAddItem} hasSearchFilters={!!searchTerm} />
        ) : viewMode === 'list' ? (
          <PantryListView items={filteredItems} onNavigateToEdit={(id) => navigate(`/pantry/edit/${id}`)} />
        ) : (
          <PantryGridView items={filteredItems} onAddItem={handleAddItem} onNavigateToEdit={(id) => navigate(`/pantry/edit/${id}`)} />
        )}
      </div>
    </PageLayout>
  );
};

export default PantryPage;
