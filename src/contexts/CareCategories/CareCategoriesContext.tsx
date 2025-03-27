
import React, { createContext, useContext, ReactNode } from 'react';
import { 
  PawPrint, 
  Utensils, 
  Pill, 
  Scissors, 
  Activity, 
  Stethoscope, 
  GraduationCap, 
  FileText, 
  ClipboardCheck, 
  Baby 
} from 'lucide-react';
import { CareCategory, CareCategoryDefinition, PuppyAgeGroup } from '@/types/careCategories';

interface CareCategoriesContextType {
  categories: CareCategoryDefinition[];
  getCategoryById: (id: CareCategory) => CareCategoryDefinition | undefined;
  puppyAgeGroups: PuppyAgeGroup[];
  getPuppyAgeGroup: (id: string) => PuppyAgeGroup | undefined;
}

const CareCategoriesContext = createContext<CareCategoriesContextType | undefined>(undefined);

export const CareCategoriesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const categories: CareCategoryDefinition[] = [
    {
      id: 'potty',
      name: 'Potty Breaks',
      icon: <PawPrint className="h-5 w-5" />,
      description: 'Track potty breaks, schedule and quality',
      color: 'bg-amber-100 text-amber-800',
      frequency: 'hourly',
      hasNotes: true
    },
    {
      id: 'feeding',
      name: 'Feeding',
      icon: <Utensils className="h-5 w-5" />,
      description: 'Track meals, food types, and amounts',
      color: 'bg-orange-100 text-orange-800',
      frequency: 'daily',
      hasNotes: true
    },
    {
      id: 'medication',
      name: 'Medications',
      icon: <Pill className="h-5 w-5" />,
      description: 'Track medications, dosages, and schedules',
      color: 'bg-red-100 text-red-800',
      frequency: 'as-needed',
      hasNotes: true
    },
    {
      id: 'grooming',
      name: 'Grooming',
      icon: <Scissors className="h-5 w-5" />,
      description: 'Track grooming activities and schedules',
      color: 'bg-blue-100 text-blue-800',
      frequency: 'weekly',
      hasNotes: true
    },
    {
      id: 'exercise',
      name: 'Exercise',
      icon: <Activity className="h-5 w-5" />,
      description: 'Track exercise and activities',
      color: 'bg-green-100 text-green-800',
      frequency: 'daily',
      hasNotes: true
    },
    {
      id: 'wellness',
      name: 'Wellness Checks',
      icon: <Stethoscope className="h-5 w-5" />,
      description: 'Track wellness checks and observations',
      color: 'bg-purple-100 text-purple-800',
      frequency: 'weekly',
      hasNotes: true
    },
    {
      id: 'training',
      name: 'Training',
      icon: <GraduationCap className="h-5 w-5" />,
      description: 'Track training progress and skills',
      color: 'bg-indigo-100 text-indigo-800',
      frequency: 'daily',
      hasNotes: true
    },
    {
      id: 'notes',
      name: 'Notes',
      icon: <FileText className="h-5 w-5" />,
      description: 'General notes and observations',
      color: 'bg-slate-100 text-slate-800',
      frequency: 'as-needed',
      hasNotes: true
    },
    {
      id: 'facility',
      name: 'Facility Tasks',
      icon: <ClipboardCheck className="h-5 w-5" />,
      description: 'Track facility maintenance and tasks',
      color: 'bg-gray-100 text-gray-800',
      frequency: 'daily',
      hasChecklist: true
    },
    {
      id: 'puppy',
      name: 'Puppy Care',
      icon: <Baby className="h-5 w-5" />,
      description: 'Age-based puppy care tracking',
      color: 'bg-pink-100 text-pink-800',
      frequency: 'hourly',
      hasNotes: true
    }
  ];

  const puppyAgeGroups: PuppyAgeGroup[] = [
    {
      id: 'newborn',
      name: 'Newborn',
      ageRange: '0-48 hours',
      description: 'Critical first hours of life',
      color: 'bg-rose-100 text-rose-800',
      careItems: [
        { name: 'Weight Check', description: 'Hourly weight monitoring', required: true, frequency: 'hourly' },
        { name: 'Temperature', description: 'Temperature monitoring', required: true, frequency: 'hourly' },
        { name: 'Feeding', description: 'Nursing/bottle feeding', required: true, frequency: 'hourly' }
      ]
    },
    {
      id: 'neonatal',
      name: 'Neonatal',
      ageRange: '3-7 days',
      description: 'Early development stage',
      color: 'bg-pink-100 text-pink-800',
      careItems: [
        { name: 'Daily Care', description: 'Basic daily care routine', required: true, frequency: 'daily' },
        { name: 'Cleaning', description: 'Linen changing and cleaning', required: true, frequency: 'daily' },
        { name: 'Observations', description: 'Developmental observations', required: false, frequency: 'daily' }
      ]
    },
    {
      id: 'transitional',
      name: 'Transitional',
      ageRange: '2-3 weeks',
      description: 'Eyes open, more mobile',
      color: 'bg-orange-100 text-orange-800',
      careItems: [
        { name: 'Weaning Prep', description: 'Prepare for weaning process', required: false, frequency: 'daily' },
        { name: 'Health Checks', description: 'Regular health monitoring', required: true, frequency: 'daily' },
        { name: 'Environment', description: 'Environmental enrichment', required: false, frequency: 'daily' }
      ]
    },
    {
      id: 'socialization',
      name: 'Socialization',
      ageRange: '3-6 weeks',
      description: 'Early socialization period',
      color: 'bg-yellow-100 text-yellow-800',
      careItems: [
        { name: 'Feeding', description: 'Weaning to solid food', required: true, frequency: 'daily' },
        { name: 'Play', description: 'Structured play time', required: true, frequency: 'daily' },
        { name: 'Socialization', description: 'First exposure to new stimuli', required: true, frequency: 'daily' }
      ]
    },
    {
      id: 'juvenile',
      name: 'Juvenile',
      ageRange: '6-8 weeks',
      description: 'Growing independence',
      color: 'bg-green-100 text-green-800',
      careItems: [
        { name: 'Exercise', description: 'Increased exercise needs', required: true, frequency: 'daily' },
        { name: 'Training', description: 'Basic training introduction', required: true, frequency: 'daily' },
        { name: 'Socialization', description: 'Expanded socialization', required: true, frequency: 'daily' }
      ]
    },
    {
      id: 'pre-adoption',
      name: 'Pre-Adoption',
      ageRange: '8-10 weeks',
      description: 'Preparing for new homes',
      color: 'bg-blue-100 text-blue-800',
      careItems: [
        { name: 'Pickup Prep', description: 'Preparing for new homes', required: true, frequency: 'daily' },
        { name: 'Independence', description: 'Encouraging independence', required: true, frequency: 'daily' },
        { name: 'Final Checks', description: 'Final health/behavior checks', required: true, frequency: 'daily' }
      ]
    }
  ];

  const getCategoryById = (id: CareCategory) => {
    return categories.find(category => category.id === id);
  };

  const getPuppyAgeGroup = (id: string) => {
    return puppyAgeGroups.find(group => group.id === id);
  };

  return (
    <CareCategoriesContext.Provider value={{ 
      categories, 
      getCategoryById,
      puppyAgeGroups,
      getPuppyAgeGroup
    }}>
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
