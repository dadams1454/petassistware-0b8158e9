
import React from 'react';
import { 
  Utensils, 
  Pill
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
  }
];

export default careCategories;
