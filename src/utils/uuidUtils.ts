
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
