
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSettings, FamilyMember, MemberRole } from '@/contexts/SettingsContext';
import { UsersRound, Bell, Settings, Users, MessageCircle, UserPlus, Plus } from 'lucide-react';
import Logo from '@/components/Logo';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import PageLayout from '@/components/PageLayout';
import { createFamilyInvitation, getFamilyForUser, getFamilyInvitations } from '@/utils/familyUtils';
import { supabase } from '@/integrations/supabase/client';
import { formatInviteCodeForDisplay } from '@/utils/inviteUtils';

const FamilyPage = () => {
  const navigate = useNavigate();
  const { settings, generateInviteCode, addFamilyMember } = useSettings();
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);
  const [newMemberDetails, setNewMemberDetails] = useState({
    name: '',
    role: 'member' as MemberRole,
    inviteMethod: 'code' // 'code' or 'direct'
  });
  const { toast } = useToast();
  
  // Add a default settings object to prevent null references
  const defaultSettings = {
    familyMembers: [],
    staffMembers: [],
    pendingInvitations: 0,
    navItems: ["home", "pantry", "shopping", "spaces", "family"]
  };

  // Use safe access to settings with fallbacks
  const familyMembers = Array.isArray(settings?.familyMembers) ? settings.familyMembers : defaultSettings.familyMembers;
  const staffMembers = Array.isArray(settings?.staffMembers) ? settings.staffMembers : defaultSettings.staffMembers;
  const pendingInvitations = settings?.pendingInvitations ?? defaultSettings.pendingInvitations;
  
  const handleSettingsClick = () => {
    navigate('/settings');
  };

  const handleGenerateInviteCode = async () => {
    try {
      setIsGeneratingCode(true);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication error",
          description: "You must be logged in to generate an invite code",
          variant: "destructive",
        });
        return;
      }
      
      // Check if user has admin permissions to create invites
      const currentMember = familyMembers.find(member => member.id === user.id);
      const canInvite = currentMember?.permissions?.inviteMembers || 
                        currentMember?.role === 'admin' || 
                        !currentMember; // If no member record yet, assume they're the first user
      
      if (!canInvite) {
        toast({
          title: "Permission denied",
          description: "You don't have permission to invite new members",
          variant: "destructive",
        });
        return;
      }
      
      // Get the user's family
      const family = await getFamilyForUser(user.id);
      if (!family) {
        // If no family exists yet, we'll create one later during member signup
        // For now, generate a standalone code
        const code = generateInviteCode();
        setInviteCode(code);
        toast({
          title: "Invite code generated!",
          description: `Share this code with family members: ${formatInviteCodeForDisplay(code)}`,
        });
        return;
      }
      
      // Create invitation in database
      const code = await createFamilyInvitation(family.id, user.id);
      setInviteCode(code);
      
      // Show success toast
      toast({
        title: "Invite code generated!",
        description: `Share this code with family members: ${formatInviteCodeForDisplay(code)}`,
      });
    } catch (error) {
      console.error("Error generating invite code:", error);
      toast({
        title: "Error",
        description: "Failed to generate invite code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingCode(false);
    }
  };

  const handleAddMember = () => {
    if (!newMemberDetails.name) {
      toast({
        title: "Error",
        description: "Please enter a member name",
        variant: "destructive",
      });
      return;
    }

    // Create a new member with default permissions based on the role
    const newMember: FamilyMember = {
      id: Date.now().toString(),
      name: newMemberDetails.name,
      role: newMemberDetails.role,
      status: "active",
      joined: new Date().toLocaleDateString(),
      tasksAssigned: 0,
      permissions: {
        viewPantry: true,
        editPantry: newMemberDetails.role !== "limitedUser",
        viewTasks: true,
        completeTasks: newMemberDetails.role !== "limitedUser",
        createTasks: newMemberDetails.role !== "limitedUser",
        assignTasks: newMemberDetails.role === "admin",
        viewSpaces: true,
        manageSpaces: newMemberDetails.role !== "limitedUser",
        viewFamily: true,
        inviteMembers: newMemberDetails.role === "admin",
        viewStaff: newMemberDetails.role !== "limitedUser",
        manageStaff: newMemberDetails.role === "admin",
        viewFinancial: newMemberDetails.role === "admin",
        adminSettings: newMemberDetails.role === "admin",
        addToShoppingLists: true,
        createShoppingLists: newMemberDetails.role !== "limitedUser"
      }
    };

    try {
      // Add the new member
      addFamilyMember(newMember);
      
      // Show success toast
      toast({
        title: "Success!",
        description: `${newMember.name} has been added as a ${newMember.role}`,
      });
      
      // Reset form
      setNewMemberDetails({
        name: '',
        role: 'member',
        inviteMethod: 'code'
      });
      
      // Clear invite code if it was used
      setInviteCode(null);
      
      // Close dialog
      setIsInviteDialogOpen(false);
    } catch (error) {
      console.error("Error adding family member:", error);
      toast({
        title: "Error",
        description: "Failed to add new member. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleManageMember = (id: string) => {
    navigate(`/family/member/${id}`);
  };

  const handleMessageMember = (id: string) => {
    toast({
      title: "Messaging coming soon",
      description: "This feature will be available in a future update.",
    });
  };

  return (
    <PageLayout title="Family Members">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-koffa-green">Family Members</h1>
        <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-koffa-green text-white hover:bg-koffa-green-dark">
              <Plus size={16} className="mr-1" /> Invite
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite a New Member</DialogTitle>
              <DialogDescription>
                Add a new family member or invite someone to join your family.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name" 
                  placeholder="Enter name" 
                  value={newMemberDetails.name}
                  onChange={e => setNewMemberDetails({
                    ...newMemberDetails,
                    name: e.target.value
                  })}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Role</Label>
                <div className="flex space-x-2">
                  <Button
                    variant={newMemberDetails.role === 'admin' ? 'default' : 'outline'}
                    className={newMemberDetails.role === 'admin' ? 'bg-koffa-green text-white' : ''}
                    onClick={() => setNewMemberDetails({
                      ...newMemberDetails,
                      role: 'admin'
                    })}
                  >
                    Admin
                  </Button>
                  <Button
                    variant={newMemberDetails.role === 'member' ? 'default' : 'outline'}
                    className={newMemberDetails.role === 'member' ? 'bg-koffa-green text-white' : ''}
                    onClick={() => setNewMemberDetails({
                      ...newMemberDetails,
                      role: 'member'
                    })}
                  >
                    Member
                  </Button>
                  <Button
                    variant={newMemberDetails.role === 'limitedUser' ? 'default' : 'outline'}
                    className={newMemberDetails.role === 'limitedUser' ? 'bg-koffa-green text-white' : ''}
                    onClick={() => setNewMemberDetails({
                      ...newMemberDetails,
                      role: 'limitedUser'
                    })}
                  >
                    Limited
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Invitation Method</Label>
                <div className="flex space-x-2">
                  <Button
                    variant={newMemberDetails.inviteMethod === 'direct' ? 'default' : 'outline'}
                    className={newMemberDetails.inviteMethod === 'direct' ? 'bg-koffa-green text-white' : ''}
                    onClick={() => setNewMemberDetails({
                      ...newMemberDetails,
                      inviteMethod: 'direct'
                    })}
                  >
                    Add Directly
                  </Button>
                  <Button
                    variant={newMemberDetails.inviteMethod === 'code' ? 'default' : 'outline'}
                    className={newMemberDetails.inviteMethod === 'code' ? 'bg-koffa-green text-white' : ''}
                    onClick={() => setNewMemberDetails({
                      ...newMemberDetails,
                      inviteMethod: 'code'
                    })}
                  >
                    Generate Code
                  </Button>
                </div>
              </div>
              
              {newMemberDetails.inviteMethod === 'code' && (
                <div className="space-y-2 border rounded-md p-4 bg-slate-50">
                  <Label>Invitation Code</Label>
                  <div className="flex space-x-2">
                    <Input 
                      value={inviteCode ? formatInviteCodeForDisplay(inviteCode) : ''} 
                      readOnly 
                      placeholder="Click generate to create code" 
                      className="font-mono"
                    />
                    <Button 
                      onClick={handleGenerateInviteCode}
                      type="button"
                      disabled={isGeneratingCode}
                    >
                      {isGeneratingCode ? "Generating..." : "Generate"}
                    </Button>
                  </div>
                  {inviteCode && (
                    <p className="text-xs text-muted-foreground">
                      Share this code with the person you want to invite. They can use it to join your family.
                    </p>
                  )}
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsInviteDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleAddMember} 
                className="bg-koffa-green text-white hover:bg-koffa-green-dark"
                disabled={newMemberDetails.inviteMethod === 'code' && !inviteCode}
              >
                {newMemberDetails.inviteMethod === 'direct' ? 'Add Member' : 'Create Invitation'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Tabs defaultValue="family" className="mb-6">
        <TabsList className="bg-koffa-beige mb-4">
          <TabsTrigger value="family" className="data-[state=active]:bg-koffa-green data-[state=active]:text-white">
            <UsersRound size={16} className="mr-1" /> Family
          </TabsTrigger>
          <TabsTrigger value="staff" className="data-[state=active]:bg-koffa-green data-[state=active]:text-white">
            <Users size={16} className="mr-1" /> Staff
          </TabsTrigger>
          <TabsTrigger value="roles" className="data-[state=active]:bg-koffa-green data-[state=active]:text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-1"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            Roles
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="family">
          {familyMembers.length > 0 ? (
            familyMembers.map((member) => (
              <Card key={member.id} className="mb-4 border-koffa-beige/30 p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-koffa-beige-dark flex items-center justify-center text-lg font-medium">
                      {member.avatar || member.name[0]}
                    </div>
                    <div className="ml-3">
                      <h3 className="font-medium text-koffa-green">{member.name}</h3>
                      <p className="text-xs text-koffa-green-dark">Status: {member.status}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-koffa-green">Role: {member.role}</p>
                    <p className="text-xs text-koffa-green-dark">Joined: {member.joined}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-3">
                  <p className="text-sm text-koffa-green-dark">Tasks assigned: {member.tasksAssigned}</p>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-koffa-green text-koffa-green hover:bg-koffa-beige-light"
                      onClick={() => handleManageMember(member.id)}
                    >
                      Manage
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-koffa-green text-koffa-green hover:bg-koffa-beige-light"
                      onClick={() => handleMessageMember(member.id)}
                    >
                      <MessageCircle size={14} className="mr-1" />
                      Message
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              No family members found. Add new members using the Invite button.
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="staff">
          {staffMembers.length > 0 ? (
            staffMembers.map((member) => (
              <Card key={member.id} className="mb-4 border-koffa-beige/30 p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-koffa-beige-dark flex items-center justify-center text-lg font-medium">
                      {member.avatar || member.name[0]}
                    </div>
                    <div className="ml-3">
                      <h3 className="font-medium text-koffa-green">{member.name}</h3>
                      <p className="text-xs text-koffa-green-dark">Status: {member.status}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-koffa-green">Role: {member.role}</p>
                    <p className="text-xs text-koffa-green-dark">Joined: {member.joined}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-3">
                  <p className="text-sm text-koffa-green-dark">Tasks assigned: {member.tasksAssigned}</p>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-koffa-green text-koffa-green hover:bg-koffa-beige-light"
                      onClick={() => handleManageMember(member.id)}
                    >
                      Manage
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-koffa-green text-koffa-green hover:bg-koffa-beige-light"
                      onClick={() => handleMessageMember(member.id)}
                    >
                      <MessageCircle size={14} className="mr-1" />
                      Message
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              No staff members found.
            </div>
          )}
          
          <Button 
            variant="outline" 
            className="w-full border-dashed border-koffa-green text-koffa-green hover:bg-koffa-beige-light mt-4"
            onClick={() => setIsInviteDialogOpen(true)}
          >
            <UserPlus size={16} className="mr-1" />
            Add Staff Member
          </Button>
        </TabsContent>
        
        <TabsContent value="roles">
          <div className="space-y-6">
            <Card className="border-koffa-beige/30 p-4">
              <h3 className="font-semibold text-lg text-koffa-green mb-2">Admin</h3>
              <p className="text-koffa-green-dark text-sm mb-4">
                Admins have full access to all features of the application.
              </p>
              <ul className="list-disc pl-5 space-y-1 text-koffa-green-dark text-sm">
                <li>Manage family and staff members</li>
                <li>Full access to all pantry and shopping features</li>
                <li>Create and assign tasks to any member</li>
                <li>View and manage financial information</li>
                <li>Configure application settings</li>
              </ul>
            </Card>
            
            <Card className="border-koffa-beige/30 p-4">
              <h3 className="font-semibold text-lg text-koffa-green mb-2">Family Member</h3>
              <p className="text-koffa-green-dark text-sm mb-4">
                Regular family members with standard access to daily features.
              </p>
              <ul className="list-disc pl-5 space-y-1 text-koffa-green-dark text-sm">
                <li>View and edit pantry items</li>
                <li>Create and view shopping lists</li>
                <li>Create and complete tasks</li>
                <li>View family members</li>
                <li>No access to financial information or admin settings</li>
              </ul>
            </Card>
            
            <Card className="border-koffa-beige/30 p-4">
              <h3 className="font-semibold text-lg text-koffa-green mb-2">Limited User</h3>
              <p className="text-koffa-green-dark text-sm mb-4">
                Restricted access for occasional users or elderly family members.
              </p>
              <ul className="list-disc pl-5 space-y-1 text-koffa-green-dark text-sm">
                <li>View pantry items but cannot edit</li>
                <li>View but cannot create shopping lists</li>
                <li>View tasks but cannot create or assign tasks</li>
                <li>View family members</li>
                <li>No access to staff management or financial information</li>
              </ul>
            </Card>
            
            <Card className="border-koffa-beige/30 p-4">
              <h3 className="font-semibold text-lg text-koffa-green mb-2">Staff</h3>
              <p className="text-koffa-green-dark text-sm mb-4">
                For helpers like drivers, shoppers who need specific access.
              </p>
              <ul className="list-disc pl-5 space-y-1 text-koffa-green-dark text-sm">
                <li>View assigned tasks</li>
                <li>Limited access based on role (driver, shopper, etc.)</li>
                <li>No access to family management or financial information</li>
                <li>Cannot invite other members</li>
              </ul>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
        <Card className="border-koffa-beige/30 p-4">
          <div className="flex items-center space-x-3 mb-2">
            <Users size={20} className="text-koffa-green" />
            <h3 className="font-medium text-koffa-green">Staff Members: {staffMembers.length}</h3>
          </div>
          <p className="text-sm text-koffa-green-dark mb-4">
            Manage your staff access and permissions
          </p>
          <Button 
            variant="outline" 
            className="w-full border-koffa-green text-koffa-green hover:bg-koffa-beige-light"
            onClick={() => navigate('/family/staff')}
          >
            View Staff
          </Button>
        </Card>
        
        <Card className="border-koffa-beige/30 p-4">
          <div className="flex items-center space-x-3 mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-koffa-accent-orange"
            >
              <path d="M22 7.99a8 8 0 0 0-4-5.05 8 8 0 0 0-4 0h0a8 8 0 0 0-4 5.05 8 8 0 0 0 0 4 8 8 0 0 0 4 5.05 8 8 0 0 0 4 0h0a8 8 0 0 0 4-5.05 8 8 0 0 0 0-4Z" />
              <path d="M16.5 16.5 21 21" />
              <path d="M12 8v8" />
              <path d="m8 12 8 0" />
            </svg>
            <h3 className="font-medium text-koffa-green">Pending Invitations: {pendingInvitations}</h3>
          </div>
          <p className="text-sm text-koffa-green-dark mb-4">
            Review and manage pending member invitations
          </p>
          <Button 
            variant="outline" 
            className="w-full border-koffa-green text-koffa-green hover:bg-koffa-beige-light"
            onClick={() => navigate('/family/invitations')}
          >
            Manage Invitations
          </Button>
        </Card>
      </div>
    </PageLayout>
  );
};

export default FamilyPage;
