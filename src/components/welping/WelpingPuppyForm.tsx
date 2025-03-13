import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Form } from '@/components/ui/form';
import { CustomButton } from '@/components/ui/custom-button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TextInput from '@/components/dogs/form/TextInput';
import SelectInput from '@/components/dogs/form/SelectInput';
import WeightInput from '@/components/dogs/form/WeightInput';
import TextareaInput from '@/components/dogs/form/TextareaInput';
import { format } from 'date-fns';
import { colorOptions } from '@/components/litters/puppies/constants';

interface WelpingPuppyFormProps {
  litterId: string;
  onSuccess: () => Promise<void>;
}

interface WelpingPuppyFormData {
  name: string;
  gender: string;
  color: string;
  birth_weight: string;
  birth_time: string;
  notes: string;
  akc_litter_number: string;
  akc_registration_number: string;
  microchip_number: string;
  markings: string;
}

const WelpingPuppyForm: React.FC<WelpingPuppyFormProps> = ({ 
  litterId,
  onSuccess
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [puppyCount, setPuppyCount] = useState(0);
  
  // Get current time for default value
  const currentTime = format(new Date(), 'HH:mm');
  
  useEffect(() => {
    // Fetch existing puppies to determine the next puppy number
    const fetchPuppyCount = async () => {
      try {
        const { data, error } = await supabase
          .from('puppies')
          .select('id')
          .eq('litter_id', litterId);
        
        if (error) throw error;
        setPuppyCount(data?.length || 0);
      } catch (error) {
        console.error('Error fetching puppy count:', error);
      }
    };
    
    fetchPuppyCount();
  }, [litterId]);
  
  const form = useForm<WelpingPuppyFormData>({
    defaultValues: {
      name: `Puppy ${puppyCount + 1}`,
      gender: '',
      color: '',
      birth_weight: '',
      birth_time: currentTime,
      notes: '',
      akc_litter_number: '',
      akc_registration_number: '',
      microchip_number: '',
      markings: ''
    }
  });

  // Update default name whenever puppy count changes
  useEffect(() => {
    form.setValue('name', `Puppy ${puppyCount + 1}`);
  }, [puppyCount, form]);

  const handleSubmit = async (data: WelpingPuppyFormData) => {
    setIsSubmitting(true);
    try {
      // Prepare data for database
      const now = new Date();
      const [hours, minutes] = data.birth_time.split(':').map(Number);
      
      // Set time on today's date
      const birthDateTime = new Date(now);
      birthDateTime.setHours(hours, minutes, 0, 0);
      
      // Create a clean name
      const nameValue = data.name.trim();
      
      // If no name is entered or it's the default "Puppy X" format, use the sequential number
      const useSequentialNumber = !nameValue || nameValue.startsWith('Puppy ');
      const puppyName = useSequentialNumber ? `Puppy ${puppyCount + 1}` : nameValue;
      
      // Combine color and markings if both are provided
      const colorWithMarkings = data.markings 
        ? `${data.color || ''} ${data.markings ? `(${data.markings})` : ''}`.trim()
        : data.color;
      
      const puppyData = {
        name: puppyName,
        gender: data.gender ? data.gender.charAt(0).toUpperCase() + data.gender.slice(1).toLowerCase() : null,
        color: colorWithMarkings || null,
        birth_weight: data.birth_weight || null,
        birth_time: data.birth_time || null,
        notes: data.notes || null,
        birth_date: now.toISOString().split('T')[0], // Today's date
        status: 'Available', // Default status
        litter_id: litterId,
        akc_litter_number: data.akc_litter_number || null,
        akc_registration_number: data.akc_registration_number || null,
        microchip_number: data.microchip_number || null,
        created_at: birthDateTime.toISOString() // Use birth date/time for created_at to sort by birth order
      };

      // Insert the puppy record
      const { error } = await supabase
        .from('puppies')
        .insert(puppyData);

      if (error) throw error;
      
      await onSuccess();
      
      toast({
        title: "Puppy Recorded",
        description: `${puppyName} has been successfully added to the litter.`,
      });
      
      // Reset form for next puppy entry, keeping some values
      form.reset({
        ...form.getValues(),
        name: `Puppy ${puppyCount + 2}`, // Increment for next puppy
        birth_weight: '',
        notes: '',
        akc_registration_number: ''
      });
    } catch (error) {
      console.error('Error recording puppy:', error);
      toast({
        title: "Error",
        description: "There was a problem recording the puppy. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="basic">Basic Information</TabsTrigger>
            <TabsTrigger value="akc">AKC & Identification</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextInput
                form={form}
                name="name"
                label="Temporary Name/ID"
                placeholder="e.g., Green collar, Puppy #1, etc."
              />
              
              <SelectInput
                form={form}
                name="gender"
                label="Gender"
                placeholder="Select gender"
                options={[
                  { value: 'Male', label: 'Male' },
                  { value: 'Female', label: 'Female' }
                ]}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SelectInput
                form={form}
                name="color"
                label="Color"
                placeholder="Select color"
                options={colorOptions}
              />
              
              <TextInput
                form={form}
                name="markings"
                label="Markings"
                placeholder="e.g., White chest patch, etc."
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <WeightInput
                form={form}
                name="birth_weight"
                label="Birth Weight (oz)"
              />
              
              {/* Using InputProps to pass the time type */}
              <div className="space-y-2">
                <label htmlFor="birth_time" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Birth Time
                </label>
                <input
                  id="birth_time"
                  type="time"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  {...form.register("birth_time")}
                />
              </div>
            </div>
            
            <TextareaInput
              form={form}
              name="notes"
              label="Birth Notes"
              placeholder="Any observations during birth, assistance needed, etc."
            />
          </TabsContent>
          
          <TabsContent value="akc" className="space-y-4">
            <div className="rounded-md bg-purple-50 p-4 mb-4">
              <h3 className="font-medium text-purple-800 mb-2">AKC Compliance Information</h3>
              <p className="text-sm text-purple-700">Record identification numbers for AKC registration and compliance tracking.</p>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <TextInput
                form={form}
                name="akc_litter_number"
                label="AKC Litter Number"
                placeholder="Enter AKC litter registration number"
              />
              
              <TextInput
                form={form}
                name="akc_registration_number"
                label="AKC Registration Number"
                placeholder="Enter individual puppy registration number (if available)"
              />
              
              <TextInput
                form={form}
                name="microchip_number"
                label="Microchip ID Number"
                placeholder="Enter microchip number (if microchipped)"
              />
            </div>
          </TabsContent>
        </Tabs>

        <Separator className="my-6" />

        <div className="flex justify-end pt-2">
          <CustomButton
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            fullWidth={false}
          >
            Record Puppy
          </CustomButton>
        </div>
      </form>
    </Form>
  );
};

export default WelpingPuppyForm;
