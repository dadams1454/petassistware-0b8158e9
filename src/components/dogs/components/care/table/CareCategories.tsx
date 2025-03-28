
import React from 'react';
import { 
  Bath, Utensils, 
  Pill, Dumbbell, Heart, 
  Clipboard, CheckCircle 
} from 'lucide-react';
import { CareCategory } from './components/types';

// Define the care categories for the table view
export const careCategories: CareCategory[] = [
  {
    id: 'feeding',
    name: 'Feeding',
    icon: <Utensils className="h-4 w-4 text-orange-500" />,
  },
  {
    id: 'medication',
    name: 'Medication',
    icon: <Pill className="h-4 w-4 text-red-500" />,
  },
  {
    id: 'grooming',
    name: 'Grooming',
    icon: <Bath className="h-4 w-4 text-purple-500" />,
  },
  {
    id: 'exercise',
    name: 'Exercise',
    icon: <Dumbbell className="h-4 w-4 text-green-500" />,
  },
  {
    id: 'wellness',
    name: 'Wellness',
    icon: <Heart className="h-4 w-4 text-pink-500" />,
  },
  {
    id: 'training',
    name: 'Training',
    icon: <CheckCircle className="h-4 w-4 text-indigo-500" />,
  },
  {
    id: 'notes',
    name: 'Notes',
    icon: <Clipboard className="h-4 w-4 text-gray-500" />,
  }
];

export default careCategories;
