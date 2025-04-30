
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Bell, Settings, Calendar as CalendarIcon, PlusCircle, Filter } from 'lucide-react';
import Logo from '@/components/Logo';
import PageNavigation from '@/components/PageNavigation';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const CalendarPage = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'list'>('month');
  const [currentMonth, setCurrentMonth] = useState('April 2025');
  const [filter, setFilter] = useState('all');
  
  // Mock data for calendar cells
  const days = Array.from({ length: 35 }, (_, i) => {
    const day = i - 2; // Offset to start from March 30
    if (day <= 0) return { day: day + 31, isCurrentMonth: false };
    if (day > 30) return { day: day - 30, isCurrentMonth: false };
    return { day, isCurrentMonth: true };
  });
  
  // Mock events
  const events = [
    { day: 4, type: 'prayer', label: 'Fri Pray', color: 'bg-amber-100 text-amber-700' },
    { day: 9, type: 'shopping', label: 'Shopping', color: 'bg-blue-100 text-blue-700' },
    { day: 11, type: 'prayer', label: 'Fri Pray', color: 'bg-amber-100 text-amber-700' },
    { day: 12, type: 'cleaning', label: 'Deep Clean', color: 'bg-green-100 text-green-700' },
    { day: 18, type: 'prayer', label: 'Fri Pray', color: 'bg-amber-100 text-amber-700' },
    { day: 21, type: 'appointment', label: 'Doc Appt', color: 'bg-red-100 text-red-700' },
    { day: 25, type: 'prayer', label: 'Fri Pray', color: 'bg-amber-100 text-amber-700' },
    { day: 26, type: 'family', label: 'Fam Dinr', color: 'bg-purple-100 text-purple-700' },
  ];
  
  // Upcoming events
  const upcomingEvents = [
    { day: 'Tomorrow', label: 'Weekly Shopping', assignedTo: 'Driver' },
    { day: 'Apr 12', label: 'Monthly Deep Clean', assignedTo: 'All Family' },
    { day: 'Apr 21', label: 'Doctor Appointment', assignedTo: 'Father' },
    { day: 'Apr 26', label: 'Family Dinner', assignedTo: 'All Family + Guests' },
  ];

  const getEventForDay = (day: number) => {
    return events.find(e => e.day === day);
  };

  const previousMonth = () => {
    setCurrentMonth('March 2025');
    toast.info('Calendar navigation between months coming soon');
  };

  const nextMonth = () => {
    setCurrentMonth('May 2025');
    toast.info('Calendar navigation between months coming soon');
  };
  
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
            <ArrowLeft size={20} className="text-koffa-green" />
          </Button>
          <Logo size="sm" />
        </div>
        
        <h1 className="text-xl font-semibold text-koffa-green">Family Calendar</h1>
        
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            className="rounded-full p-2 h-auto w-auto"
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
      <div className="flex border-b border-koffa-beige/40">
        <Button 
          variant={viewMode === 'month' ? 'default' : 'ghost'}
          className={viewMode === 'month' ? 'bg-koffa-green text-white' : 'text-koffa-green-dark'}
          onClick={() => setViewMode('month')}
        >
          <CalendarIcon className="mr-2 h-4 w-4" /> Month
        </Button>
        <Button 
          variant={viewMode === 'week' ? 'default' : 'ghost'}
          className={viewMode === 'week' ? 'bg-koffa-green text-white' : 'text-koffa-green-dark'}
          onClick={() => setViewMode('week')}
        >
          <CalendarIcon className="mr-2 h-4 w-4" /> Week
        </Button>
        <Button 
          variant={viewMode === 'list' ? 'default' : 'ghost'}
          className={viewMode === 'list' ? 'bg-koffa-green text-white' : 'text-koffa-green-dark'}
          onClick={() => setViewMode('list')}
        >
          <CalendarIcon className="mr-2 h-4 w-4" /> List
        </Button>
        
        <div className="ml-auto pr-4">
          <Button
            className="bg-koffa-green text-white"
            size="sm"
            onClick={() => toast.info("Add event coming soon")}
          >
            <PlusCircle className="mr-1 h-4 w-4" /> Add Event
          </Button>
        </div>
      </div>

      {/* Month navigation and filter */}
      <div className="flex justify-between items-center p-4 border-b border-koffa-beige/40">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={previousMonth}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-koffa-green">
              <path d="m15 18-6-6 6-6"/>
            </svg>
          </Button>
          <h2 className="text-lg font-medium text-koffa-green">{currentMonth}</h2>
          <Button variant="ghost" size="icon" onClick={nextMonth}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-koffa-green">
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
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
              <SelectItem value="prayer">Prayers</SelectItem>
              <SelectItem value="shopping">Shopping</SelectItem>
              <SelectItem value="cleaning">Cleaning</SelectItem>
              <SelectItem value="appointment">Appointments</SelectItem>
              <SelectItem value="family">Family Events</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="p-4">
        {/* Day headers */}
        <div className="grid grid-cols-7 text-center font-semibold text-koffa-green border-b pb-2 mb-2">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>
        
        {/* Calendar cells */}
        <div className="grid grid-cols-7 gap-1 auto-rows-fr">
          {days.map((day, index) => {
            const event = getEventForDay(day.day);
            const isFiltered = filter !== 'all' && event?.type !== filter;
            
            return (
              <div 
                key={index} 
                className={`border rounded-md p-1 min-h-[80px] ${day.isCurrentMonth ? 'bg-white' : 'bg-gray-50'} ${isFiltered ? 'opacity-40' : ''}`}
              >
                <div className={`text-right ${day.isCurrentMonth ? 'font-medium' : 'text-gray-400'}`}>
                  {day.day}
                </div>
                {event && (!filter || filter === 'all' || filter === event.type) && (
                  <div className={`mt-1 text-xs p-1 rounded ${event.color}`}>
                    {event.label}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {/* Upcoming events */}
        <Card className="mt-6 border-koffa-beige/30 p-4">
          <h3 className="text-lg font-medium text-koffa-green mb-3">Upcoming Events</h3>
          <ul className="space-y-2">
            {upcomingEvents.map((event, index) => (
              <li key={index} className="flex items-center">
                <span className="text-koffa-green mr-2">•</span>
                <span className="text-koffa-green-dark font-medium">{event.day}:</span>
                <span className="ml-1">{event.label}</span>
                <span className="text-sm text-gray-500 ml-1">({event.assignedTo})</span>
              </li>
            ))}
          </ul>
          
          <div className="flex justify-end mt-3">
            <Button 
              variant="link" 
              className="text-koffa-accent-blue p-0"
              onClick={() => toast.info("View all events coming soon")}
            >
              View All Events
            </Button>
          </div>
        </Card>
      </div>
      
      <PageNavigation />
    </div>
  );
};

export default CalendarPage;
