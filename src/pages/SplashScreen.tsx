
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '@/components/Logo';

const SplashScreen = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/auth');
    }, 2500);
    
    return () => clearTimeout(timer);
  }, [navigate]);
  
  return (
    <div className="min-h-screen bg-koffa-beige-light flex flex-col items-center justify-center">
      <div className="animate-fade-in text-center">
        <Logo size="xl" />
        <p className="text-koffa-green mt-6 text-xl font-medium">
          Family Grocery Simplified
        </p>
      </div>
    </div>
  );
};

export default SplashScreen;
