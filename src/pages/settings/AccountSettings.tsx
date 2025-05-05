
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  Key, 
  Camera, 
  LogOut, 
  Shield, 
  Lock, 
  Bell
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Card,
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import Logo from '@/components/Logo';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageLayout from '@/components/PageLayout';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

const AccountSettings = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    avatar: ''
  });

  // Form fields state
  const [formData, setFormData] = useState({
    ...profileData
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSaveProfile = () => {
    setProfileData({
      ...formData
    });
    setIsEditing(false);
    toast.success("Profile updated successfully");
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
    toast.info("You've been signed out");
  };

  // Password reset
  const handlePasswordReset = () => {
    toast.success("Password reset link sent to your email");
  };

  // Delete account
  const handleDeleteAccount = () => {
    toast.success("Account deletion request submitted");
    setTimeout(() => {
      signOut();
      navigate('/auth');
    }, 2000);
  };

  return (
    <PageLayout title="Account Settings">
      <div className="container px-4 py-6 max-w-3xl mx-auto">
        <div className="mb-6">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>
            
            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle className="text-koffa-green">Personal Information</CardTitle>
                  <CardDescription>Manage your personal details and preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  {!isEditing ? (
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <Avatar className="w-20 h-20 border-2 border-koffa-beige">
                          <AvatarFallback className="bg-koffa-green text-white text-xl">
                            {profileData.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-xl font-semibold text-koffa-green">{profileData.name}</h3>
                          <p className="text-koffa-green-dark">{profileData.email}</p>
                        </div>
                      </div>
                      
                      <div className="grid gap-4">
                        <div className="flex items-center gap-2">
                          <User className="text-koffa-green" size={18} />
                          <div>
                            <Label className="text-sm text-koffa-green-dark">Full Name</Label>
                            <p className="font-medium text-koffa-green">{profileData.name}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Mail className="text-koffa-green" size={18} />
                          <div>
                            <Label className="text-sm text-koffa-green-dark">Email Address</Label>
                            <p className="font-medium text-koffa-green">{profileData.email}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Phone className="text-koffa-green" size={18} />
                          <div>
                            <Label className="text-sm text-koffa-green-dark">Phone Number</Label>
                            <p className="font-medium text-koffa-green">{profileData.phone}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="w-20 h-20 border-2 border-koffa-beige">
                          <AvatarFallback className="bg-koffa-green text-white text-xl">
                            {formData.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <Button variant="outline" size="sm" className="flex items-center gap-2">
                          <Camera size={16} />
                          Change Photo
                        </Button>
                      </div>
                      
                      <div className="grid gap-4">
                        <div>
                          <Label htmlFor="name" className="text-koffa-green">Full Name</Label>
                          <Input 
                            id="name" 
                            name="name" 
                            value={formData.name}
                            onChange={handleInputChange}
                            className="mt-1"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="email" className="text-koffa-green">Email Address</Label>
                          <Input 
                            id="email" 
                            name="email" 
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="mt-1"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="phone" className="text-koffa-green">Phone Number</Label>
                          <Input 
                            id="phone" 
                            name="phone" 
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  {isEditing ? (
                    <>
                      <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                      <Button onClick={handleSaveProfile} className="bg-koffa-green hover:bg-koffa-green-dark">Save Changes</Button>
                    </>
                  ) : (
                    <Button onClick={() => setIsEditing(true)} className="bg-koffa-green hover:bg-koffa-green-dark">Edit Profile</Button>
                  )}
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Security Tab */}
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle className="text-koffa-green">Security Settings</CardTitle>
                  <CardDescription>Manage your password and account security</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Key className="text-koffa-green" size={18} />
                        <div>
                          <p className="font-medium text-koffa-green">Password</p>
                          <p className="text-sm text-koffa-green-dark">Last changed 3 months ago</p>
                        </div>
                      </div>
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline">Change Password</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Change Password</DialogTitle>
                            <DialogDescription>
                              A password reset link will be sent to your email address.
                            </DialogDescription>
                          </DialogHeader>
                          
                          <div className="space-y-4 py-4">
                            <div>
                              <Label htmlFor="current-password">Current Password</Label>
                              <Input id="current-password" type="password" className="mt-1" />
                            </div>
                            <div>
                              <Label htmlFor="new-password">New Password</Label>
                              <Input id="new-password" type="password" className="mt-1" />
                            </div>
                            <div>
                              <Label htmlFor="confirm-password">Confirm New Password</Label>
                              <Input id="confirm-password" type="password" className="mt-1" />
                            </div>
                          </div>
                          
                          <DialogFooter>
                            <Button variant="outline">Cancel</Button>
                            <Button onClick={handlePasswordReset} className="bg-koffa-green hover:bg-koffa-green-dark">
                              Change Password
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Shield className="text-koffa-green" size={18} />
                        <div>
                          <p className="font-medium text-koffa-green">Two-Factor Authentication</p>
                          <p className="text-sm text-koffa-green-dark">Add an extra layer of security</p>
                        </div>
                      </div>
                      
                      <Button variant="outline" onClick={() => toast.info("Two-factor authentication coming soon")}>
                        Enable
                      </Button>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Lock className="text-red-500" size={18} />
                        <div>
                          <p className="font-medium text-red-500">Delete Account</p>
                          <p className="text-sm text-koffa-green-dark">Permanently delete your account and data</p>
                        </div>
                      </div>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" className="border-red-200 text-red-500 hover:bg-red-50">
                            Delete Account
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete your account
                              and remove your data from our servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={handleDeleteAccount}
                              className="bg-red-500 hover:bg-red-600 text-white"
                            >
                              Delete Account
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Notifications Tab */}
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle className="text-koffa-green">Notification Preferences</CardTitle>
                  <CardDescription>
                    Manage how and when you receive notifications
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-6 text-sm">
                    Visit the Notifications Settings page for detailed notification preferences.
                  </p>
                  <Button 
                    onClick={() => navigate('/settings/notifications')}
                    className="bg-koffa-green hover:bg-koffa-green-dark flex items-center gap-2"
                  >
                    <Bell size={16} />
                    Notification Settings
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-red-500">Session</CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              variant="outline" 
              className="w-full border-red-200 text-red-500 hover:bg-red-50 flex items-center justify-center gap-2"
              onClick={handleSignOut}
            >
              <LogOut size={16} />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default AccountSettings;
