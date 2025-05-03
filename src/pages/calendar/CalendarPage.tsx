
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Bell, 
  Settings, 
  Calendar as CalendarIcon, 
  PlusCircle, 
  Filter,
  Loader2 
} from 'lucide-react';
import Logo from '@/components/Logo';
import PageNavigation from '@/components/PageNavigation';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import MonthCalendar from '@/components/calendar/MonthCalendar';
import EventSuggestionCard from '@/components/calendar/EventSuggestionCard';
import EventCard from '@/components/calendar/EventCard';
import EventDialog from '@/components/calendar/EventDialog';
import useCalendarEvents, { CalendarEvent, NewCalendarEvent } from '@/hooks/useCalendarEvents';
import { EVENT_SUGGESTIONS, CATEGORY_OPTIONS } from '@/utils/calendarUtils';

const CalendarPage = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'list'>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [filter, setFilter] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | undefined>(undefined);
  
  const { 
    events, 
    isLoading, 
    createEvent, 
    updateEvent, 
    deleteEvent, 
    familyId 
  } = useCalendarEvents();
  
  // Event handlers
  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsDialogOpen(true);
  };
  
  const handleDayClick = (date: Date) => {
    // Create event on the selected day
    setSelectedEvent(undefined);
    setCurrentDate(date);
    setIsDialogOpen(true);
  };
  
  const handleAddClick = () => {
    setSelectedEvent(undefined);
    setIsDialogOpen(true);
  };
  
  const handleEventSave = async (eventData: NewCalendarEvent) => {
    if (selectedEvent) {
      return updateEvent({
        ...selectedEvent,
        ...eventData
      } as CalendarEvent);
    } else {
      return createEvent(eventData);
    }
  };

  const handleSuggestionSelect = (category: string) => {
    setSelectedEvent(undefined);
    setIsDialogOpen(true);
    // The category will be pre-selected in the dialog
    const selectedCategory = CATEGORY_OPTIONS.find(opt => opt.value === category);
    if (selectedCategory) {
      toast.info(`Creating a new ${selectedCategory.label} event`);
    }
  };
  
  // Filter events for upcoming
  const upcomingEvents = events
    .filter(event => new Date(event.start_time) >= new Date())
    .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
    .slice(0, 4);
  
  return (
    <div className="min-h-screen bg-koffa-beige-light pb-24">
      {/* Header */}
      <div className="bg-koffa-beige-light p-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            className="p-2 h-auto w-auto"
            onClick={() => navigate('/home')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-koffa-green">
              <path d="m15 18-6-6 6-6"/>
            </svg>
          </Button>
          <Logo size="sm" />
        </div>
        
        <h1 className="text-xl font-semibold text-koffa-green">Family Calendar</h1>
        
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            className="rounded-full p-2 h-auto w-auto"
            onClick={() => navigate('/notifications')}
          >
            <Bell size={20} className="text-koffa-green" />
          </Button>
          <Button 
            variant="ghost" 
            className="rounded-full p-2 h-auto w-auto"
            onClick={() => navigate('/settings')}
          >
            <Settings size={20} className="text-koffa-green" />
          </Button>
        </div>
      </div>

      {/* View selector */}
      <div className="flex border-b border-koffa-beige/40 overflow-x-auto hide-scrollbar">
        <Button 
          variant={viewMode === 'month' ? 'default' : 'ghost'}
          className={viewMode === 'month' ? 'bg-koffa-green text-white' : 'text-koffa-green-dark whitespace-nowrap'}
          onClick={() => setViewMode('month')}
        >
          <CalendarIcon className="mr-2 h-4 w-4" /> Month
        </Button>
        <Button 
          variant={viewMode === 'week' ? 'default' : 'ghost'}
          className={viewMode === 'week' ? 'bg-koffa-green text-white' : 'text-koffa-green-dark whitespace-nowrap'}
          onClick={() => {
            setViewMode('week');
            toast.info('Week view coming soon');
          }}
        >
          <CalendarIcon className="mr-2 h-4 w-4" /> Week
        </Button>
        <Button 
          variant={viewMode === 'list' ? 'default' : 'ghost'}
          className={viewMode === 'list' ? 'bg-koffa-green text-white' : 'text-koffa-green-dark whitespace-nowrap'}
          onClick={() => {
            setViewMode('list');
            toast.info('List view coming soon');
          }}
        >
          <CalendarIcon className="mr-2 h-4 w-4" /> List
        </Button>
        
        <div className="ml-auto pr-4 flex items-center">
          <div className="flex items-center gap-2 mr-2">
            <Filter size={16} className="text-koffa-green" />
            <Select
              value={filter}
              onValueChange={setFilter}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {CATEGORY_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button
            className="bg-koffa-green text-white"
            size="sm"
            onClick={handleAddClick}
          >
            <PlusCircle className="mr-1 h-4 w-4" /> Add Event
          </Button>
        </div>
      </div>

      <div className="container mx-auto p-4">
        {/* Calendar */}
        <div className="mb-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-koffa-green" />
            </div>
          ) : (
            <MonthCalendar
              events={events}
              currentDate={currentDate}
              onDateChange={setCurrentDate}
              onEventClick={handleEventClick}
              onDayClick={handleDayClick}
              onAddClick={handleAddClick}
              filterCategory={filter !== 'all' ? filter : undefined}
            />
          )}
        </div>
        
        {/* Upcoming events */}
        <Card className="mb-8 border-koffa-beige/30 p-4">
          <h3 className="text-lg font-medium text-koffa-green mb-3">Upcoming Events</h3>
          {upcomingEvents.length > 0 ? (
            <div className="space-y-2">
              {upcomingEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onClick={() => handleEventClick(event)}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No upcoming events</p>
          )}
          
          <div className="flex justify-end mt-3">
            <Button 
              variant="link" 
              className="text-koffa-accent-blue p-0"
              onClick={handleAddClick}
            >
              Add New Event
            </Button>
          </div>
        </Card>
        
        {/* Event suggestions */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-koffa-green mb-3">Suggested Events</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {EVENT_SUGGESTIONS.map((suggestion, index) => (
              <EventSuggestionCard
                key={index}
                title={suggestion.title}
                description={suggestion.description}
                icon={suggestion.icon}
                category={suggestion.category}
                onSelect={handleSuggestionSelect}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Event dialog */}
      <EventDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleEventSave}
        onDelete={deleteEvent}
        event={selectedEvent}
        familyId={familyId}
      />
      
      <PageNavigation />
    </div>
  );
};

export default CalendarPage;
