import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Logo from '@/components/Logo';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const CreateFamilyPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [familyName, setFamilyName] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!familyName.trim()) {
      toast.error("Please enter a family name");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Create a new family using the families table
      if (!user) {
        toast.error("You must be logged in to create a family");
        navigate('/auth');
        return;
      }
      
      const { data, error } = await supabase
        .from('families')
        .insert({
          name: familyName,
          created_by: user.id
        })
        .select();
      
      if (error) throw error;
      
      toast.success("Family created successfully!");
      navigate('/home');
    } catch (error: any) {
      toast.error(error.message || "Failed to create family");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-koffa-beige-light flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        <div className="mb-6 text-center">
          <Logo size="md" />
          <h2 className="text-2xl font-semibold text-koffa-green mt-4">Create your family</h2>
          <p className="text-koffa-green-dark mt-1">Set up your Koffa family space</p>
        </div>
        
        <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-koffa-green">Family Name</label>
              <Input 
                value={familyName}
                onChange={(e) => setFamilyName(e.target.value)}
                className="border-koffa-beige focus-visible:ring-koffa-green"
                placeholder="Your family name"
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-koffa-green hover:bg-koffa-green-dark text-white mt-4" 
              disabled={isLoading}
            >
              {isLoading ? "Creating Family..." : "Create Family"}
            </Button>
          </form>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-koffa-green-dark">Want to join an existing family?</p>
          <Button 
            onClick={() => navigate('/auth', { state: { defaultTab: 'invite' } })}
            variant="link" 
            className="text-koffa-green hover:text-koffa-accent-blue"
          >
            Enter Invitation Code
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateFamilyPage;
