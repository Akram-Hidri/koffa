
import { useState, useEffect } from "react";
import { CalendarEvent } from "@/hooks/useCalendarEvents";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek } from "date-fns";
import { getEventColor } from "@/utils/calendarUtils";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MonthCalendarProps {
  events: CalendarEvent[];
  currentDate: Date;
  onDateChange: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
  onDayClick: (date: Date) => void;
  onAddClick: () => void;
  filterCategory?: string;
}

export default function MonthCalendar({
  events,
  currentDate,
  onDateChange,
  onEventClick,
  onDayClick,
  onAddClick,
  filterCategory
}: MonthCalendarProps) {
  const [calendarDays, setCalendarDays] = useState<Date[]>([]);
  
  // Calculate days for the calendar grid
  useEffect(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calStart = startOfWeek(monthStart);
    const calEnd = endOfWeek(monthEnd);
    
    const allDays = eachDayOfInterval({
      start: calStart,
      end: calEnd
    });
    
    setCalendarDays(allDays);
  }, [currentDate]);
  
  const nextMonth = () => onDateChange(addMonths(currentDate, 1));
  const prevMonth = () => onDateChange(subMonths(currentDate, 1));
  
  const getEventsForDay = (day: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.start_time);
      return isSameDay(eventDate, day) && 
        (!filterCategory || event.category === filterCategory);
    });
  };
  
  return (
    <div className="w-full">
      {/* Month navigation */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={prevMonth} className="h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-lg font-medium px-2">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <Button variant="ghost" size="icon" onClick={nextMonth} className="h-8 w-8">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <Button 
          size="sm" 
          onClick={onAddClick}
          className="bg-koffa-green hover:bg-koffa-green/90 text-white"
        >
          Add Event
        </Button>
      </div>
      
      {/* Day headers */}
      <div className="grid grid-cols-7 text-center font-medium mb-2">
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>
      
      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1 auto-rows-fr">
        {calendarDays.map((day, index) => {
          const isCurrentMonth = isSameMonth(day, currentDate);
          const dayEvents = getEventsForDay(day);
          
          return (
            <div
              key={index}
              className={`border rounded-md p-1 min-h-[90px] ${
                isCurrentMonth ? 'bg-white' : 'bg-gray-50'
              } hover:bg-gray-50 cursor-pointer transition`}
              onClick={() => onDayClick(day)}
            >
              <div className={`text-right ${isCurrentMonth ? 'font-medium' : 'text-gray-400'}`}>
                {format(day, 'd')}
              </div>
              
              <div className="mt-1 space-y-1 overflow-hidden max-h-[70px]">
                {dayEvents.slice(0, 3).map((event) => (
                  <div
                    key={event.id}
                    className={`text-xs p-1 rounded truncate ${getEventColor(event.category)}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick(event);
                    }}
                  >
                    {event.title}
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <div className="text-xs text-center text-gray-500">
                    +{dayEvents.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
