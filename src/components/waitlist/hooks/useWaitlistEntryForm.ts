
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { waitlistFormSchema, WaitlistFormValues } from '../schemas/waitlistFormSchema';
import { Customer } from '@/components/customers/types/customer';
import { WaitlistEntry } from '../types';

interface UseWaitlistEntryFormProps {
  litterId: string;
  entry: WaitlistEntry | null;
  onSuccess: () => void;
  onOpenChange: (open: boolean) => void;
}

export const useWaitlistEntryForm = ({
  litterId,
  entry,
  onSuccess,
  onOpenChange
}: UseWaitlistEntryFormProps) => {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    entry ? entry.customers : null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch color options from puppies in this litter
  const { data: colorOptions } = useQuery({
    queryKey: ['puppy-colors', litterId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('puppies')
        .select('color')
        .eq('litter_id', litterId)
        .not('color', 'is', null);
      
      if (error) throw error;
      
      // Extract unique colors
      const colors = new Set<string>();
      data.forEach(puppy => {
        if (puppy.color) colors.add(puppy.color);
      });
      
      return Array.from(colors);
    },
  });

  const form = useForm<WaitlistFormValues>({
    resolver: zodResolver(waitlistFormSchema),
    defaultValues: {
      customer_id: entry?.customer_id || '',
      notes: entry?.notes || '',
      gender_preference: entry?.preferences?.gender_preference || null,
      color_preference: entry?.preferences?.color_preference || null,
    },
  });

  // Update the form values when the entry changes
  useEffect(() => {
    if (entry) {
      form.setValue('customer_id', entry.customer_id);
      form.setValue('notes', entry.notes || '');
      form.setValue('gender_preference', entry.preferences?.gender_preference || null);
      form.setValue('color_preference', entry.preferences?.color_preference || null);
      setSelectedCustomer(entry.customers);
    } else {
      form.reset({
        customer_id: '',
        notes: '',
        gender_preference: null,
        color_preference: null,
      });
      setSelectedCustomer(null);
    }
  }, [entry, form]);

  const handleCustomerSelected = (customer: Customer) => {
    if (customer && customer.id) {
      form.setValue('customer_id', customer.id);
      setSelectedCustomer(customer);
    }
  };

  const onSubmit = async (values: WaitlistFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Prepare preferences object
      const preferences = {
        gender_preference: values.gender_preference,
        color_preference: values.color_preference,
      };
      
      if (entry) {
        // Update existing entry
        const { error } = await supabase
          .from('waitlist')
          .update({
            notes: values.notes,
            preferences,
          })
          .eq('id', entry.id);
        
        if (error) throw error;
        
        toast({
          title: 'Waitlist entry updated',
          description: `Updated ${selectedCustomer?.first_name} ${selectedCustomer?.last_name}'s waitlist entry.`,
        });
      } else {
        // Check if this customer is already on the waitlist for this litter
        const { data: existingEntries, error: checkError } = await supabase
          .from('waitlist')
          .select('id')
          .eq('customer_id', values.customer_id)
          .eq('litter_id', litterId);
        
        if (checkError) throw checkError;
        
        if (existingEntries && existingEntries.length > 0) {
          toast({
            title: 'Customer already on waitlist',
            description: `${selectedCustomer?.first_name} ${selectedCustomer?.last_name} is already on the waitlist for this litter.`,
            variant: 'destructive',
          });
          setIsSubmitting(false);
          return;
        }
        
        // Insert new entry
        const { error: insertError } = await supabase
          .from('waitlist')
          .insert({
            customer_id: values.customer_id,
            litter_id: litterId,
            notes: values.notes,
            preferences,
            status: 'pending',
          });
        
        if (insertError) throw insertError;
        
        toast({
          title: 'Added to waitlist',
          description: `${selectedCustomer?.first_name} ${selectedCustomer?.last_name} has been added to the waitlist.`,
        });
      }
      
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving waitlist entry:', error);
      toast({
        title: 'Error',
        description: 'There was a problem saving the waitlist entry.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    colorOptions,
    selectedCustomer,
    isSubmitting,
    handleCustomerSelected,
    onSubmit
  };
};
