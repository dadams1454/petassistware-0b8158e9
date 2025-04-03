
/**
 * Generates a new UUID v4
 * @returns A valid UUID v4 string
 */
export function generateUUID(): string {
  // Implementation of RFC4122 version 4 compliant UUID generator
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Validates if a string is a properly formatted UUID
 * @param uuid String to validate
 * @returns Boolean indicating if the string is a valid UUID
 */
export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Creates a UUID from components
 * Primarily used for deterministic UUID generation when needed
 */
export function uuidFromComponents(
  timeLow: string,
  timeMid: string, 
  timeHiAndVersion: string,
  clockSeqHiAndReserved: string, 
  clockSeqLow: string, 
  node: string
): string {
  return `${timeLow}-${timeMid}-${timeHiAndVersion}-${clockSeqHiAndReserved}${clockSeqLow}-${node}`;
}

/**
 * Tries to parse a string into a UUID, cleaning it if possible
 * @param input Potential UUID string 
 * @returns Valid UUID or null if cannot be converted
 */
export function parseUUID(input: string): string | null {
  if (!input) return null;
  
  // If it's already a valid UUID, return it
  if (isValidUUID(input)) return input;
  
  // Try removing any non-hex characters and add dashes in the right places
  const cleanedInput = input.replace(/[^0-9a-f]/gi, '');
  
  // If we don't have enough characters after cleaning, it's not a UUID
  if (cleanedInput.length !== 32) return null;
  
  // Format into UUID pattern
  const formatted = `${cleanedInput.substring(0, 8)}-${cleanedInput.substring(8, 12)}-${cleanedInput.substring(12, 16)}-${cleanedInput.substring(16, 20)}-${cleanedInput.substring(20, 32)}`;
  
  // Verify it's valid
  if (isValidUUID(formatted)) return formatted;
  
  return null;
}
