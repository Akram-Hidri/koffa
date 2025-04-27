
import React from 'react';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';

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
  return (
    <Card className="mb-4 p-4 shadow-sm">
      <div className="flex">
        <div className="mr-3 pt-1">
          <Checkbox checked={completed} onCheckedChange={onToggle} />
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between">
            <h3 className={`font-medium ${completed ? 'line-through text-gray-400' : ''}`}>
              {task}
            </h3>
            <p className="text-sm text-amber-600 dark:text-amber-400">Due: {dueDate}</p>
          </div>
          
          <div className="flex justify-between mt-2">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Assigned to: {assignedTo}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Recurrence: {recurrence}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SpaceTask;
