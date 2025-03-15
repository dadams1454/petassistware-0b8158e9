
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { format } from 'date-fns';

interface UseWelpingPuppyFormProps {
  litterId: string;
  onSuccess: () => Promise<void>;
}

export interface WelpingPuppyFormData {
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

export const useWelpingPuppyForm = ({ litterId, onSuccess }: UseWelpingPuppyFormProps) => {
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
    console.log('Starting puppy submission process with data:', data);
    
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
      
      // Format birth_weight to ensure it's a valid value for the database
      let birthWeight = null;
      if (data.birth_weight && data.birth_weight.trim() !== '') {
        const weightValue = parseFloat(data.birth_weight.replace(',', '.'));
        if (!isNaN(weightValue)) {
          birthWeight = weightValue.toString();
        }
      }
      
      const puppyData = {
        name: puppyName,
        gender: data.gender ? data.gender.charAt(0).toUpperCase() + data.gender.slice(1).toLowerCase() : null,
        color: colorWithMarkings || null,
        birth_weight: birthWeight,
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

      console.log('Attempting to insert puppy with data:', puppyData);

      // Insert the puppy record
      const { data: insertedData, error } = await supabase
        .from('puppies')
        .insert(puppyData)
        .select();

      if (error) {
        console.error('Supabase error recording puppy:', error);
        throw new Error(`Database error: ${error.message}`);
      }
      
      console.log('Successfully recorded puppy:', insertedData);
      
      try {
        await onSuccess();
        console.log('onSuccess callback completed successfully');
      } catch (callbackError) {
        console.error('Error in onSuccess callback:', callbackError);
        // Continue with the function even if callback has issues
      }
      
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
        description: "There was a problem saving the puppy information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    puppyCount,
    handleSubmit: form.handleSubmit(handleSubmit)
  };
};
