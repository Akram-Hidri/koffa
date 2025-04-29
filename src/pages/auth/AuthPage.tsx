import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Eye, EyeOff, Mail, Lock, Package } from 'lucide-react';

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
      
      // Check if the invite code is valid using our database function
      const { data, error } = await supabase
        .rpc('is_valid_invite_code', { code_param: inviteCode.trim() });
        
      if (error) throw error;
      
      if (!data) {
        throw new Error("Invalid or expired invitation code");
      }
      
      toast.success("Invitation code accepted!");
      navigate('/signup', { state: { inviteCode: inviteCode.trim() } });
    } catch (error: any) {
      toast.error(error.message || "Invalid invitation code");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-koffa-beige-light flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="mb-8 text-center">
          <Logo size="lg" />
          <h2 className="text-2xl font-semibold text-koffa-green mt-6">Welcome to Koffa</h2>
          <p className="text-koffa-green-dark mt-1">Your family grocery companion</p>
        </div>

        <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6">
          <Tabs defaultValue={defaultTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger 
                value="email" 
                className="data-[state=active]:bg-koffa-green data-[state=active]:text-white"
              >
                Email
              </TabsTrigger>
              <TabsTrigger 
                value="phone"
                className="data-[state=active]:bg-koffa-green data-[state=active]:text-white"
              >
                Phone
              </TabsTrigger>
              <TabsTrigger 
                value="invite"
                className="data-[state=active]:bg-koffa-green data-[state=active]:text-white"
              >
                Invite Code
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="email">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-koffa-green">Email</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      <Mail size={18} />
                    </span>
                    <Input 
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 border-koffa-beige focus-visible:ring-koffa-green"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-koffa-green">Password</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      <Lock size={18} />
                    </span>
                    <Input 
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 border-koffa-beige focus-visible:ring-koffa-green"
                      placeholder="Enter your password"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-koffa-green hover:bg-koffa-green-dark text-white" 
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Log In"}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="phone">
              <form className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-koffa-green">Phone</label>
                  <Input 
                    type="tel"
                    className="border-koffa-beige focus-visible:ring-koffa-green"
                    placeholder="Enter your phone number"
                  />
                </div>
                
                <Button 
                  type="button" 
                  className="w-full bg-koffa-green hover:bg-koffa-green-dark text-white"
                  onClick={() => toast.info("Phone authentication coming soon")}
                >
                  Send Code
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="invite">
              <form onSubmit={handleInviteCode} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-koffa-green">Invitation Code</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      <Package size={18} />
                    </span>
                    <Input 
                      type="text"
                      value={inviteCode}
                      onChange={(e) => setInviteCode(e.target.value)}
                      className="pl-10 border-koffa-beige focus-visible:ring-koffa-green"
                      placeholder="Enter your invitation code"
                    />
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-koffa-green hover:bg-koffa-green-dark text-white"
                  disabled={isLoading}
                >
                  {isLoading ? "Verifying..." : "Join Family"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center my-4">
            <div className="border-t flex-1 border-koffa-beige"></div>
            <span className="px-4 text-sm text-koffa-green-dark">OR</span>
            <div className="border-t flex-1 border-koffa-beige"></div>
          </div>
          
          <p className="text-koffa-green-dark mb-2">New to Koffa?</p>
          <Button 
            onClick={() => navigate('/signup')}
            variant="outline" 
            className="w-full max-w-md border-koffa-green text-koffa-green hover:bg-koffa-beige-light"
          >
            Create Account
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
