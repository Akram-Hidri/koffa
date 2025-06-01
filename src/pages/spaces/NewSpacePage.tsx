
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Home, MapPin, Car, Wrench } from 'lucide-react';
import { useSpaces } from '@/hooks/useSpaces';
import { toast } from 'sonner';
import PageLayout from '@/components/PageLayout';

const NewSpacePage = () => {
  const navigate = useNavigate();
  const { useCreateSpace } = useSpaces();
  const createSpace = useCreateSpace();
  
  const [formData, setFormData] = useState({
    name: '',
    type: 'indoor',
    icon: '',
    color: '#3B82F6'
  });

  const spaceTypes = [
    { value: 'indoor', label: 'Indoor Space', icon: Home },
    { value: 'outdoor', label: 'Outdoor Space', icon: MapPin },
    { value: 'garage', label: 'Garage/Storage', icon: Car },
    { value: 'utility', label: 'Utility Room', icon: Wrench }
  ];

  const iconOptions = [
    { value: 'home', label: '🏠 Home', icon: 'home' },
    { value: 'kitchen', label: '👨‍🍳 Kitchen', icon: 'kitchen' },
    { value: 'bedroom', label: '🛏️ Bedroom', icon: 'bedroom' },
    { value: 'bathroom', label: '🚿 Bathroom', icon: 'bathroom' },
    { value: 'living-room', label: '🛋️ Living Room', icon: 'living-room' },
    { value: 'garden', label: '🌱 Garden', icon: 'garden' },
    { value: 'garage', label: '🚗 Garage', icon: 'garage' },
    { value: 'office', label: '💼 Office', icon: 'office' }
  ];

  const colorOptions = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444',
    '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Please enter a space name');
      return;
    }

    try {
      const newSpace = await createSpace.mutateAsync({
        name: formData.name.trim(),
        type: formData.type,
        icon: formData.icon || null,
        color: formData.color
      });
      
      toast.success('Space created successfully!');
      navigate(`/spaces/${newSpace.id}`);
    } catch (error) {
      console.error('Error creating space:', error);
      toast.error('Failed to create space');
    }
  };

  return (
    <PageLayout title="Create New Space">
      <div className="max-w-2xl mx-auto space-y-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/spaces')}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Spaces
        </Button>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Space Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Space Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Space Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Kitchen, Living Room, Garden"
                  required
                />
              </div>

              {/* Space Type */}
              <div className="space-y-2">
                <Label>Space Type</Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select space type" />
                  </SelectTrigger>
                  <SelectContent>
                    {spaceTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <type.icon className="h-4 w-4" />
                          {type.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Icon Selection */}
              <div className="space-y-2">
                <Label>Icon (Optional)</Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {iconOptions.map((icon) => (
                    <Button
                      key={icon.value}
                      type="button"
                      variant={formData.icon === icon.value ? "default" : "outline"}
                      className="h-auto p-3"
                      onClick={() => setFormData({ ...formData, icon: icon.value })}
                    >
                      <span className="text-sm">{icon.label}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Color Selection */}
              <div className="space-y-2">
                <Label>Color Theme</Label>
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map((color) => (
                    <Button
                      key={color}
                      type="button"
                      className={`w-8 h-8 rounded-full border-2 ${
                        formData.color === color ? 'border-gray-800' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setFormData({ ...formData, color })}
                    />
                  ))}
                </div>
              </div>

              {/* Preview */}
              <div className="space-y-2">
                <Label>Preview</Label>
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-semibold"
                      style={{ backgroundColor: formData.color }}
                    >
                      {formData.icon ? 
                        iconOptions.find(i => i.value === formData.icon)?.label.split(' ')[0] || formData.name.charAt(0).toUpperCase() :
                        formData.name.charAt(0).toUpperCase()
                      }
                    </div>
                    <div>
                      <h3 className="font-semibold">{formData.name || 'Space Name'}</h3>
                      <p className="text-sm text-gray-600">
                        {spaceTypes.find(t => t.value === formData.type)?.label}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* Submit Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/spaces')}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createSpace.isPending}
              className="flex-1"
            >
              {createSpace.isPending ? 'Creating...' : 'Create Space'}
            </Button>
          </div>
        </form>
      </div>
    </PageLayout>
  );
};

export default NewSpacePage;
