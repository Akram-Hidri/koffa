
import React from 'react';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useIsMobile } from '@/hooks/use-mobile';
import { Calendar, User, RefreshCw } from 'lucide-react';

interface SpaceTaskProps {
  task: string;
  dueDate: string;
  assignedTo: string;
  recurrence: string;
  completed: boolean;
  onToggle: () => void;
}

const SpaceTask: React.FC<SpaceTaskProps> = ({
  task,
  dueDate,
  assignedTo,
  recurrence,
  completed,
  onToggle
}) => {
  const isMobile = useIsMobile();
  
  return (
    <Card className="mb-3 p-3 transition-all hover:shadow-sm border-l-4 border-l-transparent hover:border-l-[#586b4d]">
      <div className="flex">
        <div className="mr-3 pt-1">
          <Checkbox checked={completed} onCheckedChange={onToggle} />
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between flex-wrap">
            <h3 className={`font-medium text-sm sm:text-base ${completed ? 'line-through text-gray-400' : ''}`}>
              {task}
            </h3>
          </div>
          
          <div className={`grid ${isMobile ? 'grid-cols-1 gap-1' : 'grid-cols-3 gap-2'} mt-2`}>
            <div className="flex items-center text-xs sm:text-sm text-gray-600 dark:text-gray-300">
              <Calendar className="h-3 w-3 mr-1" />
              {dueDate}
            </div>
            <div className="flex items-center text-xs sm:text-sm text-gray-600 dark:text-gray-300">
              <User className="h-3 w-3 mr-1" />
              {assignedTo}
            </div>
            <div className="flex items-center text-xs sm:text-sm text-gray-600 dark:text-gray-300">
              <RefreshCw className="h-3 w-3 mr-1" />
              {recurrence}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SpaceTask;
