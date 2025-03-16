
import React from 'react';
import { Calendar, Coffee, Utensils } from 'lucide-react';
import { CareCategory } from './components/types';

// Define the care categories for the table view
export const careCategories: CareCategory[] = [
  {
    id: 'all',
    name: 'All Care',
    icon: <Calendar className="h-4 w-4 text-blue-500" />,
  },
  {
    id: 'feeding',
    name: 'Feeding',
    icon: <Utensils className="h-4 w-4 text-yellow-500" />,
  },
  {
    id: 'pottybreaks',
    name: 'Potty Breaks',
    icon: <Coffee className="h-4 w-4 text-blue-500" />,
  },
  // Removed "exercise" and "medications" categories from this list
];

export default careCategories;
