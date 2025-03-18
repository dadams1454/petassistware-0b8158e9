
import { supabase } from '@/integrations/supabase/client';
import { Customer } from '../../types/customer';
import { CustomerFormValues } from '../../schemas/customerFormSchema';
import { extractFormFields, prepareCustomerData } from './formValueUtils';
import { usePuppyStatusUpdate } from './usePuppyStatusUpdate';
import { useWaitlistManagement } from './useWaitlistManagement';

export const useCustomerSubmit = () => {
  const { updatePuppyStatuses } = usePuppyStatusUpdate();
  const { addToWaitlist } = useWaitlistManagement();
  
  const submitCustomerForm = async (values: CustomerFormValues, customer?: Customer) => {
    // Step 1: Process form values
    const { metadata, otherFields } = extractFormFields(values);
    const customerData = prepareCustomerData(values, metadata);
    
    console.log("Customer data to be sent:", customerData);
    
    // Step 2: Update or create the customer
    let customerId;
    if (customer) {
      console.log("Updating existing customer with ID:", customer.id);
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
    
    // Step 3: Handle puppy status updates
    const previousPuppyId = customer?.metadata?.interested_puppy_id || null;
    const newPuppyId = values.interested_puppy_id === 'none' ? null : values.interested_puppy_id;
    
    await updatePuppyStatuses(previousPuppyId, newPuppyId);
    
    // Step 4: Handle waitlist management
    await addToWaitlist(
      customerId, 
      values.waitlist_type, 
      values.interested_litter_id === 'none' ? null : values.interested_litter_id
    );
    
    return customerId;
  };
  
  return { submitCustomerForm };
};
