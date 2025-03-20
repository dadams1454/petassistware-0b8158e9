
import React from 'react';
import { Coffee, Apple } from 'lucide-react';
import { CareCategory } from './components/types';

// Define the care categories for the table view - now with only Potty Breaks and Feeding
export const careCategories: CareCategory[] = [
  {
    id: 'pottybreaks',
    name: 'Potty Breaks',
    icon: <Coffee className="h-4 w-4 text-blue-500" />,
  },
  {
    id: 'feeding',
    name: 'Feeding',
    icon: <Apple className="h-4 w-4 text-green-500" />,
  },
];

export default careCategories;
