
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Tables } from '@/integrations/supabase/types';
import { customerFormSchema, CustomerFormValues } from '../schemas/customerFormSchema';

type Customer = Tables<'customers'> & {
  metadata?: {
    customer_type?: 'new' | 'returning';
    customer_since?: string;
    interested_puppy_id?: string;
    interested_litter_id?: string;
    waitlist_type?: 'specific' | 'open';
  }
};

interface UseCustomerFormProps {
  customer?: Customer;
  onSubmitSuccess: () => void;
}

export const useCustomerForm = ({ customer, onSubmitSuccess }: UseCustomerFormProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      first_name: customer?.first_name || '',
      last_name: customer?.last_name || '',
      email: customer?.email || '',
      phone: customer?.phone || '',
      address: customer?.address || '',
      notes: customer?.notes || '',
      customer_type: customer?.metadata?.customer_type || 'new',
      customer_since: customer?.metadata?.customer_since || '',
      interested_puppy_id: customer?.metadata?.interested_puppy_id || 'none',
      interested_litter_id: customer?.metadata?.interested_litter_id || 'none',
      waitlist_type: customer?.metadata?.waitlist_type || 'specific',
    },
  });

  const handleSubmit = async (values: CustomerFormValues) => {
    setIsLoading(true);
    try {
      console.log("Form submit started with values:", values);
      
      // Extract metadata fields
      const { 
        customer_type, 
        customer_since, 
        interested_puppy_id, 
        interested_litter_id,
        waitlist_type,
        ...otherFields 
      } = values;
      
      // Get previous puppy id from existing customer if updating
      const previousPuppyId = customer?.metadata?.interested_puppy_id || null;
      
      // Create metadata object
      const metadata = {
        customer_type,
        customer_since: customer_since || new Date().toISOString().split('T')[0],
        interested_puppy_id: interested_puppy_id === 'none' ? null : interested_puppy_id,
        interested_litter_id: interested_litter_id === 'none' ? null : interested_litter_id,
        waitlist_type,
      };
      
      // Log values to help with debugging
      console.log("Form values:", values);
      console.log("Processed metadata:", metadata);
      
      // Ensure required fields are non-optional when sending to the database
      const customerData = {
        ...otherFields,
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email || null,
        phone: values.phone || null,
        address: values.address || null,
        notes: values.notes || null,
        metadata,
      };

      // Determine if the puppy interest changed
      const puppyInterestChanged = 
        (previousPuppyId || 'none') !== (interested_puppy_id || 'none');

      console.log("Customer data to be sent:", customerData);
      console.log("Puppy interest changed:", puppyInterestChanged);
      
      // Transaction to update customer and handle puppy status
      const updateCustomerAndPuppies = async () => {
        // Step 1: Update or create customer
        let customerId;
        
        if (customer) {
          console.log("Updating existing customer with ID:", customer.id);
          // Update existing customer
          const { data, error } = await supabase
            .from('customers')
            .update(customerData)
            .eq('id', customer.id)
            .select();
          
          if (error) {
            console.error("Customer update error:", error);
            throw error;
          }
          console.log("Customer update successful:", data);
          customerId = customer.id;
        } else {
          // Create new customer
          const { data, error } = await supabase
            .from('customers')
            .insert(customerData)
            .select('id')
            .single();
          
          if (error) throw error;
          customerId = data.id;
        }

        // Step 2: Handle puppy status updates if puppy interest changed
        if (puppyInterestChanged) {
          // If there was a previous puppy, set it back to Available
          if (previousPuppyId && previousPuppyId !== 'none') {
            console.log("Resetting previous puppy status for:", previousPuppyId);
            const { error: resetError } = await supabase
              .from('puppies')
              .update({ status: 'Available' })
              .eq('id', previousPuppyId);
            
            if (resetError) console.error("Error resetting previous puppy status:", resetError);
          }
          
          // If a new puppy is selected, set it to Reserved
          if (interested_puppy_id && interested_puppy_id !== 'none') {
            console.log("Updating new puppy status to Reserved for:", interested_puppy_id);
            const { error: reserveError } = await supabase
              .from('puppies')
              .update({ 
                status: 'Reserved',
                reservation_date: new Date().toISOString().split('T')[0]
              })
              .eq('id', interested_puppy_id);
            
            if (reserveError) console.error("Error updating puppy status:", reserveError);
          }
        }

        // Step 3: Add to waitlist if applicable
        if (waitlist_type === "open" || (waitlist_type === "specific" && interested_litter_id && interested_litter_id !== "none")) {
          // Check if already on waitlist for this litter
          const { data: existingEntries, error: checkError } = await supabase
            .from('waitlist')
            .select('id')
            .eq('customer_id', customerId)
            .eq('litter_id', waitlist_type === "open" ? null : interested_litter_id);
          
          if (checkError) console.error("Error checking waitlist:", checkError);
          
          // Only add to waitlist if not already on it
          if (!existingEntries || existingEntries.length === 0) {
            console.log("Adding to waitlist:", waitlist_type);
            
            const waitlistEntry = {
              customer_id: customerId,
              litter_id: waitlist_type === "open" ? null : interested_litter_id,
              status: 'pending',
              notes: `Added via customer form - ${waitlist_type === "open" ? "Open waitlist" : "Specific litter interest"}`,
              preferences: {}
            };
            
            const { error: waitlistError } = await supabase
              .from('waitlist')
              .insert(waitlistEntry);
            
            if (waitlistError) console.error("Error adding to waitlist:", waitlistError);
            else console.log("Successfully added to waitlist");
          }
        }

        return customerId;
      };
      
      // Execute the transaction logic
      await updateCustomerAndPuppies();
      console.log("Customer and puppies updated successfully");

      toast({
        title: customer ? "Customer updated" : "Customer added",
        description: `${values.first_name} ${values.last_name} has been ${customer ? 'updated' : 'added'}.`,
      });
      
      onSubmitSuccess();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      console.error("Customer form error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    isLoading,
    handleSubmit: form.handleSubmit(handleSubmit),
    isEditMode: !!customer,
  };
};
