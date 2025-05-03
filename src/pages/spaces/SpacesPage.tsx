
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, LayoutGrid, RefreshCw } from 'lucide-react';
import PageLayout from '@/components/PageLayout';
import SpaceCard from '@/components/spaces/SpaceCard';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

interface Space {
  id: string;
  name: string;
  tasksCount: number;
  allTasksDone: boolean;
}

interface SpaceTask {
  id: string;
  completed: boolean;
}

const SpacesPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newSpaceName, setNewSpaceName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const fetchSpaces = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // First get user profile to check family_id
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('family_id')
        .eq('id', user.id)
        .single();
      
      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }

      // Get spaces created by the user
      const { data: userSpaces, error: userSpacesError } = await supabase
        .from('spaces')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (userSpacesError) throw userSpacesError;
      
      let familySpaces: any[] = [];
      
      // If user has a family, also get spaces shared via family
      if (profileData?.family_id) {
        // Get other family members
        const { data: familyMembers, error: familyMembersError } = await supabase
          .from('family_members')
          .select('user_id')
          .eq('family_id', profileData.family_id)
          .neq('user_id', user.id);
        
        if (familyMembersError) throw familyMembersError;
        
        // If there are other family members, get their spaces
        if (familyMembers && familyMembers.length > 0) {
          const familyMemberIds = familyMembers.map(member => member.user_id);
          
          const { data: otherFamilySpaces, error: otherSpacesError } = await supabase
            .from('spaces')
            .select('*')
            .in('user_id', familyMemberIds)
            .order('created_at', { ascending: false });
          
          if (otherSpacesError) throw otherSpacesError;
          
          familySpaces = otherFamilySpaces || [];
        }
      }
      
      // Combine user spaces and family spaces
      const allSpacesData = [...(userSpaces || []), ...familySpaces];
      
      if (allSpacesData.length === 0) {
        setSpaces([]);
        setIsLoading(false);
        return;
      }
      
      // Get all space IDs to fetch tasks
      const spaceIds = allSpacesData.map(space => space.id);
      
      // Then get all tasks to calculate stats
      const { data: tasksData, error: tasksError } = await supabase
        .from('space_tasks')
        .select('id, space_id, completed')
        .in('space_id', spaceIds);
      
      if (tasksError) throw tasksError;
      
      // Map spaces with task counts
      const spacesWithTaskCounts = allSpacesData.map((space: any) => {
        const spaceTasks = tasksData?.filter((task: SpaceTask & { space_id: string }) => 
          task.space_id === space.id
        ) || [];
        
        const tasksCount = spaceTasks.length;
        const completedTasksCount = spaceTasks.filter((task: SpaceTask) => task.completed).length;
        const allTasksDone = tasksCount > 0 && tasksCount === completedTasksCount;
        
        return {
          id: space.id,
          name: space.name,
          tasksCount: tasksCount - completedTasksCount, // Only count incomplete tasks
          allTasksDone,
          isOwner: space.user_id === user.id
        };
      });
      
      setSpaces(spacesWithTaskCounts);
    } catch (error: any) {
      console.error("Error fetching spaces:", error);
      toast.error(`Failed to load spaces: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (user) {
      fetchSpaces();
    }
  }, [user]);
  
  const handleAddSpace = () => {
    setIsDialogOpen(true);
  };
  
  const handleRefresh = () => {
    fetchSpaces();
    toast.success("Spaces refreshed");
  };
  
  const createSpace = async () => {
    if (!newSpaceName.trim() || !user) {
      toast.error("Please enter a space name");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('spaces')
        .insert({
          name: newSpaceName.trim(),
          user_id: user.id
        })
        .select();
      
      if (error) throw error;
      
      toast.success("Space created successfully!");
      
      // Add the new space to the list
      if (data?.[0]) {
        setSpaces(prev => [{
          id: data[0].id,
          name: data[0].name,
          tasksCount: 0,
          allTasksDone: false
        }, ...prev]);
      }
      
      // Close dialog and reset form
      setIsDialogOpen(false);
      setNewSpaceName('');
      
      // Create a notification for other family members
      await createFamilyNotification(user.id, `${newSpaceName} space created`);
      
    } catch (error: any) {
      toast.error(`Failed to create space: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const createFamilyNotification = async (userId: string, message: string) => {
    try {
      // Get user's family
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('family_id')
        .eq('id', userId)
        .single();
      
      if (profileError) return;
      
      const familyId = profileData?.family_id;
      if (!familyId) return;
      
      // Get family members
      const { data: familyMembers, error: familyMembersError } = await supabase
        .from('family_members')
        .select('user_id')
        .eq('family_id', familyId)
        .neq('user_id', userId);
      
      if (familyMembersError || !familyMembers) return;
      
      // Create notification for each family member
      for (const member of familyMembers) {
        await supabase.from('notifications').insert({
          user_id: member.user_id,
          title: 'New Space Created',
          body: message,
          type: 'space'
        });
      }
    } catch (err) {
      console.error("Error creating notifications:", err);
    }
  };

  return (
    <PageLayout title="Home Spaces">
      <div className="space-y-6">
        {/* Header with icon */}
        <div className="flex items-center mb-4">
          <LayoutGrid className="h-6 w-6 mr-2 text-[#586b4d]" />
          <h1 className="text-lg font-semibold">Manage Your Spaces</h1>
        </div>
        
        {/* Header controls */}
        <div className="flex flex-wrap justify-between items-center gap-2">
          <select className="text-sm rounded-md border border-[#98948c] px-3 py-1 bg-white dark:bg-slate-800">
            <option value="all">Manage ▼ All Spaces</option>
            <option value="living">Living Areas</option>
            <option value="bedrooms">Bedrooms</option>
            <option value="outdoor">Outdoor</option>
          </select>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh} 
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            
            <Button onClick={handleAddSpace} className="bg-[#586b4d] hover:bg-[#586b4d]/90">
              <Plus className="mr-1 h-4 w-4" />
              Add New Space
            </Button>
          </div>
        </div>
        
        {/* Spaces grid */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <p>Loading spaces...</p>
          </div>
        ) : spaces.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="flex flex-col items-center gap-2">
              <LayoutGrid className="h-12 w-12 text-gray-400" />
              <h3 className="font-medium text-lg">No spaces yet</h3>
              <p className="text-gray-500">Create spaces to organize tasks by location in your home</p>
              <Button 
                onClick={handleAddSpace} 
                className="mt-4 bg-[#586b4d] hover:bg-[#586b4d]/90"
              >
                Add Your First Space
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {spaces.map((space) => (
              <SpaceCard
                key={space.id}
                id={space.id}
                name={space.name}
                tasksCount={space.tasksCount}
                allTasksDone={space.allTasksDone}
              />
            ))}
          </div>
        )}
        
        {/* Create Space Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Space</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Space Name</label>
                <Input
                  id="name"
                  value={newSpaceName}
                  onChange={(e) => setNewSpaceName(e.target.value)}
                  placeholder="e.g., Kitchen, Living Room, Master Bedroom"
                  className="col-span-3"
                  autoFocus
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={createSpace} 
                className="bg-[#586b4d] hover:bg-[#586b4d]/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create Space"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PageLayout>
  );
};

export default SpacesPage;
