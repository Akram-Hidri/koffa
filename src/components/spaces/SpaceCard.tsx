
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
  onClick?: () => void;
}

const SpaceCard: React.FC<SpaceCardProps> = ({ 
  id, 
  name, 
  icon = 'layout-grid',
  color = '#586b4d',
  tasksCount,
  allTasksDone,
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
          "w-12 h-12 rounded-full flex items-center justify-center mb-2",
          "bg-opacity-20"
        )}
        style={{ backgroundColor: `${color}30` }}
      >
        <Icon 
          name={icon}
          className="h-6 w-6"
          style={{ color }}
        />
      </div>
      
      <h3 className="font-semibold">{name}</h3>
      
      {(tasksCount !== undefined || allTasksDone !== undefined) && (
        <div className="mt-2">
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
