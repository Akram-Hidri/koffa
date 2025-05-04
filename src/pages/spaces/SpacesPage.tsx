
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, LayoutGrid, RefreshCw, Search } from 'lucide-react';
import PageLayout from '@/components/PageLayout';
import SpaceCard from '@/components/spaces/SpaceCard';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useSpaces, useCreateSpace, Space } from '@/hooks/useSpaces';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';
import SpaceTemplateCard from '@/components/spaces/SpaceTemplateCard';

// Space templates with predefined spaces
const SPACE_TEMPLATES = [
  { 
    name: 'Living Room',
    icon: 'sofa',
    color: '#6a798f',
    type: 'indoor',
    tasks: ['Vacuum carpet', 'Dust furniture', 'Clean windows', 'Organize books', 'Water plants', 'Clean TV screen', 'Fluff pillows']
  },
  { 
    name: 'Kitchen',
    icon: 'kitchen',
    color: '#E6A44E',
    type: 'indoor',
    tasks: ['Clean counters', 'Wash dishes', 'Mop floor', 'Take out trash', 'Clean refrigerator', 'Wipe appliances', 'Organize pantry', 'Clean oven']
  },
  { 
    name: 'Master Bedroom',
    icon: 'bed',
    color: '#7E69AB',
    type: 'indoor',
    tasks: ['Change bed sheets', 'Vacuum floor', 'Dust surfaces', 'Organize wardrobe', 'Clean mirror', 'Arrange bedside table']
  },
  { 
    name: 'Bathroom',
    icon: 'bath',
    color: '#0EA5E9',
    type: 'indoor',
    tasks: ['Clean toilet', 'Clean shower', 'Wash sink', 'Replace towels', 'Refill soap dispensers', 'Clean mirror', 'Mop floor', 'Wash bath mat']
  },
  { 
    name: 'Garden',
    icon: 'flower',
    color: '#586b4d',
    type: 'outdoor',
    tasks: ['Water plants', 'Mow lawn', 'Remove weeds', 'Trim bushes', 'Fertilize plants', 'Check irrigation system', 'Sweep pathways']
  },
  { 
    name: 'Majlis',
    icon: 'sofa',
    color: '#C05746',
    type: 'indoor',
    tasks: ['Vacuum carpet', 'Dust furniture', 'Arrange cushions', 'Clean coffee table', 'Dust decor items', 'Refresh air freshener', 'Organize seating']
  },
  { 
    name: 'Garage',
    icon: 'car',
    color: '#8E9196',
    type: 'outdoor',
    tasks: ['Organize tools', 'Sweep floor', 'Check oil levels', 'Clean car', 'Dispose of old items', 'Check tire pressure', 'Arrange storage']
  },
  { 
    name: 'Yacht',
    icon: 'ship',
    color: '#0EA5E9',
    type: 'outdoor',
    tasks: ['Check engine', 'Clean deck', 'Inspect safety equipment', 'Refill fuel', 'Clean interior cabin', 'Wash exterior', 'Wipe windows']
  },
  { 
    name: 'Home Office',
    icon: 'computer',
    color: '#6b7280',
    type: 'indoor',
    tasks: ['Organize desk', 'Clean computer screen', 'Empty trash bin', 'File documents', 'Dust shelves', 'Clean keyboard', 'Arrange cables']
  },
  { 
    name: 'Dining Room',
    icon: 'dining',
    color: '#8B4513',
    type: 'indoor',
    tasks: ['Polish table', 'Dust chairs', 'Clean light fixture', 'Arrange centerpiece', 'Vacuum floor', 'Wipe baseboards', 'Clean china cabinet']
  },
  { 
    name: 'Laundry Room',
    icon: 'laundry',
    color: '#4A6FA5',
    type: 'indoor',
    tasks: ['Clean washing machine', 'Wipe dryer', 'Sweep floor', 'Organize supplies', 'Clean lint trap', 'Check hoses', 'Wipe counters']
  },
  { 
    name: 'Backyard',
    icon: 'backyard',
    color: '#2F4F4F',
    type: 'outdoor',
    tasks: ['Sweep patio', 'Clean furniture', 'Trim plants', 'Check lighting', 'Clean grill', 'Organize garden tools', 'Check irrigation']
  },
];

const SpacesPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [newSpace, setNewSpace] = useState({
    name: '',
    icon: '',
    color: '#586b4d',
    type: 'indoor'
  });
  const [selectedTemplate, setSelectedTemplate] = useState<null | typeof SPACE_TEMPLATES[0]>(null);
  
  const isMobile = useIsMobile();
  const { data: spaces = [], isLoading, refetch } = useSpaces();
  const createSpace = useCreateSpace();
  
  const handleAddSpace = () => {
    setIsAddDialogOpen(true);
  };
  
  const handleTemplateDialog = () => {
    setSelectedTemplate(null);
    setIsTemplateDialogOpen(true);
  };
  
  const handleRefresh = () => {
    refetch();
    toast.success("Spaces refreshed");
  };
  
  const handleCreateSpace = async () => {
    if (!newSpace.name.trim()) {
      toast.error("Please enter a space name");
      return;
    }
    
    try {
      await createSpace.mutateAsync(newSpace);
      setIsAddDialogOpen(false);
      setNewSpace({
        name: '',
        icon: '',
        color: '#586b4d',
        type: 'indoor'
      });
    } catch (error) {
      // Error is handled by the mutation
    }
  };
  
  const handleSelectTemplate = (template: typeof SPACE_TEMPLATES[0]) => {
    setSelectedTemplate(template);
    setNewSpace({
      name: template.name,
      icon: template.icon,
      color: template.color,
      type: template.type
    });
    setIsTemplateDialogOpen(false);
    setIsAddDialogOpen(true);
  };
  
  // Filter spaces based on search and category filter
  const filteredSpaces = spaces.filter(space => {
    const matchesSearch = space.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'all' || space.type === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <PageLayout title="Home Spaces">
      <div className="space-y-6">
        {/* Header with icon */}
        <div className="flex items-center mb-4">
          <LayoutGrid className="h-6 w-6 mr-2 text-[#586b4d]" />
          <h1 className="text-lg md:text-xl font-semibold">Manage Your Spaces</h1>
        </div>
        
        {/* Search and Filter */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search spaces..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2 flex-wrap justify-between md:justify-end">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh} 
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            
            <Button 
              onClick={handleTemplateDialog} 
              className="bg-[#586b4d] hover:bg-[#586b4d]/90"
            >
              <Plus className="mr-1 h-4 w-4" />
              Add Space
            </Button>
          </div>
        </div>
        
        {/* Tabs for filtering */}
        <Tabs defaultValue="all" value={activeFilter} onValueChange={setActiveFilter}>
          <TabsList className="mb-4 overflow-x-auto flex w-full h-auto pb-1 justify-start hide-scrollbar">
            <TabsTrigger value="all" className="whitespace-nowrap">
              All Spaces
            </TabsTrigger>
            <TabsTrigger value="indoor" className="whitespace-nowrap">
              Indoor
            </TabsTrigger>
            <TabsTrigger value="outdoor" className="whitespace-nowrap">
              Outdoor
            </TabsTrigger>
          </TabsList>
          
          {/* Spaces grid */}
          <TabsContent value={activeFilter} className="mt-0 pt-0">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <p>Loading spaces...</p>
              </div>
            ) : filteredSpaces.length === 0 ? (
              <Card className="p-8 text-center">
                <div className="flex flex-col items-center gap-2">
                  <LayoutGrid className="h-12 w-12 text-gray-400" />
                  <h3 className="font-medium text-lg">No spaces yet</h3>
                  <p className="text-gray-500">Create spaces to organize tasks by location in your home</p>
                  <Button 
                    onClick={handleTemplateDialog} 
                    className="mt-4 bg-[#586b4d] hover:bg-[#586b4d]/90"
                  >
                    Add Your First Space
                  </Button>
                </div>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSpaces.map((space: Space) => (
                  <SpaceCard
                    key={space.id}
                    id={space.id}
                    name={space.name}
                    icon={space.icon || undefined}
                    color={space.color || undefined}
                    onClick={() => navigate(`/spaces/${space.id}`)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        {/* Create Space Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Space</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Space Name</label>
                <Input
                  id="name"
                  value={newSpace.name}
                  onChange={(e) => setNewSpace({...newSpace, name: e.target.value})}
                  placeholder="e.g., Kitchen, Living Room, Master Bedroom"
                  className="col-span-3"
                  autoFocus
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="type" className="text-sm font-medium">Type</label>
                <select
                  id="type"
                  value={newSpace.type}
                  onChange={(e) => setNewSpace({...newSpace, type: e.target.value})}
                  className="w-full rounded-md border border-input p-2 bg-background"
                >
                  <option value="indoor">Indoor</option>
                  <option value="outdoor">Outdoor</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Color</label>
                <div className="flex gap-2 flex-wrap">
                  {['#586b4d', '#6a798f', '#E6A44E', '#C05746', '#7E69AB', '#0EA5E9', '#8B4513', '#4A6FA5'].map(color => (
                    <button
                      key={color}
                      type="button"
                      className={`w-8 h-8 rounded-full ${newSpace.color === color ? 'ring-2 ring-offset-2 ring-black' : ''}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setNewSpace({...newSpace, color})}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Icon</label>
                <div className="grid grid-cols-6 gap-2">
                  {['sofa', 'kitchen', 'bed', 'bath', 'flower', 'car', 'ship', 'house', 'garden', 'computer', 'laundry', 'storage', 'dining', 'office', 'backyard'].map(icon => (
                    <button
                      key={icon}
                      type="button"
                      className={`w-10 h-10 rounded-md flex items-center justify-center ${newSpace.icon === icon ? 'ring-2 ring-offset-1 ring-black bg-gray-100' : 'bg-gray-50'}`}
                      onClick={() => setNewSpace({...newSpace, icon})}
                    >
                      <Icon name={icon} size={20} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline" 
                onClick={() => setIsAddDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleCreateSpace} 
                className="bg-[#586b4d] hover:bg-[#586b4d]/90"
                disabled={createSpace.isPending}
              >
                {createSpace.isPending ? "Creating..." : "Create Space"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Space Templates Dialog */}
        <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
          <DialogContent className={`${isMobile ? 'max-w-[95%]' : 'max-w-[700px]'}`}>
            <DialogHeader>
              <DialogTitle>Choose a Space Template</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {SPACE_TEMPLATES.map((template, index) => (
                  <SpaceTemplateCard
                    key={index}
                    name={template.name}
                    icon={template.icon}
                    color={template.color}
                    taskCount={template.tasks.length}
                    onClick={() => handleSelectTemplate(template)}
                  />
                ))}
                <Card 
                  className="p-4 flex flex-col items-center justify-center text-center h-32 cursor-pointer hover:shadow-md transition-shadow border-dashed"
                  onClick={() => {
                    setIsTemplateDialogOpen(false);
                    setIsAddDialogOpen(true);
                  }}
                >
                  <Plus className="h-8 w-8 mb-2 text-gray-400" />
                  <h3 className="font-semibold text-gray-600">Custom Space</h3>
                </Card>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline" 
                onClick={() => setIsTemplateDialogOpen(false)}
              >
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PageLayout>
  );
};

export default SpacesPage;
