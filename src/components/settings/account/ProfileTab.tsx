
import React, { useState } from 'react';
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
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { User, Mail, Phone, Camera } from 'lucide-react';

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  avatar: string;
}

const ProfileTab: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  
  const [profileData, setProfileData] = useState<ProfileData>({
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

  return (
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
  );
};

export default ProfileTab;
