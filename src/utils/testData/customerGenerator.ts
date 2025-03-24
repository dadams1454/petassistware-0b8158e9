
import { supabase } from '@/integrations/supabase/client';
import { sampleCustomers } from './sampleData';

/**
 * Creates test customers in the database
 */
export const createTestCustomers = async (): Promise<string[]> => {
  console.log('Creating test customers...');
  
  const customerIds: string[] = [];
  for (const customer of sampleCustomers) {
    const { data, error } = await supabase
      .from('customers')
      .upsert(customer)
      .select('id');
      
    if (error) {
      console.error('Error creating test customer:', error);
      // Continue despite errors
    }
    
    if (data && data[0]) {
      customerIds.push(data[0].id);
      console.log(`Created test customer: ${customer.first_name} ${customer.last_name}`);
    }
  }
  
  return customerIds;
};
