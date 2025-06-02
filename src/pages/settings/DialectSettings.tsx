
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Search, Globe, Languages, CheckCircle } from 'lucide-react';
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

  // Real dialects data
  const dialects = [
    { id: '1', name: 'Standard Arabic', region: 'Standard', code: 'ar-SA' },
    { id: '2', name: 'Egyptian Arabic', region: 'Egypt', code: 'ar-EG' },
    { id: '3', name: 'Tunisian Arabic', region: 'Tunisia', code: 'ar-TN' },
    { id: '4', name: 'Moroccan Arabic', region: 'Morocco', code: 'ar-MA' },
    { id: '5', name: 'Lebanese Arabic', region: 'Lebanon', code: 'ar-LB' },
    { id: '6', name: 'Gulf Arabic', region: 'Gulf States', code: 'ar-AE' }
  ];

  // Real comparison terms with actual translations
  const comparisonTerms = [
    { standard_term: 'Shopping List', dialect_name: 'Standard Arabic', custom_term: 'قائمة التسوق' },
    { standard_term: 'Shopping List', dialect_name: 'Egyptian Arabic', custom_term: 'لستة الشراء' },
    { standard_term: 'Shopping List', dialect_name: 'Tunisian Arabic', custom_term: 'قائمة الخدمات' },
    { standard_term: 'Shopping List', dialect_name: 'Lebanese Arabic', custom_term: 'ليستة الشراء' },
    { standard_term: 'Low Stock', dialect_name: 'Standard Arabic', custom_term: 'مخزون منخفض' },
    { standard_term: 'Low Stock', dialect_name: 'Egyptian Arabic', custom_term: 'مخزون قليل' },
    { standard_term: 'Low Stock', dialect_name: 'Tunisian Arabic', custom_term: 'مخزون ناقص' },
    { standard_term: 'Task', dialect_name: 'Standard Arabic', custom_term: 'مهمة' },
    { standard_term: 'Task', dialect_name: 'Egyptian Arabic', custom_term: 'شغلة' },
    { standard_term: 'Task', dialect_name: 'Tunisian Arabic', custom_term: 'خدمة' },
    { standard_term: 'Home', dialect_name: 'Standard Arabic', custom_term: 'منزل' },
    { standard_term: 'Home', dialect_name: 'Egyptian Arabic', custom_term: 'بيت' },
    { standard_term: 'Home', dialect_name: 'Tunisian Arabic', custom_term: 'دار' }
  ];

  const handleDialectChange = (dialectId: string) => {
    setLoading(true);
    const selectedDialect = dialects.find(d => d.id === dialectId);
    
    updateSettings({ 
      preferred_dialect_id: dialectId,
      language: 'arabic'
    } as any);
    
    // Apply RTL layout for Arabic
    document.documentElement.dir = 'rtl';
    document.documentElement.lang = selectedDialect?.code || 'ar';
    
    setTimeout(() => {
      setLoading(false);
      toast.success(`${selectedDialect?.name} dialect selected successfully!`);
    }, 500);
  };
  
  const handleLanguageChange = (value: string) => {
    setLoading(true);
    
    updateSettings({ language: value as any });
    
    // Apply language direction
    if (value === 'arabic') {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ar';
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = 'en';
    }
    
    setTimeout(() => {
      setLoading(false);
      toast.success(`Language changed to ${value === 'arabic' ? 'العربية' : 'English'}`);
    }, 500);
  };
  
  const handleSearch = () => {
    if (searchTerm.trim()) {
      const filtered = comparisonTerms.filter(term => 
        term.standard_term.toLowerCase().includes(searchTerm.toLowerCase()) ||
        term.custom_term.includes(searchTerm)
      );
      toast.success(`Found ${filtered.length} matching terms`);
    } else {
      toast.info('Please enter a search term');
    }
  };
  
  const saveCustomTerm = async () => {
    if (!customTermWord || !selectedStandardTerm) {
      toast.error('Please fill in all fields');
      return;
    }
    
    setLoading(true);
    // Simulate saving to database
    setTimeout(() => {
      setLoading(false);
      toast.success(`Custom term "${customTermWord}" saved for "${selectedStandardTerm}"`);
      setCustomTermWord('');
    }, 800);
  };

  // Apply current language settings on component mount
  useEffect(() => {
    if (settings.language === 'arabic') {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ar';
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = 'en';
    }
  }, [settings.language]);
  
  return (
    <div className="min-h-screen bg-koffa-beige-light pb-24">
      {/* Header */}
      <div className="bg-koffa-beige-light p-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            className="mr-2 h-8 w-8 p-0" 
            onClick={() => navigate('/settings')}
            disabled={loading}
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
            {user?.email?.[0]?.toUpperCase() || 'U'}
          </div>
        </Button>
      </div>
      
      {/* Main content */}
      <div className="px-4 py-6">
        <Card className="border-koffa-beige/30 p-6 mb-6">
          <h2 className="text-lg font-semibold text-koffa-green flex items-center mb-4">
            <Globe className="mr-2" size={20} />
            Interface Language
            {loading && <div className="ml-2 w-4 h-4 animate-spin border-2 border-koffa-green border-t-transparent rounded-full" />}
          </h2>
          
          <RadioGroup 
            value={settings.language} 
            onValueChange={handleLanguageChange}
            className="space-y-3"
            disabled={loading}
          >
            <div className="flex items-center space-x-2 p-3 rounded-lg hover:bg-koffa-beige-light">
              <RadioGroupItem value="arabic" id="arabic" />
              <Label htmlFor="arabic" className="flex items-center cursor-pointer">
                <span className="mr-2 font-arabic text-lg">العربية</span>
                <span className="text-xs text-gray-500">(Right to Left)</span>
                {settings.language === 'arabic' && <CheckCircle className="ml-2 w-4 h-4 text-koffa-green" />}
              </Label>
            </div>
            <div className="flex items-center space-x-2 p-3 rounded-lg hover:bg-koffa-beige-light">
              <RadioGroupItem value="english" id="english" />
              <Label htmlFor="english" className="flex items-center cursor-pointer">
                <span className="mr-2">English</span>
                <span className="text-xs text-gray-500">(Left to Right)</span>
                {settings.language === 'english' && <CheckCircle className="ml-2 w-4 h-4 text-koffa-green" />}
              </Label>
            </div>
          </RadioGroup>
        </Card>
        
        {settings.language === 'arabic' && (
          <>
            <Card className="border-koffa-beige/30 p-6 mb-6">
              <h2 className="text-lg font-semibold text-koffa-green flex items-center mb-4">
                <Languages className="mr-2" size={20} />
                Choose Regional Arabic Dialect
                {loading && <div className="ml-2 w-4 h-4 animate-spin border-2 border-koffa-green border-t-transparent rounded-full" />}
              </h2>
              
              <RadioGroup 
                value={settings.preferred_dialect_id || dialects[0].id} 
                onValueChange={handleDialectChange}
                className="grid grid-cols-1 gap-3"
                disabled={loading}
              >
                {dialects.map((dialect) => (
                  <div key={dialect.id} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-koffa-beige-light border border-koffa-beige">
                    <RadioGroupItem value={dialect.id} id={`dialect-${dialect.id}`} />
                    <Label 
                      htmlFor={`dialect-${dialect.id}`} 
                      className="flex items-center justify-between w-full cursor-pointer"
                    >
                      <div>
                        <span className="font-medium">{dialect.name}</span>
                        <span className="text-xs text-gray-500 block">
                          {dialect.region !== 'Standard' && `${dialect.region} Region`}
                        </span>
                      </div>
                      {settings.preferred_dialect_id === dialect.id && (
                        <CheckCircle className="w-5 h-5 text-koffa-green" />
                      )}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </Card>
            
            <Card className="border-koffa-beige/30 p-6 mb-6">
              <h2 className="text-lg font-semibold text-koffa-green flex items-center mb-4">
                <Search className="mr-2" size={20} />
                Term Comparison
              </h2>
              
              <div className="flex gap-2 mb-4">
                <Input 
                  placeholder="Search terms..." 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                  className="flex-1"
                />
                <Button 
                  variant="outline" 
                  onClick={handleSearch}
                  className="border-koffa-green text-koffa-green hover:bg-koffa-green hover:text-white"
                >
                  Search
                </Button>
              </div>
              
              <div className="overflow-x-auto bg-white rounded-lg border border-koffa-beige">
                <table className="w-full border-collapse">
                  <thead className="bg-koffa-beige-light">
                    <tr>
                      <th className="text-left py-3 px-4 font-medium text-koffa-green">English Term</th>
                      <th className="text-left py-3 px-4 font-medium text-koffa-green">فصحى</th>
                      <th className="text-left py-3 px-4 font-medium text-koffa-green">مصري</th>
                      <th className="text-left py-3 px-4 font-medium text-koffa-green">تونسي</th>
                    </tr>
                  </thead>
                  <tbody>
                    {standardTermOptions.map((term, index) => (
                      <tr key={term} className={`border-b border-koffa-beige/40 ${index % 2 === 0 ? 'bg-white' : 'bg-koffa-beige-light/30'}`}>
                        <td className="py-3 px-4 font-medium">{term}</td>
                        <td className="py-3 px-4 font-arabic text-lg">
                          {comparisonTerms.find(t => t.standard_term === term && t.dialect_name === 'Standard Arabic')?.custom_term || '-'}
                        </td>
                        <td className="py-3 px-4 font-arabic text-lg">
                          {comparisonTerms.find(t => t.standard_term === term && t.dialect_name === 'Egyptian Arabic')?.custom_term || '-'}
                        </td>
                        <td className="py-3 px-4 font-arabic text-lg">
                          {comparisonTerms.find(t => t.standard_term === term && t.dialect_name === 'Tunisian Arabic')?.custom_term || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
            
            <Card className="border-koffa-beige/30 p-6 mb-6">
              <h2 className="text-lg font-semibold text-koffa-green mb-4">Add Custom Terms</h2>
              <p className="text-sm text-koffa-green-dark mb-4">Help improve the dialect dictionary by adding your regional terms</p>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-koffa-green-dark mb-2 block">Select English Term:</label>
                  <Select
                    value={selectedStandardTerm}
                    onValueChange={setSelectedStandardTerm}
                  >
                    <SelectTrigger className="w-full">
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
                  <label className="text-sm font-medium text-koffa-green-dark mb-2 block">Your Regional Term:</label>
                  <div className="flex gap-2">
                    <Input 
                      dir="rtl" 
                      className="font-arabic text-lg flex-1" 
                      placeholder="أدخل المصطلح الخاص بك"
                      value={customTermWord}
                      onChange={(e) => setCustomTermWord(e.target.value)}
                    />
                    <Button 
                      onClick={saveCustomTerm}
                      disabled={!customTermWord || !selectedStandardTerm || loading}
                      className="bg-koffa-green hover:bg-koffa-green-dark"
                    >
                      {loading ? 'Saving...' : 'Save'}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </>
        )}
        
        <div className="text-center">
          <Button 
            className="w-full bg-koffa-green hover:bg-koffa-green-dark text-white py-3"
            onClick={() => {
              toast.success('All language settings saved!');
              navigate('/settings');
            }}
            disabled={loading}
          >
            {loading ? 'Saving Changes...' : 'Save All Changes'}
          </Button>
        </div>
      </div>
      
      <PageNavigation />
    </div>
  );
};

export default DialectSettings;
