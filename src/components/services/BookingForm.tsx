
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { CalendarIcon, Plus, Minus, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Chef, useCreateBooking, useGroceryItems } from '@/hooks/useChefs';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const mealTypes = ['breakfast', 'lunch', 'dinner', 'dessert', 'custom'];

// Generate time options in 30-minute increments
const generateTimeOptions = () => {
  const options = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const formattedHour = hour.toString().padStart(2, '0');
      const formattedMinute = minute.toString().padStart(2, '0');
      options.push(`${formattedHour}:${formattedMinute}`);
    }
  }
  return options;
};

const timeOptions = generateTimeOptions();

// Create schema for form validation
const bookingSchema = z.object({
  booking_date: z.date({
    required_error: "Please select a date",
  }),
  start_time: z.string({
    required_error: "Please select a start time",
  }),
  end_time: z.string({
    required_error: "Please select an end time",
  }),
  meal_type: z.string({
    required_error: "Please select a meal type",
  }),
  guests_count: z.number({
    required_error: "Please enter number of guests",
  }).min(1, "Minimum 1 guest").max(20, "Maximum 20 guests"),
  special_requests: z.string().optional(),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

interface BookingFormProps {
  chef: Chef;
}

export const BookingForm: React.FC<BookingFormProps> = ({ chef }) => {
  const navigate = useNavigate();
  const createBooking = useCreateBooking();
  const { data: groceryItems = [], isLoading: loadingGroceries } = useGroceryItems();
  const [selectedGroceries, setSelectedGroceries] = useState<Record<string, number>>({});
  const [showGroceryList, setShowGroceryList] = useState(false);
  
  // Initialize form
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      booking_date: new Date(),
      start_time: "18:00",
      end_time: "20:00",
      meal_type: "dinner",
      guests_count: 2,
      special_requests: "",
    },
  });
  
  // Handle adding/removing grocery items
  const handleAddGrocery = (id: string, price: number) => {
    setSelectedGroceries(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
  };
  
  const handleRemoveGrocery = (id: string) => {
    setSelectedGroceries(prev => {
      const newCount = (prev[id] || 0) - 1;
      const newSelected = { ...prev };
      if (newCount <= 0) {
        delete newSelected[id];
      } else {
        newSelected[id] = newCount;
      }
      return newSelected;
    });
  };
  
  // Calculate subtotal for groceries
  const grocerySubtotal = groceryItems
    .filter(item => selectedGroceries[item.id])
    .reduce((sum, item) => sum + (selectedGroceries[item.id] * item.price), 0);
  
  // Calculate chef cost based on selected hours
  const calculateChefCost = (startTime: string, endTime: string) => {
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    if (end <= start) {
      return 0; // Invalid time selection
    }
    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    return chef.hourly_rate * hours;
  };
  
  const startTime = form.watch("start_time");
  const endTime = form.watch("end_time");
  const chefCost = calculateChefCost(startTime, endTime);
  
  // Calculate total cost
  const totalCost = chefCost + grocerySubtotal;
  
  const onSubmit = async (values: BookingFormValues) => {
    try {
      // Format grocery items for the booking
      const groceryItemsForBooking = groceryItems
        .filter(item => selectedGroceries[item.id])
        .map(item => ({
          id: item.id,
          quantity: selectedGroceries[item.id],
          price: item.price
        }));
      
      await createBooking.mutateAsync({
        ...values,
        chef_id: chef.id,
        grocery_items: groceryItemsForBooking
      });
      
      // Navigate to bookings or success page
      navigate('/services/bookings');
    } catch (error) {
      console.error("Booking error:", error);
      toast.error("Failed to create booking");
    }
  };

  // Group grocery items by category for display
  const groupedGroceries = groceryItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof groceryItems>);
  
  return (
    <Card className="border-koffa-beige">
      <CardHeader>
        <CardTitle>Book {chef.name}</CardTitle>
        <CardDescription>
          Fill in the details to book your cooking session
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Date Picker */}
              <FormField
                control={form.control}
                name="booking_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Meal Type */}
              <FormField
                control={form.control}
                name="meal_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meal Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select meal type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {mealTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Start Time */}
              <FormField
                control={form.control}
                name="start_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select start time" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {timeOptions.map((time) => (
                          <SelectItem key={`start-${time}`} value={time}>
                            {format(new Date(`2000-01-01T${time}`), 'h:mm a')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* End Time */}
              <FormField
                control={form.control}
                name="end_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Time</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select end time" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {timeOptions.map((time) => (
                          <SelectItem key={`end-${time}`} value={time}>
                            {format(new Date(`2000-01-01T${time}`), 'h:mm a')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Number of Guests */}
            <FormField
              control={form.control}
              name="guests_count"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Guests</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      max="20"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Special Requests */}
            <FormField
              control={form.control}
              name="special_requests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Special Requests</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any dietary restrictions, allergies, or special requests..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Add Groceries Button */}
            <div className="border-t border-b border-koffa-beige/30 py-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowGroceryList(!showGroceryList)}
                className="w-full justify-between"
              >
                <div className="flex items-center">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  <span>Add Groceries (Optional)</span>
                </div>
                <span className="text-sm font-normal text-gray-500">
                  {Object.keys(selectedGroceries).length === 0 ? (
                    "None selected"
                  ) : (
                    `${Object.keys(selectedGroceries).length} items - $${grocerySubtotal.toFixed(2)}`
                  )}
                </span>
              </Button>

              {/* Grocery List */}
              {showGroceryList && (
                <div className="mt-4 space-y-4 max-h-80 overflow-y-auto p-2">
                  {loadingGroceries ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-2 border-koffa-green border-t-transparent mx-auto"></div>
                      <p className="mt-2 text-sm text-gray-500">Loading grocery items...</p>
                    </div>
                  ) : (
                    Object.entries(groupedGroceries).map(([category, items]) => (
                      <div key={category} className="space-y-2">
                        <h4 className="font-medium text-sm text-gray-500">
                          {category}
                        </h4>
                        <div className="space-y-1">
                          {items.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center justify-between p-2 rounded-md hover:bg-koffa-beige/10"
                            >
                              <div>
                                <p className="text-sm font-medium">{item.name}</p>
                                <p className="text-xs text-gray-500">
                                  ${item.price.toFixed(2)} per {item.unit}
                                </p>
                              </div>
                              <div className="flex items-center">
                                {selectedGroceries[item.id] ? (
                                  <>
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="icon"
                                      onClick={() => handleRemoveGrocery(item.id)}
                                      className="h-8 w-8"
                                    >
                                      <Minus className="h-3 w-3" />
                                    </Button>
                                    <span className="w-8 text-center">
                                      {selectedGroceries[item.id]}
                                    </span>
                                  </>
                                ) : null}
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  onClick={() => handleAddGrocery(item.id, item.price)}
                                  className="h-8 w-8"
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Cost Summary */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Chef fee ({calculateChefCost(startTime, endTime) / chef.hourly_rate} hours @ ${chef.hourly_rate}/hr)</span>
                <span>${chefCost.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Groceries</span>
                <span>${grocerySubtotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between font-medium pt-2 border-t border-koffa-beige/30">
                <span>Total</span>
                <span className="text-koffa-green">${totalCost.toFixed(2)}</span>
              </div>
            </div>
            
            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full bg-koffa-green hover:bg-koffa-green-dark"
              disabled={createBooking.isPending}
            >
              {createBooking.isPending ? "Processing..." : "Book Now"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
