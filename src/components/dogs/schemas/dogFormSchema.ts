
import * as z from 'zod';

export const dogFormSchema = z.object({
  name: z.string().min(1, { message: 'Dog name is required' }),
  breed: z.string().min(1, { message: 'Breed is required' }),
  birthdate: z.date().optional().nullable(),
  birthdateStr: z.string().optional(),
  gender: z.string().optional(),
  color: z.string().optional(),
  weight: z.string().optional().transform(val => val ? parseFloat(val) : null),
  microchip_number: z.string().optional(),
  registration_number: z.string().optional(),
  pedigree: z.boolean().default(false),
  notes: z.string().optional(),
  photo_url: z.string().optional(),
});

export type DogFormValues = z.infer<typeof dogFormSchema>;

export interface DogFormProps {
  dog?: any;
  onSuccess: () => void;
  onCancel: () => void;
}
