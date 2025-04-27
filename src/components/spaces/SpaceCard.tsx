
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';

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
      
      <div className="mt-4 text-sm">
        {allTasksDone ? (
          <span className="text-green-600 dark:text-green-400">All tasks done</span>
        ) : tasksCount > 0 ? (
          <span className="text-amber-600 dark:text-amber-400">
            {tasksCount} task{tasksCount > 1 ? 's' : ''} pending
          </span>
        ) : (
          <span className="text-gray-500">No tasks</span>
        )}
      </div>
    </Card>
  );
};

export default SpaceCard;
