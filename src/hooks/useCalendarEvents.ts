
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { fetchCalendarEvents, createCalendarEvent, updateCalendarEvent, deleteCalendarEvent } from "@/utils/calendarUtils";
import { getFamilyForUser } from "@/utils/familyUtils";
import { useQuery } from "@tanstack/react-query";

export type CalendarEvent = {
  id: string;
  title: string;
  description?: string | null;
  start_time: string;
  end_time?: string | null;
  location?: string | null;
  category: string;
  color?: string | null;
  family_id?: string | null;
  is_recurring?: boolean | null;
  recurrence_pattern?: string | null;
  all_day?: boolean | null;
  assigned_to?: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
};

export type NewCalendarEvent = Omit<CalendarEvent, "id" | "created_by" | "created_at" | "updated_at"> & { 
  id?: string;
  created_by?: string;
};

export default function useCalendarEvents() {
  const { user } = useAuth();
  const [familyId, setFamilyId] = useState<string | null>(null);
  
  useEffect(() => {
    if (user?.id) {
      getFamilyForUser(user.id)
        .then(family => {
          if (family) {
            setFamilyId(family.id);
          }
        });
    }
  }, [user]);
  
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['calendarEvents', user?.id, familyId],
    queryFn: () => user?.id ? fetchCalendarEvents(user.id, familyId) : Promise.resolve([]),
    enabled: !!user?.id
  });

  const createEvent = async (event: NewCalendarEvent) => {
    if (!user?.id) return null;
    const result = await createCalendarEvent(event, user.id);
    if (result) {
      refetch();
    }
    return result;
  };

  const updateEvent = async (event: CalendarEvent) => {
    const result = await updateCalendarEvent(event);
    if (result) {
      refetch();
    }
    return result;
  };

  const deleteEvent = async (eventId: string) => {
    const result = await deleteCalendarEvent(eventId);
    if (result) {
      refetch();
    }
    return result;
  };

  return {
    events: data as CalendarEvent[] || [],
    isLoading,
    error,
    refetch,
    createEvent,
    updateEvent,
    deleteEvent,
    familyId
  };
}
