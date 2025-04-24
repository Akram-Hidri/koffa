import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ShoppingCart, Package, Home as HomeIcon, List } from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();
  const currentDate = new Date();
  
  // Mock data for our page
  const recentPurchases = [
    { id: 1, name: 'Organic Milk', price: '$4.99', date: '2025-04-24', image: '🥛' },
    { id: 2, name: 'Fresh Eggs', price: '$3.49', date: '2025-04-24', image: '🥚' },
    { id: 3, name: 'Whole Wheat Bread', price: '$2.99', date: '2025-04-24', image: '🍞' },
  ];
  
  const smartSuggestions = {
    runningLow: ['Milk', 'Eggs', 'Bread'],
    frequentlyBought: ['Bananas', 'Yogurt', 'Coffee'],
    bestDeals: ['20% off Dairy', 'BOGO Produce'],
    seasonal: ['Spring Vegetables', 'Fresh Herbs']
  };
  
  const shoppingActivity = {
    steps: 2847,
    miles: 1.2,
    calories: 145
  };
  
  const activeLists = [
    { id: 1, name: 'Pantry Restock', store: 'Costco', progress: 85, itemCount: 3, inCart: 2, members: ['👨', '👩'] }
  ];
  
  return (
    <div className="min-h-screen bg-koffa-beige-light pb-20">
      {/* Header */}
      <div className="bg-koffa-beige-light p-4 flex justify-between items-center">
        <Logo size="sm" />
        <div className="text-right">
          <p className="text-sm text-koffa-green">
            {currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <Button variant="ghost" className="rounded-full p-2 h-auto w-auto">
          <div className="w-8 h-8 bg-koffa-green rounded-full text-white flex items-center justify-center">
            JD
          </div>
        </Button>
      </div>
      
      {/* Main content */}
      <div className="px-4 py-2">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-koffa-green">Hello, Johnson Family</h1>
          <p className="text-koffa-green-dark text-sm">What's on your shopping list today?</p>
        </div>
        
        {/* Quick actions */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="flex flex-col items-center">
            <Button variant="outline" className="w-16 h-16 rounded-full bg-white border-koffa-beige hover:bg-koffa-beige-light">
              <ShoppingCart size={24} className="text-koffa-green" />
            </Button>
            <span className="text-sm mt-2 text-koffa-green">Grab & Go</span>
          </div>
          
          <div className="flex flex-col items-center">
            <Button variant="outline" className="w-16 h-16 rounded-full bg-koffa-green text-white border-koffa-green hover:bg-koffa-green-dark">
              <List size={24} className="text-white" />
            </Button>
            <span className="text-sm mt-2 text-koffa-green">Lists</span>
          </div>
          
          <div className="flex flex-col items-center">
            <Button variant="outline" className="w-16 h-16 rounded-full bg-white border-koffa-beige hover:bg-koffa-beige-light">
              <Package size={24} className="text-koffa-green" />
            </Button>
            <span className="text-sm mt-2 text-koffa-green">Pantry</span>
          </div>
        </div>
        
        {/* Recent Purchases */}
        <div className="mb-8">
          <h2 className="font-semibold text-koffa-green mb-3">Recent Purchases</h2>
          <div className="flex overflow-x-auto pb-4 gap-4 hide-scrollbar">
            {recentPurchases.map(item => (
              <Card key={item.id} className="min-w-[200px] p-3 flex items-center space-x-3 border-koffa-beige/30">
                <div className="text-3xl">{item.image}</div>
                <div>
                  <p className="font-medium text-koffa-green">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.date}</p>
                  <p className="text-sm font-medium">{item.price}</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-1 h-8 text-xs border-koffa-green text-koffa-green hover:bg-koffa-beige-light"
                  >
                    Buy Again
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
        
        {/* Smart Suggestions */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-semibold text-koffa-green flex items-center gap-2">
              <span className="text-lg">💡</span> Smart Suggestions
            </h2>
            <Button variant="link" className="text-sm text-koffa-accent-blue p-0 h-auto">View All</Button>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {/* Running Low */}
            <Card className="border-koffa-beige/30 p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-koffa-accent-orange text-lg">⬇️</span>
                <h3 className="font-medium text-koffa-green">Running Low</h3>
              </div>
              <ul className="text-sm space-y-1 text-koffa-green-dark">
                {smartSuggestions.runningLow.map(item => (
                  <li key={item} className="flex items-center gap-2">
                    <span>•</span> {item}
                  </li>
                ))}
              </ul>
            </Card>
            
            {/* Frequently Bought */}
            <Card className="border-koffa-beige/30 p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-koffa-accent-blue text-lg">🕒</span>
                <h3 className="font-medium text-koffa-green">Frequently Bought</h3>
              </div>
              <ul className="text-sm space-y-1 text-koffa-green-dark">
                {smartSuggestions.frequentlyBought.map(item => (
                  <li key={item} className="flex items-center gap-2">
                    <span>•</span> {item}
                  </li>
                ))}
              </ul>
            </Card>
            
            {/* Best Deals */}
            <Card className="border-koffa-beige/30 p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-koffa-accent-green text-lg">💰</span>
                <h3 className="font-medium text-koffa-green">Best Deals</h3>
              </div>
              <ul className="text-sm space-y-1 text-koffa-green-dark">
                {smartSuggestions.bestDeals.map(item => (
                  <li key={item} className="flex items-center gap-2">
                    <span>•</span> {item}
                  </li>
                ))}
              </ul>
            </Card>
            
            {/* Seasonal Items */}
            <Card className="border-koffa-beige/30 p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-purple-500 text-lg">🌱</span>
                <h3 className="font-medium text-koffa-green">Seasonal Items</h3>
              </div>
              <ul className="text-sm space-y-1 text-koffa-green-dark">
                {smartSuggestions.seasonal.map(item => (
                  <li key={item} className="flex items-center gap-2">
                    <span>•</span> {item}
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
        
        {/* Shopping Activity */}
        <div className="mb-8">
          <h2 className="font-semibold text-koffa-green mb-3">Shopping Activity</h2>
          <Card className="border-koffa-beige/30 p-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-blue-500 mb-1">
                  <span role="img" aria-label="steps" className="text-2xl">👣</span>
                </div>
                <p className="text-xl font-bold text-koffa-green">{shoppingActivity.steps.toLocaleString()}</p>
                <p className="text-xs text-koffa-green-dark">Steps</p>
              </div>
              
              <div className="text-center">
                <div className="text-green-500 mb-1">
                  <span role="img" aria-label="miles" className="text-2xl">📍</span>
                </div>
                <p className="text-xl font-bold text-koffa-green">{shoppingActivity.miles}</p>
                <p className="text-xs text-koffa-green-dark">Miles</p>
              </div>
              
              <div className="text-center">
                <div className="text-orange-500 mb-1">
                  <span role="img" aria-label="calories" className="text-2xl">🔥</span>
                </div>
                <p className="text-xl font-bold text-koffa-green">{shoppingActivity.calories}</p>
                <p className="text-xs text-koffa-green-dark">Calories</p>
              </div>
            </div>
            
            <div className="bg-koffa-beige-light rounded-lg p-3 mt-4">
              <div className="flex items-start gap-2">
                <span className="text-koffa-green bg-koffa-beige-dark h-6 w-6 rounded-full flex items-center justify-center text-xs mt-1">!</span>
                <div>
                  <p className="text-sm font-medium text-koffa-green">Fun Fact!</p>
                  <p className="text-xs text-koffa-green-dark">
                    That's equivalent to walking around a football field 1.5 times! Keep up the healthy shopping!
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
        
        {/* Active Shopping Lists */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-semibold text-koffa-green">Active Shopping Lists</h2>
            <div className="flex gap-1">
              <Button variant="ghost" className="p-1 h-auto w-auto text-koffa-green">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="8" x2="21" y1="6" y2="6" />
                  <line x1="8" x2="21" y1="12" y2="12" />
                  <line x1="8" x2="21" y1="18" y2="18" />
                  <line x1="3" x2="3" y1="6" y2="6" />
                  <line x1="3" x2="3" y1="12" y2="12" />
                  <line x1="3" x2="3" y1="18" y2="18" />
                </svg>
              </Button>
              <Button variant="ghost" className="p-1 h-auto w-auto text-koffa-green">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                  <line x1="3" x2="21" y1="9" y2="9" />
                  <line x1="3" x2="21" y1="15" y2="15" />
                  <line x1="9" x2="9" y1="3" y2="21" />
                  <line x1="15" x2="15" y1="3" y2="21" />
                </svg>
              </Button>
              <Button variant="ghost" className="p-1 h-auto w-auto text-koffa-green">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8 3H5a2 2 0 0 0-2 2v3" />
                  <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
                  <path d="M3 16v3a2 2 0 0 0 2 2h3" />
                  <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
                </svg>
              </Button>
            </div>
          </div>
          
          {activeLists.length > 0 ? (
            <div className="space-y-4">
              {activeLists.map(list => (
                <Card key={list.id} className="border-koffa-beige/30 p-4">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium text-koffa-green">{list.name}</h3>
                      <p className="text-xs text-koffa-green-dark flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
                          <path d="M3 9V6a2 2 0 0 1 2-2h2" />
                          <path d="M19 4V2" />
                          <path d="M15 4V2" />
                          <path d="M15 4h-5a2 2 0 0 0-2 2v3" />
                        </svg>
                        {list.store}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      {list.members.map((member, idx) => (
                        <div key={idx} className="text-sm">{member}</div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-koffa-green-dark">Progress</span>
                      <span className="font-medium text-koffa-green">{list.progress}%</span>
                    </div>
                    <div className="w-full bg-koffa-beige-light rounded-full h-2">
                      <div 
                        className="bg-koffa-green h-2 rounded-full" 
                        style={{ width: `${list.progress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs mt-2 text-koffa-green-dark">
                      {list.itemCount} items • {list.inCart} in cart
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-koffa-beige/30 p-6 text-center">
              <p className="text-koffa-green-dark mb-3">No active lists</p>
              <Button 
                className="bg-koffa-green hover:bg-koffa-green-dark text-white"
                onClick={() => navigate('/lists/new')}
              >
                Create a New List
              </Button>
            </Card>
          )}
        </div>
      </div>
      
      {/* Floating Navigation */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white rounded-full shadow-lg px-6 py-2 w-[90%] max-w-md border border-koffa-beige/20">
        <div className="flex justify-around items-center relative">
          <Button variant="ghost" className="koffa-nav-button text-koffa-green">
            <HomeIcon size={20} />
            <span>Home</span>
          </Button>
          
          <Button variant="ghost" className="koffa-nav-button text-koffa-green-dark">
            <List size={20} />
            <span>Lists</span>
          </Button>
          
          <div className="-mt-10 bg-white rounded-full p-2 absolute left-1/2 -translate-x-1/2 -translate-y-1/2">
            <Button className="rounded-full w-14 h-14 bg-koffa-green hover:bg-koffa-green-dark flex items-center justify-center shadow-lg">
              <ShoppingCart size={24} className="text-white" />
            </Button>
          </div>
          
          <Button variant="ghost" className="koffa-nav-button text-koffa-green-dark">
            <Package size={20} />
            <span>Pantry</span>
          </Button>
          
          <Button variant="ghost" className="koffa-nav-button text-koffa-green-dark">
            <span className="w-5 h-5 rounded-full bg-koffa-beige flex items-center justify-center">
              JD
            </span>
            <span>Profile</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
