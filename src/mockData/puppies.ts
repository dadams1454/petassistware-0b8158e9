
import { PuppyWithAge } from '@/types/puppy';
import { v4 as uuidv4 } from 'uuid';

// Helper to calculate age in days from birth date
const calculateAgeInDays = (birthDate: string): number => {
  const today = new Date();
  const birth = new Date(birthDate);
  const diffTime = Math.abs(today.getTime() - birth.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Generate an age description from days
const generateAgeDescription = (ageInDays: number): string => {
  const ageInWeeks = Math.floor(ageInDays / 7);
  
  if (ageInDays < 7) {
    return `${ageInDays} days`;
  } else if (ageInDays < 14) {
    return `1 week, ${ageInDays % 7} days`;
  } else {
    const remainingDays = ageInDays % 7;
    if (remainingDays > 0) {
      return `${ageInWeeks} weeks, ${remainingDays} days`;
    } else {
      return `${ageInWeeks} weeks`;
    }
  }
};

// Create mock data for puppies with different age groups
export const mockPuppies: PuppyWithAge[] = [
  // Newborns (0-2 weeks)
  {
    id: uuidv4(),
    name: "Tiny",
    gender: "Male",
    birth_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    litter_id: "litter-1",
    color: "Black",
    status: "Available",
    birth_weight: 350,
    weight_unit: "g",
    current_weight: 450,
    birth_order: 1,
    created_at: new Date().toISOString(),
    ageInDays: 5,
    ageInWeeks: 0,
    ageDescription: "5 days"
  },
  // 2-4 weeks
  {
    id: uuidv4(),
    name: "Scout",
    gender: "Female",
    birth_date: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
    litter_id: "litter-1",
    color: "Brown",
    status: "Available",
    birth_weight: 380,
    weight_unit: "g",
    current_weight: 700,
    birth_order: 2,
    created_at: new Date().toISOString(),
    ageInDays: 18,
    ageInWeeks: 2,
    ageDescription: "2 weeks, 4 days"
  },
  // 4-6 weeks
  {
    id: uuidv4(),
    name: "Buddy",
    gender: "Male",
    birth_date: new Date(Date.now() - 32 * 24 * 60 * 60 * 1000).toISOString(),
    litter_id: "litter-2",
    color: "White",
    status: "Reserved",
    birth_weight: 400,
    weight_unit: "g",
    current_weight: 1200,
    birth_order: 1,
    created_at: new Date().toISOString(),
    ageInDays: 32,
    ageInWeeks: 4,
    ageDescription: "4 weeks, 4 days"
  },
  // 6-8 weeks
  {
    id: uuidv4(),
    name: "Luna",
    gender: "Female",
    birth_date: new Date(Date.now() - 49 * 24 * 60 * 60 * 1000).toISOString(),
    litter_id: "litter-2",
    color: "Black and White",
    status: "Reserved",
    birth_weight: 420,
    weight_unit: "g",
    current_weight: 2100,
    birth_order: 2,
    created_at: new Date().toISOString(),
    ageInDays: 49,
    ageInWeeks: 7,
    ageDescription: "7 weeks"
  },
  // 8-10 weeks
  {
    id: uuidv4(),
    name: "Max",
    gender: "Male",
    birth_date: new Date(Date.now() - 63 * 24 * 60 * 60 * 1000).toISOString(),
    litter_id: "litter-3",
    color: "Brown and Black",
    status: "Sold",
    birth_weight: 450,
    weight_unit: "g",
    current_weight: 3200,
    birth_order: 1,
    created_at: new Date().toISOString(),
    ageInDays: 63,
    ageInWeeks: 9,
    ageDescription: "9 weeks"
  },
  // 10-12 weeks
  {
    id: uuidv4(),
    name: "Daisy",
    gender: "Female",
    birth_date: new Date(Date.now() - 77 * 24 * 60 * 60 * 1000).toISOString(),
    litter_id: "litter-3",
    color: "Tan",
    status: "Sold",
    birth_weight: 430,
    weight_unit: "g",
    current_weight: 4100,
    birth_order: 2,
    created_at: new Date().toISOString(),
    ageInDays: 77,
    ageInWeeks: 11,
    ageDescription: "11 weeks"
  },
  // 12+ weeks
  {
    id: uuidv4(),
    name: "Rocky",
    gender: "Male",
    birth_date: new Date(Date.now() - 98 * 24 * 60 * 60 * 1000).toISOString(),
    litter_id: "litter-4",
    color: "Brindle",
    status: "Unavailable",
    birth_weight: 470,
    weight_unit: "g",
    current_weight: 5500,
    birth_order: 1,
    created_at: new Date().toISOString(),
    ageInDays: 98,
    ageInWeeks: 14,
    ageDescription: "14 weeks"
  },
];

// Get a single puppy by ID
export const getMockPuppyById = (puppyId: string): PuppyWithAge | undefined => {
  return mockPuppies.find(puppy => puppy.id === puppyId);
};

// Update puppy ages based on the current date
export const getUpdatedPuppies = (): PuppyWithAge[] => {
  return mockPuppies.map(puppy => {
    const ageInDays = calculateAgeInDays(puppy.birth_date);
    const ageInWeeks = Math.floor(ageInDays / 7);
    return {
      ...puppy,
      ageInDays,
      ageInWeeks,
      ageDescription: generateAgeDescription(ageInDays)
    };
  });
};
