
import React from 'react';
import { useNavigate } from 'react-router-dom';
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
} from '@/components/ui/card';
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
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Key, Shield, Lock, LogOut } from 'lucide-react';

const SecurityTab: React.FC = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  
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
  
  // Sign out
  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
    toast.info("You've been signed out");
  };

  return (
    <>
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
      
      <Card className="mt-6">
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
    </>
  );
};

export default SecurityTab;
