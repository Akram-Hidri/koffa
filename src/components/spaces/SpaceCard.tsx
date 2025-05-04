
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/ui/icon';
import { cn } from '@/lib/utils';

interface SpaceCardProps {
  id: string;
  name: string;
  icon?: string;
  color?: string;
  tasksCount?: number;
  allTasksDone?: boolean;
  type?: string;
  onClick?: () => void;
}

const SpaceCard: React.FC<SpaceCardProps> = ({ 
  id, 
  name, 
  icon = 'layout-grid',
  color = '#586b4d',
  tasksCount,
  allTasksDone,
  type,
  onClick 
}) => {
  return (
    <Card 
      className="p-4 flex flex-col items-center justify-center cursor-pointer hover:shadow-md transition-shadow border-t-4"
      onClick={onClick}
      style={{ borderTopColor: color }}
    >
      <div 
        className={cn(
          "w-14 h-14 rounded-full flex items-center justify-center mb-3",
          "bg-opacity-20"
        )}
        style={{ backgroundColor: `${color}30` }}
      >
        <Icon 
          name={icon}
          className="h-7 w-7"
          style={{ color }}
        />
      </div>
      
      <h3 className="font-semibold text-center">{name}</h3>
      
      {type && (
        <Badge variant="outline" className="mt-2 text-xs">
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </Badge>
      )}
      
      {(tasksCount !== undefined || allTasksDone !== undefined) && (
        <div className="mt-3">
          {allTasksDone ? (
            <Badge variant="outline" className="text-green-600 dark:text-green-400 border-green-200">
              All tasks done
            </Badge>
          ) : tasksCount && tasksCount > 0 ? (
            <Badge variant="outline" className="text-amber-600 dark:text-amber-400 border-amber-200">
              {tasksCount} task{tasksCount > 1 ? 's' : ''} pending
            </Badge>
          ) : (
            <Badge variant="outline" className="text-gray-500 border-gray-200">
              No tasks
            </Badge>
          )}
        </div>
      )}
    </Card>
  );
};

export default SpaceCard;
