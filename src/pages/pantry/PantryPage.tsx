
import React, { useState, useEffect } from 'react';
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
  
  useEffect(() => {
    // Initial load of data
    refetch();
  }, [refetch]);
  
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
    
    // Category filter - assuming category might be in the notes field
    if (categoryFilter && !item.notes?.toLowerCase().includes(categoryFilter.toLowerCase())) {
      return false;
    }
    
    // Added by filter
    if (addedByFilter && item.added_by !== addedByFilter) {
      return false;
    }
    
    return true;
  });

  // Calculate stats for the home page
  const calculateStats = () => {
    const lowStockItems = pantryItems.filter(item => item.low_stock).length;
    
    const expiringItems = pantryItems.filter(item => {
      if (!item.expiry_date) return false;
      const expiryDate = new Date(item.expiry_date);
      const today = new Date();
      const sevenDaysLater = new Date();
      sevenDaysLater.setDate(today.getDate() + 7);
      return expiryDate <= sevenDaysLater && expiryDate >= today;
    }).length;
    
    return { lowStockItems, expiringItems };
  };

  // Make stats available as a static method that can be called from HomePage
  PantryPage.getStats = calculateStats;

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
