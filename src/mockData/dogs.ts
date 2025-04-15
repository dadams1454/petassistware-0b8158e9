
import { Dog, DogGender, DogStatus } from '@/types/dog';
import { v4 as uuidv4 } from 'uuid';

// Helper to get a random date within the past few years
const getRandomBirthdate = (minYears = 1, maxYears = 8): string => {
  const now = new Date();
  const minAgo = new Date(now.getFullYear() - maxYears, now.getMonth(), now.getDate());
  const maxAgo = new Date(now.getFullYear() - minYears, now.getMonth(), now.getDate());
  const randomTime = minAgo.getTime() + Math.random() * (maxAgo.getTime() - minAgo.getTime());
  return new Date(randomTime).toISOString().split('T')[0];
};

// Create mock data for dogs
export const mockDogs: Dog[] = [
  {
    id: uuidv4(),
    name: "Luna",
    breed: "Newfoundland",
    gender: DogGender.FEMALE,
    color: "Black",
    birthdate: getRandomBirthdate(2, 4),
    status: DogStatus.ACTIVE,
    photo_url: "https://example.com/photos/luna.jpg",
    is_pregnant: false,
    weight: 120,
    weight_unit: "lb",
    pedigree: true,
    requires_special_handling: false,
    created_at: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    name: "Bear",
    breed: "Newfoundland",
    gender: DogGender.MALE,
    color: "Brown",
    birthdate: getRandomBirthdate(3, 5),
    status: DogStatus.ACTIVE,
    photo_url: "https://example.com/photos/bear.jpg",
    weight: 150,
    weight_unit: "lb",
    pedigree: true,
    requires_special_handling: false,
    created_at: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    name: "Daisy",
    breed: "Newfoundland",
    gender: DogGender.FEMALE,
    color: "Landseer",
    birthdate: getRandomBirthdate(1, 3),
    status: DogStatus.ACTIVE,
    photo_url: "https://example.com/photos/daisy.jpg",
    is_pregnant: true,
    weight: 110,
    weight_unit: "lb",
    pedigree: true,
    requires_special_handling: true,
    created_at: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    name: "Max",
    breed: "Newfoundland",
    gender: DogGender.MALE,
    color: "Gray",
    birthdate: getRandomBirthdate(4, 6),
    status: DogStatus.GUARDIAN,
    photo_url: "https://example.com/photos/max.jpg",
    weight: 145,
    weight_unit: "lb",
    pedigree: true,
    requires_special_handling: false,
    created_at: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    name: "Rosie",
    breed: "Newfoundland",
    gender: DogGender.FEMALE,
    color: "Black",
    birthdate: getRandomBirthdate(5, 7),
    status: DogStatus.RETIRED,
    photo_url: "https://example.com/photos/rosie.jpg",
    is_pregnant: false,
    weight: 105,
    weight_unit: "lb",
    pedigree: true,
    requires_special_handling: false,
    created_at: new Date().toISOString(),
  },
];

// Get a single dog by ID
export const getMockDogById = (dogId: string): Dog | undefined => {
  return mockDogs.find(dog => dog.id === dogId);
};

// Get all dogs
export const getAllMockDogs = (): Dog[] => {
  return mockDogs;
};

// Filter dogs by status
export const filterMockDogsByStatus = (status: DogStatus | string): Dog[] => {
  return mockDogs.filter(dog => dog.status === status);
};
