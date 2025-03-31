
/**
 * Utility functions for UUID validation and generation
 */
import { v4 as uuidv4 } from 'uuid';

// Improved RegEx for validating properly formatted UUIDs that strictly follows RFC4122
export const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Basic validation - returns boolean
 * @param uuid UUID string to validate
 * @returns boolean indicating if the UUID is valid
 */
export const isValidUUID = (uuid: string | null | undefined): boolean => {
  if (!uuid) return false;
  return UUID_REGEX.test(uuid);
};

/**
 * More detailed validation with error messages
 * @param input UUID string to validate
 * @returns Object with validation result and error message if any
 */
export const validateUUID = (input: string | null | undefined) => {
  if (!input) {
    return { valid: false, error: "UUID cannot be empty" };
  }
  
  // First check: Does it look like a UUID?
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(input)) {
    return { valid: false, error: "Invalid UUID format" };
  }
  
  // Second check: Is it a valid v4 UUID?
  const parts = input.split('-');
  const variant = parseInt(parts[3].charAt(0), 16);
  const version = parseInt(parts[2].charAt(0), 16);
  
  if (version !== 4) {
    return { valid: false, error: "UUID must be version 4" };
  }
  
  if (variant < 8 || variant > 11) { // 8, 9, a, b
    return { valid: false, error: "UUID has invalid variant" };
  }
  
  return { valid: true, error: null };
};

/**
 * Attempt to repair common UUID format issues
 * @param malformedUUID Potentially malformed UUID string
 * @returns Repaired UUID string or null if repair failed
 */
export const attemptUUIDRepair = (malformedUUID?: string | null): string | null => {
  if (!malformedUUID) return null;
  
  // Handle common mistakes
  let repaired = malformedUUID.trim();
  
  // Remove any hidden characters or invisible spaces
  repaired = repaired.replace(/\s+/g, '');
  
  // Add missing hyphens if length is right
  if (/^[0-9a-f]{32}$/i.test(repaired)) {
    repaired = repaired.replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, "$1-$2-$3-$4-$5");
  }
  
  // Remove any extra characters that might have been copied
  repaired = repaired.replace(/[^0-9a-f-]/gi, '');
  
  // Check if repair was successful
  return isValidUUID(repaired) ? repaired : null;
};

/**
 * Generate a new valid UUID
 * @returns A RFC4122 compliant UUID string
 */
export const generateUUID = (): string => {
  return uuidv4();
};

/**
 * Safely handle a UUID for database operations
 * @param uuid UUID to sanitize
 * @returns Valid UUID or null
 */
export const sanitizeUUID = (uuid: string | null | undefined): string | null => {
  if (!uuid) return null;
  
  // First try direct validation
  if (isValidUUID(uuid)) return uuid;
  
  // If not valid, try to repair it
  const repaired = attemptUUIDRepair(uuid);
  return repaired;
};
