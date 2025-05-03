
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface PantryFiltersProps {
  onAddItem: () => void;
  onSearch: (term: string) => void;
  onLocationFilter: (location: string | null) => void;
  onCategoryFilter: (category: string | null) => void;
  onAddedByFilter: (addedBy: string | null) => void;
}

const PantryFilters: React.FC<PantryFiltersProps> = ({ 
  onAddItem, 
  onSearch,
  onLocationFilter,
  onCategoryFilter,
  onAddedByFilter
}) => {
  const [searchValue, setSearchValue] = useState('');
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearch(value);
  };
  
  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onLocationFilter(e.target.value || null);
  };
  
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onCategoryFilter(e.target.value || null);
  };
  
  const handleAddedByChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onAddedByFilter(e.target.value || null);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 overflow-x-auto hide-scrollbar pb-2 border-b">
        <Button variant="ghost" className="rounded-full whitespace-nowrap">
          📋 All Items
        </Button>
        <Button variant="ghost" className="rounded-full whitespace-nowrap">
          🔻 Low Stock
        </Button>
        <Button variant="ghost" className="rounded-full whitespace-nowrap">
          📅 Expiring Soon
        </Button>
        <div className="relative ml-auto">
          <Search className="h-4 w-4 absolute top-3 left-3 text-gray-400" />
          <Input 
            placeholder="Search items..." 
            className="pl-9 h-10 rounded-full w-28 focus:w-40 transition-all"
            value={searchValue}
            onChange={handleSearchChange}
          />
        </div>
      </div>
      
      <div className="flex flex-wrap justify-between items-center gap-2">
        <div className="flex flex-wrap gap-2 overflow-x-auto hide-scrollbar">
          <select 
            className="text-sm rounded-md border px-2 py-1 bg-white dark:bg-slate-800"
            onChange={handleLocationChange}
          >
            <option value="">▼ Location</option>
            <option value="Kitchen">Kitchen</option>
            <option value="Pantry">Pantry</option>
            <option value="Refrigerator">Refrigerator</option>
            <option value="Freezer">Freezer</option>
            <option value="Cabinet">Cabinet</option>
          </select>
          
          <select 
            className="text-sm rounded-md border px-2 py-1 bg-white dark:bg-slate-800"
            onChange={handleCategoryChange}
          >
            <option value="">▼ Category</option>
            <option value="Grains">Grains</option>
            <option value="Dairy">Dairy</option>
            <option value="Meat">Meat</option>
            <option value="Produce">Produce</option>
            <option value="Canned">Canned Goods</option>
          </select>
          
          <select 
            className="text-sm rounded-md border px-2 py-1 bg-white dark:bg-slate-800"
            onChange={handleAddedByChange}
          >
            <option value="">▼ Added by</option>
            <option value="Mother">Mother</option>
            <option value="Father">Father</option>
            <option value="Child">Child</option>
          </select>
        </div>
        
        <Button onClick={onAddItem} size="sm" className="whitespace-nowrap">
          <Plus className="mr-1 h-4 w-4" />Add
        </Button>
      </div>
    </div>
  );
};

export default PantryFilters;
