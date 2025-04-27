
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Home, ArrowLeft, CircleDot } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

const AppearanceSettings = () => {
  const navigate = useNavigate();
  const { settings, updateSettings } = useSettings();
  
  const handleLanguageChange = (value: string) => {
    updateSettings({ language: value as any });
    toast.success(`Language changed to ${value}`);
  };
  
  const handleThemeChange = (value: string) => {
    updateSettings({ theme: value as any });
    toast.success(`Theme changed to ${value}`);
  };
  
  const handleTextSizeChange = (value: string) => {
    updateSettings({ textSize: value as any });
    toast.success(`Text size changed to ${value}`);
  };
  
  const handleAccessibilityChange = (key: keyof typeof settings, checked: boolean) => {
    updateSettings({ [key]: checked });
  };
  
  const handleNavItemChange = (item: string, checked: boolean) => {
    if (checked) {
      if (settings.navItems.length < 5) {
        updateSettings({ navItems: [...settings.navItems, item as any] });
      } else {
        toast.error("You can only select up to 5 items for the navigation bar");
      }
    } else {
      if (settings.navItems.length > 1) {
        updateSettings({ navItems: settings.navItems.filter(i => i !== item) });
      } else {
        toast.error("You must have at least one item in the navigation bar");
      }
    }
  };
  
  const handleSaveChanges = () => {
    toast.success("Your changes have been saved");
    navigate('/settings');
  };
  
  return (
    <div className="min-h-screen bg-koffa-beige-light pb-24">
      {/* Header */}
      <div className="bg-koffa-beige-light p-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            className="mr-2 h-8 w-8 p-0" 
            onClick={() => navigate('/settings')}
          >
            <ArrowLeft size={20} className="text-koffa-green" />
          </Button>
          <Logo size="sm" />
        </div>
        
        <h1 className="text-xl font-semibold text-koffa-green">Appearance</h1>
        
        <Button 
          variant="ghost" 
          className="rounded-full p-2 h-auto w-auto"
          onClick={() => navigate('/profile')}
        >
          <div className="w-8 h-8 rounded-full bg-koffa-beige flex items-center justify-center text-sm font-medium text-koffa-green">
            JD
          </div>
        </Button>
      </div>
      
      {/* Tab Navigation */}
      <div className="flex overflow-x-auto hide-scrollbar border-b border-koffa-beige/40">
        <Button 
          variant="ghost" 
          className="px-4 py-2 text-koffa-green-dark"
          onClick={() => navigate('/settings/account')}
        >
          <span className="mr-2">👤</span> Account
        </Button>
        <Button 
          variant="ghost" 
          className="px-4 py-2 text-koffa-green-dark"
          onClick={() => navigate('/home')}
        >
          <span className="mr-2">🏠</span> Home
        </Button>
        <Button 
          variant="ghost" 
          className="px-4 py-2 border-b-2 border-koffa-green text-koffa-green font-medium"
        >
          <span className="mr-2">🎨</span> Appearance
        </Button>
        <Button 
          variant="ghost" 
          className="px-4 py-2 text-koffa-green-dark"
          onClick={() => navigate('/settings/notifications')}
        >
          <span className="mr-2">🔔</span> Notifications
        </Button>
      </div>
      
      {/* Main content */}
      <div className="px-4 py-6">
        <Card className="border-koffa-beige/30 p-6 mb-6">
          <h2 className="text-lg font-semibold text-koffa-green mb-4">Appearance Settings</h2>
          
          <div className="space-y-6">
            {/* Language */}
            <div>
              <h3 className="font-medium text-koffa-green mb-2">Language:</h3>
              <RadioGroup 
                value={settings.language} 
                onValueChange={handleLanguageChange}
                className="flex flex-wrap gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="english" id="english" />
                  <Label htmlFor="english">English</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="arabic" id="arabic" />
                  <Label htmlFor="arabic">Arabic</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other" id="other-lang" />
                  <Label htmlFor="other-lang">Other</Label>
                </div>
              </RadioGroup>
            </div>
            
            {/* Theme */}
            <div>
              <h3 className="font-medium text-koffa-green mb-2">Theme:</h3>
              <RadioGroup 
                value={settings.theme} 
                onValueChange={handleThemeChange}
                className="flex flex-wrap gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="light" id="light" />
                  <Label htmlFor="light">Light</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="dark" id="dark" />
                  <Label htmlFor="dark">Dark</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="system" id="system" />
                  <Label htmlFor="system">System Default</Label>
                </div>
              </RadioGroup>
            </div>
            
            {/* Text Size */}
            <div>
              <h3 className="font-medium text-koffa-green mb-2">Text Size:</h3>
              <RadioGroup 
                value={settings.textSize} 
                onValueChange={handleTextSizeChange}
                className="flex flex-wrap gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="small" id="small" />
                  <Label htmlFor="small">Small</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id="medium" />
                  <Label htmlFor="medium">Medium</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="large" id="large" />
                  <Label htmlFor="large">Large</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="extraLarge" id="extraLarge" />
                  <Label htmlFor="extraLarge">Extra Large</Label>
                </div>
              </RadioGroup>
            </div>
            
            {/* Accessibility */}
            <div>
              <h3 className="font-medium text-koffa-green mb-2">Accessibility:</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="highContrastMode" 
                    checked={settings.highContrastMode}
                    onCheckedChange={(checked) => handleAccessibilityChange('highContrastMode', checked as boolean)}
                  />
                  <label
                    htmlFor="highContrastMode"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    High Contrast Mode
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="screenReaderCompatible" 
                    checked={settings.screenReaderCompatible}
                    onCheckedChange={(checked) => handleAccessibilityChange('screenReaderCompatible', checked as boolean)}
                  />
                  <label
                    htmlFor="screenReaderCompatible"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Screen Reader Compatible
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="voiceCommands" 
                    checked={settings.voiceCommands}
                    onCheckedChange={(checked) => handleAccessibilityChange('voiceCommands', checked as boolean)}
                  />
                  <label
                    htmlFor="voiceCommands"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Voice Commands
                  </label>
                </div>
              </div>
            </div>
          </div>
        </Card>
        
        <Card className="border-koffa-beige/30 p-6">
          <h2 className="text-lg font-semibold text-koffa-green mb-4">Navigation Bar Customization</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-medium text-koffa-green mb-2">Select 5 items to display in your navigation bar:</h3>
              <div className="grid grid-cols-3 gap-2">
                {['home', 'pantry', 'shopping', 'spaces', 'family', 'tasks', 'calendar', 'notes', 'settings'].map((item) => (
                  <div key={item} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`nav-${item}`} 
                      checked={settings.navItems.includes(item as any)}
                      onCheckedChange={(checked) => handleNavItemChange(item, checked as boolean)}
                    />
                    <label
                      htmlFor={`nav-${item}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize"
                    >
                      {item}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-koffa-green mb-2">Navigation Bar Order:</h3>
              <div className="bg-koffa-beige/20 p-3 rounded-md flex flex-wrap gap-2">
                {settings.navItems.map((item, index) => (
                  <div key={item} className="flex items-center bg-white px-3 py-1 rounded-full shadow-sm">
                    <span className="text-koffa-green-dark mr-1">{index + 1}.</span>
                    <span className="text-koffa-green capitalize">{item}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-koffa-green-dark mt-1">Drag and reorder functionality coming soon</p>
            </div>
            
            <Button 
              className="w-full bg-koffa-green hover:bg-koffa-green-dark text-white"
              onClick={handleSaveChanges}
            >
              Save Changes
            </Button>
          </div>
        </Card>
      </div>
      
      {/* Floating Navigation */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white rounded-full shadow-lg px-6 py-3 w-[80%] max-w-sm border border-koffa-beige/20 transition-all duration-300 hover:shadow-xl">
        <div className="flex justify-around items-center">
          <Button 
            variant="ghost" 
            className="p-2 h-auto w-14 hover:bg-koffa-beige-light rounded-full transition-all duration-300"
            onClick={() => navigate('/home')}
          >
            <Home size={28} className="text-koffa-green-dark" />
          </Button>
          
          {settings.navItems.slice(1, 4).map((item, index) => {
            const getIcon = () => {
              switch (item) {
                case 'pantry':
                  return <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-koffa-green-dark">
                    <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
                    <path d="M3 9V6a2 2 0 0 1 2-2h2" />
                    <path d="M19 4V2" />
                    <path d="M15 4V2" />
                    <path d="M15 4h-5a2 2 0 0 0-2 2v3" />
                  </svg>;
                case 'shopping':
                  return <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-koffa-green-dark">
                    <path d="M8 3H5a2 2 0 0 0-2 2v3" />
                    <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
                    <path d="M3 16v3a2 2 0 0 0 2 2h3" />
                    <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
                  </svg>;
                default:
                  return <Home size={28} className="text-koffa-green-dark" />;
              }
            };
            
            return (
              <Button 
                key={index}
                variant="ghost" 
                className="p-2 h-auto w-14 hover:bg-koffa-beige-light rounded-full transition-all duration-300"
                onClick={() => navigate(`/${item}`)}
              >
                {getIcon()}
              </Button>
            );
          })}
          
          <Button 
            variant="ghost" 
            className="p-2 h-auto w-14 hover:bg-koffa-beige-light rounded-full transition-all duration-300"
            onClick={() => navigate('/profile')}
          >
            <div className="w-8 h-8 rounded-full bg-koffa-beige flex items-center justify-center text-sm font-medium text-koffa-green">
              JD
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AppearanceSettings;
