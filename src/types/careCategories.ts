
// Define all possible care categories
export type CareCategory = 
  | 'potty' 
  | 'feeding' 
  | 'medication' 
  | 'grooming' 
  | 'wellness' 
  | 'exercise' 
  | 'notes'
  | 'facility'
  | 'puppy';

// Puppy age groups for puppy care module
export interface PuppyAgeGroup {
  id: string;
  name: string;
  range: string;
  description: string;
  tasks: PuppyTask[];
}

// Tasks specific to puppy care
export interface PuppyTask {
  id: string;
  name: string;
  description: string;
  required: boolean;
  frequency?: string;
}
