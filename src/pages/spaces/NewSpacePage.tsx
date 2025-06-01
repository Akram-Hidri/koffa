
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Home, Car, TreePine, Building } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useCreateSpace } from '@/hooks/useSpaces';

const spaceTypes = [
  { value: 'indoor', label: 'Indoor', icon: Home },
  { value: 'outdoor', label: 'Outdoor', icon: TreePine },
  { value: 'garage', label: 'Garage', icon: Car },
  { value: 'office', label: 'Office', icon: Building },
];

const spaceColors = [
  '#10B981', // Green
  '#3B82F6', // Blue  
  '#8B5CF6', // Purple
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#6B7280', // Gray
];

const NewSpacePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const createSpace = useCreateSpace();
  
  const [formData, setFormData] = useState({
    name: '',
    type: 'indoor',
    color: spaceColors[0],
    icon: 'Home'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please sign in to create a space');
      return;
    }

    if (!formData.name.trim()) {
      toast.error('Please enter a space name');
      return;
    }

    try {
      await createSpace.mutateAsync({
        name: formData.name.trim(),
        type: formData.type,
        color: formData.color,
        icon: formData.icon,
        user_id: user.id
      });
      
      navigate('/spaces');
    } catch (error) {
      console.error('Error creating space:', error);
    }
  };

  return (
    <div className="min-h-screen bg-koffa-beige-light">
      {/* Header */}
      <div className="bg-white border-b border-koffa-beige p-4 flex items-center sticky top-0 z-10">
        <Button 
          variant="ghost" 
          className="mr-2 h-8 w-8 p-0" 
          onClick={() => navigate('/spaces')}
        >
          <ArrowLeft size={20} className="text-koffa-green" />
        </Button>
        <h1 className="text-xl font-semibold text-koffa-green">Create New Space</h1>
      </div>

      {/* Form */}
      <div className="p-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Space Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-koffa-green">Space Name</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Kitchen, Living Room, Garden"
              className="border-koffa-beige focus-visible:ring-koffa-green"
              required
            />
          </div>

          {/* Space Type */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-koffa-green">Space Type</label>
            <Select 
              value={formData.type} 
              onValueChange={(value) => {
                const selectedType = spaceTypes.find(t => t.value === value);
                setFormData(prev => ({ 
                  ...prev, 
                  type: value,
                  icon: selectedType?.icon.name || 'Home'
                }));
              }}
            >
              <SelectTrigger className="border-koffa-beige focus:ring-koffa-green">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {spaceTypes.map((type) => {
                  const IconComponent = type.icon;
                  return (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center">
                        <IconComponent size={16} className="mr-2" />
                        {type.label}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Color Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-koffa-green">Color</label>
            <div className="flex gap-2 flex-wrap">
              {spaceColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`w-8 h-8 rounded-full border-2 ${
                    formData.color === color ? 'border-koffa-green' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setFormData(prev => ({ ...prev, color }))}
                />
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full bg-koffa-green hover:bg-koffa-green-dark"
            disabled={createSpace.isPending}
          >
            {createSpace.isPending ? 'Creating...' : 'Create Space'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default NewSpacePage;
