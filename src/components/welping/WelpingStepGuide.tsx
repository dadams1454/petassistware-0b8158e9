
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Baby, Check, Dog, Heart, FileText, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import BackButton from '@/components/common/BackButton';
import { toast } from '@/components/ui/use-toast';

interface WelpingStepGuideProps {
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  onLitterCreated: (litterId: string) => void;
}

const WelpingStepGuide: React.FC<WelpingStepGuideProps> = ({ currentStep, setCurrentStep, onLitterCreated }) => {
  const navigate = useNavigate();
  const [selectedDamId, setSelectedDamId] = useState<string>('');
  const [selectedSireId, setSelectedSireId] = useState<string>('');
  const [birthDate, setBirthDate] = useState<Date | undefined>(new Date());
  const [litterName, setLitterName] = useState<string>('');
  const [isCreating, setIsCreating] = useState(false);
  
  // Fetch female dogs for dam selection
  const { data: femaleDogs } = useQuery({
    queryKey: ['female-dogs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dogs')
        .select('id, name, breed, color, photo_url')
        .eq('gender', 'Female');
        
      if (error) throw error;
      return data;
    }
  });
  
  // Fetch male dogs for sire selection
  const { data: maleDogs } = useQuery({
    queryKey: ['male-dogs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dogs')
        .select('id, name, breed, color, photo_url')
        .eq('gender', 'Male');
        
      if (error) throw error;
      return data;
    }
  });
  
  const steps = [
    { title: "Select Dam", icon: Dog },
    { title: "Select Sire", icon: Heart },
    { title: "Set Whelping Date", icon: FileText },
    { title: "Ready to Record", icon: Baby }
  ];
  
  const handleCreateLitter = async () => {
    if (!selectedDamId) {
      toast({
        title: "Dam Required",
        description: "Please select a dam before creating the litter",
        variant: "destructive"
      });
      return;
    }
    
    if (!birthDate) {
      toast({
        title: "Birth Date Required",
        description: "Please set a birth date for this litter",
        variant: "destructive"
      });
      return;
    }
    
    setIsCreating(true);
    
    try {
      // Format date for database
      const formattedDate = birthDate.toISOString().split('T')[0];
      
      // Create the litter
      const { data, error } = await supabase
        .from('litters')
        .insert({
          dam_id: selectedDamId,
          sire_id: selectedSireId || null,
          birth_date: formattedDate,
          litter_name: litterName || null,
          breeder_id: '00000000-0000-0000-0000-000000000000', // This would be the current user's ID
          status: 'active'
        })
        .select();
        
      if (error) throw error;
      
      // Update the dam's status to reflect the whelping
      await supabase
        .from('dogs')
        .update({ 
          breeding_status: 'whelped', 
          is_pregnant: false
        })
        .eq('id', selectedDamId);
      
      toast({
        title: "Litter Created",
        description: "You can now begin recording puppies for this litter",
      });
      
      // Navigate to the new litter
      if (data && data[0]) {
        onLitterCreated(data[0].id);
      }
    } catch (error) {
      console.error("Error creating litter:", error);
      toast({
        title: "Error",
        description: "There was a problem creating the litter. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <BackButton fallbackPath="/welping-dashboard" className="mr-4" />
        <h1 className="text-2xl font-semibold flex items-center">
          <Baby className="h-6 w-6 mr-2 text-pink-500" />
          New Whelping
        </h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Whelping Setup</CardTitle>
        </CardHeader>
        
        <CardContent>
          {/* Step indicator */}
          <div className="flex justify-between mb-8">
            {steps.map((step, index) => (
              <div 
                key={index} 
                className={`flex flex-col items-center relative ${index > 0 ? 'flex-1' : ''}`}
              >
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center z-10
                    ${currentStep >= index 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'}`}
                >
                  {currentStep > index ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <step.icon className="h-4 w-4" />
                  )}
                </div>
                
                <span 
                  className={`text-xs mt-2 whitespace-nowrap
                    ${currentStep >= index 
                      ? 'text-primary font-medium' 
                      : 'text-muted-foreground'}`}
                >
                  {step.title}
                </span>
                
                {/* Connecting line */}
                {index < steps.length - 1 && (
                  <div 
                    className={`absolute h-0.5 top-4 left-1/2 right-0 -translate-y-1/2
                      ${currentStep > index 
                        ? 'bg-primary' 
                        : 'bg-muted'}`}
                  />
                )}
              </div>
            ))}
          </div>
          
          {/* Step content */}
          <div className="py-4">
            {currentStep === 0 && (
              <div className="space-y-4">
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">Select the Dam (Mother)</h3>
                  <p className="text-muted-foreground mb-4">
                    Choose the female dog who will be or has been whelping this litter.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <Label htmlFor="dam">Dam</Label>
                  <Select
                    value={selectedDamId}
                    onValueChange={setSelectedDamId}
                  >
                    <SelectTrigger id="dam" className="w-full">
                      <SelectValue placeholder="Select dam..." />
                    </SelectTrigger>
                    <SelectContent>
                      {femaleDogs?.map(dog => (
                        <SelectItem key={dog.id} value={dog.id}>
                          {dog.name} ({dog.breed})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">Select the Sire (Father)</h3>
                  <p className="text-muted-foreground mb-4">
                    Choose the male dog who sired this litter. This step is optional but recommended.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <Label htmlFor="sire">Sire</Label>
                  <Select
                    value={selectedSireId}
                    onValueChange={setSelectedSireId}
                  >
                    <SelectTrigger id="sire" className="w-full">
                      <SelectValue placeholder="Select sire..." />
                    </SelectTrigger>
                    <SelectContent>
                      {maleDogs?.map(dog => (
                        <SelectItem key={dog.id} value={dog.id}>
                          {dog.name} ({dog.breed})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">Set Litter Details</h3>
                  <p className="text-muted-foreground mb-4">
                    Enter the whelping date and give your litter a descriptive name.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="litterName">Litter Name (Optional)</Label>
                    <Input
                      id="litterName"
                      placeholder="e.g., Spring 2023 Litter"
                      value={litterName}
                      onChange={(e) => setLitterName(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label>Birth Date</Label>
                    <div className="mt-1">
                      <DatePicker
                        date={birthDate}
                        setDate={setBirthDate}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">Ready to Record Puppies</h3>
                  <p className="text-muted-foreground mb-4">
                    Review the information and create the litter to start recording puppies as they are born.
                  </p>
                </div>
                
                <Card className="bg-muted/40 border">
                  <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Dam</p>
                        <p className="font-medium">
                          {femaleDogs?.find(dog => dog.id === selectedDamId)?.name || 'Not selected'}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground">Sire</p>
                        <p className="font-medium">
                          {maleDogs?.find(dog => dog.id === selectedSireId)?.name || 'Not selected'}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground">Litter Name</p>
                        <p className="font-medium">
                          {litterName || 'No name specified'}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground">Birth Date</p>
                        <p className="font-medium">
                          {birthDate?.toLocaleDateString() || 'Not set'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          
          {currentStep < steps.length - 1 ? (
            <Button
              onClick={() => setCurrentStep(prev => Math.min(steps.length - 1, prev + 1))}
              disabled={currentStep === 0 && !selectedDamId}
            >
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button 
              onClick={handleCreateLitter}
              disabled={!selectedDamId || !birthDate || isCreating}
            >
              {isCreating ? 'Creating...' : 'Create Litter & Start Recording'}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default WelpingStepGuide;
