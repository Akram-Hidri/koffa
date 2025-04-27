
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Home, ArrowLeft } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

const AccessibilitySettings = () => {
  const navigate = useNavigate();
  const { settings, updateSettings } = useSettings();
  
  const handleTextSizeChange = (value: string) => {
    updateSettings({ textSize: value as any });
    toast.success(`Text size changed to ${value}`);
  };
  
  const handleContrastChange = (value: string) => {
    updateSettings({ highContrastMode: value === 'highContrast' });
    toast.success(`Contrast mode changed`);
  };
  
  const handleToggleSetting = (setting: keyof typeof settings, value: boolean) => {
    updateSettings({ [setting]: value });
    const settingName = setting.replace(/([A-Z])/g, ' $1').toLowerCase();
    toast.success(`${settingName} ${value ? 'enabled' : 'disabled'}`);
  };
  
  const handleInputMethodChange = (value: string) => {
    updateSettings({ inputMethod: value as any });
    toast.success(`Input method changed to ${value}`);
  };
  
  const applyChanges = () => {
    toast.success("Your accessibility settings have been applied");
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
        
        <h1 className="text-xl font-semibold text-koffa-green">Accessibility</h1>
        
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
      
      {/* Main content */}
      <div className="px-4 py-6">
        <Card className="border-koffa-beige/30 p-6 mb-6">
          <h2 className="text-lg font-semibold text-koffa-green mb-4">Vision Settings</h2>
          
          <div className="space-y-6">
            {/* Text Size */}
            <div>
              <h3 className="font-medium text-koffa-green mb-2">Text Size:</h3>
              <RadioGroup 
                value={settings.textSize} 
                onValueChange={handleTextSizeChange}
                className="flex flex-wrap gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id="default-size" />
                  <Label htmlFor="default-size">Default</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="large" id="large-size" />
                  <Label htmlFor="large-size">Large</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="extraLarge" id="extra-large-size" />
                  <Label htmlFor="extra-large-size">Extra Large</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="huge" id="huge-size" />
                  <Label htmlFor="huge-size">Huge</Label>
                </div>
              </RadioGroup>
            </div>
            
            {/* Contrast */}
            <div>
              <h3 className="font-medium text-koffa-green mb-2">Contrast:</h3>
              <RadioGroup 
                value={settings.highContrastMode ? 'highContrast' : 'normal'} 
                onValueChange={handleContrastChange}
                className="flex flex-wrap gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="normal" id="normal-contrast" />
                  <Label htmlFor="normal-contrast">Normal</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="highContrast" id="high-contrast" />
                  <Label htmlFor="high-contrast">High Contrast</Label>
                </div>
              </RadioGroup>
            </div>
            
            {/* Visual Preferences */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="boldText" 
                  checked={settings.boldText}
                  onCheckedChange={(checked) => handleToggleSetting('boldText', checked as boolean)}
                />
                <label
                  htmlFor="boldText"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Bold Text
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="reduceTransparency" 
                  checked={settings.reduceTransparency}
                  onCheckedChange={(checked) => handleToggleSetting('reduceTransparency', checked as boolean)}
                />
                <label
                  htmlFor="reduceTransparency"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Reduce Transparency
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="reduceMotion" 
                  checked={settings.reduceMotion}
                  onCheckedChange={(checked) => handleToggleSetting('reduceMotion', checked as boolean)}
                />
                <label
                  htmlFor="reduceMotion"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Reduce Motion
                </label>
              </div>
            </div>
          </div>
        </Card>
        
        <Card className="border-koffa-beige/30 p-6 mb-6">
          <h2 className="text-lg font-semibold text-koffa-green mb-4">Interaction Settings</h2>
          
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="voiceCommands" 
                  checked={settings.voiceCommands}
                  onCheckedChange={(checked) => handleToggleSetting('voiceCommands', checked as boolean)}
                />
                <label
                  htmlFor="voiceCommands"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Voice Commands
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="screenReaderSupport" 
                  checked={settings.screenReaderCompatible}
                  onCheckedChange={(checked) => handleToggleSetting('screenReaderCompatible', checked as boolean)}
                />
                <label
                  htmlFor="screenReaderSupport"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Screen Reader Support
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="touchAccommodations" 
                  checked={settings.touchAccommodations}
                  onCheckedChange={(checked) => handleToggleSetting('touchAccommodations', checked as boolean)}
                />
                <label
                  htmlFor="touchAccommodations"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Touch Accommodations
                </label>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-koffa-green mb-2">Input Method:</h3>
              <RadioGroup 
                value={settings.inputMethod} 
                onValueChange={handleInputMethodChange}
                className="flex flex-wrap gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="touch" id="touch-input" />
                  <Label htmlFor="touch-input">Touch</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="voice" id="voice-input" />
                  <Label htmlFor="voice-input">Voice</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="switch" id="switch-input" />
                  <Label htmlFor="switch-input">Switch Control</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </Card>
        
        <Card className="border-koffa-beige/30 p-6 mb-6">
          <h2 className="text-lg font-semibold text-koffa-green mb-4">Simplified Interface</h2>
          
          <div className="space-y-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="simplifiedMode" 
                  checked={settings.simplifiedMode}
                  onCheckedChange={(checked) => handleToggleSetting('simplifiedMode', checked as boolean)}
                />
                <label
                  htmlFor="simplifiedMode"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Enable Simplified Mode
                </label>
              </div>
              <p className="text-xs text-koffa-green-dark ml-6">Shows fewer options and larger buttons</p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="showLabelsWithIcons" 
                checked={settings.showLabelsWithIcons}
                onCheckedChange={(checked) => handleToggleSetting('showLabelsWithIcons', checked as boolean)}
              />
              <label
                htmlFor="showLabelsWithIcons"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Show Labels with Icons
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="reduceAnimations" 
                checked={settings.reduceAnimations}
                onCheckedChange={(checked) => handleToggleSetting('reduceAnimations', checked as boolean)}
              />
              <label
                htmlFor="reduceAnimations"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Reduce Animations
              </label>
            </div>
            
            <Button 
              className="w-full bg-koffa-green hover:bg-koffa-green-dark text-white mt-4"
              onClick={applyChanges}
            >
              Apply Changes
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
          
          <Button 
            variant="ghost" 
            className="p-2 h-auto w-14 hover:bg-koffa-beige-light rounded-full transition-all duration-300"
            onClick={() => navigate('/settings')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-koffa-green-dark">
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </Button>
          
          <Button 
            variant="ghost" 
            className="p-2 h-auto w-14 hover:bg-koffa-beige-light rounded-full transition-all duration-300"
            onClick={() => navigate('/home')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-koffa-green-dark">
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AccessibilitySettings;
