
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { NewCalendarEvent, CalendarEvent } from "@/hooks/useCalendarEvents";
import { CATEGORY_OPTIONS } from "@/utils/calendarUtils";
import { format } from "date-fns";
import { CalendarIcon, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface EventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: NewCalendarEvent) => Promise<any>;
  onDelete?: (id: string) => Promise<boolean>;
  event?: CalendarEvent;
  familyId?: string | null;
}

export default function EventDialog({ isOpen, onClose, onSave, onDelete, event, familyId }: EventDialogProps) {
  const { user } = useAuth();
  const isEditing = !!event;
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("other");
  const [isAllDay, setIsAllDay] = useState(false);
  const [assignedTo, setAssignedTo] = useState("");
  const [isFamilyEvent, setIsFamilyEvent] = useState(false);

  // Reset form when modal opens or event changes
  useEffect(() => {
    if (isOpen) {
      if (event) {
        setTitle(event.title || "");
        setDescription(event.description || "");
        setStartDate(new Date(event.start_time));
        setEndDate(event.end_time ? new Date(event.end_time) : undefined);
        setLocation(event.location || "");
        setCategory(event.category || "other");
        setIsAllDay(event.all_day || false);
        setAssignedTo(event.assigned_to || "");
        setIsFamilyEvent(!!event.family_id);
      } else {
        // Default values for new event
        setTitle("");
        setDescription("");
        setStartDate(new Date());
        setEndDate(undefined);
        setLocation("");
        setCategory("other");
        setIsAllDay(false);
        setAssignedTo("");
        setIsFamilyEvent(false);
      }
    }
  }, [isOpen, event]);

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("Event title is required");
      return;
    }
    
    const eventData: NewCalendarEvent = {
      title,
      description,
      start_time: startDate.toISOString(),
      end_time: endDate ? endDate.toISOString() : null,
      location: location || null,
      category,
      all_day: isAllDay,
      assigned_to: assignedTo || null,
      family_id: isFamilyEvent ? familyId : null,
    };

    if (isEditing && event) {
      eventData.id = event.id;
    }

    await onSave(eventData);
    onClose();
  };

  const handleDelete = async () => {
    if (isEditing && event && onDelete) {
      await onDelete(event.id);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Event" : "Add New Event"}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="title" className="text-sm font-medium">
              Title*
            </label>
            <Input 
              id="title" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="Enter event title"
              className="w-full"
            />
          </div>
          
          <div className="grid gap-2">
            <label htmlFor="category" className="text-sm font-medium">
              Category
            </label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORY_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2">
            <Switch 
              checked={isAllDay} 
              onCheckedChange={setIsAllDay} 
              id="all-day"
            />
            <label htmlFor="all-day" className="text-sm font-medium">
              All day event
            </label>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Start Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => date && setStartDate(date)}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              
              {!isAllDay && (
                <Input 
                  type="time" 
                  value={format(startDate, "HH:mm")}
                  onChange={(e) => {
                    const [hours, minutes] = e.target.value.split(':').map(Number);
                    const newDate = new Date(startDate);
                    newDate.setHours(hours, minutes);
                    setStartDate(newDate);
                  }}
                />
              )}
            </div>
            
            <div className="grid gap-2">
              <label className="text-sm font-medium">End Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={(date) => date && setEndDate(date)}
                    initialFocus
                    disabled={(date) => date < startDate}
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              
              {!isAllDay && (
                <Input 
                  type="time" 
                  value={endDate ? format(endDate, "HH:mm") : ""}
                  onChange={(e) => {
                    if (!endDate) {
                      const newDate = new Date(startDate);
                      const [hours, minutes] = e.target.value.split(':').map(Number);
                      newDate.setHours(hours, minutes);
                      setEndDate(newDate);
                    } else {
                      const [hours, minutes] = e.target.value.split(':').map(Number);
                      const newDate = new Date(endDate);
                      newDate.setHours(hours, minutes);
                      setEndDate(newDate);
                    }
                  }}
                />
              )}
            </div>
          </div>
          
          <div className="grid gap-2">
            <label htmlFor="location" className="text-sm font-medium">
              Location
            </label>
            <Input 
              id="location" 
              value={location} 
              onChange={(e) => setLocation(e.target.value)} 
              placeholder="Enter location (optional)"
            />
          </div>
          
          <div className="grid gap-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Textarea 
              id="description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Enter description (optional)"
              rows={3}
            />
          </div>
          
          <div className="grid gap-2">
            <label htmlFor="assigned" className="text-sm font-medium">
              Assigned To
            </label>
            <Input 
              id="assigned" 
              value={assignedTo} 
              onChange={(e) => setAssignedTo(e.target.value)} 
              placeholder="Who is this assigned to? (optional)"
            />
          </div>
          
          {familyId && (
            <div className="flex items-center gap-2">
              <Switch 
                checked={isFamilyEvent} 
                onCheckedChange={setIsFamilyEvent} 
                id="family-event"
              />
              <label htmlFor="family-event" className="text-sm font-medium">
                Share with family
              </label>
            </div>
          )}
        </div>
        
        <DialogFooter className="flex justify-between">
          <div>
            {isEditing && onDelete && (
              <Button variant="destructive" onClick={handleDelete} type="button">
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button onClick={handleSave} type="button">
              {isEditing ? "Update" : "Add"} Event
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
