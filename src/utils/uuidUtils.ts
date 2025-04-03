
import { v4 as uuidv4 } from 'uuid';

/**
 * Validates if a string is a valid UUID
 * @param uuid String to validate
 * @returns Boolean indicating if the string is a valid UUID
 */
export const isValidUUID = (uuid: string): boolean => {
  // Regular expression for UUID validation
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

/**
 * Sanitizes a UUID string by removing any non-UUID characters
 * @param uuid String that should be a UUID
 * @returns Sanitized UUID string or empty string if invalid
 */
export const sanitizeUUID = (uuid: string): string | null => {
  if (!uuid) return null;
  
  // Remove any non-alphanumeric characters except dashes
  const sanitized = uuid.replace(/[^a-f0-9-]/gi, '');
  
  // Check if it's a valid UUID after sanitization
  if (isValidUUID(sanitized)) {
    return sanitized;
  }
  
  // If it's not valid after sanitization, return null
  return null;
};

/**
 * Attempts to repair a malformed UUID
 * @param possibleUUID String that might be a UUID
 * @returns Repaired UUID or null if beyond repair
 */
export const attemptUUIDRepair = (possibleUUID: string): string | null => {
  if (!possibleUUID) return null;
  
  // Remove all non-alphanumeric characters
  let cleaned = possibleUUID.replace(/[^a-f0-9]/gi, '');
  
  // If we don't have enough characters, it's not salvageable
  if (cleaned.length < 32) return null;
  
  // Truncate to 32 characters if longer
  if (cleaned.length > 32) {
    cleaned = cleaned.substring(0, 32);
  }
  
  // Insert dashes in the correct positions for UUID format
  const parts = [
    cleaned.substring(0, 8),
    cleaned.substring(8, 12),
    cleaned.substring(12, 16),
    cleaned.substring(16, 20),
    cleaned.substring(20, 32)
  ];
  
  const formattedUUID = parts.join('-');
  
  // Final validation check
  if (isValidUUID(formattedUUID)) {
    return formattedUUID;
  }
  
  return null;
};

/**
 * Validates a UUID, with optional auto-repair attempt
 * @param uuid UUID to validate
 * @param attemptRepair Whether to attempt to repair an invalid UUID
 * @returns Validation result with the original or repaired UUID
 */
export const validateUUID = (uuid: string, attemptRepair = false): { 
  isValid: boolean; 
  uuid: string | null;
  wasRepaired: boolean;
} => {
  // Check if it's already valid
  if (isValidUUID(uuid)) {
    return { isValid: true, uuid, wasRepaired: false };
  }
  
  // If we're not attempting repair, return invalid
  if (!attemptRepair) {
    return { isValid: false, uuid: null, wasRepaired: false };
  }
  
  // Try to repair
  const repairedUUID = attemptUUIDRepair(uuid);
  
  return {
    isValid: repairedUUID !== null,
    uuid: repairedUUID,
    wasRepaired: repairedUUID !== null
  };
};

/**
 * Generates a new valid UUID
 * @returns A new UUID
 */
export const generateUUID = (): string => {
  return uuidv4();
};
