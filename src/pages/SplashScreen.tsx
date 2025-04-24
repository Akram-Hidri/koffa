
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '@/components/Logo';

const SplashScreen = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Navigate to auth page after a delay
    const timer = setTimeout(() => {
      navigate('/auth');
    }, 2500);
    
    return () => clearTimeout(timer);
  }, [navigate]);
  
  return (
    <div className="min-h-screen bg-koffa-green flex flex-col items-center justify-center">
      <div className="animate-fade-in text-center">
        <Logo size="lg" className="text-white" />
        <p className="text-koffa-beige-light mt-6 text-xl">
          Family Grocery Simplified
        </p>
      </div>
    </div>
  );
};

export default SplashScreen;
