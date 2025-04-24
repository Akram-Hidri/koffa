
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Logo from '@/components/Logo';
import { toast } from 'sonner';

const SignupPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match");
      setIsLoading(false);
      return;
    }
    
    // Simulate signup (would connect to backend in real app)
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Account created successfully!");
      navigate('/home');
    }, 1500);
  };
  
  return (
    <div className="min-h-screen bg-koffa-beige-light flex flex-col">
      {/* Header with date */}
      <div className="bg-koffa-green text-white p-4 text-center">
        <p className="text-sm font-medium">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>
      
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
            onClick={() => navigate('/')}
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
