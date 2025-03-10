
import * as z from 'zod';

export const waitlistFormSchema = z.object({
  customer_id: z.string().min(1, 'Please select a customer'),
  notes: z.string().optional(),
  gender_preference: z.enum(['Male', 'Female']).optional().nullable(),
  color_preference: z.string().optional().nullable(),
});

export type WaitlistFormValues = z.infer<typeof waitlistFormSchema>;
