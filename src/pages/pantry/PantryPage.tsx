
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, Search, RefreshCw, Grid3x3 } from 'lucide-react';
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
  
  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleLocationFilter = (location: string | null) => {
    setLocationFilter(location);
  };

  const handleCategoryFilter = (category: string | null) => {
    setCategoryFilter(category);
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

  // Group items by location for grid view
  const categorizedItems = () => {
    // Group by location
    const categories: Record<string, PantryItem[]> = {};
    
    filteredItems.forEach(item => {
      const category = item.location || 'Unassigned';
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(item);
    });
    
    return categories;
  };

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
        <div className="flex items-center gap-2">
          <Button 
            variant={viewMode === 'list' ? 'secondary' : 'outline'} 
            size="sm"
            onClick={() => setViewMode('list')}
            className="h-8 px-2"
          >
            List
          </Button>
          <Button 
            variant={viewMode === 'grid' ? 'secondary' : 'outline'} 
            size="sm"
            onClick={() => setViewMode('grid')}
            className="h-8 px-2"
          >
            <Grid3x3 className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
            className="ml-2"
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
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
        ) : viewMode === 'list' ? (
          // List view
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
        ) : (
          // Grid view - grouped by locations
          <div>
            {Object.entries(categorizedItems()).map(([location, items]) => (
              <div key={location} className="mb-6">
                <h3 className="text-lg font-medium mb-3">{location}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {items.map(item => (
                    <Card 
                      key={item.id}
                      className="p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between">
                        <h4 className="font-medium truncate">{item.name}</h4>
                        <span className="font-medium text-sm">{item.quantity} {item.unit || ''}</span>
                      </div>
                      
                      {item.notes && (
                        <p className="text-xs text-gray-600 mt-1 truncate">{item.notes}</p>
                      )}
                      
                      <div className="flex justify-between mt-2 pt-2 border-t">
                        <span className={`text-xs font-medium ${
                          item.low_stock ? 'text-amber-500' : 'text-green-500'
                        }`}>
                          {item.low_stock ? '⚠️ LOW' : '✓ IN STOCK'}
                        </span>
                        
                        <span className="text-xs text-gray-500">
                          {item.expiry_date ? new Date(item.expiry_date).toLocaleDateString() : '--'}
                        </span>
                      </div>
                      
                      <div className="flex justify-end mt-2 gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 px-2"
                          onClick={() => navigate(`/pantry/edit/${item.id}`)}
                        >
                          Edit
                        </Button>
                      </div>
                    </Card>
                  ))}
                  
                  {/* Add new item card */}
                  <Card 
                    className="p-4 cursor-pointer hover:shadow-md transition-shadow border-dashed flex flex-col items-center justify-center text-center min-h-[120px]"
                    onClick={handleAddItem}
                  >
                    <Plus className="h-8 w-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">Add New Item</span>
                  </Card>
                </div>
              </div>
            ))}
            
            {/* If no locations yet, show add new item button */}
            {Object.keys(categorizedItems()).length === 0 && (
              <Card 
                className="p-8 text-center cursor-pointer hover:shadow-md transition-shadow border-dashed"
                onClick={handleAddItem}
              >
                <div className="flex flex-col items-center gap-2">
                  <Plus className="h-10 w-10 text-gray-400 mb-2" />
                  <h3 className="font-medium text-lg">No pantry items found</h3>
                  <p className="text-gray-500">Add your first item</p>
                </div>
              </Card>
            )}
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default PantryPage;
