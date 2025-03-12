
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Form } from '@/components/ui/form';
import { CustomButton } from '@/components/ui/custom-button';
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
      notes: ''
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
      
      // Use simple numerical naming convention rather than using IDs
      const puppyName = data.name ? data.name.trim() : `Puppy ${puppyCount + 1}`;
      
      const puppyData = {
        name: puppyName,
        gender: data.gender ? data.gender.charAt(0).toUpperCase() + data.gender.slice(1).toLowerCase() : null,
        color: data.color || null,
        birth_weight: data.birth_weight || null,
        birth_time: data.birth_time || null,
        notes: data.notes || null,
        birth_date: now.toISOString().split('T')[0], // Today's date
        status: 'Available', // Default status
        litter_id: litterId,
        created_at: birthDateTime.toISOString() // Use birth date/time for created_at to sort by birth order
      };

      // Insert the puppy record
      const { error } = await supabase
        .from('puppies')
        .insert(puppyData);

      if (error) throw error;
      
      await onSuccess();
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
            label="Color/Markings"
            placeholder="Select color"
            options={colorOptions}
          />
          
          <WeightInput
            form={form}
            name="birth_weight"
            label="Birth Weight (oz)"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          
          <div className="md:col-span-1"></div>
        </div>
        
        <TextareaInput
          form={form}
          name="notes"
          label="Birth Notes"
          placeholder="Any observations during birth, assistance needed, etc."
        />

        <div className="flex justify-end pt-4">
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
