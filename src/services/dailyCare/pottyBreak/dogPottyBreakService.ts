
/**
 * Stub service for dog potty break service
 * This is kept as a compatibility layer while transitioning to Dog Let Out functionality
 */

export const logDogPottyBreak = async (
  dogId: string, 
  dogName: string, 
  timeSlot: string
): Promise<boolean> => {
  console.warn('logDogPottyBreak is deprecated, use dog let out functionality instead');
  return false;
};
