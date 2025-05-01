
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Logo from '@/components/Logo';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { formatInviteCodeForDisplay } from '@/utils/inviteUtils';
import { createNewFamily, useInviteCode, verifyInviteCode } from '@/utils/familyUtils';
import { Checkbox } from '@/components/ui/checkbox';

const SignupPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const inviteCode = location.state?.inviteCode || '';
  
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    inviteCode: inviteCode,
    familyName: '',
    createFamily: !inviteCode, // Default to true if no invite code
  });
  
  const [inviteCodeValid, setInviteCodeValid] = useState<boolean | null>(
    inviteCode ? true : null
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
      // Remove any formatting from the invite code
      const cleanCode = formData.inviteCode.replace(/[^A-Z0-9]/gi, '').toUpperCase();
      
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
        const cleanCode = formData.inviteCode.replace(/[^A-Z0-9]/gi, '').toUpperCase();
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
      
      // Create profile entry
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          username: formData.name,
        });
        
      if (profileError) throw profileError;
      
      // If there's an invite code, process it
      if (formData.inviteCode && !formData.createFamily) {
        try {
          await useInviteCode(formData.inviteCode, authData.user.id);
          toast.success("You've joined a family!");
        } catch (error: any) {
          toast.error(`Failed to join family: ${error.message}`);
        }
      } 
      // If user wants to create a family
      else if (formData.createFamily && formData.familyName) {
        try {
          await createNewFamily(formData.familyName, authData.user.id);
          toast.success(`Family "${formData.familyName}" created successfully!`);
        } catch (error: any) {
          toast.error(`Failed to create family: ${error.message}`);
        }
      }
      
      toast.success("Account created successfully!");
      navigate('/home');
    } catch (error: any) {
      toast.error(error.message || "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-koffa-beige-light flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        <div className="mb-6 text-center">
          <Logo size="md" />
          <h2 className="text-2xl font-semibold text-koffa-green mt-4">Create your account</h2>
          <p className="text-koffa-green-dark mt-1">Join the Koffa family</p>
        </div>
        
        <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6">
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
            
            {formData.createFamily && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-koffa-green">Family Name</label>
                <Input 
                  name="familyName"
                  value={formData.familyName}
                  onChange={handleChange}
                  className="border-koffa-beige focus-visible:ring-koffa-green"
                  placeholder="Your family name"
                  required={formData.createFamily}
                />
              </div>
            )}
            
            {!formData.createFamily && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-koffa-green">Invitation Code</label>
                <div className="flex space-x-2">
                  <Input 
                    name="inviteCode"
                    value={formatInviteCodeForDisplay(formData.inviteCode)}
                    onChange={handleChange}
                    className="border-koffa-beige focus-visible:ring-koffa-green font-mono"
                    placeholder="XXXX-XXXX"
                    required={!formData.createFamily}
                  />
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={validateInviteCode}
                    disabled={isLoading || !formData.inviteCode}
                  >
                    Verify
                  </Button>
                </div>
                {inviteCodeValid === true && (
                  <p className="text-xs text-green-600 font-medium">
                    Valid invitation code - you'll be added to a family
                  </p>
                )}
                {inviteCodeValid === false && (
                  <p className="text-xs text-red-500 font-medium">
                    Invalid or expired invitation code
                  </p>
                )}
              </div>
            )}
            
            <Button 
              type="submit" 
              className="w-full bg-koffa-green hover:bg-koffa-green-dark text-white mt-4" 
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-koffa-green-dark">Already have an account?</p>
          <Button 
            onClick={() => navigate('/auth')}
            variant="link" 
            className="text-koffa-green hover:text-koffa-accent-blue"
          >
            Log In
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
