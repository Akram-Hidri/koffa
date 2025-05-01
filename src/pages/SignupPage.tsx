
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Logo from '@/components/Logo';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { formatInviteCodeForDisplay } from '@/utils/inviteUtils';
import { createNewFamily, useInviteCode } from '@/utils/familyUtils';
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
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleCreateFamily = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      createFamily: checked
    }));
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
      
      // If there's an invite code, process it
      if (formData.inviteCode) {
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
            
            {formData.inviteCode ? (
              <div className="space-y-2">
                <label className="text-sm font-medium text-koffa-green">Invitation Code</label>
                <Input 
                  type="text"
                  name="inviteCode"
                  value={formatInviteCodeForDisplay(formData.inviteCode)}
                  className="border-koffa-beige focus-visible:ring-koffa-green bg-koffa-beige-light font-mono text-center"
                  readOnly
                />
                <p className="text-xs text-green-600 font-medium">
                  Valid invitation code - you'll be added to a family
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="createFamily" 
                    checked={formData.createFamily}
                    onCheckedChange={toggleCreateFamily}
                  />
                  <label
                    htmlFor="createFamily"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Create a family
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
              </>
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
