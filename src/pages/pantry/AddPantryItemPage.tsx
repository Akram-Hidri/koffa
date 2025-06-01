
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/PageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { useAddPantryItem } from '@/hooks/usePantryItems';
import { toast } from 'sonner';

const AddPantryItemPage = () => {
  const navigate = useNavigate();
  const addPantryItem = useAddPantryItem();
  
  const [formData, setFormData] = useState({
    name: '',
    quantity: 1,
    unit: '',
    category: '',
    location: '',
    notes: '',
    expiry_date: null as Date | null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Please enter an item name');
      return;
    }

    try {
      await addPantryItem.mutateAsync({
        name: formData.name.trim(),
        quantity: formData.quantity || null,
        unit: formData.unit || null,
        category: formData.category || null,
        location: formData.location || null,
        notes: formData.notes || null,
        expiry_date: formData.expiry_date ? format(formData.expiry_date, 'yyyy-MM-dd') : null,
        image_url: null,
        barcode: null,
      });
      
      toast.success('Item added successfully!');
      navigate('/pantry');
    } catch (error) {
      console.error('Error adding pantry item:', error);
    }
  };

  const categories = [
    'Fruits & Vegetables',
    'Meat & Poultry',
    'Dairy & Eggs',
    'Pantry Staples',
    'Frozen Foods',
    'Beverages',
    'Snacks',
    'Condiments & Sauces',
    'Bakery',
    'Other'
  ];

  const units = [
    'pieces',
    'kg',
    'g',
    'lb',
    'oz',
    'liters',
    'ml',
    'cups',
    'tbsp',
    'tsp',
    'cans',
    'bottles',
    'packages'
  ];

  const locations = [
    'Refrigerator',
    'Freezer',
    'Pantry',
    'Kitchen Counter',
    'Spice Rack',
    'Vegetable Drawer',
    'Other'
  ];

  return (
    <PageLayout title="Add Pantry Item">
      <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
        <div className="space-y-2">
          <label className="text-sm font-medium">Item Name *</label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter item name"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Quantity</label>
            <Input
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
              min="1"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Unit</label>
            <Select value={formData.unit} onValueChange={(value) => setFormData({ ...formData, unit: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                {units.map((unit) => (
                  <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Category</label>
          <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Location</label>
          <Select value={formData.location} onValueChange={(value) => setFormData({ ...formData, location: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              {locations.map((location) => (
                <SelectItem key={location} value={location}>{location}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Expiry Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.expiry_date ? format(formData.expiry_date, 'PPP') : 'Pick a date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.expiry_date || undefined}
                onSelect={(date) => setFormData({ ...formData, expiry_date: date || null })}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Notes</label>
          <Textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Additional notes about this item"
            rows={3}
          />
        </div>

        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/pantry')}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={addPantryItem.isPending}
            className="flex-1"
          >
            {addPantryItem.isPending ? 'Adding...' : 'Add Item'}
          </Button>
        </div>
      </form>
    </PageLayout>
  );
};

export default AddPantryItemPage;
