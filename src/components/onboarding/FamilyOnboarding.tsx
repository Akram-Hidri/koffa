
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Users, User, Baby, Heart, Settings, Eye } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import { toast } from 'sonner';

type FamilyTemplate = 'small' | 'large' | 'multigenerational' | 'single-parent';
type AgeGroup = 'child' | 'teen' | 'adult' | 'senior';
type UserRole = 'parent' | 'child' | 'grandparent' | 'teenager';

const FamilyOnboarding: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [familyTemplate, setFamilyTemplate] = useState<FamilyTemplate>('small');
  const [userAge, setUserAge] = useState<AgeGroup>('adult');
  const [userRole, setUserRole] = useState<UserRole>('parent');
  const [userName, setUserName] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [accessibilityNeeds, setAccessibilityNeeds] = useState({
    largeText: false,
    highContrast: false,
    simplifiedInterface: false,
    voiceAssistance: false
  });
  
  const { updateSettings } = useSettings();

  const familyTemplates = [
    {
      id: 'small' as const,
      title: 'Small Family',
      description: '2-4 members, simple setup',
      icon: <Users size={32} />,
      color: '#586b4d'
    },
    {
      id: 'large' as const,
      title: 'Large Family',
      description: '5+ members, multiple spaces',
      icon: <Users size={32} />,
      color: '#6a798f'
    },
    {
      id: 'multigenerational' as const,
      title: 'Multi-generational',
      description: 'Grandparents, parents, children',
      icon: <Heart size={32} />,
      color: '#E6A44E'
    },
    {
      id: 'single-parent' as const,
      title: 'Single Parent',
      description: 'One parent with children',
      icon: <User size={32} />,
      color: '#C05746'
    }
  ];

  const ageGroups = [
    { id: 'child' as const, label: 'Child (5-12)', description: 'Large icons, simple interface' },
    { id: 'teen' as const, label: 'Teenager (13-17)', description: 'Modern design, social features' },
    { id: 'adult' as const, label: 'Adult (18-64)', description: 'Full featured interface' },
    { id: 'senior' as const, label: 'Senior (65+)', description: 'Large text, simplified layout' }
  ];

  const handleComplete = () => {
    // Apply accessibility settings based on age group
    const accessibilitySettings = {
      textSize: userAge === 'senior' || accessibilityNeeds.largeText ? 'large' : 'medium',
      highContrastMode: userAge === 'senior' || accessibilityNeeds.highContrast,
      simplifiedMode: userAge === 'child' || userAge === 'senior' || accessibilityNeeds.simplifiedInterface,
      voiceCommands: accessibilityNeeds.voiceAssistance,
      showLabelsWithIcons: true,
      boldText: userAge === 'senior' || accessibilityNeeds.largeText
    };

    updateSettings(accessibilitySettings as any);
    toast.success('Family setup completed!');
    onComplete();
  };

  if (step === 1) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-koffa-green mb-2">Welcome to Your Family Hub</h2>
          <p className="text-koffa-green-dark">Let's set up your family space together</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {familyTemplates.map((template) => (
            <Card 
              key={template.id}
              className={`p-6 cursor-pointer border-2 transition-all hover:shadow-lg ${
                familyTemplate === template.id 
                  ? 'border-koffa-green bg-koffa-beige-light' 
                  : 'border-koffa-beige hover:border-koffa-green'
              }`}
              onClick={() => setFamilyTemplate(template.id)}
            >
              <div className="text-center">
                <div 
                  className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                  style={{ backgroundColor: `${template.color}20`, color: template.color }}
                >
                  {template.icon}
                </div>
                <h3 className="font-semibold text-lg text-koffa-green mb-2">{template.title}</h3>
                <p className="text-sm text-koffa-green-dark">{template.description}</p>
              </div>
            </Card>
          ))}
        </div>

        <Button 
          onClick={() => setStep(2)} 
          className="w-full bg-koffa-green hover:bg-koffa-green-dark"
        >
          Continue
        </Button>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="max-w-xl mx-auto p-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-koffa-green mb-2">Tell us about yourself</h2>
          <p className="text-koffa-green-dark">This helps us customize your experience</p>
        </div>

        <div className="space-y-6">
          <div>
            <Label className="text-lg font-medium text-koffa-green mb-3 block">Your Name</Label>
            <Input 
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your name"
              className="text-lg p-4"
            />
          </div>

          <div>
            <Label className="text-lg font-medium text-koffa-green mb-3 block">Family Name</Label>
            <Input 
              value={familyName}
              onChange={(e) => setFamilyName(e.target.value)}
              placeholder="The Smith Family"
              className="text-lg p-4"
            />
          </div>

          <div>
            <Label className="text-lg font-medium text-koffa-green mb-3 block">Your Age Group</Label>
            <RadioGroup value={userAge} onValueChange={(value) => setUserAge(value as AgeGroup)}>
              {ageGroups.map((group) => (
                <div key={group.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-koffa-beige-light">
                  <RadioGroupItem value={group.id} id={group.id} />
                  <Label htmlFor={group.id} className="flex-1">
                    <div className="font-medium">{group.label}</div>
                    <div className="text-sm text-koffa-green-dark">{group.description}</div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div>
            <Label className="text-lg font-medium text-koffa-green mb-3 block">Your Role in the Family</Label>
            <Select value={userRole} onValueChange={(value) => setUserRole(value as UserRole)}>
              <SelectTrigger className="text-lg p-4">
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="parent">Parent/Guardian</SelectItem>
                <SelectItem value="child">Child</SelectItem>
                <SelectItem value="teenager">Teenager</SelectItem>
                <SelectItem value="grandparent">Grandparent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <Button 
            variant="outline" 
            onClick={() => setStep(1)}
            className="flex-1"
          >
            Back
          </Button>
          <Button 
            onClick={() => setStep(3)} 
            className="flex-1 bg-koffa-green hover:bg-koffa-green-dark"
            disabled={!userName || !familyName}
          >
            Continue
          </Button>
        </div>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="max-w-xl mx-auto p-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-koffa-green mb-2">Accessibility Preferences</h2>
          <p className="text-koffa-green-dark">Make the app work better for you</p>
        </div>

        <div className="space-y-4">
          {[
            { key: 'largeText', label: 'Large Text', description: 'Bigger fonts for easier reading', icon: <Eye size={20} /> },
            { key: 'highContrast', label: 'High Contrast', description: 'Better visibility with stronger colors', icon: <Settings size={20} /> },
            { key: 'simplifiedInterface', label: 'Simplified Interface', description: 'Fewer options, cleaner design', icon: <User size={20} /> },
            { key: 'voiceAssistance', label: 'Voice Assistance', description: 'Audio guidance and commands', icon: <Settings size={20} /> }
          ].map((option) => (
            <Card 
              key={option.key}
              className={`p-4 cursor-pointer border-2 transition-all hover:shadow-md ${
                accessibilityNeeds[option.key as keyof typeof accessibilityNeeds]
                  ? 'border-koffa-green bg-koffa-beige-light' 
                  : 'border-koffa-beige hover:border-koffa-green'
              }`}
              onClick={() => setAccessibilityNeeds(prev => ({ 
                ...prev, 
                [option.key]: !prev[option.key as keyof typeof accessibilityNeeds] 
              }))}
            >
              <div className="flex items-center space-x-3">
                <div className="text-koffa-green">{option.icon}</div>
                <div className="flex-1">
                  <div className="font-medium text-koffa-green">{option.label}</div>
                  <div className="text-sm text-koffa-green-dark">{option.description}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="flex gap-3 mt-8">
          <Button 
            variant="outline" 
            onClick={() => setStep(2)}
            className="flex-1"
          >
            Back
          </Button>
          <Button 
            onClick={handleComplete} 
            className="flex-1 bg-koffa-green hover:bg-koffa-green-dark"
          >
            Complete Setup
          </Button>
        </div>
      </div>
    );
  }

  return null;
};

export default FamilyOnboarding;
