
import React from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Utensils, ShoppingBag, Layers, BarChart, Bell } from 'lucide-react';

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
        
        {/* Quick stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-base flex items-center">
                <Utensils className="h-4 w-4 mr-2" />
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
          
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-base flex items-center">
                <ShoppingBag className="h-4 w-4 mr-2" />
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
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-base flex items-center">
              <Layers className="h-4 w-4 mr-2" />
              Home Spaces
            </CardTitle>
            <CardDescription>
              {quickStats.pendingTasks} tasks pending
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="grid grid-cols-3 gap-2">
              <Link to="/spaces/1">
                <Button variant="outline" className="w-full h-full py-4 flex flex-col">
                  <span>Kitchen</span>
                  <span className="text-xs text-amber-500">2 tasks</span>
                </Button>
              </Link>
              <Link to="/spaces/2">
                <Button variant="outline" className="w-full h-full py-4 flex flex-col">
                  <span>Bathroom</span>
                  <span className="text-xs text-amber-500">3 tasks</span>
                </Button>
              </Link>
              <Link to="/spaces/3">
                <Button variant="outline" className="w-full h-full py-4 flex flex-col">
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
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-base flex items-center">
              <Bell className="h-4 w-4 mr-2" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <ul className="space-y-2">
              <li className="text-sm pb-2 border-b">
                <span className="font-medium">Driver</span> completed "Weekly Grocery" shopping
                <div className="text-xs text-gray-500">Just now</div>
              </li>
              <li className="text-sm pb-2 border-b">
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
            <Link to="/reports" className="flex-1 ml-2">
              <Button variant="outline" className="w-full flex items-center">
                <BarChart className="h-4 w-4 mr-1" />
                Reports
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </PageLayout>
  );
};

export default HomePage;
