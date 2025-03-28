
import React from 'react';
import { 
  Utensils, 
  Pill, 
  Baby, 
  Scissors, 
  Building2, 
  DropletHalf, 
  Dumbbell, 
  Heart, 
  GraduationCap,
  StickyNote
} from 'lucide-react';

export interface CareCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  color?: string;
  description?: string;
}

// Export the list of categories for use in components
export const careCategories: CareCategory[] = [
  {
    id: 'feeding',
    name: 'Feeding',
    icon: <Utensils className="h-4 w-4" />,
    description: 'Track meals and food intake'
  },
  {
    id: 'pottybreaks',
    name: 'Potty Breaks',
    icon: <DropletHalf className="h-4 w-4" />,
    description: 'Track bathroom breaks'
  },
  {
    id: 'medication',
    name: 'Medications',
    icon: <Pill className="h-4 w-4" />,
    description: 'Schedule and track medications'
  },
  {
    id: 'exercise',
    name: 'Exercise',
    icon: <Dumbbell className="h-4 w-4" />,
    description: 'Record physical activity'
  },
  {
    id: 'grooming',
    name: 'Grooming',
    icon: <Scissors className="h-4 w-4" />,
    description: 'Log grooming sessions'
  },
  {
    id: 'wellness',
    name: 'Wellness',
    icon: <Heart className="h-4 w-4" />,
    description: 'Track health check-ups'
  },
  {
    id: 'puppies',
    name: 'Puppies',
    icon: <Baby className="h-4 w-4" />,
    description: 'Manage puppy care activities'
  },
  {
    id: 'facility',
    name: 'Facility',
    icon: <Building2 className="h-4 w-4" />,
    description: 'Manage facility tasks'
  },
  {
    id: 'training',
    name: 'Training',
    icon: <GraduationCap className="h-4 w-4" />,
    description: 'Track training progress'
  },
  {
    id: 'notes',
    name: 'Notes',
    icon: <StickyNote className="h-4 w-4" />,
    description: 'Record general notes'
  }
];
