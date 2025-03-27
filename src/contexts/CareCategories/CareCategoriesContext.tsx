
import React, { createContext, useContext } from 'react';
import { 
  Coffee, Droplet, Scissors, Pill, HeartPulse, 
  Baby, Dumbbell, StickyNote, Trash2 
} from 'lucide-react';
import { CareCategory } from '@/types/careCategories';

interface CategoryData {
  id: CareCategory;
  name: string;
  icon: React.ReactNode;
  description: string;
  color?: string;
}

interface CareCategoriesContextType {
  categories: CategoryData[];
  getCategoryById: (id: CareCategory) => CategoryData | undefined;
}

const CareCategoriesContext = createContext<CareCategoriesContextType | undefined>(undefined);

export const CareCategoriesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const categories: CategoryData[] = [
    { 
      id: 'potty', 
      name: 'Potty Breaks', 
      icon: <Droplet className="h-4 w-4" />,
      description: 'Track potty breaks and bathroom habits',
      color: 'border-blue-500'
    },
    { 
      id: 'feeding', 
      name: 'Feeding', 
      icon: <Coffee className="h-4 w-4" />,
      description: 'Manage feeding schedules and food intake',
      color: 'border-orange-500'
    },
    { 
      id: 'medication', 
      name: 'Medications', 
      icon: <Pill className="h-4 w-4" />,
      description: 'Track medication administration',
      color: 'border-red-500'
    },
    { 
      id: 'grooming', 
      name: 'Grooming', 
      icon: <Scissors className="h-4 w-4" />,
      description: 'Record grooming and cleaning activities',
      color: 'border-purple-500'
    },
    { 
      id: 'wellness', 
      name: 'Wellness', 
      icon: <HeartPulse className="h-4 w-4" />, 
      description: 'Monitor health and wellness checks',
      color: 'border-green-500'
    },
    { 
      id: 'exercise', 
      name: 'Exercise', 
      icon: <Dumbbell className="h-4 w-4" />,
      description: 'Track exercise and physical activity',
      color: 'border-yellow-500'
    },
    { 
      id: 'notes', 
      name: 'Notes', 
      icon: <StickyNote className="h-4 w-4" />,
      description: 'Add general notes and observations',
      color: 'border-gray-500'
    },
    { 
      id: 'facility', 
      name: 'Facility', 
      icon: <Trash2 className="h-4 w-4" />,
      description: 'Manage kennel and facility maintenance tasks',
      color: 'border-emerald-500'
    },
    { 
      id: 'puppy', 
      name: 'Puppy Care', 
      icon: <Baby className="h-4 w-4" />,
      description: 'Age-specific care for puppies',
      color: 'border-pink-500'
    }
  ];

  // Add the missing getCategoryById method
  const getCategoryById = (id: CareCategory) => {
    return categories.find(category => category.id === id);
  };

  return (
    <CareCategoriesContext.Provider value={{ categories, getCategoryById }}>
      {children}
    </CareCategoriesContext.Provider>
  );
};

export const useCareCategories = () => {
  const context = useContext(CareCategoriesContext);
  if (context === undefined) {
    throw new Error('useCareCategories must be used within a CareCategoriesProvider');
  }
  return context;
};
