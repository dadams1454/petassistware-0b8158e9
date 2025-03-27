
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
}

interface CareCategoriesContextType {
  categories: CategoryData[];
}

const CareCategoriesContext = createContext<CareCategoriesContextType | undefined>(undefined);

export const CareCategoriesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const categories: CategoryData[] = [
    { 
      id: 'potty', 
      name: 'Potty Breaks', 
      icon: <Droplet className="h-4 w-4" />,
      description: 'Track potty breaks and bathroom habits'
    },
    { 
      id: 'feeding', 
      name: 'Feeding', 
      icon: <Coffee className="h-4 w-4" />,
      description: 'Manage feeding schedules and food intake'
    },
    { 
      id: 'medication', 
      name: 'Medications', 
      icon: <Pill className="h-4 w-4" />,
      description: 'Track medication administration'
    },
    { 
      id: 'grooming', 
      name: 'Grooming', 
      icon: <Scissors className="h-4 w-4" />,
      description: 'Record grooming and cleaning activities'
    },
    { 
      id: 'wellness', 
      name: 'Wellness', 
      icon: <HeartPulse className="h-4 w-4" />, 
      description: 'Monitor health and wellness checks'
    },
    { 
      id: 'exercise', 
      name: 'Exercise', 
      icon: <Dumbbell className="h-4 w-4" />,
      description: 'Track exercise and physical activity'
    },
    { 
      id: 'notes', 
      name: 'Notes', 
      icon: <StickyNote className="h-4 w-4" />,
      description: 'Add general notes and observations'
    },
    { 
      id: 'facility', 
      name: 'Facility', 
      icon: <Trash2 className="h-4 w-4" />,
      description: 'Manage kennel and facility maintenance tasks'
    },
    { 
      id: 'puppy', 
      name: 'Puppy Care', 
      icon: <Baby className="h-4 w-4" />,
      description: 'Age-specific care for puppies'
    }
  ];

  return (
    <CareCategoriesContext.Provider value={{ categories }}>
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
