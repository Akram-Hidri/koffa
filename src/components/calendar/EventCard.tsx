
import { Card } from "@/components/ui/card";
import { CalendarEvent } from "@/hooks/useCalendarEvents";
import { getEventColor, formatEventDate } from "@/utils/calendarUtils";
import { format } from "date-fns";

interface EventCardProps {
  event: CalendarEvent;
  onClick?: () => void;
  className?: string;
  compact?: boolean;
}

export default function EventCard({ event, onClick, className = "", compact = false }: EventCardProps) {
  const colorClasses = getEventColor(event.category);
  
  return (
    <Card 
      className={`border-l-4 ${colorClasses} cursor-pointer hover:shadow-md transition-shadow mb-2 ${className}`}
      onClick={onClick}
    >
      <div className="p-3">
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-sm sm:text-base line-clamp-1">{event.title}</h3>
          {event.category && (
            <span className={`text-xs px-2 py-0.5 rounded-full ${colorClasses} capitalize`}>
              {event.category}
            </span>
          )}
        </div>
        
        <div className="text-xs text-gray-500 mt-1">
          {formatEventDate(event.start_time, event.end_time || undefined, event.all_day || false)}
        </div>
        
        {!compact && event.location && (
          <div className="text-xs mt-1">
            📍 {event.location}
          </div>
        )}
        
        {!compact && event.assigned_to && (
          <div className="text-xs mt-1">
            👤 {event.assigned_to}
          </div>
        )}
      </div>
    </Card>
  );
}
