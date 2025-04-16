
import { v4 as uuidv4 } from 'uuid';
import { PuppyWithAge } from '../types';

// Helper function to get a date X days ago
const getDaysAgo = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split('T')[0];
};

// Helper function to get a random weight within a range
const getRandomWeight = (min: number, max: number): number => {
  return parseFloat((Math.random() * (max - min) + min).toFixed(2));
};

/**
 * Mock puppy data for development
 */
export const mockPuppies: PuppyWithAge[] = [
  // Newborn puppies (0-2 weeks)
  {
    id: uuidv4(),
    name: 'Luna',
    litter_id: 'litter-1',
    gender: 'female',
    color: 'Black',
    collar_color: 'Pink',
    birth_weight: 0.45,
    birth_weight_unit: 'kg',
    birthdate: getDaysAgo(5),
    status: 'available',
    markings: 'White chest patch',
    notes: 'Strong nursing instinct',
    photo_url: null,
    created_at: getDaysAgo(5),
    weight_current: 0.65,
    weight_unit: 'kg'
  },
  {
    id: uuidv4(),
    name: 'Atlas',
    litter_id: 'litter-1',
    gender: 'male',
    color: 'Brown',
    collar_color: 'Blue',
    birth_weight: 0.52,
    birth_weight_unit: 'kg',
    birthdate: getDaysAgo(5),
    status: 'available',
    markings: 'White paws',
    notes: 'Very vocal',
    photo_url: null,
    created_at: getDaysAgo(5),
    weight_current: 0.72,
    weight_unit: 'kg'
  },
  
  // Transitional puppies (2-4 weeks)
  {
    id: uuidv4(),
    name: 'Maple',
    litter_id: 'litter-2',
    gender: 'female',
    color: 'Red',
    collar_color: 'Purple',
    birth_weight: 0.48,
    birth_weight_unit: 'kg',
    birthdate: getDaysAgo(18),
    status: 'reserved',
    markings: 'White tail tip',
    notes: 'Eyes opening, starting to walk',
    photo_url: null,
    created_at: getDaysAgo(18),
    weight_current: 1.2,
    weight_unit: 'kg'
  },
  {
    id: uuidv4(),
    name: 'Bear',
    litter_id: 'litter-2',
    gender: 'male',
    color: 'Black and Tan',
    collar_color: 'Green',
    birth_weight: 0.55,
    birth_weight_unit: 'kg',
    birthdate: getDaysAgo(18),
    status: 'available',
    markings: 'Tan eyebrows',
    notes: 'Active, curious about surroundings',
    photo_url: null,
    created_at: getDaysAgo(18),
    weight_current: 1.35,
    weight_unit: 'kg'
  },
  
  // Socialization puppies (4-8 weeks)
  {
    id: uuidv4(),
    name: 'Daisy',
    litter_id: 'litter-3',
    gender: 'female',
    color: 'Cream',
    collar_color: 'Yellow',
    birth_weight: 0.5,
    birth_weight_unit: 'kg',
    birthdate: getDaysAgo(40),
    status: 'reserved',
    markings: 'None',
    notes: 'Playing with toys, socializing well',
    photo_url: null,
    created_at: getDaysAgo(40),
    weight_current: 2.8,
    weight_unit: 'kg'
  },
  {
    id: uuidv4(),
    name: 'Rocky',
    litter_id: 'litter-3',
    gender: 'male',
    color: 'Gray',
    collar_color: 'Red',
    birth_weight: 0.58,
    birth_weight_unit: 'kg',
    birthdate: getDaysAgo(40),
    status: 'available',
    markings: 'Black mask',
    notes: 'Very confident, loves exploring',
    photo_url: null,
    created_at: getDaysAgo(40),
    weight_current: 3.2,
    weight_unit: 'kg'
  },
  
  // Juvenile puppies (8-12 weeks)
  {
    id: uuidv4(),
    name: 'Piper',
    litter_id: 'litter-4',
    gender: 'female',
    color: 'Tricolor',
    collar_color: 'Orange',
    birth_weight: 0.53,
    birth_weight_unit: 'kg',
    birthdate: getDaysAgo(65),
    status: 'sold',
    markings: 'White blaze on face',
    notes: 'Good with children, house training well',
    photo_url: null,
    created_at: getDaysAgo(65),
    weight_current: 5.4,
    weight_unit: 'kg'
  },
  {
    id: uuidv4(),
    name: 'Scout',
    litter_id: 'litter-4',
    gender: 'male',
    color: 'Brindle',
    collar_color: 'Black',
    birth_weight: 0.62,
    birth_weight_unit: 'kg',
    birthdate: getDaysAgo(65),
    status: 'keeping',
    markings: 'Brindle pattern',
    notes: 'Starting leash training, smart',
    photo_url: null,
    created_at: getDaysAgo(65),
    weight_current: 6.1,
    weight_unit: 'kg'
  },
  
  // Adolescent puppies (12+ weeks)
  {
    id: uuidv4(),
    name: 'Willow',
    litter_id: 'litter-5',
    gender: 'female',
    color: 'Fawn',
    collar_color: 'Teal',
    birth_weight: 0.51,
    birth_weight_unit: 'kg',
    birthdate: getDaysAgo(90),
    status: 'sold',
    markings: 'Black mask',
    notes: 'Well-socialized, great with other dogs',
    photo_url: null,
    created_at: getDaysAgo(90),
    weight_current: 8.7,
    weight_unit: 'kg'
  },
  {
    id: uuidv4(),
    name: 'Oakley',
    litter_id: 'litter-5',
    gender: 'male',
    color: 'White',
    collar_color: 'Brown',
    birth_weight: 0.6,
    birth_weight_unit: 'kg',
    birthdate: getDaysAgo(90),
    status: 'reserved',
    markings: 'None',
    notes: 'Good recall, learning advanced commands',
    photo_url: null,
    created_at: getDaysAgo(90),
    weight_current: 9.5,
    weight_unit: 'kg'
  }
];

export default mockPuppies;
