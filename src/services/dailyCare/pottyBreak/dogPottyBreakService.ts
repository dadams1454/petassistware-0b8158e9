
/**
 * Service for managing dog potty breaks
 */

// Define the interface for potty break data
export interface DogPottyBreak {
  dog_id: string;
  session_time: string;
  notes?: string;
}

// Function to add a potty break for a dog at a specific time
export const addDogPottyBreak = async (dogId: string, timeSlot: string): Promise<void> => {
  console.log(`Adding potty break for dog ${dogId} at ${timeSlot}`);
  // In a real implementation, this would make an API call to add the potty break
  // For now, we'll simulate a successful API call with a delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return Promise.resolve();
};

// Function to remove a potty break for a dog at a specific time
export const removeDogPottyBreak = async (dogId: string, timeSlot: string): Promise<void> => {
  console.log(`Removing potty break for dog ${dogId} at ${timeSlot}`);
  // In a real implementation, this would make an API call to remove the potty break
  // For now, we'll simulate a successful API call with a delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return Promise.resolve();
};

// Function to log a potty break (similar to addDogPottyBreak but for backward compatibility)
export const logDogPottyBreak = async (dogId: string, timeSlot: string): Promise<void> => {
  return addDogPottyBreak(dogId, timeSlot);
};

// Function to get the last potty break for a dog
export const getLastDogPottyBreak = async (dogId: string): Promise<DogPottyBreak | null> => {
  console.log(`Fetching last potty break for dog ${dogId}`);
  // In a real implementation, this would fetch from an API or database
  // For now, we'll simulate a successful API call with a delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Return simulated data - in a real app this would come from the backend
  // Generate a random time within the last 6 hours
  const randomHoursAgo = Math.floor(Math.random() * 6);
  const randomTime = new Date();
  randomTime.setHours(randomTime.getHours() - randomHoursAgo);
  
  return {
    dog_id: dogId,
    session_time: randomTime.toISOString()
  };
};
