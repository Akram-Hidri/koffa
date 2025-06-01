
import React from 'react';

interface AvatarFallbackProps {
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const AvatarFallback: React.FC<AvatarFallbackProps> = ({ 
  name, 
  size = 'md', 
  className = '' 
}) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl'
  };

  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-yellow-500',
    'bg-red-500',
    'bg-gray-500'
  ];

  // Generate consistent color based on name
  const colorIndex = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
  const bgColor = colors[colorIndex];

  return (
    <div 
      className={`
        ${sizeClasses[size]} 
        ${bgColor} 
        rounded-full 
        flex 
        items-center 
        justify-center 
        text-white 
        font-semibold 
        ${className}
      `}
    >
      {getInitials(name)}
    </div>
  );
};

export default AvatarFallback;
