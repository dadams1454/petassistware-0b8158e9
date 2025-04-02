
import React, { useState } from 'react';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { CheckCircle, ArrowRight, Calendar, Dog } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { DatePicker } from '@/components/ui/date-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useWelping } from '../hooks/useWelping';
import { WelpingStepperProps } from '../types';

interface StepProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  isActive: boolean;
  isCompleted: boolean;
  stepNumber: number;
}

const Step: React.FC<StepProps> = ({ children, title, subtitle, isActive, isCompleted, stepNumber }) => {
  return (
    <div className={`p-6 border rounded-lg ${isActive ? 'border-primary' : 'border-gray-200'}`}>
      <div className="flex items-center mb-4">
        <div className={`flex items-center justify-center h-8 w-8 rounded-full mr-3 ${isCompleted ? 'bg-green-100 text-green-700' : isActive ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'}`}>
          {isCompleted ? <CheckCircle className="h-5 w-5" /> : stepNumber}
        </div>
        <div>
          <h3 className="font-medium">{title}</h3>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      {isActive && <div className="mt-4">{children}</div>}
    </div>
  );
};

const WelpingStepper: React.FC<WelpingStepperProps> = ({ currentStep, setCurrentStep, onLitterCreated }) => {
  const { createWelping, isCreating } = useWelping();
  const [formData, setFormData] = useState({
    damId: '',
    sireId: '',
    birthDate: new Date(),
    litterName: '',
    totalPuppies: 0,
    males: 0,
    females: 0,
    attendedBy: ''
  });
  
  // Fetch available dams (female dogs)
  const { data: femaleDogs } = useQuery({
    queryKey: ['female-dogs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dogs')
        .select('id, name, breed, color, photo_url')
        .eq('gender', 'Female')
        .order('name');
        
      if (error) throw error;
      return data || [];
    }
  });
  
  // Fetch available sires (male dogs)
  const { data: maleDogs } = useQuery({
    queryKey: ['male-dogs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dogs')
        .select('id, name, breed, color, photo_url')
        .eq('gender', 'Male')
        .order('name');
        
      if (error) throw error;
      return data || [];
    }
  });
  
  const damSireForm = useForm({
    defaultValues: {
      damId: formData.damId,
      sireId: formData.sireId
    }
  });
  
  const detailsForm = useForm({
    defaultValues: {
      birthDate: formData.birthDate,
      litterName: formData.litterName
    }
  });
  
  const birthForm = useForm({
    defaultValues: {
      totalPuppies: formData.totalPuppies,
      males: formData.males,
      females: formData.females,
      attendedBy: formData.attendedBy
    }
  });
  
  const handleDamSireSubmit = (data: any) => {
    setFormData(prev => ({ ...prev, ...data }));
    setCurrentStep(1);
  };
  
  const handleDetailsSubmit = (data: any) => {
    setFormData(prev => ({ ...prev, ...data }));
    setCurrentStep(2);
  };
  
  const handleBirthSubmit = async (data: any) => {
    const combinedData = { ...formData, ...data };
    setFormData(combinedData);
    
    try {
      const result = await createWelping(combinedData);
      if (result && result.litterId) {
        onLitterCreated(result.litterId);
      }
    } catch (error) {
      console.error('Error creating welping record:', error);
    }
  };
  
  const goBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Step 1: Select Dam & Sire */}
      <Step 
        title="Select Dam & Sire" 
        subtitle="Choose the mother and father dogs"
        isActive={currentStep === 0}
        isCompleted={currentStep > 0}
        stepNumber={1}
      >
        <Form {...damSireForm}>
          <form onSubmit={damSireForm.handleSubmit(handleDamSireSubmit)} className="space-y-4">
            <FormField
              control={damSireForm.control}
              name="damId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dam (Mother)</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a female dog" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {femaleDogs?.map(dog => (
                        <SelectItem key={dog.id} value={dog.id}>
                          <div className="flex items-center">
                            <Dog className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{dog.name} ({dog.breed || 'Unknown breed'})</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={damSireForm.control}
              name="sireId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sire (Father)</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a male dog" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {maleDogs?.map(dog => (
                        <SelectItem key={dog.id} value={dog.id}>
                          <div className="flex items-center">
                            <Dog className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{dog.name} ({dog.breed || 'Unknown breed'})</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end">
              <Button type="submit" className="flex items-center">
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </form>
        </Form>
      </Step>
      
      {/* Step 2: Whelping Details */}
      <Step 
        title="Whelping Details" 
        subtitle="Enter birth date and litter name"
        isActive={currentStep === 1}
        isCompleted={currentStep > 1}
        stepNumber={2}
      >
        <Form {...detailsForm}>
          <form onSubmit={detailsForm.handleSubmit(handleDetailsSubmit)} className="space-y-4">
            <FormField
              control={detailsForm.control}
              name="birthDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Birth Date</FormLabel>
                  <FormControl>
                    <DatePicker
                      date={field.value ? new Date(field.value) : new Date()}
                      onSelect={field.onChange}
                      popoverTrigger={
                        <Button variant="outline" className="w-full justify-start">
                          <Calendar className="mr-2 h-4 w-4" />
                          {field.value ? format(new Date(field.value), 'PPP') : 'Pick a date'}
                        </Button>
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={detailsForm.control}
              name="litterName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Litter Name (Optional)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="E.g., Spring 2023 Litter" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-between pt-4">
              <Button type="button" variant="outline" onClick={goBack}>
                Back
              </Button>
              <Button type="submit" className="flex items-center">
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </form>
        </Form>
      </Step>
      
      {/* Step 3: Birth Information */}
      <Step 
        title="Birth Information" 
        subtitle="Record the whelping details"
        isActive={currentStep === 2}
        isCompleted={currentStep > 2}
        stepNumber={3}
      >
        <Form {...birthForm}>
          <form onSubmit={birthForm.handleSubmit(handleBirthSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={birthForm.control}
                name="totalPuppies"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Puppies</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        value={field.value || 0}
                        onChange={e => {
                          const value = parseInt(e.target.value);
                          field.onChange(isNaN(value) ? 0 : value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={birthForm.control}
                name="males"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Males</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        value={field.value || 0}
                        onChange={e => {
                          const value = parseInt(e.target.value);
                          field.onChange(isNaN(value) ? 0 : value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={birthForm.control}
                name="females"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Females</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        value={field.value || 0}
                        onChange={e => {
                          const value = parseInt(e.target.value);
                          field.onChange(isNaN(value) ? 0 : value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={birthForm.control}
              name="attendedBy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Attended By</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Person(s) attending the birth" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Separator className="my-4" />
            
            <div className="flex justify-between pt-4">
              <Button type="button" variant="outline" onClick={goBack}>
                Back
              </Button>
              <Button type="submit" disabled={isCreating}>
                {isCreating ? 'Creating...' : 'Complete Setup'}
              </Button>
            </div>
          </form>
        </Form>
      </Step>
    </div>
  );
};

export default WelpingStepper;
