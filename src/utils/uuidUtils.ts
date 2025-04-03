
/**
 * UUID utility functions for generating and validating UUIDs
 */

/**
 * Generates a new valid UUID v4
 * @returns {string} A valid UUID v4 string
 */
export const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * Validates if a string is a valid UUID
 * @param {string} uuid - The UUID string to validate
 * @returns {boolean} Whether the string is a valid UUID
 */
export const isValidUUID = (uuid: string): boolean => {
  if (!uuid) return false;
  
  const uuidRegex = 
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  
  return uuidRegex.test(uuid);
};

/**
 * Attempts to repair a malformed UUID
 * @param {string} uuid - The potentially malformed UUID string
 * @returns {string|null} A repaired UUID or null if repair is not possible
 */
export const attemptUUIDRepair = (uuid: string): string | null => {
  if (!uuid) return null;
  
  // Remove any non-hex characters (except hyphens)
  let cleaned = uuid.replace(/[^0-9a-f-]/gi, '');
  
  // Handle common formatting issues
  // Add missing hyphens if the length is right but hyphens are missing
  if (cleaned.length === 32 && !cleaned.includes('-')) {
    cleaned = 
      cleaned.slice(0, 8) + '-' + 
      cleaned.slice(8, 12) + '-' + 
      cleaned.slice(12, 16) + '-' + 
      cleaned.slice(16, 20) + '-' + 
      cleaned.slice(20);
  }
  
  // Check if the repaired UUID is valid
  if (isValidUUID(cleaned)) {
    return cleaned;
  }
  
  return null;
};
