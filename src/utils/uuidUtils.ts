
/**
 * Utility functions for UUID validation and generation
 */

// Regex for validating properly formatted UUIDs
export const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// Basic validation - returns boolean
export const isValidUUID = (uuid: string): boolean => {
  if (!uuid) return false;
  return UUID_REGEX.test(uuid);
};

// More detailed validation with error messages
export const validateUUID = (input: string) => {
  // First check: Does it look like a UUID?
  if (!input || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(input)) {
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

// Attempt to repair common UUID format issues
export const attemptUUIDRepair = (malformedUUID?: string): string | null => {
  if (!malformedUUID) return null;
  
  // Handle common mistakes
  let repaired = malformedUUID.trim();
  
  // Add missing hyphens if length is right
  if (/^[0-9a-f]{32}$/i.test(repaired)) {
    repaired = repaired.replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, "$1-$2-$3-$4-$5");
  }
  
  // Check if repair was successful
  return isValidUUID(repaired) ? repaired : null;
};
