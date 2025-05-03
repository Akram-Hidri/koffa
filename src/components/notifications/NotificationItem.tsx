
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface NotificationItemProps {
  id: string;
  title: string;
  time: string;
  isNew?: boolean;
  additionalAction?: string;
  type: string;
  onView: (id: string, type: string) => void;
  onDismiss: (id: string) => void;
  onAdditionalAction?: (id: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  id,
  title,
  time,
  isNew = false,
  additionalAction,
  type,
  onView,
  onDismiss,
  onAdditionalAction
}) => {
  return (
    <Card className="mb-4 p-4 shadow-sm">
      <div className="flex flex-col">
        <div className="flex items-start">
          {isNew && (
            <span className="inline-block bg-red-500 text-white text-xs px-2 py-0.5 rounded mr-2">
              NEW
            </span>
          )}
          <h3 className="font-medium flex-1">{title}</h3>
        </div>
        
        <div className="text-xs text-gray-500 mt-1 mb-3">
          {time}
        </div>
        
        <div className="flex justify-end space-x-2">
          {additionalAction && (
            <Button variant="outline" size="sm" onClick={() => onAdditionalAction && onAdditionalAction(id)}>
              {additionalAction}
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={() => onView(id, type)}>
            View
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDismiss(id)}>
            Dismiss
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default NotificationItem;
