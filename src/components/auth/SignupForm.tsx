
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { createNewFamily, useInviteCode, verifyInviteCode } from '@/utils/familyUtils';
import { normalizeInviteCode, validateInviteCodeFormat } from '@/utils/inviteUtils';
import InviteCodeInput from '@/components/ui/invite-code-input';
import { User, Mail, Lock, Users, Package, Check, X, AlertCircle } from 'lucide-react';

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
    createFamily: !initialInviteCode,
  });
  
  const [inviteCodeValid, setInviteCodeValid] = useState<boolean | null>(
    initialInviteCode ? true : null
  );
  
  const [inviteCodeValidating, setInviteCodeValidating] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (name === 'inviteCode') {
      setInviteCodeValid(null);
    }
  };

  const handleInviteCodeChange = (cleanCode: string) => {
    setFormData(prev => ({ ...prev, inviteCode: cleanCode }));
    setInviteCodeValid(null);
  };

  const toggleCreateFamily = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      createFamily: checked,
      inviteCode: checked ? '' : prev.inviteCode
    }));
    
    if (checked) {
      setInviteCodeValid(null);
    }
  };
  
  const validateInviteCode = async () => {
    if (!formData.inviteCode.trim()) {
      toast.error("Please enter an invitation code");
      return;
    }
    
    // Validate format first
    const { isValid, errors } = validateInviteCodeFormat(formData.inviteCode);
    
    if (!isValid) {
      setInviteCodeValid(false);
      toast.error(errors[0]);
      return;
    }
    
    try {
      setInviteCodeValidating(true);
      const cleanCode = normalizeInviteCode(formData.inviteCode);
      
      const verification = await verifyInviteCode(cleanCode);
      
      if (verification.valid) {
        setInviteCodeValid(true);
        toast.success("Invitation code is valid!");
        setFormData(prev => ({
          ...prev,
          inviteCode: cleanCode,
          createFamily: false
        }));
      } else {
        setInviteCodeValid(false);
        toast.error(verification.error || "Invalid or expired invitation code");
      }
    } catch (error: any) {
      setInviteCodeValid(false);
      toast.error(error.message || "Failed to verify invitation code");
    } finally {
      setInviteCodeValidating(false);
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
    
    // Validate invite code if not creating family
    if (!formData.createFamily && formData.inviteCode) {
      if (inviteCodeValid === null) {
        try {
          const verification = await verifyInviteCode(formData.inviteCode);
          if (!verification.valid) {
            toast.error(verification.error || "Invalid invitation code. Please verify it first.");
            setIsLoading(false);
            return;
          }
        } catch (error) {
          toast.error("Please verify your invitation code first");
          setIsLoading(false);
          return;
        }
      } else if (inviteCodeValid === false) {
        toast.error("Please enter a valid invitation code");
        setIsLoading(false);
        return;
      }
    }
    
    try {
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
      
      // Wait a moment for user creation to complete
      await new Promise(resolve => setTimeout(resolve, 500));
      
      try {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            username: formData.name,
          });
          
        if (profileError) {
          console.error("Profile creation error:", profileError);
        }
        
        if (formData.inviteCode && !formData.createFamily) {
          try {
            const cleanCode = normalizeInviteCode(formData.inviteCode);
            await useInviteCode(cleanCode, authData.user.id);
            toast.success("You've joined a family!");
          } catch (error: any) {
            console.error("Family join error:", error);
            toast.error(`Failed to join family: ${error.message}`);
          }
        } 
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
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name field */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-koffa-green block">Full Name</label>
        <div className="relative">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-koffa-green/60 w-5 h-5" />
          <Input 
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="pl-12 h-14 text-base border-2 border-koffa-beige focus:border-koffa-green rounded-xl transition-colors"
            placeholder="Your full name"
            required
          />
        </div>
      </div>
      
      {/* Email field */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-koffa-green block">Email Address</label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-koffa-green/60 w-5 h-5" />
          <Input 
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="pl-12 h-14 text-base border-2 border-koffa-beige focus:border-koffa-green rounded-xl transition-colors"
            placeholder="Your email address"
            required
          />
        </div>
      </div>
      
      {/* Password field */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-koffa-green block">Password</label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-koffa-green/60 w-5 h-5" />
          <Input 
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="pl-12 h-14 text-base border-2 border-koffa-beige focus:border-koffa-green rounded-xl transition-colors"
            placeholder="Create a password"
            required
          />
        </div>
      </div>
      
      {/* Confirm password field */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-koffa-green block">Confirm Password</label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-koffa-green/60 w-5 h-5" />
          <Input 
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="pl-12 h-14 text-base border-2 border-koffa-beige focus:border-koffa-green rounded-xl transition-colors"
            placeholder="Confirm your password"
            required
          />
        </div>
      </div>
      
      {/* Create family toggle */}
      <div className="flex items-center space-x-3 p-4 bg-koffa-beige-light rounded-xl">
        <Checkbox 
          id="createFamily" 
          checked={formData.createFamily}
          onCheckedChange={toggleCreateFamily}
          className="touch-target"
        />
        <label
          htmlFor="createFamily"
          className="text-sm font-medium leading-none touch-target flex-1"
        >
          Create a new family
        </label>
      </div>
      
      {/* Conditional sections */}
      {formData.createFamily ? (
        <div className="space-y-3">
          <label className="text-sm font-semibold text-koffa-green block">Family Name</label>
          <div className="relative">
            <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-koffa-green/60 w-5 h-5" />
            <Input 
              name="familyName"
              value={formData.familyName}
              onChange={handleChange}
              className="pl-12 h-14 text-base border-2 border-koffa-beige focus:border-koffa-green rounded-xl transition-colors"
              placeholder="Enter your family name"
              required
            />
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <label className="text-sm font-semibold text-koffa-green block">Invitation Code</label>
          <div className="space-y-3">
            <div className="flex space-x-3">
              <div className="relative flex-1">
                <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-koffa-green/60 w-5 h-5 z-10" />
                <InviteCodeInput
                  value={formData.inviteCode}
                  onChange={handleInviteCodeChange}
                  className="pl-12 h-14 text-base border-2 border-koffa-beige focus:border-koffa-green rounded-xl transition-colors"
                  placeholder="XXXX-XXXX"
                  disabled={isLoading || inviteCodeValidating}
                />
              </div>
              <Button 
                type="button" 
                variant="outline"
                onClick={validateInviteCode}
                disabled={isLoading || inviteCodeValidating || !formData.inviteCode}
                className="h-14 px-6 border-2 border-koffa-green text-koffa-green hover:bg-koffa-green hover:text-white rounded-xl transition-colors touch-target"
              >
                {inviteCodeValidating ? "..." : "Verify"}
              </Button>
            </div>
            
            {/* Validation feedback */}
            {inviteCodeValid === true && (
              <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-3 rounded-xl">
                <Check className="w-4 h-4" />
                <p className="text-sm font-medium">Valid invitation code - you'll join a family</p>
              </div>
            )}
            {inviteCodeValid === false && (
              <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-xl">
                <X className="w-4 h-4" />
                <p className="text-sm font-medium">Invalid or expired invitation code</p>
              </div>
            )}
            {formData.inviteCode && inviteCodeValid === null && (
              <div className="flex items-center space-x-2 text-amber-600 bg-amber-50 p-3 rounded-xl">
                <AlertCircle className="w-4 h-4" />
                <p className="text-sm font-medium">Click "Verify" to check this invitation code</p>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Submit button */}
      <Button 
        type="submit" 
        className="w-full bg-koffa-green hover:bg-koffa-green-dark text-white h-14 text-base font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl touch-target" 
        disabled={isLoading || inviteCodeValidating}
      >
        {isLoading ? "Creating Account..." : "Create Account"}
      </Button>
    </form>
  );
};

export default SignupForm;
