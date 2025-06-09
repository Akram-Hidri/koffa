
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Eye, EyeOff, Mail, Lock, Package } from 'lucide-react';
import { formatInviteCodeForDisplay } from '@/utils/inviteUtils';

const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const defaultTab = location.state?.defaultTab || 'email';
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      navigate('/onboarding');
      toast.success("Successfully signed in!");
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleInviteCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (!inviteCode.trim()) {
        throw new Error("Please enter an invitation code");
      }
      
      const cleanCode = inviteCode.replace(/[^A-Z0-9]/gi, '').toUpperCase();
      
      console.log("Verifying invite code:", cleanCode);
      
      const { data, error } = await supabase
        .rpc('is_valid_invite_code', { code_param: cleanCode });
        
      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }
      
      console.log("Invite code validation result:", data);
      
      if (!data) {
        throw new Error("Invalid or expired invitation code");
      }
      
      toast.success("Invitation code accepted!");
      navigate('/signup', { state: { inviteCode: cleanCode } });
    } catch (error: any) {
      console.error("Invite code error:", error);
      toast.error(error.message || "Invalid invitation code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInviteCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (inputValue.length <= 9) {
      setInviteCode(inputValue.toUpperCase());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-koffa-beige-light via-white to-koffa-beige flex flex-col">
      {/* Mobile-optimized header */}
      <div className="safe-area-top"></div>
      
      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-6 sm:py-8">
        {/* Logo section - mobile optimized */}
        <div className="mb-8 sm:mb-10 text-center animate-fade-in">
          <Logo size="lg" />
          <h1 className="text-2xl sm:text-3xl font-bold text-koffa-green mt-6 mb-2">
            Welcome to Koffa
          </h1>
          <p className="text-base sm:text-lg text-koffa-green-dark px-4">
            Your family's digital assistant
          </p>
        </div>

        {/* Main card - mobile-first design */}
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl border border-koffa-beige p-6 sm:p-8 mx-4">
          <Tabs defaultValue={defaultTab} className="w-full">
            {/* Mobile-optimized tab list */}
            <TabsList className="grid grid-cols-3 mb-6 h-12 bg-koffa-beige-light rounded-xl p-1">
              <TabsTrigger 
                value="email" 
                className="data-[state=active]:bg-koffa-green data-[state=active]:text-white text-sm font-medium rounded-lg transition-all duration-200 touch-target"
              >
                <Mail className="w-5 h-5 mr-1" />
                Email
              </TabsTrigger>
              <TabsTrigger 
                value="phone"
                className="data-[state=active]:bg-koffa-green data-[state=active]:text-white text-sm font-medium rounded-lg transition-all duration-200 touch-target"
              >
                Phone
              </TabsTrigger>
              <TabsTrigger 
                value="invite"
                className="data-[state=active]:bg-koffa-green data-[state=active]:text-white text-sm font-medium rounded-lg transition-all duration-200 touch-target"
              >
                <Package className="w-5 h-5 mr-1" />
                Invite
              </TabsTrigger>
            </TabsList>
            
            {/* Email tab - mobile optimized */}
            <TabsContent value="email" className="space-y-0">
              <form onSubmit={handleSignIn} className="space-y-5">
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-koffa-green block">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-koffa-green/60 w-6 h-6" />
                    <Input 
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-14 h-16 text-lg border-2 border-koffa-beige focus:border-koffa-green rounded-xl transition-colors"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-koffa-green block">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-koffa-green/60 w-6 h-6" />
                    <Input 
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-14 pr-16 h-16 text-lg border-2 border-koffa-beige focus:border-koffa-green rounded-xl transition-colors"
                      placeholder="Enter your password"
                      required
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-koffa-green/60 touch-target p-2"
                    >
                      {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                    </button>
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-koffa-green hover:bg-koffa-green-dark text-white h-16 text-lg font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl touch-target" 
                  disabled={isLoading}
                >
                  {isLoading ? "Signing In..." : "Sign In"}
                </Button>
              </form>
            </TabsContent>
            
            {/* Phone tab */}
            <TabsContent value="phone" className="space-y-0">
              <form className="space-y-5">
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-koffa-green block">Phone Number</label>
                  <Input 
                    type="tel"
                    className="h-16 text-lg border-2 border-koffa-beige focus:border-koffa-green rounded-xl transition-colors"
                    placeholder="Enter your phone number"
                  />
                </div>
                
                <Button 
                  type="button" 
                  className="w-full bg-koffa-green hover:bg-koffa-green-dark text-white h-16 text-lg font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl touch-target"
                  onClick={() => toast.info("Phone authentication coming soon")}
                >
                  Send Verification Code
                </Button>
              </form>
            </TabsContent>

            {/* Invite code tab - mobile optimized */}
            <TabsContent value="invite" className="space-y-0">
              <form onSubmit={handleInviteCode} className="space-y-5">
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-koffa-green block">Invitation Code</label>
                  <div className="relative">
                    <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-koffa-green/60 w-6 h-6" />
                    <Input 
                      type="text"
                      value={formatInviteCodeForDisplay(inviteCode)}
                      onChange={handleInviteCodeChange}
                      className="pl-14 h-16 text-lg border-2 border-koffa-beige focus:border-koffa-green font-mono tracking-wider text-center rounded-xl transition-colors"
                      placeholder="XXXX-XXXX"
                    />
                  </div>
                  <p className="text-sm text-koffa-green-dark text-center px-2">
                    Enter the 8-character code from a family member
                  </p>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-koffa-green hover:bg-koffa-green-dark text-white h-16 text-lg font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl touch-target"
                  disabled={isLoading || inviteCode.length < 1}
                >
                  {isLoading ? "Verifying..." : "Join Family"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Bottom section - mobile optimized */}
        <div className="mt-8 text-center w-full max-w-sm px-4">
          <div className="flex items-center justify-center my-6">
            <div className="border-t flex-1 border-koffa-beige"></div>
            <span className="px-4 text-sm text-koffa-green-dark font-medium">OR</span>
            <div className="border-t flex-1 border-koffa-beige"></div>
          </div>
          
          <p className="text-koffa-green-dark mb-4 text-base">New to Koffa?</p>
          <Button 
            onClick={() => navigate('/signup')}
            variant="outline" 
            className="w-full border-2 border-koffa-green text-koffa-green hover:bg-koffa-green hover:text-white h-16 text-lg font-semibold rounded-xl transition-all duration-200 touch-target"
          >
            Create New Account
          </Button>
        </div>
      </div>
      
      {/* Safe area bottom for mobile */}
      <div className="safe-area-bottom"></div>
    </div>
  );
};

export default AuthPage;
