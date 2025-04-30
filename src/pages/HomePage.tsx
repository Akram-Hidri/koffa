
import React from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Utensils, ShoppingBag, LayoutGrid, Bell, Calendar, ListTodo, BookOpen } from 'lucide-react';

const HomePage = () => {
  // Sample data for quick stats
  const quickStats = {
    lowStockItems: 4,
    expiringItems: 2,
    pendingTasks: 8,
    shoppingLists: 3
  };

  return (
    <PageLayout title="Home">
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Welcome back!</h2>
        
        {/* Large Quick Access Tiles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/calendar" className="block">
            <Card className="h-full transition-all hover:shadow-md border-koffa-beige hover:border-koffa-green">
              <CardHeader className="p-4 pb-2 flex flex-col items-center text-center">
                <Calendar className="h-16 w-16 text-koffa-green mb-2" />
                <CardTitle className="text-xl">Calendar</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 text-center">
                <p className="text-sm text-muted-foreground">Manage your schedule</p>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/tasks" className="block">
            <Card className="h-full transition-all hover:shadow-md border-koffa-beige hover:border-koffa-green">
              <CardHeader className="p-4 pb-2 flex flex-col items-center text-center">
                <ListTodo className="h-16 w-16 text-koffa-green mb-2" />
                <CardTitle className="text-xl">Tasks</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 text-center">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-amber-600">{quickStats.pendingTasks}</span> tasks pending
                </p>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/notes" className="block">
            <Card className="h-full transition-all hover:shadow-md border-koffa-beige hover:border-koffa-green">
              <CardHeader className="p-4 pb-2 flex flex-col items-center text-center">
                <BookOpen className="h-16 w-16 text-koffa-green mb-2" />
                <CardTitle className="text-xl">Notes</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 text-center">
                <p className="text-sm text-muted-foreground">Access your notes</p>
              </CardContent>
            </Card>
          </Link>
        </div>
        
        {/* Quick stats */}
        <div className="grid grid-cols-2 gap-4 mt-8">
          <Card className="border-koffa-beige hover:border-koffa-green transition-all">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-base flex items-center">
                <Utensils className="h-4 w-4 mr-2 text-koffa-green" />
                Pantry
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm">Low stock items:</span>
                  <span className="font-medium text-amber-500">{quickStats.lowStockItems}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Expiring soon:</span>
                  <span className="font-medium text-amber-500">{quickStats.expiringItems}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Link to="/pantry" className="w-full">
                <Button variant="outline" className="w-full">View Pantry</Button>
              </Link>
            </CardFooter>
          </Card>
          
          <Card className="border-koffa-beige hover:border-koffa-green transition-all">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-base flex items-center">
                <ShoppingBag className="h-4 w-4 mr-2 text-koffa-green" />
                Shopping
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm">Active lists:</span>
                  <span className="font-medium">{quickStats.shoppingLists}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Next due:</span>
                  <span className="font-medium text-amber-500">Tomorrow</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Link to="/shopping" className="w-full">
                <Button variant="outline" className="w-full">Shopping Lists</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
        
        {/* Spaces quick access */}
        <Card className="border-koffa-beige hover:border-koffa-green transition-all mt-4">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-base flex items-center">
              <LayoutGrid className="h-4 w-4 mr-2 text-koffa-green" />
              Home Spaces
            </CardTitle>
            <CardDescription>
              {quickStats.pendingTasks} tasks pending
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="grid grid-cols-3 gap-2">
              <Link to="/spaces/1">
                <Button variant="outline" className="w-full h-full py-4 flex flex-col hover:border-koffa-green">
                  <span>Kitchen</span>
                  <span className="text-xs text-amber-500">2 tasks</span>
                </Button>
              </Link>
              <Link to="/spaces/2">
                <Button variant="outline" className="w-full h-full py-4 flex flex-col hover:border-koffa-green">
                  <span>Bathroom</span>
                  <span className="text-xs text-amber-500">3 tasks</span>
                </Button>
              </Link>
              <Link to="/spaces/3">
                <Button variant="outline" className="w-full h-full py-4 flex flex-col hover:border-koffa-green">
                  <span>Garden</span>
                  <span className="text-xs text-amber-500">1 task</span>
                </Button>
              </Link>
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <Link to="/spaces" className="w-full">
              <Button variant="outline" className="w-full">View All Spaces</Button>
            </Link>
          </CardFooter>
        </Card>
        
        {/* Recent activity */}
        <Card className="border-koffa-beige hover:border-koffa-green transition-all">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-base flex items-center">
              <Bell className="h-4 w-4 mr-2 text-koffa-green" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <ul className="space-y-2">
              <li className="text-sm pb-2 border-b border-koffa-beige/30">
                <span className="font-medium">Driver</span> completed "Weekly Grocery" shopping
                <div className="text-xs text-gray-500">Just now</div>
              </li>
              <li className="text-sm pb-2 border-b border-koffa-beige/30">
                <span className="font-medium">Mother</span> added 3 items to pantry
                <div className="text-xs text-gray-500">5 minutes ago</div>
              </li>
              <li className="text-sm">
                <span className="font-medium">Ahmad</span> created a new shopping list
                <div className="text-xs text-gray-500">Yesterday</div>
              </li>
            </ul>
          </CardContent>
          <CardFooter className="p-4 pt-0 flex justify-between">
            <Link to="/notifications" className="flex-1 mr-2">
              <Button variant="outline" className="w-full">All Notifications</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </PageLayout>
  );
};

export default HomePage;
