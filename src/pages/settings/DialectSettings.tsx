
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Search, Globe, Languages } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import PageNavigation from '@/components/PageNavigation';

const DialectSettings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { settings, updateSettings } = useSettings();
  const [searchTerm, setSearchTerm] = useState('');
  const [customTermWord, setCustomTermWord] = useState('');
  const [selectedStandardTerm, setSelectedStandardTerm] = useState('Shopping List');
  const [loading, setLoading] = useState(false);
  
  const standardTermOptions = [
    'Shopping List',
    'Low Stock',
    'Task',
    'Tomatoes',
    'Home'
  ];

  // Mock dialects data since the table doesn't exist
  const mockDialects = [
    { id: '1', name: 'Standard Arabic', region: 'Standard' },
    { id: '2', name: 'Egyptian', region: 'Egypt' },
    { id: '3', name: 'Tunisian', region: 'Tunisia' },
    { id: '4', name: 'Moroccan', region: 'Morocco' },
    { id: '5', name: 'Lebanese', region: 'Lebanon' }
  ];

  // Mock comparison terms
  const mockComparisonTerms = [
    { standard_term: 'Shopping List', dialect_name: 'Standard Arabic', custom_term: 'قائمة التسوق' },
    { standard_term: 'Shopping List', dialect_name: 'Egyptian', custom_term: 'لستة الشراء' },
    { standard_term: 'Shopping List', dialect_name: 'Tunisian', custom_term: 'قائمة الخدمات' },
    { standard_term: 'Low Stock', dialect_name: 'Standard Arabic', custom_term: 'مخزون منخفض' },
    { standard_term: 'Low Stock', dialect_name: 'Egyptian', custom_term: 'مخزون قليل' },
    { standard_term: 'Task', dialect_name: 'Standard Arabic', custom_term: 'مهمة' },
    { standard_term: 'Task', dialect_name: 'Egyptian', custom_term: 'شغلة' }
  ];

  const handleDialectChange = (dialectId: string) => {
    updateSettings({ preferred_dialect_id: dialectId } as any);
    toast.success('Dialect preference updated');
  };
  
  const handleLanguageChange = (value: string) => {
    updateSettings({ language: value as any });
    toast.success(`Language changed to ${value}`);
  };
  
  const handleSearch = () => {
    // Mock search functionality
    toast.info('Search functionality coming soon');
  };
  
  const saveCustomTerm = async () => {
    if (!customTermWord || !selectedStandardTerm) {
      toast.error('Please fill in all fields');
      return;
    }
    
    // Mock save functionality
    toast.success('Custom term saved successfully (demo mode)');
    setCustomTermWord('');
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
        
        <h1 className="text-xl font-semibold text-koffa-green">Language & Dialect</h1>
        
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
          <h2 className="text-lg font-semibold text-koffa-green flex items-center mb-4">
            <Globe className="mr-2" size={20} />
            Interface Language
          </h2>
          
          <RadioGroup 
            value={settings.language} 
            onValueChange={handleLanguageChange}
            className="space-y-3"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="arabic" id="arabic" />
              <Label htmlFor="arabic" className="flex items-center">
                <span className="mr-2">العربية</span>
                <span className="text-xs text-gray-500">(RTL)</span>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="english" id="english" />
              <Label htmlFor="english" className="flex items-center">
                <span className="mr-2">English</span>
                <span className="text-xs text-gray-500">(LTR)</span>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="other" id="other-lang" />
              <Label htmlFor="other-lang">Other</Label>
            </div>
          </RadioGroup>
          
          <Button 
            className="mt-4 bg-koffa-green text-white hover:bg-koffa-green-dark"
          >
            Apply Language
          </Button>
        </Card>
        
        {settings.language === 'arabic' && (
          <>
            <Card className="border-koffa-beige/30 p-6 mb-6">
              <h2 className="text-lg font-semibold text-koffa-green flex items-center mb-4">
                <Languages className="mr-2" size={20} />
                Choose Regional Arabic Dialect
              </h2>
              
              <RadioGroup 
                value={settings.preferred_dialect_id || mockDialects[0].id} 
                onValueChange={handleDialectChange}
                className="grid grid-cols-1 gap-2"
              >
                {mockDialects.map((dialect) => (
                  <div key={dialect.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={dialect.id} id={`dialect-${dialect.id}`} />
                    <Label 
                      htmlFor={`dialect-${dialect.id}`} 
                      className="flex items-center justify-between w-full"
                    >
                      <span>{dialect.name}</span>
                      <span className="text-xs text-gray-500 rtl:font-arabic">
                        {dialect.region !== 'Standard' && `(${dialect.region})`}
                      </span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              
              <Button 
                className="mt-4 bg-koffa-green text-white hover:bg-koffa-green-dark"
                onClick={() => toast.success("Dialect saved")}
              >
                Save Dialect
              </Button>
            </Card>
            
            <Card className="border-koffa-beige/30 p-6 mb-6">
              <h2 className="text-lg font-semibold text-koffa-green flex items-center mb-4">
                <Search className="mr-2" size={20} />
                Term Preview (Live Comparison)
              </h2>
              
              <div className="flex gap-2 mb-4">
                <Input 
                  placeholder="Search term" 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                  className="flex-1"
                />
                <Button 
                  variant="outline" 
                  onClick={handleSearch}
                >
                  Search
                </Button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-koffa-beige">
                      <th className="text-left py-2 px-3">Term</th>
                      <th className="text-left py-2 px-3">فصحى</th>
                      <th className="text-left py-2 px-3">تونسي</th>
                      <th className="text-left py-2 px-3">مصري</th>
                    </tr>
                  </thead>
                  <tbody>
                    {standardTermOptions.map((term) => (
                      <tr key={term} className="border-b border-koffa-beige/40">
                        <td className="py-2 px-3">{term}</td>
                        <td className="py-2 px-3 font-arabic">
                          {mockComparisonTerms.find(t => t.standard_term === term && t.dialect_name === 'Standard Arabic')?.custom_term || '-'}
                        </td>
                        <td className="py-2 px-3 font-arabic">
                          {mockComparisonTerms.find(t => t.standard_term === term && t.dialect_name === 'Tunisian')?.custom_term || '-'}
                        </td>
                        <td className="py-2 px-3 font-arabic">
                          {mockComparisonTerms.find(t => t.standard_term === term && t.dialect_name === 'Egyptian')?.custom_term || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <Button 
                className="mt-4 w-full flex items-center justify-center"
                variant="outline"
                onClick={() => toast.info("Feature coming soon")}
              >
                <span className="mr-2">▶️</span> View All Terms for My Dialect
              </Button>
            </Card>
            
            <Card className="border-koffa-beige/30 p-6 mb-6">
              <h2 className="text-lg font-semibold text-koffa-green mb-4">Customize My Dialect (Advanced Users)</h2>
              <p className="text-sm text-koffa-green-dark mb-4">Can't find your word? Add it below.</p>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-koffa-green-dark mb-1 block">Select Term:</label>
                  <Select
                    value={selectedStandardTerm}
                    onValueChange={setSelectedStandardTerm}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Term" />
                    </SelectTrigger>
                    <SelectContent>
                      {standardTermOptions.map((term) => (
                        <SelectItem key={term} value={term}>{term}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm text-koffa-green-dark mb-1 block">Custom Word:</label>
                  <div className="flex gap-2">
                    <Input 
                      dir="rtl" 
                      className="font-arabic flex-1" 
                      placeholder="أدخل المصطلح الخاص بك"
                      value={customTermWord}
                      onChange={(e) => setCustomTermWord(e.target.value)}
                    />
                    <Button 
                      onClick={saveCustomTerm}
                      disabled={!customTermWord || !selectedStandardTerm}
                    >
                      Save
                    </Button>
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-koffa-accent-blue mt-4 flex items-center">
                <span className="mr-2">💡</span> Use this to teach the app new regional slang.
              </p>
            </Card>
            
            <Card className="border-koffa-beige/30 p-6 mb-6">
              <h2 className="text-lg font-semibold text-koffa-green mb-4">Notes:</h2>
              <ul className="list-disc list-inside space-y-2 text-koffa-green-dark">
                <li>Colloquial labels apply to pantry, shopping, task flows.</li>
                <li>System UI stays readable for clarity.</li>
                <li>You can help grow your dialect's dictionary!</li>
              </ul>
            </Card>
          </>
        )}
        
        <Button 
          className="w-full bg-koffa-green hover:bg-koffa-green-dark text-white"
          onClick={() => {
            toast.success('All changes saved');
            navigate('/settings');
          }}
        >
          Save All Changes
        </Button>
      </div>
      
      <PageNavigation />
    </div>
  );
};

export default DialectSettings;
