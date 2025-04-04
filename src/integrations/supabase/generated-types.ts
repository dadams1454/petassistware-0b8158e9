
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

// Import WeightUnit from common types
import { WeightUnit } from '@/types/common';

// Re-export WeightUnit for use in other files
export type { WeightUnit };
