import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

const AuthPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate authentication (would connect to backend in real app)
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Successfully signed in!");
      navigate('/home');
    }, 1500);
  };
  
  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate account creation (would connect to backend in real app)
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Account created successfully!");
      navigate('/home');
    }, 1500);
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
          <Tabs defaultValue="email" className="w-full">
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
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="20" height="16" x="2" y="4" rx="2" />
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                      </svg>
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
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
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
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                          <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                          <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                          <line x1="2" x2="22" y1="2" y2="22" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-koffa-green hover:bg-koffa-green-dark text-white" 
                  disabled={isLoading}
                >
                  {isLoading ? "Loading..." : "Log In"}
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
                >
                  Send Code
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="invite">
              <form className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-koffa-green">Invitation Code</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 8v13H3V8" />
                        <path d="M1 3h22v5H1z" />
                        <path d="M10 12h4" />
                      </svg>
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
                  type="button" 
                  className="w-full bg-koffa-green hover:bg-koffa-green-dark text-white"
                  onClick={() => {
                    toast.info("This feature requires backend integration. Please connect to Supabase first.");
                  }}
                >
                  Join Family
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
