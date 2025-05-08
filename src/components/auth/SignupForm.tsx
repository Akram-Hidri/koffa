
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { createNewFamily, useInviteCode, verifyInviteCode } from '@/utils/familyUtils';
import { formatInviteCodeForDisplay, normalizeInviteCode } from '@/utils/inviteUtils';
import CreateFamilySection from './CreateFamilySection';
import JoinFamilySection from './JoinFamilySection';

interface SignupFormProps {
  initialInviteCode?: string;
}

const SignupForm: React.FC<SignupFormProps> = ({ initialInviteCode = '' }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    inviteCode: initialInviteCode,
    familyName: '',
    createFamily: !initialInviteCode, // Default to true if no invite code
  });
  
  const [inviteCodeValid, setInviteCodeValid] = useState<boolean | null>(
    initialInviteCode ? true : null
  );
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // If changing invite code, reset validation
    if (name === 'inviteCode') {
      setInviteCodeValid(null);
    }
  };

  const toggleCreateFamily = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      createFamily: checked,
      // Clear invite code if switching to create family
      inviteCode: checked ? '' : prev.inviteCode
    }));
    
    // Reset invite code validation
    if (checked) {
      setInviteCodeValid(null);
    }
  };
  
  const validateInviteCode = async () => {
    if (!formData.inviteCode.trim()) {
      toast.error("Please enter an invitation code");
      return;
    }
    
    try {
      setIsLoading(true);
      // Normalize the invite code
      const cleanCode = normalizeInviteCode(formData.inviteCode);
      
      const { valid } = await verifyInviteCode(cleanCode);
      
      if (valid) {
        setInviteCodeValid(true);
        toast.success("Invitation code is valid!");
        setFormData(prev => ({
          ...prev,
          inviteCode: cleanCode,
          createFamily: false
        }));
      } else {
        setInviteCodeValid(false);
        toast.error("Invalid or expired invitation code");
      }
    } catch (error: any) {
      setInviteCodeValid(false);
      toast.error(error.message || "Failed to verify invitation code");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match");
      setIsLoading(false);
      return;
    }

    if (formData.createFamily && !formData.familyName.trim()) {
      toast.error("Please enter a family name");
      setIsLoading(false);
      return;
    }
    
    // If user wants to join with invite code but hasn't validated yet
    if (!formData.createFamily && formData.inviteCode && inviteCodeValid === null) {
      try {
        const cleanCode = normalizeInviteCode(formData.inviteCode);
        const { valid } = await verifyInviteCode(cleanCode);
        if (!valid) {
          toast.error("Invalid invitation code. Please verify it first.");
          setIsLoading(false);
          return;
        }
      } catch (error) {
        toast.error("Please verify your invitation code first");
        setIsLoading(false);
        return;
      }
    }
    
    try {
      // Register with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name,
          }
        }
      });
      
      if (authError) throw authError;
      if (!authData.user) throw new Error("Failed to create account");
      
      // Wait a moment for the user record to be fully created
      await new Promise(resolve => setTimeout(resolve, 500));
      
      try {
        // Create profile entry with service role to bypass RLS during signup
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            username: formData.name,
          });
          
        if (profileError) {
          console.error("Profile creation error:", profileError);
          // Continue with the signup process even if profile creation fails
          // The auth trigger should handle creating the profile
        }
        
        // If there's an invite code, process it
        if (formData.inviteCode && !formData.createFamily) {
          try {
            // Normalize the code before using it
            const cleanCode = normalizeInviteCode(formData.inviteCode);
            await useInviteCode(cleanCode, authData.user.id);
            toast.success("You've joined a family!");
          } catch (error: any) {
            console.error("Family join error:", error);
            toast.error(`Failed to join family: ${error.message}`);
          }
        } 
        // If user wants to create a family
        else if (formData.createFamily && formData.familyName) {
          try {
            await createNewFamily(formData.familyName, authData.user.id);
            toast.success(`Family "${formData.familyName}" created successfully!`);
          } catch (error: any) {
            console.error("Family creation error:", error);
            toast.error(`Failed to create family: ${error.message}`);
          }
        }
      } catch (error: any) {
        console.error("Error during profile or family setup:", error);
        // Continue to show success even if there were issues with profile or family
        // since the user account was created successfully
      }
      
      toast.success("Account created successfully!");
      navigate('/home');
    } catch (error: any) {
      console.error("Signup error:", error);
      toast.error(error.message || "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-koffa-green">Full Name</label>
        <Input 
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="border-koffa-beige focus-visible:ring-koffa-green"
          placeholder="Your full name"
          required
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium text-koffa-green">Email</label>
        <Input 
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="border-koffa-beige focus-visible:ring-koffa-green"
          placeholder="Your email address"
          required
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium text-koffa-green">Password</label>
        <Input 
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="border-koffa-beige focus-visible:ring-koffa-green"
          placeholder="Create a password"
          required
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium text-koffa-green">Confirm Password</label>
        <Input 
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="border-koffa-beige focus-visible:ring-koffa-green"
          placeholder="Confirm your password"
          required
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="createFamily" 
          checked={formData.createFamily}
          onCheckedChange={toggleCreateFamily}
        />
        <label
          htmlFor="createFamily"
          className="text-sm font-medium leading-none"
        >
          Create a new family
        </label>
      </div>
      
      {formData.createFamily ? (
        <CreateFamilySection 
          familyName={formData.familyName}
          onChange={handleChange}
        />
      ) : (
        <JoinFamilySection 
          inviteCode={formData.inviteCode}
          inviteCodeValid={inviteCodeValid}
          onChange={handleChange}
          onValidate={validateInviteCode}
          isLoading={isLoading}
        />
      )}
      
      <Button 
        type="submit" 
        className="w-full bg-koffa-green hover:bg-koffa-green-dark text-white mt-4" 
        disabled={isLoading}
      >
        {isLoading ? "Creating Account..." : "Create Account"}
      </Button>
    </form>
  );
};

export default SignupForm;
