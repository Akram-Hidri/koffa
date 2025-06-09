
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Users, User, Baby, Heart, Settings, Eye, ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type FamilyTemplate = 'small' | 'large' | 'multigenerational' | 'single-parent';
type AgeGroup = 'child' | 'teen' | 'adult' | 'senior';
type UserRole = 'parent' | 'child' | 'grandparent' | 'teenager';

const OnboardingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(20);
  const [isLoading, setIsLoading] = useState(false);
  
  const [onboardingData, setOnboardingData] = useState({
    familyTemplate: 'small' as FamilyTemplate,
    userAge: 'adult' as AgeGroup,
    userRole: 'parent' as UserRole,
    userName: '',
    familyName: '',
    preferences: {
      largeText: false,
      highContrast: false,
      simplifiedInterface: false,
      voiceAssistance: false
    }
  });

  const totalSteps = 5;

  useEffect(() => {
    setProgress((step / totalSteps) * 100);
  }, [step]);

  const familyTemplates = [
    {
      id: 'small' as const,
      title: 'Small Family',
      description: '2-4 members, simple setup',
      icon: <Users size={40} />,
      color: '#586b4d'
    },
    {
      id: 'large' as const,
      title: 'Large Family',
      description: '5+ members, multiple spaces',
      icon: <Users size={40} />,
      color: '#6a798f'
    },
    {
      id: 'multigenerational' as const,
      title: 'Multi-generational',
      description: 'Grandparents, parents, children',
      icon: <Heart size={40} />,
      color: '#E6A44E'
    },
    {
      id: 'single-parent' as const,
      title: 'Single Parent',
      description: 'One parent with children',
      icon: <User size={40} />,
      color: '#C05746'
    }
  ];

  const ageGroups = [
    { id: 'child' as const, label: 'Child (5-12)', description: 'Large icons, simple interface', icon: <Baby size={32} /> },
    { id: 'teen' as const, label: 'Teenager (13-17)', description: 'Modern design, social features', icon: <User size={32} /> },
    { id: 'adult' as const, label: 'Adult (18-64)', description: 'Full featured interface', icon: <Users size={32} /> },
    { id: 'senior' as const, label: 'Senior (65+)', description: 'Large text, simplified layout', icon: <Heart size={32} /> }
  ];

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);
    
    try {
      // Save onboarding data to database
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          username: onboardingData.userName,
          onboarding_completed: true,
          user_role: onboardingData.userRole,
          age_group: onboardingData.userAge,
          accessibility_preferences: onboardingData.preferences
        })
        .eq('id', user?.id);

      if (profileError) throw profileError;

      // Create family if needed
      if (onboardingData.familyName) {
        const { data: familyData, error: familyError } = await supabase
          .from('families')
          .insert({
            name: onboardingData.familyName,
            created_by: user?.id
          })
          .select()
          .single();

        if (familyError) throw familyError;

        // Add user to family
        const { error: memberError } = await supabase
          .from('family_members')
          .insert({
            family_id: familyData.id,
            user_id: user?.id,
            role: 'admin'
          });

        if (memberError) throw memberError;

        // Update profile with family_id
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ family_id: familyData.id })
          .eq('id', user?.id);

        if (updateError) throw updateError;
      }

      toast.success('Welcome to Koffa! Your setup is complete.');
      navigate('/home');
    } catch (error: any) {
      console.error('Onboarding error:', error);
      toast.error('Failed to complete setup. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateData = (field: string, value: any) => {
    setOnboardingData(prev => ({ ...prev, [field]: value }));
  };

  const updatePreferences = (field: string, value: boolean) => {
    setOnboardingData(prev => ({
      ...prev,
      preferences: { ...prev.preferences, [field]: value }
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-koffa-beige-light via-white to-koffa-beige">
      <div className="safe-area-top"></div>
      
      {/* Progress header */}
      <div className="p-6 sm:p-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-koffa-green">
              Getting Started
            </h1>
            <span className="text-sm font-medium text-koffa-green-dark">
              {step} of {totalSteps}
            </span>
          </div>
          <Progress value={progress} className="h-3 mb-2" />
          <p className="text-sm text-koffa-green-dark">
            Let's personalize your Koffa experience
          </p>
        </div>
      </div>

      {/* Step content */}
      <div className="flex-1 px-6 sm:px-8 pb-8">
        <div className="max-w-2xl mx-auto">
          {/* Step 1: Welcome & Family Template */}
          {step === 1 && (
            <div className="animate-fade-in">
              <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-koffa-green mb-3">
                  Welcome to Your Family Hub! 🏠
                </h2>
                <p className="text-lg text-koffa-green-dark">
                  Let's set up your perfect family space
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {familyTemplates.map((template) => (
                  <Card 
                    key={template.id}
                    className={`p-6 cursor-pointer border-2 transition-all duration-300 hover:shadow-xl touch-target ${
                      onboardingData.familyTemplate === template.id 
                        ? 'border-koffa-green bg-koffa-beige-light scale-105 shadow-lg' 
                        : 'border-koffa-beige hover:border-koffa-green hover:scale-102'
                    }`}
                    onClick={() => updateData('familyTemplate', template.id)}
                  >
                    <div className="text-center">
                      <div 
                        className="w-20 h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg"
                        style={{ backgroundColor: `${template.color}20`, color: template.color }}
                      >
                        {template.icon}
                      </div>
                      <h3 className="font-bold text-lg text-koffa-green mb-2">{template.title}</h3>
                      <p className="text-sm text-koffa-green-dark">{template.description}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Personal Info */}
          {step === 2 && (
            <div className="animate-fade-in">
              <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-koffa-green mb-3">
                  Tell us about yourself 👋
                </h2>
                <p className="text-lg text-koffa-green-dark">
                  This helps us customize your experience
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <Label className="text-lg font-semibold text-koffa-green mb-3 block">Your Name</Label>
                  <Input 
                    value={onboardingData.userName}
                    onChange={(e) => updateData('userName', e.target.value)}
                    placeholder="Enter your name"
                    className="h-16 text-lg border-2 border-koffa-beige focus:border-koffa-green rounded-xl"
                  />
                </div>

                <div>
                  <Label className="text-lg font-semibold text-koffa-green mb-3 block">Family Name</Label>
                  <Input 
                    value={onboardingData.familyName}
                    onChange={(e) => updateData('familyName', e.target.value)}
                    placeholder="The Smith Family"
                    className="h-16 text-lg border-2 border-koffa-beige focus:border-koffa-green rounded-xl"
                  />
                </div>

                <div>
                  <Label className="text-lg font-semibold text-koffa-green mb-3 block">Your Role in the Family</Label>
                  <Select value={onboardingData.userRole} onValueChange={(value) => updateData('userRole', value as UserRole)}>
                    <SelectTrigger className="h-16 text-lg border-2 border-koffa-beige focus:border-koffa-green rounded-xl">
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
            </div>
          )}

          {/* Step 3: Age Group */}
          {step === 3 && (
            <div className="animate-fade-in">
              <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-koffa-green mb-3">
                  What's your age group? 🎂
                </h2>
                <p className="text-lg text-koffa-green-dark">
                  We'll optimize the interface for you
                </p>
              </div>

              <RadioGroup value={onboardingData.userAge} onValueChange={(value) => updateData('userAge', value as AgeGroup)}>
                <div className="space-y-4">
                  {ageGroups.map((group) => (
                    <Card 
                      key={group.id} 
                      className={`p-6 cursor-pointer border-2 transition-all duration-300 hover:shadow-lg touch-target ${
                        onboardingData.userAge === group.id 
                          ? 'border-koffa-green bg-koffa-beige-light' 
                          : 'border-koffa-beige hover:border-koffa-green'
                      }`}
                      onClick={() => updateData('userAge', group.id)}
                    >
                      <div className="flex items-center space-x-4">
                        <RadioGroupItem value={group.id} id={group.id} className="w-6 h-6" />
                        <div className="text-koffa-green">{group.icon}</div>
                        <Label htmlFor={group.id} className="flex-1 cursor-pointer">
                          <div className="font-semibold text-lg text-koffa-green">{group.label}</div>
                          <div className="text-sm text-koffa-green-dark">{group.description}</div>
                        </Label>
                      </div>
                    </Card>
                  ))}
                </div>
              </RadioGroup>
            </div>
          )}

          {/* Step 4: Accessibility Preferences */}
          {step === 4 && (
            <div className="animate-fade-in">
              <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-koffa-green mb-3">
                  Accessibility Preferences ♿
                </h2>
                <p className="text-lg text-koffa-green-dark">
                  Make the app work better for you
                </p>
              </div>

              <div className="space-y-4">
                {[
                  { key: 'largeText', label: 'Large Text', description: 'Bigger fonts for easier reading', icon: <Eye size={24} /> },
                  { key: 'highContrast', label: 'High Contrast', description: 'Better visibility with stronger colors', icon: <Settings size={24} /> },
                  { key: 'simplifiedInterface', label: 'Simplified Interface', description: 'Fewer options, cleaner design', icon: <User size={24} /> },
                  { key: 'voiceAssistance', label: 'Voice Assistance', description: 'Audio guidance and commands', icon: <Settings size={24} /> }
                ].map((option) => (
                  <Card 
                    key={option.key}
                    className={`p-6 cursor-pointer border-2 transition-all duration-300 hover:shadow-lg touch-target ${
                      onboardingData.preferences[option.key as keyof typeof onboardingData.preferences]
                        ? 'border-koffa-green bg-koffa-beige-light' 
                        : 'border-koffa-beige hover:border-koffa-green'
                    }`}
                    onClick={() => updatePreferences(option.key, !onboardingData.preferences[option.key as keyof typeof onboardingData.preferences])}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="text-koffa-green">{option.icon}</div>
                      <div className="flex-1">
                        <div className="font-semibold text-lg text-koffa-green">{option.label}</div>
                        <div className="text-sm text-koffa-green-dark">{option.description}</div>
                      </div>
                      {onboardingData.preferences[option.key as keyof typeof onboardingData.preferences] && (
                        <CheckCircle className="w-6 h-6 text-koffa-green" />
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Completion */}
          {step === 5 && (
            <div className="animate-fade-in text-center">
              <div className="mb-8">
                <div className="w-32 h-32 bg-koffa-green rounded-full mx-auto mb-6 flex items-center justify-center">
                  <CheckCircle className="w-16 h-16 text-white" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-koffa-green mb-4">
                  You're All Set! 🎉
                </h2>
                <p className="text-lg text-koffa-green-dark mb-8 px-4">
                  Welcome to your personalized Koffa experience, {onboardingData.userName}!
                </p>
              </div>

              <div className="bg-koffa-beige-light rounded-2xl p-6 mb-8">
                <h3 className="font-bold text-lg text-koffa-green mb-4">Your Setup Summary:</h3>
                <div className="space-y-2 text-left">
                  <p><strong>Family:</strong> {onboardingData.familyName}</p>
                  <p><strong>Role:</strong> {onboardingData.userRole}</p>
                  <p><strong>Age Group:</strong> {onboardingData.userAge}</p>
                  <p><strong>Template:</strong> {familyTemplates.find(t => t.id === onboardingData.familyTemplate)?.title}</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex gap-4 mt-8">
            {step > 1 && (
              <Button 
                variant="outline" 
                onClick={handlePrevious}
                className="flex-1 h-16 text-lg font-semibold border-2 border-koffa-green text-koffa-green hover:bg-koffa-green hover:text-white rounded-xl transition-all duration-200 touch-target"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Previous
              </Button>
            )}
            
            {step < totalSteps ? (
              <Button 
                onClick={handleNext} 
                className="flex-1 bg-koffa-green hover:bg-koffa-green-dark text-white h-16 text-lg font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl touch-target"
                disabled={
                  (step === 2 && (!onboardingData.userName || !onboardingData.familyName)) ||
                  (step === 1 && !onboardingData.familyTemplate)
                }
              >
                Continue
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            ) : (
              <Button 
                onClick={handleComplete} 
                className="flex-1 bg-koffa-green hover:bg-koffa-green-dark text-white h-16 text-lg font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl touch-target"
                disabled={isLoading}
              >
                {isLoading ? "Setting up..." : "Start Using Koffa!"}
                <CheckCircle className="w-5 h-5 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="safe-area-bottom"></div>
    </div>
  );
};

export default OnboardingPage;
