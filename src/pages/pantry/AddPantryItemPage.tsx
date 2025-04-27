
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/components/ui/sonner';
import { Upload } from 'lucide-react';
import PageLayout from '@/components/PageLayout';

const AddPantryItemPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: '',
    unit: '',
    location: '',
    expirationDate: '',
    noExpiration: false,
    lowStockThreshold: '',
    notes: ''
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, noExpiration: checked }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, save the data to your backend
    toast.success('Item added to pantry', {
      description: `${formData.name} has been added to your pantry.`
    });
    navigate('/pantry');
  };
  
  const handleCancel = () => {
    navigate('/pantry');
  };

  return (
    <PageLayout title="Add New Pantry Item">
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-center">Item Information</h3>
            
            <div className="space-y-2">
              <Label htmlFor="name">Item Name:</Label>
              <Input 
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="category">Category:</Label>
                <Button type="button" variant="link" className="text-sm h-auto p-0">
                  + Add Category
                </Button>
              </div>
              <select
                id="category"
                name="category"
                className="w-full rounded-md border border-input p-2 bg-background"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                <option value="grains">Grains</option>
                <option value="dairy">Dairy</option>
                <option value="meat">Meat</option>
                <option value="produce">Produce</option>
                <option value="canned">Canned Goods</option>
                <option value="spices">Spices</option>
                <option value="snacks">Snacks</option>
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity:</Label>
                <Input 
                  id="quantity"
                  name="quantity"
                  type="number"
                  min="0"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="unit">Unit:</Label>
                <select
                  id="unit"
                  name="unit"
                  className="w-full rounded-md border border-input p-2 bg-background"
                  value={formData.unit}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Unit</option>
                  <option value="kg">Kilogram (kg)</option>
                  <option value="g">Gram (g)</option>
                  <option value="l">Liter (L)</option>
                  <option value="ml">Milliliter (ml)</option>
                  <option value="pcs">Pieces (pcs)</option>
                  <option value="box">Box</option>
                  <option value="bottle">Bottle</option>
                  <option value="carton">Carton</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="location">Location:</Label>
                <Button type="button" variant="link" className="text-sm h-auto p-0">
                  + Add Location
                </Button>
              </div>
              <select
                id="location"
                name="location"
                className="w-full rounded-md border border-input p-2 bg-background"
                value={formData.location}
                onChange={handleChange}
                required
              >
                <option value="">Select Location</option>
                <option value="kitchen">Kitchen</option>
                <option value="pantry">Pantry</option>
                <option value="refrigerator">Refrigerator</option>
                <option value="freezer">Freezer</option>
                <option value="cabinet">Cabinet</option>
                <option value="shelf">Shelf</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="expirationDate">Expiration Date:</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="noExpiration" 
                    checked={formData.noExpiration} 
                    onCheckedChange={handleCheckboxChange}
                  />
                  <label htmlFor="noExpiration" className="text-sm">
                    No Expiration
                  </label>
                </div>
              </div>
              <Input 
                id="expirationDate"
                name="expirationDate"
                type="date"
                value={formData.expirationDate}
                onChange={handleChange}
                disabled={formData.noExpiration}
                required={!formData.noExpiration}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lowStockThreshold">Low Stock Threshold:</Label>
              <Input 
                id="lowStockThreshold"
                name="lowStockThreshold"
                type="number"
                min="0"
                value={formData.lowStockThreshold}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes:</Label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                className="w-full rounded-md border border-input p-2 bg-background"
                value={formData.notes}
                onChange={handleChange}
              />
            </div>
            
            <Button type="button" variant="outline" className="w-full">
              <Upload className="h-4 w-4 mr-2" />
              Upload Photo
            </Button>
          </div>
          
          <div className="flex space-x-4">
            <Button type="submit" className="flex-1">Add To Pantry</Button>
            <Button type="button" variant="outline" className="flex-1" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </PageLayout>
  );
};

export default AddPantryItemPage;
