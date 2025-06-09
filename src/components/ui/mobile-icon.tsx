
import React from 'react';
import { cn } from '@/lib/utils';

interface MobileIconProps {
  icon: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  background?: boolean;
  className?: string;
  onClick?: () => void;
}

const MobileIcon: React.FC<MobileIconProps> = ({
  icon,
  size = 'md',
  color,
  background = false,
  className,
  onClick
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 p-1',
    md: 'w-12 h-12 p-2',
    lg: 'w-16 h-16 p-3',
    xl: 'w-20 h-20 p-4'
  };

  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
    xl: 'w-12 h-12'
  };

  return (
    <div
      className={cn(
        'flex items-center justify-center touch-target transition-all duration-200',
        sizeClasses[size],
        background && 'rounded-2xl shadow-lg',
        onClick && 'cursor-pointer hover:scale-110 active:scale-95',
        className
      )}
      style={{
        backgroundColor: background ? `${color}20` : undefined,
        color: color || 'currentColor'
      }}
      onClick={onClick}
    >
      <div className={iconSizes[size]}>
        {icon}
      </div>
    </div>
  );
};

export default MobileIcon;
