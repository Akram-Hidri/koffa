
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export type Chef = {
  id: string;
  name: string;
  profile_image: string | null;
  bio: string | null;
  years_experience: number | null;
  hourly_rate: number;
  specialty: string | null;
  cuisine_style: string;
  created_at: string;
  user_id: string | null;
};

export const useChefs = (cuisine?: string) => {
  const query = useQuery({
    queryKey: ['chefs', cuisine],
    queryFn: async () => {
      let query = supabase.from('chefs').select('*');
      
      if (cuisine && cuisine !== 'all') {
        query = query.eq('cuisine_style', cuisine);
      }
      
      const { data, error } = await query.order('hourly_rate');
      
      if (error) {
        toast.error("Failed to load chefs");
        throw error;
      }
      
      return data as Chef[];
    }
  });

  return query;
};

export const useChefDetails = (chefId?: string) => {
  return useQuery({
    queryKey: ['chef', chefId],
    queryFn: async () => {
      if (!chefId) return null;
      
      const { data, error } = await supabase
        .from('chefs')
        .select('*')
        .eq('id', chefId)
        .single();
        
      if (error) {
        toast.error("Failed to load chef details");
        throw error;
      }
      
      return data as Chef;
    },
    enabled: !!chefId
  });
};

export const useChefFavorites = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const fetchFavorites = async () => {
    if (!user) return [];
    
    const { data, error } = await supabase
      .from('chef_favorites')
      .select('chef_id')
      .eq('user_id', user.id);
      
    if (error) {
      toast.error("Failed to load favorites");
      throw error;
    }
    
    return data.map(fav => fav.chef_id);
  };
  
  const toggleFavorite = async (chefId: string) => {
    if (!user) {
      toast.error("You must be logged in to add favorites");
      return null;
    }
    
    // Check if already a favorite
    const { data: existingFav } = await supabase
      .from('chef_favorites')
      .select('id')
      .eq('chef_id', chefId)
      .eq('user_id', user.id)
      .single();
      
    if (existingFav) {
      // Remove from favorites
      const { error } = await supabase
        .from('chef_favorites')
        .delete()
        .eq('id', existingFav.id);
        
      if (error) {
        toast.error("Failed to remove from favorites");
        throw error;
      }
      
      toast.success("Removed from favorites");
    } else {
      // Add to favorites
      const { error } = await supabase
        .from('chef_favorites')
        .insert({
          chef_id: chefId,
          user_id: user.id
        });
        
      if (error) {
        toast.error("Failed to add to favorites");
        throw error;
      }
      
      toast.success("Added to favorites");
    }
    
    // Invalidate queries to refresh data
    queryClient.invalidateQueries({ queryKey: ['chef-favorites'] });
  };
  
  const query = useQuery({
    queryKey: ['chef-favorites'],
    queryFn: fetchFavorites,
    enabled: !!user
  });
  
  return {
    ...query,
    toggleFavorite,
    isFavorite: (chefId: string) => query.data?.includes(chefId) || false
  };
};

export const useChefReviews = (chefId?: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  type Review = {
    id: string;
    chef_id: string;
    user_id: string;
    rating: number;
    comment: string | null;
    created_at: string;
  };

  const addReview = useMutation({
    mutationFn: async ({ chefId, rating, comment }: { chefId: string; rating: number; comment?: string }) => {
      if (!user) {
        toast.error("You must be logged in to leave a review");
        throw new Error("Not authenticated");
      }

      const { data, error } = await supabase
        .from('chef_reviews')
        .insert({
          chef_id: chefId,
          user_id: user.id,
          rating,
          comment: comment || null
        })
        .select();

      if (error) {
        toast.error("Failed to submit review");
        throw error;
      }

      return data[0];
    },
    onSuccess: () => {
      toast.success("Review submitted successfully");
      queryClient.invalidateQueries({ queryKey: ['chef-reviews', chefId] });
    }
  });

  const query = useQuery({
    queryKey: ['chef-reviews', chefId],
    queryFn: async () => {
      if (!chefId) return [];
      
      const { data, error } = await supabase
        .from('chef_reviews')
        .select('*')
        .eq('chef_id', chefId)
        .order('created_at', { ascending: false });
        
      if (error) {
        toast.error("Failed to load reviews");
        throw error;
      }
      
      return data as Review[];
    },
    enabled: !!chefId
  });

  return {
    ...query,
    addReview
  };
};

