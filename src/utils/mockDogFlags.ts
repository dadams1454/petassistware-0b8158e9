
/**
 * Utility to generate mock dog flags for demonstration purposes
 */

/**
 * Creates mock dog flags for demonstration purposes
 * @param dogs Array of dogs to generate flags for
 * @returns Record mapping dog IDs to their flags
 */
export const createMockDogFlags = (dogs: any[]): Record<string, DogFlag[]> => {
  // Mock flag data - in a real implementation, fetch this from a database table
  const mockDogFlags: Record<string, DogFlag[]> = {};

  // Add some mock flags for random dogs as an example
  if (dogs && dogs.length > 0) {
    // Add "in heat" flag to a random dog
    const randomIndex1 = Math.floor(Math.random() * dogs.length);
    mockDogFlags[dogs[randomIndex1].id] = [{ type: 'in_heat' }];
    
    // Add "incompatible" flags to two random dogs
    if (dogs.length > 2) {
      let randomIndex2 = Math.floor(Math.random() * dogs.length);
      // Make sure randomIndex2 is different from randomIndex1
      if (randomIndex2 === randomIndex1) {
        // If it's the same, choose the next or first index
        randomIndex2 = (randomIndex1 + 1) % dogs.length;
      }
      
      let randomIndex3 = Math.floor(Math.random() * dogs.length);
      // Make sure randomIndex3 is different from both randomIndex1 and randomIndex2
      if (randomIndex3 === randomIndex1 || randomIndex3 === randomIndex2) {
        // If it's the same as either, choose the next available index
        randomIndex3 = (randomIndex2 + 1) % dogs.length;
        if (randomIndex3 === randomIndex1) {
          randomIndex3 = (randomIndex3 + 1) % dogs.length;
        }
      }
      
      mockDogFlags[dogs[randomIndex2].id] = [{ 
        type: 'incompatible', 
        incompatible_with: [dogs[randomIndex3].id] 
      }];
      
      mockDogFlags[dogs[randomIndex3].id] = [{ 
        type: 'incompatible', 
        incompatible_with: [dogs[randomIndex2].id] 
      }];
    }
    
    // Add "special attention" flag to another random dog
    if (dogs.length > 3) {
      let randomIndex4 = Math.floor(Math.random() * dogs.length);
      
      // Declare these outside the if to avoid scope issues
      let randomIndex2 = -1;
      let randomIndex3 = -1;
      
      // Only set these values if we previously created them (in the dogs.length > 2 block)
      if (dogs.length > 2) {
        randomIndex2 = (randomIndex1 + 1) % dogs.length; // re-calculate based on previous logic
        randomIndex3 = (randomIndex2 + 1) % dogs.length;
        if (randomIndex3 === randomIndex1) {
          randomIndex3 = (randomIndex3 + 1) % dogs.length;
        }
      }
      
      while (
        randomIndex4 === randomIndex1 || 
        (dogs.length > 2 && randomIndex4 === randomIndex2) ||
        (dogs.length > 2 && randomIndex4 === randomIndex3)
      ) {
        randomIndex4 = Math.floor(Math.random() * dogs.length);
      }
      
      mockDogFlags[dogs[randomIndex4].id] = [{ 
        type: 'special_attention',
        value: 'Needs medication'
      }];
    }
  }
  
  return mockDogFlags;
};
