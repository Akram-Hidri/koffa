
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';
import SignupForm from '@/components/auth/SignupForm';
import { ArrowLeft } from 'lucide-react';

const SignupPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const inviteCode = location.state?.inviteCode || '';
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-koffa-beige-light via-white to-koffa-beige flex flex-col">
      {/* Mobile-optimized header */}
      <div className="safe-area-top"></div>
      
      {/* Back button */}
      <div className="p-4">
        <Button
          onClick={() => navigate('/auth')}
          variant="ghost"
          className="touch-target text-koffa-green hover:bg-koffa-beige-light rounded-xl"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Sign In
        </Button>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-6">
        {/* Logo section */}
        <div className="mb-8 text-center animate-fade-in">
          <Logo size="md" />
          <h1 className="text-2xl sm:text-3xl font-bold text-koffa-green mt-4 mb-2">
            Create Your Account
          </h1>
          <p className="text-base sm:text-lg text-koffa-green-dark px-4">
            Join the Koffa family today
          </p>
        </div>
        
        {/* Main form card */}
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl border border-koffa-beige p-6 sm:p-8 mx-4">
          <SignupForm initialInviteCode={inviteCode} />
        </div>
        
        {/* Bottom section */}
        <div className="mt-8 text-center">
          <p className="text-koffa-green-dark mb-3">Already have an account?</p>
          <Button 
            onClick={() => navigate('/auth')}
            variant="link" 
            className="text-koffa-green hover:text-koffa-green-dark font-semibold touch-target"
          >
            Sign In Here
          </Button>
        </div>
      </div>
      
      {/* Safe area bottom */}
      <div className="safe-area-bottom"></div>
    </div>
  );
};

export default SignupPage;
