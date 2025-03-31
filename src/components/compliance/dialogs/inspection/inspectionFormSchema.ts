
import { z } from 'zod';

export const inspectionFormSchema = z.object({
  title: z.string().min(1, "Inspection name is required"),
  inspector: z.string().optional(),
  inspection_date: z.date({ required_error: "Inspection date is required" }),
  next_date: z.date().optional(),
  status: z.enum(["scheduled", "passed", "failed"]),
  follow_up: z.string().optional(),
  notes: z.string().optional(),
});

export type InspectionFormValues = z.infer<typeof inspectionFormSchema>;

export const inspectionTypes = [
  "Annual AKC Inspection",
  "State Health Department",
  "County Animal Control",
  "USDA Inspection",
  "Fire Department",
  "Kennel Club Evaluation",
  "Health Certificate Inspection",
  "Other"
];
