
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MobileButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  children: React.ReactNode;
}

const MobileButton: React.FC<MobileButtonProps> = ({
  variant = 'default',
  size = 'md',
  icon,
  iconPosition = 'left',
  fullWidth = false,
  children,
  className,
  ...props
}) => {
  const sizeClasses = {
    sm: 'h-12 text-sm px-4',
    md: 'h-16 text-lg px-6',
    lg: 'h-20 text-xl px-8'
  };

  return (
    <Button
      variant={variant}
      className={cn(
        'touch-target font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl',
        sizeClasses[size],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {icon && iconPosition === 'left' && (
        <span className="mr-2">{icon}</span>
      )}
      {children}
      {icon && iconPosition === 'right' && (
        <span className="ml-2">{icon}</span>
      )}
    </Button>
  );
};

export default MobileButton;
