
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

// Add the WeightUnit type that's referenced in components
export type WeightUnit = 'lb' | 'kg' | 'oz' | 'g';
