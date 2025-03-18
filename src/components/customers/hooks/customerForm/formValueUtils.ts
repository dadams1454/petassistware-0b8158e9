
import { Customer } from '../../types/customer';
import { CustomerFormValues } from '../../schemas/customerFormSchema';

/**
 * Extracts default form values from a customer object
 * @param customer Optional customer data to use for defaults
 * @returns Default values for the customer form
 */
export const getDefaultFormValues = (customer?: Customer): CustomerFormValues => {
  if (!customer) {
    return {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      address: '',
      notes: '',
      customer_type: 'new',
      customer_since: '',
      interested_puppy_id: 'none',
      interested_litter_id: 'none',
      waitlist_type: 'specific',
    };
  }
  
  return {
    first_name: customer.first_name || '',
    last_name: customer.last_name || '',
    email: customer.email || '',
    phone: customer.phone || '',
    address: customer.address || '',
    notes: customer.notes || '',
    customer_type: customer.metadata?.customer_type || 'new',
    customer_since: customer.metadata?.customer_since || '',
    interested_puppy_id: customer.metadata?.interested_puppy_id || 'none',
    interested_litter_id: customer.metadata?.interested_litter_id || 'none',
    waitlist_type: customer.metadata?.waitlist_type || 'specific',
  };
};

/**
 * Extracts metadata fields from form values
 * @param values Form values
 * @returns Object containing metadata and other fields separately
 */
export const extractFormFields = (values: CustomerFormValues) => {
  const { 
    customer_type, 
    customer_since, 
    interested_puppy_id, 
    interested_litter_id,
    waitlist_type,
    ...otherFields 
  } = values;
  
  // Create metadata object
  const metadata = {
    customer_type,
    customer_since: customer_since || new Date().toISOString().split('T')[0],
    interested_puppy_id: interested_puppy_id === 'none' ? null : interested_puppy_id,
    interested_litter_id: interested_litter_id === 'none' ? null : interested_litter_id,
    waitlist_type,
  };
  
  return { metadata, otherFields };
};

/**
 * Prepares customer data for database submission
 * @param values Form values
 * @param metadata Processed metadata object
 * @returns Customer data ready for database
 */
export const prepareCustomerData = (values: CustomerFormValues, metadata: any) => {
  return {
    first_name: values.first_name,
    last_name: values.last_name,
    email: values.email || null,
    phone: values.phone || null,
    address: values.address || null,
    notes: values.notes || null,
    metadata,
  };
};