export const useGroceryItems = () => {
  return useQuery({
    queryKey: ['grocery-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('chef_grocery_items')
        .select('*')
        .order('category');
        
      if (error) {
        toast.error("Failed to load grocery items");
        throw error;
      }
      
      return data;
    }
  });
};

export type BookingFormData = {
  chef_id: string;
  booking_date: Date;
  start_time: string;
  end_time: string;
  meal_type: string;
  guests_count: number;
  special_requests?: string;
  grocery_items: Array<{
    id: string;
    quantity: number;
    price: number;
  }>;
};

export const useCreateBooking = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookingData: BookingFormData) => {
      if (!user) {
        toast.error("You must be logged in to make a booking");
        throw new Error("Not authenticated");
      }
      
      // Calculate total price based on chef hourly rate and grocery items
      const { data: chefData } = await supabase
        .from('chefs')
        .select('hourly_rate')
        .eq('id', bookingData.chef_id)
        .single();
        
      if (!chefData) {
        toast.error("Chef not found");
        throw new Error("Chef not found");
      }
      
      // Calculate hours
      const startTime = new Date(`2000-01-01T${bookingData.start_time}`);
      const endTime = new Date(`2000-01-01T${bookingData.end_time}`);
      const hours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
      
      // Calculate chef cost
      const chefCost = chefData.hourly_rate * hours;
      
      // Calculate grocery cost
      const groceryCost = bookingData.grocery_items.reduce(
        (sum, item) => sum + (item.quantity * item.price), 
        0
      );
      
      // Total price
      const totalPrice = chefCost + groceryCost;
      
      // Begin transaction
      // 1. First create the booking
      const { data: booking, error: bookingError } = await supabase
        .from('chef_bookings')
        .insert({
          chef_id: bookingData.chef_id,
          user_id: user.id,
          booking_date: bookingData.booking_date.toISOString().split('T')[0],
          start_time: bookingData.start_time,
          end_time: bookingData.end_time,
          meal_type: bookingData.meal_type,
          guests_count: bookingData.guests_count,
          special_requests: bookingData.special_requests || null,
          total_price: totalPrice,
          status: 'pending'
        })
        .select()
        .single();
        
      if (bookingError) {
        toast.error("Failed to create booking");
        throw bookingError;
      }
      
      // 2. Add grocery items to the booking
      if (bookingData.grocery_items.length > 0) {
        const groceryInserts = bookingData.grocery_items.map(item => ({
          booking_id: booking.id,
          grocery_item_id: item.id,
          quantity: item.quantity
        }));
        
        const { error: groceryError } = await supabase
          .from('booking_groceries')
          .insert(groceryInserts);
          
        if (groceryError) {
          toast.error("Failed to add grocery items to booking");
          throw groceryError;
        }
      }
      
      return booking;
    },
    onSuccess: () => {
      toast.success("Booking created successfully");
      queryClient.invalidateQueries({ queryKey: ['user-bookings'] });
    }
  });
};

export const useUserBookings = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['user-bookings'],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('chef_bookings')
        .select(`
          *,
          chefs:chef_id (
            name,
            profile_image,
            cuisine_style
          )
        `)
        .eq('user_id', user.id)
        .order('booking_date', { ascending: false });
        
      if (error) {
        toast.error("Failed to load bookings");
        throw error;
      }
      
      return data;
    },
    enabled: !!user
  });
};
