
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MobileButton } from '@/components/ui/mobile-button';
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
      navigate('/home');
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
    <div className="min-h-screen bg-gradient-to-br from-bring-green/10 via-white to-bring-blue/10 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center mobile-container py-8">
        <div className="mb-8 text-center">
          <Logo size="lg" />
          <h2 className="text-3xl font-bold bg-gradient-to-r from-bring-green to-bring-blue bg-clip-text text-transparent mt-6">
            Welcome to Koffa
          </h2>
          <p className="text-lg text-gray-600 mt-2">Your family grocery companion</p>
        </div>

        <div className="w-full max-w-md bg-white/90 backdrop-blur-sm rounded-3xl shadow-mobile-lg p-6 border border-white/20">
          <Tabs defaultValue={defaultTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-6 h-auto bg-gray-100 rounded-2xl p-1">
              <TabsTrigger 
                value="email" 
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm font-semibold rounded-xl py-3"
              >
                Email
              </TabsTrigger>
              <TabsTrigger 
                value="phone"
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm font-semibold rounded-xl py-3"
              >
                Phone
              </TabsTrigger>
              <TabsTrigger 
                value="invite"
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm font-semibold rounded-xl py-3"
              >
                Invite
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="email">
              <form onSubmit={handleSignIn} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Email</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                      <Mail size={20} />
                    </span>
                    <Input 
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-12 h-14 text-base rounded-2xl border-gray-200 focus:border-bring-green focus:ring-bring-green bg-white"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Password</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                      <Lock size={20} />
                    </span>
                    <Input 
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-12 pr-12 h-14 text-base rounded-2xl border-gray-200 focus:border-bring-green focus:ring-bring-green bg-white"
                      placeholder="Enter your password"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 mobile-touch"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
                
                <MobileButton 
                  type="submit" 
                  className="w-full h-14 text-lg font-bold"
                  disabled={isLoading}
                  variant="success"
                >
                  {isLoading ? "Signing in..." : "Log In"}
                </MobileButton>
              </form>
            </TabsContent>
            
            <TabsContent value="phone">
              <form className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Phone</label>
                  <Input 
                    type="tel"
                    className="h-14 text-base rounded-2xl border-gray-200 focus:border-bring-blue focus:ring-bring-blue bg-white"
                    placeholder="Enter your phone number"
                  />
                </div>
                
                <MobileButton 
                  type="button" 
                  className="w-full h-14 text-lg font-bold"
                  variant="info"
                  onClick={() => toast.info("Phone authentication coming soon")}
                >
                  Send Code
                </MobileButton>
              </form>
            </TabsContent>

            <TabsContent value="invite">
              <form onSubmit={handleInviteCode} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Invitation Code</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                      <Package size={20} />
                    </span>
                    <Input 
                      type="text"
                      value={formatInviteCodeForDisplay(inviteCode)}
                      onChange={handleInviteCodeChange}
                      className="pl-12 h-14 text-base rounded-2xl border-gray-200 focus:border-bring-purple focus:ring-bring-purple font-mono tracking-wider text-center bg-white"
                      placeholder="XXXX-XXXX"
                    />
                  </div>
                  <p className="text-xs text-gray-500 text-center">
                    Enter the 8-character invitation code from a family member
                  </p>
                </div>
                
                <MobileButton 
                  type="submit" 
                  className="w-full h-14 text-lg font-bold"
                  disabled={isLoading || inviteCode.length < 1}
                  variant="default"
                >
                  {isLoading ? "Verifying..." : "Join Family"}
                </MobileButton>
              </form>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="mt-8 text-center w-full max-w-md">
          <div className="flex items-center justify-center my-6">
            <div className="border-t flex-1 border-gray-200"></div>
            <span className="px-4 text-sm text-gray-500 font-medium">OR</span>
            <div className="border-t flex-1 border-gray-200"></div>
          </div>
          
          <p className="text-gray-600 mb-4 text-lg font-medium">New to Koffa?</p>
          <MobileButton 
            onClick={() => navigate('/signup')}
            variant="outline" 
            className="w-full h-14 text-lg font-bold bg-white/90 border-2 border-gray-200 text-gray-700 hover:bg-gray-50"
          >
            Create Account
          </MobileButton>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
