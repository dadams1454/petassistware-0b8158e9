
/**
 * Utility functions for UUID validation and sanitization
 */

// Standard UUID v4 regex pattern
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Validates if a string is a valid UUID
 * @param uuid String to validate
 * @returns Boolean indicating if the string is a valid UUID
 */
export const validateUUID = (uuid: string): boolean => {
  return UUID_REGEX.test(uuid);
};

/**
 * @deprecated Use validateUUID instead
 * Legacy function kept for backward compatibility
 */
export const isValidUUID = (uuid: string): boolean => {
  return validateUUID(uuid);
};

/**
 * Sanitizes a UUID string, removing any non-UUID characters
 * @param input String that might contain a UUID
 * @returns Cleaned UUID string if valid, otherwise the original string
 */
export const sanitizeUUID = (input: string): string => {
  if (!input) return input;
  
  // Try to match a UUID pattern within the string
  const match = input.match(UUID_REGEX);
  if (match) {
    return match[0];
  }
  
  // If no valid UUID found, return the original
  return input;
};

/**
 * Attempts to repair a malformed UUID
 * @param input Potentially malformed UUID string
 * @returns Repaired UUID or null if not repairable
 */
export const attemptUUIDRepair = (input: string): string | null => {
  if (!input) return null;
  
  // Remove all non-alphanumeric characters
  const cleaned = input.replace(/[^a-f0-9]/gi, '');
  
  // If we don't have enough characters for a UUID, can't repair
  if (cleaned.length < 32) return null;
  
  // Take the first 32 characters and format as UUID
  const segments = [
    cleaned.substring(0, 8),
    cleaned.substring(8, 12),
    cleaned.substring(12, 16),
    cleaned.substring(16, 20),
    cleaned.substring(20, 32)
  ];
  
  // Make sure it's a v4 UUID
  const uuidStr = segments.join('-').replace(/(.{14})(.{1})(.{3})/, '$14$3');
  
  // Validate the repaired UUID
  return validateUUID(uuidStr) ? uuidStr : null;
};

/**
 * Generates a random UUID v4
 * @returns A new UUID v4 string
 */
export const generateUUID = (): string => {
  return crypto.randomUUID ? crypto.randomUUID() : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};
