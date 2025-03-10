
import React, { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import CustomerSelector from '../communications/CustomerSelector';
import { Customer } from '../customers/types/customer';
import { WaitlistEntry } from './types';

interface WaitlistEntryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  litterId: string;
  entry?: WaitlistEntry | null;
  onSuccess: () => void;
}

const waitlistFormSchema = z.object({
  customer_id: z.string().min(1, 'Please select a customer'),
  notes: z.string().optional(),
  gender_preference: z.enum(['Male', 'Female']).optional().nullable(),
  color_preference: z.string().optional().nullable(),
});

type WaitlistFormValues = z.infer<typeof waitlistFormSchema>;

const WaitlistEntryDialog: React.FC<WaitlistEntryDialogProps> = ({
  open,
  onOpenChange,
  litterId,
  entry,
  onSuccess,
}) => {
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
    enabled: open, // Only run this query when the dialog is open
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {entry ? 'Edit Waitlist Entry' : 'Add to Waitlist'}
          </DialogTitle>
          <DialogDescription>
            {entry
              ? 'Update the waitlist entry information'
              : 'Add a customer to the waitlist for this litter'}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="customer_id"
              render={() => (
                <FormItem>
                  <FormLabel>Customer</FormLabel>
                  <CustomerSelector 
                    onCustomerSelected={handleCustomerSelected}
                    defaultValue={selectedCustomer}
                    disabled={!!entry}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="gender_preference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender Preference (optional)</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ''}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="No preference" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">No preference</SelectItem>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="color_preference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color Preference (optional)</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ''}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="No preference" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">No preference</SelectItem>
                      {colorOptions?.map(color => (
                        <SelectItem key={color} value={color}>
                          {color}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add any additional notes or customer preferences..."
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : entry ? 'Update' : 'Add to Waitlist'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default WaitlistEntryDialog;
