
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, ShoppingCart, Package, Users, CheckCircle, AlertCircle, Star } from 'lucide-react';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePantryItems } from '@/hooks/usePantryItems';
import useCalendarEvents from '@/hooks/useCalendarEvents';
import { useShoppingLists } from '@/hooks/useShoppingLists';

const HomePage = () => {
  const navigate = useNavigate();
  const { data: pantryItems = [] } = usePantryItems();
  const { events } = useCalendarEvents();
  const { data: shoppingLists = [] } = useShoppingLists();

  // Calculate pantry statistics
  const lowStockItems = pantryItems.filter(item => 
    item.quantity !== null && item.quantity <= 2
  ).length;
  
  const expiringItems = pantryItems.filter(item => {
    if (!item.expiry_date) return false;
    const expiryDate = new Date(item.expiry_date);
    const today = new Date();
    const sevenDaysLater = new Date();
    sevenDaysLater.setDate(today.getDate() + 7);
    return expiryDate <= sevenDaysLater && expiryDate >= today;
  }).length;

  // Calculate today's events
  const today = new Date();
  const todayEvents = events.filter(event => {
    const eventDate = new Date(event.start_time);
    return eventDate.toDateString() === today.toDateString();
  });

  // Calculate active shopping lists
  const activeShoppingLists = shoppingLists.filter(list => 
    list.status === 'Not Started' || list.status === 'In Progress'
  ).length;

  const quickActions = [
    {
      title: 'Add Pantry Item',
      description: 'Quick add items to your pantry',
      icon: Package,
      action: () => navigate('/pantry/add'),
      color: 'bg-blue-500'
    },
    {
      title: 'Create Event',
      description: 'Schedule a new family event',
      icon: Calendar,
      action: () => navigate('/calendar'),
      color: 'bg-green-500'
    },
    {
      title: 'New Shopping List',
      description: 'Start a new shopping list',
      icon: ShoppingCart,
      action: () => navigate('/shopping'),
      color: 'bg-purple-500'
    },
    {
      title: 'Family Settings',
      description: 'Manage your family',
      icon: Users,
      action: () => navigate('/family'),
      color: 'bg-orange-500'
    }
  ];

  return (
    <PageLayout title="Home">
      <div className="space-y-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pantry Items</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pantryItems.length}</div>
              <p className="text-xs text-muted-foreground">
                Total items in pantry
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
              <AlertCircle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-500">{lowStockItems}</div>
              <p className="text-xs text-muted-foreground">
                Items running low
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">{expiringItems}</div>
              <p className="text-xs text-muted-foreground">
                Items expiring this week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todayEvents.length}</div>
              <p className="text-xs text-muted-foreground">
                Events scheduled today
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-24 flex flex-col items-center justify-center space-y-2"
                  onClick={action.action}
                >
                  <action.icon className={`h-6 w-6 text-white p-1 rounded ${action.color}`} />
                  <div className="text-center">
                    <div className="font-medium text-sm">{action.title}</div>
                    <div className="text-xs text-muted-foreground">{action.description}</div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pantry Summary */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Pantry Summary</CardTitle>
              <Button variant="outline" size="sm" onClick={() => navigate('/pantry')}>
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lowStockItems > 0 && (
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4 text-orange-500" />
                    <span className="text-sm">
                      <Badge variant="outline" className="text-orange-500 border-orange-500">
                        {lowStockItems}
                      </Badge>
                      {' '}items running low
                    </span>
                  </div>
                )}
                {expiringItems > 0 && (
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <span className="text-sm">
                      <Badge variant="outline" className="text-red-500 border-red-500">
                        {expiringItems}
                      </Badge>
                      {' '}items expiring this week
                    </span>
                  </div>
                )}
                {lowStockItems === 0 && expiringItems === 0 && (
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-500">All items are well-stocked</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Today's Events</CardTitle>
              <Button variant="outline" size="sm" onClick={() => navigate('/calendar')}>
                View Calendar
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {todayEvents.length > 0 ? (
                  todayEvents.slice(0, 3).map((event) => (
                    <div key={event.id} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      <div className="flex-1">
                        <div className="font-medium text-sm">{event.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(event.start_time).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-muted-foreground">No events scheduled for today</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default HomePage;
