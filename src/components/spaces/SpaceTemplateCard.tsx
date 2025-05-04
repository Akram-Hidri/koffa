
import React from 'react';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { cn } from '@/lib/utils';

interface SpaceTemplateCardProps {
  name: string;
  icon: string;
  color: string;
  taskCount: number;
  onClick: () => void;
}

const SpaceTemplateCard: React.FC<SpaceTemplateCardProps> = ({
  name,
  icon,
  color,
  taskCount,
  onClick
}) => {
  return (
    <Card 
      className="p-4 flex flex-col items-center justify-center text-center h-32 cursor-pointer hover:shadow-md transition-shadow border-t-4"
      onClick={onClick}
      style={{ borderTopColor: color }}
    >
      <div 
        className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center mb-2",
          "bg-opacity-20"
        )}
        style={{ backgroundColor: `${color}30` }}
      >
        <Icon 
          name={icon}
          className="h-5 w-5"
          style={{ color }}
        />
      </div>
      
      <h3 className="font-semibold text-sm">{name}</h3>
      <p className="text-xs text-gray-500 mt-1">{taskCount} predefined tasks</p>
    </Card>
  );
};

export default SpaceTemplateCard;
