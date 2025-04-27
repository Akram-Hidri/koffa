
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface NotificationItemProps {
  title: string;
  time: string;
  isNew?: boolean;
  additionalAction?: string;
  onView: () => void;
  onDismiss: () => void;
  onAdditionalAction?: () => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  title,
  time,
  isNew = false,
  additionalAction,
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
            <Button variant="outline" size="sm" onClick={onAdditionalAction}>
              {additionalAction}
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={onView}>
            View
          </Button>
          <Button variant="ghost" size="sm" onClick={onDismiss}>
            Dismiss
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default NotificationItem;
