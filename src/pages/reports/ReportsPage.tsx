
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Printer, Download } from 'lucide-react';
import PageLayout from '@/components/PageLayout';
import { toast } from '@/components/ui/sonner';

// Sample data for spending by category
const SPENDING_DATA = [
  { name: 'Groceries', value: 65, color: '#4CAF50' },
  { name: 'Household Items', value: 20, color: '#2196F3' },
  { name: 'Personal Care', value: 10, color: '#FF9800' },
  { name: 'Other', value: 5, color: '#9E9E9E' }
];

// Sample data for most purchased items
const MOST_PURCHASED = [
  { name: 'Milk', times: 12 },
  { name: 'Bread', times: 10 },
  { name: 'Eggs', times: 5 },
  { name: 'Rice', times: 3 },
  { name: 'Chicken', times: 3 }
];

// Sample data for task completion
const TASK_DATA = [
  { name: 'Mother', tasks: 25, color: '#4CAF50' },
  { name: 'Father', tasks: 18, color: '#2196F3' },
  { name: 'Ahmad', tasks: 12, color: '#FF9800' },
  { name: 'Driver', tasks: 10, color: '#9E9E9E' }
];

const ReportsPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [timePeriod, setTimePeriod] = useState('month');
  
  const handleExport = () => {
    toast.success('Report exported', {
      description: 'Your report has been exported successfully.'
    });
  };
  
  const handlePrint = () => {
    window.print();
  };

  return (
    <PageLayout title="Household Reports">
      <div className="space-y-6">
        {/* Tab navigation */}
        <div className="flex items-center border-b overflow-x-auto hide-scrollbar pb-2">
          <Button 
            variant={activeTab === 'overview' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('overview')}
            className="rounded-full whitespace-nowrap"
          >
            📊 Overview
          </Button>
          <Button 
            variant={activeTab === 'shopping' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('shopping')}
            className="rounded-full whitespace-nowrap"
          >
            🛒 Shopping
          </Button>
          <Button 
            variant={activeTab === 'pantry' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('pantry')}
            className="rounded-full whitespace-nowrap"
          >
            📦 Pantry
          </Button>
          <Button 
            variant={activeTab === 'activity' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('activity')}
            className="rounded-full whitespace-nowrap"
          >
            👥 Activity
          </Button>
        </div>
        
        {/* Time period and actions */}
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-sm mr-2">Time Period:</span>
            <select
              value={timePeriod}
              onChange={(e) => setTimePeriod(e.target.value)}
              className="text-sm rounded-md border px-2 py-1 bg-white dark:bg-slate-800"
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
            </select>
          </div>
          
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-1" />
              Print
            </Button>
          </div>
        </div>
        
        {/* Charts and data */}
        <div className="space-y-6">
          {/* Spending by category */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4 text-center">Shopping Expenditure by Category</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={SPENDING_DATA}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {SPENDING_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-1">
              {SPENDING_DATA.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <span className="text-sm">- {item.name}:</span>
                  <span className="text-sm font-medium">{item.value}%</span>
                </div>
              ))}
            </div>
          </Card>
          
          {/* Most purchased items */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4 text-center">Most Purchased Items</h3>
            <div className="space-y-2">
              {MOST_PURCHASED.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <span>
                    {index + 1}. {item.name}
                  </span>
                  <span className="font-medium">
                    {item.times} times
                  </span>
                </div>
              ))}
            </div>
          </Card>
          
          {/* Task completion */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4 text-center">Task Completion by Family Member</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={TASK_DATA}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="tasks" fill="#8884d8">
                    {TASK_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-1">
              {TASK_DATA.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <span className="text-sm">- {item.name}:</span>
                  <span className="text-sm font-medium">{item.tasks} tasks</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default ReportsPage;
