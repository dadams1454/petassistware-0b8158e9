
import * as z from 'zod';

export const vaccinationFormSchema = z.object({
  dog_id: z.string().nonempty('Dog ID is required'),
  vaccination_type: z.string().nonempty('Vaccination type is required'),
  vaccination_date: z.date().refine(date => {
    // Check that date is not in the future
    return date <= new Date();
  }, {
    message: 'Vaccination date cannot be in the future',
  }).nullable().or(z.string()),
  vaccination_dateStr: z.string().optional(),
  notes: z.string().optional(),
  created_at: z.date().optional().or(z.string().optional()),
  id: z.string().optional(),
});

export type VaccinationFormValues = z.infer<typeof vaccinationFormSchema>;
