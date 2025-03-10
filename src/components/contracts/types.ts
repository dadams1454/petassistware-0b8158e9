
import { z } from 'zod';

export const contractTypeOptions = [
  { value: 'purchase', label: 'Purchase Agreement' },
  { value: 'health_guarantee', label: 'Health Guarantee' },
  { value: 'spay_neuter', label: 'Spay/Neuter Agreement' },
  { value: 'co_ownership', label: 'Co-Ownership Agreement' },
  { value: 'breeding_rights', label: 'Breeding Rights Agreement' },
  { value: 'deposit', label: 'Deposit Agreement' },
  { value: 'other', label: 'Other' }
];

export const ContractFormSchema = z.object({
  contract_type: z.string(),
  contract_date: z.date().nullable(),
  contract_dateStr: z.string().optional(),
  price: z.string().nullable().optional().transform(val => 
    val && val.trim() !== '' ? parseFloat(val) : null
  ),
  signed: z.boolean().optional().default(false),
  notes: z.string().nullable().optional(),
  breeder_id: z.string().uuid(),
  customer_id: z.string().uuid().nullable().optional(),
  puppy_id: z.string().uuid().nullable().optional()
});

export type ContractFormValues = z.infer<typeof ContractFormSchema>;

export interface ContractFormProps {
  puppyId?: string;
  customerId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}
