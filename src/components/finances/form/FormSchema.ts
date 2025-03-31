
import * as z from 'zod';

export const expenseFormSchema = z.object({
  description: z.string().min(2, "Description is required"),
  amount: z.coerce.number().positive("Amount must be positive"),
  date: z.date(),
  category: z.string(),
  notes: z.string().optional(),
  dog_id: z.string().optional(),
  puppy_id: z.string().optional(),
});

export type ExpenseFormSchema = z.infer<typeof expenseFormSchema>;
