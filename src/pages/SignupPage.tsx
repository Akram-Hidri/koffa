
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';
import SignupForm from '@/components/auth/SignupForm';

const SignupPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const inviteCode = location.state?.inviteCode || '';
  
  return (
    <div className="min-h-screen bg-koffa-beige-light flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        <div className="mb-6 text-center">
          <Logo size="md" />
          <h2 className="text-2xl font-semibold text-koffa-green mt-4">Create your account</h2>
          <p className="text-koffa-green-dark mt-1">Join the Koffa family</p>
        </div>
        
        <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6">
          <SignupForm initialInviteCode={inviteCode} />
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
