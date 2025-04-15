
import { DailyCarelog, CareTaskPreset } from '@/types/dailyCare';
import { v4 as uuidv4 } from 'uuid';
import { mockDogs } from './dogs';

// Generate a random time within the last few days
const getRandomRecentTime = (maxDaysAgo = 3): string => {
  const now = Date.now();
  const randomTime = now - Math.floor(Math.random() * maxDaysAgo * 24 * 60 * 60 * 1000);
  return new Date(randomTime).toISOString();
};

// Care task presets
export const mockCareTaskPresets: CareTaskPreset[] = [
  {
    id: uuidv4(),
    category: 'pottybreaks',
    task_name: 'Morning Potty Break',
    created_at: new Date().toISOString(),
    created_by: 'user-1'
  },
  {
    id: uuidv4(),
    category: 'pottybreaks',
    task_name: 'Afternoon Potty Break',
    created_at: new Date().toISOString(),
    created_by: 'user-1'
  },
  {
    id: uuidv4(),
    category: 'pottybreaks',
    task_name: 'Evening Potty Break',
    created_at: new Date().toISOString(),
    created_by: 'user-1'
  },
  {
    id: uuidv4(),
    category: 'feeding',
    task_name: 'Breakfast',
    created_at: new Date().toISOString(),
    created_by: 'user-1'
  },
  {
    id: uuidv4(),
    category: 'feeding',
    task_name: 'Dinner',
    created_at: new Date().toISOString(),
    created_by: 'user-1'
  },
  {
    id: uuidv4(),
    category: 'medication',
    task_name: 'Heartworm Prevention',
    created_at: new Date().toISOString(),
    created_by: 'user-1'
  },
  {
    id: uuidv4(),
    category: 'medication',
    task_name: 'Flea & Tick Treatment',
    created_at: new Date().toISOString(),
    created_by: 'user-1'
  },
  {
    id: uuidv4(),
    category: 'grooming',
    task_name: 'Brushing',
    created_at: new Date().toISOString(),
    created_by: 'user-1'
  },
  {
    id: uuidv4(),
    category: 'exercise',
    task_name: 'Morning Walk',
    created_at: new Date().toISOString(),
    created_by: 'user-1'
  },
  {
    id: uuidv4(),
    category: 'exercise',
    task_name: 'Play Time',
    created_at: new Date().toISOString(),
    created_by: 'user-1'
  },
  {
    id: uuidv4(),
    category: 'wellness',
    task_name: 'Weight Check',
    created_at: new Date().toISOString(),
    created_by: 'user-1'
  },
  {
    id: uuidv4(),
    category: 'training',
    task_name: 'Basic Commands',
    created_at: new Date().toISOString(),
    created_by: 'user-1'
  },
  {
    id: uuidv4(),
    category: 'notes',
    task_name: 'General Observation',
    created_at: new Date().toISOString(),
    created_by: 'user-1'
  }
];

// Generate mock care logs for each dog
export const generateMockCareLogs = (): DailyCarelog[] => {
  const careLogs: DailyCarelog[] = [];
  
  mockDogs.forEach(dog => {
    // Add potty breaks
    careLogs.push({
      id: uuidv4(),
      dog_id: dog.id,
      category: 'pottybreaks',
      task_name: 'Morning Potty Break',
      timestamp: getRandomRecentTime(0.5),
      notes: 'Normal activity',
      created_by: 'user-1',
      created_at: new Date().toISOString()
    });
    
    // Add feeding logs
    careLogs.push({
      id: uuidv4(),
      dog_id: dog.id,
      category: 'feeding',
      task_name: 'Breakfast',
      timestamp: getRandomRecentTime(0.5),
      notes: 'Ate well',
      created_by: 'user-1',
      created_at: new Date().toISOString()
    });
    
    // Add medication logs
    if (Math.random() > 0.5) {
      careLogs.push({
        id: uuidv4(),
        dog_id: dog.id,
        category: 'medication',
        task_name: 'Heartworm Prevention',
        timestamp: getRandomRecentTime(15),
        notes: 'Monthly dose administered',
        created_by: 'user-1',
        created_at: new Date().toISOString()
      });
    }
    
    // Add grooming logs
    if (Math.random() > 0.7) {
      careLogs.push({
        id: uuidv4(),
        dog_id: dog.id,
        category: 'grooming',
        task_name: 'Brushing',
        timestamp: getRandomRecentTime(2),
        notes: 'Coat looks healthy',
        created_by: 'user-1',
        created_at: new Date().toISOString()
      });
    }
    
    // Add exercise logs
    careLogs.push({
      id: uuidv4(),
      dog_id: dog.id,
      category: 'exercise',
      task_name: 'Morning Walk',
      timestamp: getRandomRecentTime(1),
      notes: 'Enjoyed the exercise',
      created_by: 'user-1',
      created_at: new Date().toISOString()
    });
  });
  
  return careLogs;
};

// Mock care logs
export const mockCareLogs: DailyCarelog[] = generateMockCareLogs();

// Get care logs for a specific dog
export const getMockCareLogsForDog = (dogId: string): DailyCarelog[] => {
  return mockCareLogs.filter(log => log.dog_id === dogId);
};

// Get care logs by category for a specific dog
export const getMockCareLogsByCategory = (dogId: string, category: string): DailyCarelog[] => {
  return mockCareLogs.filter(log => log.dog_id === dogId && log.category === category);
};

// Get latest care log for each category for a dog
export const getLatestMockCareLogsByCategory = (
  dogId: string,
  categories = ['pottybreaks', 'feeding', 'medication', 'grooming', 'exercise', 'wellness', 'training', 'notes']
): Record<string, DailyCarelog | null> => {
  const result: Record<string, DailyCarelog | null> = {};
  
  categories.forEach(category => {
    const logs = getMockCareLogsByCategory(dogId, category);
    if (logs.length > 0) {
      // Sort by timestamp in descending order and get the first one
      const latest = logs.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )[0];
      result[category] = latest;
    } else {
      result[category] = null;
    }
  });
  
  return result;
};
