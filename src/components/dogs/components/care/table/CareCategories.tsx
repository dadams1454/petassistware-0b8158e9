
import React from 'react';
import { Coffee } from 'lucide-react';
import { CareCategory } from './components/types';

// Define the care categories for the table view - now with only Potty Breaks
export const careCategories: CareCategory[] = [
  {
    id: 'pottybreaks',
    name: 'Potty Breaks',
    icon: <Coffee className="h-4 w-4 text-blue-500" />,
  },
];

export default careCategories;
