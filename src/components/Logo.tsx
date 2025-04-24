
import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className={`${sizes[size]} relative`}>
        <img 
          src="/lovable-uploads/e4692c8e-f833-46ef-a311-e75d3830d983.png"
          alt="Koffa logo" 
          className="w-full h-full object-contain"
        />
      </div>
      {size !== 'sm' && (
        <h1 className={`font-bold text-koffa-green ${size === 'lg' ? 'text-2xl' : 'text-xl'} mt-1`}>
          KOFFA
        </h1>
      )}
    </div>
  );
};

export default Logo;
