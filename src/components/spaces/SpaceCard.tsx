
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SpaceCardProps {
  id: string;
  name: string;
  tasksCount: number;
  allTasksDone: boolean;
}

const SpaceCard: React.FC<SpaceCardProps> = ({ id, name, tasksCount, allTasksDone }) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/spaces/${id}`);
  };
  
  return (
    <Card 
      className="p-4 flex flex-col items-center justify-center text-center h-32 cursor-pointer hover:shadow-md transition-shadow"
      onClick={handleClick}
    >
      <h3 className="font-semibold">{name}</h3>
      
      <div className="mt-4">
        {allTasksDone ? (
          <Badge variant="outline" className="text-green-600 dark:text-green-400 border-green-200">
            All tasks done
          </Badge>
        ) : tasksCount > 0 ? (
          <Badge variant="outline" className="text-amber-600 dark:text-amber-400 border-amber-200">
            {tasksCount} task{tasksCount > 1 ? 's' : ''} pending
          </Badge>
        ) : (
          <Badge variant="outline" className="text-gray-500 border-gray-200">
            No tasks
          </Badge>
        )}
      </div>
    </Card>
  );
};

export default SpaceCard;
