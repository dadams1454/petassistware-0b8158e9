
import React from 'react';
import { 
  Coffee, 
  Droplet, 
  Scissors, 
  Dumbbell, 
  Heart, 
  Pill, 
  LifeBuoy,
  Building2,
  Baby,
  StickyNote
} from 'lucide-react';

export const careCategories = [
  {
    id: 'pottybreaks',
    name: 'Potty Breaks',
    icon: <Droplet className="h-4 w-4" />,
  },
  {
    id: 'feeding',
    name: 'Feeding',
    icon: <Coffee className="h-4 w-4" />,
  },
  {
    id: 'medication',
    name: 'Medications',
    icon: <Pill className="h-4 w-4" />,
  },
  {
    id: 'grooming',
    name: 'Grooming',
    icon: <Scissors className="h-4 w-4" />,
  },
  {
    id: 'exercise',
    name: 'Exercise',
    icon: <Dumbbell className="h-4 w-4" />,
  },
  {
    id: 'wellness',
    name: 'Wellness',
    icon: <LifeBuoy className="h-4 w-4" />,
  },
  {
    id: 'health',
    name: 'Health',
    icon: <Heart className="h-4 w-4" />,
  },
  {
    id: 'notes',
    name: 'Notes',
    icon: <StickyNote className="h-4 w-4" />,
  },
  {
    id: 'facility',
    name: 'Facility',
    icon: <Building2 className="h-4 w-4" />,
  },
  {
    id: 'puppies',
    name: 'Puppies',
    icon: <Baby className="h-4 w-4" />,
  }
];

export default careCategories;
