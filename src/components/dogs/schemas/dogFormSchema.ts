
import * as z from 'zod';

export const dogFormSchema = z.object({
  name: z.string().min(1, { message: 'Dog name is required' }),
  breed: z.string().min(1, { message: 'Breed is required' }),
  birthdate: z.date().optional().nullable(),
  birthdateStr: z.string().optional(),
  gender: z.string().optional(),
  color: z.string().optional(),
  weight: z.string().optional().transform(val => val ? parseFloat(val) : null),
  weight_unit: z.enum(['lbs', 'kg', 'oz', 'g']).default('lbs').optional(),
  microchip_number: z.string().optional(),
  microchip_location: z.string().optional(),
  registration_number: z.string().optional(),
  registration_organization: z.string().optional(),
  pedigree: z.boolean().default(false),
  notes: z.string().optional(),
  photo_url: z.string().optional(),
  status: z.enum(['active', 'archived', 'deceased', 'retired', 'rehomed', 'guardian', 'sold']).default('active').optional(),
  // Female dog breeding fields
  is_pregnant: z.boolean().optional().default(false),
  last_heat_date: z.date().optional().nullable(),
  tie_date: z.date().optional().nullable(),
  litter_number: z.number().optional().default(0),
  // Vaccination fields
  last_vaccination_date: z.date().optional().nullable(),
  vaccination_type: z.string().optional(),
  vaccination_notes: z.string().optional(),
  // Special handling fields
  requires_special_handling: z.boolean().optional().default(false),
  potty_alert_threshold: z.number().optional(),
  max_time_between_breaks: z.number().optional(),
  // Genetic fields
  genetic_testing_id: z.string().optional(),
  genetic_testing_provider: z.string().optional(),
  genetic_coi: z.number().optional(),
  has_genetic_tests: z.boolean().optional().default(false),
});

export type DogFormValues = z.infer<typeof dogFormSchema>;

export interface DogFormProps {
  dog?: any;
  onSuccess: () => void;
  onCancel: () => void;
}
