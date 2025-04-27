
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface PantryFiltersProps {
  onAddItem: () => void;
  onSearch: (term: string) => void;
}

const PantryFilters: React.FC<PantryFiltersProps> = ({ onAddItem, onSearch }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-2 border-b">
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
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="flex gap-2 overflow-x-auto hide-scrollbar">
          <select className="text-sm rounded-md border px-2 py-1 bg-white dark:bg-slate-800">
            <option value="">▼ Kitchen</option>
            <option value="kitchen">Kitchen</option>
            <option value="pantry">Pantry</option>
            <option value="fridge">Refrigerator</option>
          </select>
          
          <select className="text-sm rounded-md border px-2 py-1 bg-white dark:bg-slate-800">
            <option value="">▼ Category</option>
            <option value="grains">Grains</option>
            <option value="dairy">Dairy</option>
            <option value="meat">Meat</option>
          </select>
          
          <select className="text-sm rounded-md border px-2 py-1 bg-white dark:bg-slate-800">
            <option value="">▼ Added by</option>
            <option value="mother">Mother</option>
            <option value="father">Father</option>
            <option value="ahmad">Ahmad</option>
          </select>
        </div>
        
        <Button onClick={onAddItem} size="sm">
          <Plus className="mr-1 h-4 w-4" />Add
        </Button>
      </div>
    </div>
  );
};

export default PantryFilters;
