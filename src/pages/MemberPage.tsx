
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSettings, FamilyMember } from '@/contexts/SettingsContext';
import { Bell, Settings, Edit, Trash, ArrowLeft } from 'lucide-react';
import Logo from '@/components/Logo';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const MemberPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { settings, updateFamilyMember, removeFamilyMember } = useSettings();
  const [member, setMember] = useState<FamilyMember | null>(null);
  const [permissions, setPermissions] = useState<FamilyMember['permissions'] | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Find the member from both family and staff members
    const foundMember = [...settings.familyMembers, ...settings.staffMembers]
      .find(m => m.id === id);
      
    if (foundMember) {
      setMember(foundMember);
      setPermissions(foundMember.permissions);
    } else {
      navigate('/family');
      toast({
        title: "Member not found",
        description: "The member you're looking for doesn't exist",
        variant: "destructive",
      });
    }
  }, [id, settings.familyMembers, settings.staffMembers, navigate, toast]);
  
  const handleSettingsClick = () => {
    navigate('/settings');
  };
  
  const handleBack = () => {
    navigate('/family');
  };
  
  const handlePermissionChange = (key: keyof FamilyMember['permissions']) => {
    if (!permissions) return;
    
    setPermissions(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        [key]: !prev[key],
      };
    });
  };
  
  const handleSavePermissions = () => {
    if (!member || !permissions) return;
    
    updateFamilyMember(member.id, { permissions });
    
    toast({
      title: "Permissions updated",
      description: "Member permissions have been successfully updated",
    });
  };
  
  const handleRemoveMember = () => {
    if (!member) return;
    
    removeFamilyMember(member.id);
    
    toast({
      title: "Member removed",
      description: `${member.name} has been removed from your family`,
    });
    
    navigate('/family');
  };
  
  if (!member || !permissions) {
    return (
      <div className="min-h-screen bg-koffa-beige-light flex items-center justify-center">
        <div className="text-center">
          <p className="text-koffa-green">Loading member information...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-koffa-beige-light pb-24">
      {/* Header */}
      <div className="bg-koffa-beige-light p-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <Logo size="sm" />
        
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            className="rounded-full p-2 h-auto w-auto"
          >
            <Bell size={20} className="text-koffa-green" />
          </Button>
          <Button 
            variant="ghost" 
            className="rounded-full p-2 h-auto w-auto"
            onClick={handleSettingsClick}
          >
            <Settings size={20} className="text-koffa-green" />
          </Button>
        </div>
      </div>

      <div className="p-4">
        <div className="mb-4">
          <Button 
            variant="ghost" 
            className="mb-4 pl-0 text-koffa-green-dark"
            onClick={handleBack}
          >
            <ArrowLeft size={18} className="mr-1" /> Back to Family
          </Button>
          
          <h1 className="text-2xl font-semibold text-koffa-green">Member: {member.name}</h1>
        </div>
        
        <Tabs defaultValue="profile" className="mb-6">
          <TabsList className="bg-koffa-beige mb-4">
            <TabsTrigger value="profile" className="data-[state=active]:bg-koffa-green data-[state=active]:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                <circle cx="12" cy="8" r="5" />
                <path d="M20 21a8 8 0 0 0-16 0" />
              </svg>
              Profile
            </TabsTrigger>
            <TabsTrigger value="permissions" className="data-[state=active]:bg-koffa-green data-[state=active]:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <path d="M7 12h10" />
                <path d="M12 7v10" />
              </svg>
              Permissions
            </TabsTrigger>
            <TabsTrigger value="activity" className="data-[state=active]:bg-koffa-green data-[state=active]:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                <path d="M15 2H9a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1Z" />
                <path d="M12 11h4" />
                <path d="M12 16h4" />
                <path d="M8 11h.01" />
                <path d="M8 16h.01" />
              </svg>
              Activity
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <Card className="border-koffa-beige/30 p-4 mb-6">
              <h2 className="font-medium text-lg text-koffa-green mb-4">Profile Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-koffa-green-dark">Name</p>
                  <p className="font-medium text-koffa-green">{member.name}</p>
                </div>
                <div>
                  <p className="text-sm text-koffa-green-dark">Role</p>
                  <p className="font-medium text-koffa-green">{member.role}</p>
                </div>
                <div>
                  <p className="text-sm text-koffa-green-dark">Joined</p>
                  <p className="font-medium text-koffa-green">{member.joined}</p>
                </div>
                <div>
                  <p className="text-sm text-koffa-green-dark">Status</p>
                  <p className="font-medium text-koffa-green">{member.status}</p>
                </div>
                <div>
                  <p className="text-sm text-koffa-green-dark">Last Activity</p>
                  <p className="font-medium text-koffa-green">Today at 12:30</p>
                </div>
                <div>
                  <p className="text-sm text-koffa-green-dark">Tasks Assigned</p>
                  <p className="font-medium text-koffa-green">{member.tasksAssigned}</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-6">
                <Button 
                  variant="outline" 
                  className="border-koffa-green text-koffa-green hover:bg-koffa-beige-light"
                >
                  <Edit size={16} className="mr-1" /> Edit Profile
                </Button>
                <Button 
                  variant="outline" 
                  className="border-koffa-green text-koffa-green hover:bg-koffa-beige-light"
                >
                  Reset Password
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="border-red-500 text-red-500 hover:bg-red-50"
                    >
                      <Trash size={16} className="mr-1" /> Remove Member
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently remove {member.name} 
                        from your family and delete all their associated data.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleRemoveMember}
                        className="bg-red-500 text-white hover:bg-red-600"
                      >
                        Remove
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="permissions">
            <Card className="border-koffa-beige/30 p-4 mb-6">
              <h2 className="font-medium text-lg text-koffa-green mb-4">Access Permissions</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="viewPantry" 
                    checked={permissions.viewPantry} 
                    onCheckedChange={() => handlePermissionChange('viewPantry')}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="viewPantry"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      View Pantry Items
                    </label>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="addToShoppingLists" 
                    checked={permissions.addToShoppingLists}
                    onCheckedChange={() => handlePermissionChange('addToShoppingLists')}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="addToShoppingLists"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Add to Shopping Lists
                    </label>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="editPantry" 
                    checked={permissions.editPantry}
                    onCheckedChange={() => handlePermissionChange('editPantry')}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="editPantry"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Edit Pantry Items
                    </label>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="createShoppingLists" 
                    checked={permissions.createShoppingLists}
                    onCheckedChange={() => handlePermissionChange('createShoppingLists')}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="createShoppingLists"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Create Shopping Lists
                    </label>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="viewTasks" 
                    checked={permissions.viewTasks}
                    onCheckedChange={() => handlePermissionChange('viewTasks')}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="viewTasks"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      View Tasks
                    </label>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="assignTasks" 
                    checked={permissions.assignTasks}
                    onCheckedChange={() => handlePermissionChange('assignTasks')}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="assignTasks"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Assign Tasks
                    </label>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="completeTasks" 
                    checked={permissions.completeTasks}
                    onCheckedChange={() => handlePermissionChange('completeTasks')}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="completeTasks"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Complete Tasks
                    </label>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="createTasks" 
                    checked={permissions.createTasks}
                    onCheckedChange={() => handlePermissionChange('createTasks')}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="createTasks"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Create Tasks
                    </label>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="viewSpaces" 
                    checked={permissions.viewSpaces}
                    onCheckedChange={() => handlePermissionChange('viewSpaces')}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="viewSpaces"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      View Spaces
                    </label>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="manageSpaces" 
                    checked={permissions.manageSpaces}
                    onCheckedChange={() => handlePermissionChange('manageSpaces')}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="manageSpaces"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Manage Spaces
                    </label>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="viewFamily" 
                    checked={permissions.viewFamily}
                    onCheckedChange={() => handlePermissionChange('viewFamily')}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="viewFamily"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      View Family Members
                    </label>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="inviteMembers" 
                    checked={permissions.inviteMembers}
                    onCheckedChange={() => handlePermissionChange('inviteMembers')}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="inviteMembers"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Invite Members
                    </label>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="viewStaff" 
                    checked={permissions.viewStaff}
                    onCheckedChange={() => handlePermissionChange('viewStaff')}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="viewStaff"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      View Staff Members
                    </label>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="manageStaff" 
                    checked={permissions.manageStaff}
                    onCheckedChange={() => handlePermissionChange('manageStaff')}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="manageStaff"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Manage Staff
                    </label>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="viewFinancial" 
                    checked={permissions.viewFinancial}
                    onCheckedChange={() => handlePermissionChange('viewFinancial')}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="viewFinancial"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Financial Information
                    </label>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="adminSettings" 
                    checked={permissions.adminSettings}
                    onCheckedChange={() => handlePermissionChange('adminSettings')}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="adminSettings"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Admin Settings
                    </label>
                  </div>
                </div>
              </div>
              
              <Button 
                className="bg-koffa-green text-white hover:bg-koffa-green-dark"
                onClick={handleSavePermissions}
              >
                Apply Changes
              </Button>
            </Card>
          </TabsContent>
          
          <TabsContent value="activity">
            <Card className="border-koffa-beige/30 p-4 mb-6">
              <h2 className="font-medium text-lg text-koffa-green mb-4">Recent Activity</h2>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Activity</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Today, 12:30 PM</TableCell>
                    <TableCell>Added item to shopping list</TableCell>
                    <TableCell>Added "Milk" to Weekly Groceries</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Today, 11:15 AM</TableCell>
                    <TableCell>Completed task</TableCell>
                    <TableCell>Marked "Take out trash" as completed</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Yesterday, 3:45 PM</TableCell>
                    <TableCell>Updated pantry</TableCell>
                    <TableCell>Marked "Bread" as used</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Yesterday, 9:20 AM</TableCell>
                    <TableCell>Created shopping list</TableCell>
                    <TableCell>Created "Weekend BBQ" list</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Apr 25, 2025</TableCell>
                    <TableCell>Logged in</TableCell>
                    <TableCell>First login of the day</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              
              <Button 
                variant="outline" 
                className="mt-4 border-koffa-green text-koffa-green hover:bg-koffa-beige-light"
              >
                View All Activity
              </Button>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Floating Navigation Bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white rounded-full shadow-lg px-6 py-3 w-[80%] max-w-sm border border-koffa-beige/20 transition-all duration-300 hover:shadow-xl">
        <div className="flex justify-around items-center">
          <Button 
            variant="ghost" 
            className="p-2 h-auto w-14 hover:bg-koffa-beige-light rounded-full transition-all duration-300"
            onClick={() => navigate('/home')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-koffa-green-dark">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </Button>
          
          {settings.navItems.slice(1, 4).map((item, index) => {
            return (
              <Button 
                key={index}
                variant="ghost" 
                className={`p-2 h-auto w-14 hover:bg-koffa-beige-light rounded-full transition-all duration-300 ${item === 'family' ? 'bg-koffa-beige-light' : ''}`}
                onClick={() => navigate(`/${item}`)}
              >
                {item === 'pantry' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-koffa-green-dark">
                    <path d="M21 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v3" />
                    <path d="M3 8v8a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8" />
                    <path d="M10 2v9" />
                  </svg>
                ) : item === 'shopping' || item === 'lists' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-koffa-green-dark">
                    <path d="M8 5h8l2 13H6z" />
                    <path d="M5 8l14 1" />
                    <path d="M9 3v2" />
                    <path d="M15 3v2" />
                    <path d="M11 23a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
                    <path d="M17 23a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
                  </svg>
                ) : item === 'spaces' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-koffa-green-dark">
                    <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
                    <path d="M3 9V6a2 2 0 0 1 2-2h2" />
                  </svg>
                ) : item === 'family' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-koffa-green">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-koffa-green-dark">
                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                )}
              </Button>
            );
          })}
          
          <Button 
            variant="ghost" 
            className="p-2 h-auto w-14 hover:bg-koffa-beige-light rounded-full transition-all duration-300"
            onClick={() => navigate('/profile')}
          >
            <div className="w-8 h-8 rounded-full bg-koffa-beige flex items-center justify-center text-sm font-medium text-koffa-green">
              JD
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MemberPage;
