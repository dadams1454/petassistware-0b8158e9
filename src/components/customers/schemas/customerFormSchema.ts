
import * as z from "zod";

export const customerFormSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email").optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
  customer_type: z.enum(["new", "returning"]).default("new"),
  customer_since: z.string().optional(),
  interested_puppy_id: z.string().default("none"),
});

export type CustomerFormValues = z.infer<typeof customerFormSchema>;
