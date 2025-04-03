
/**
 * Utilities for handling UUIDs
 */

/**
 * Check if a string is a valid UUID
 * @param uuid String to validate as UUID
 * @returns Boolean indicating if the string is a valid UUID
 */
export const isValidUUID = (uuid: string): boolean => {
  const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return regex.test(uuid);
};

/**
 * Try to fix common issues with UUIDs
 * @param uuid UUID string that might be malformed
 * @returns Fixed UUID string or the original string if unfixable
 */
export const sanitizeUUID = (uuid: string): string => {
  // If it's already valid, return it
  if (isValidUUID(uuid)) {
    return uuid;
  }

  // Try to fix UUIDs that are missing hyphens
  if (uuid.length === 32 && !uuid.includes('-')) {
    const parts = [
      uuid.slice(0, 8),
      uuid.slice(8, 12),
      uuid.slice(12, 16),
      uuid.slice(16, 20),
      uuid.slice(20)
    ];
    return parts.join('-');
  }

  // Return original if we can't fix it
  return uuid;
};

/**
 * Result of UUID validation
 */
export interface UuidValidationResult {
  isValid: boolean;
  uuid: string;
  wasRepaired: boolean;
}

/**
 * Validate and potentially repair a UUID
 * @param uuid UUID string to validate and repair
 * @returns Validation result with repaired UUID if possible
 */
export const validateUUID = (uuid: string): UuidValidationResult => {
  if (isValidUUID(uuid)) {
    return {
      isValid: true,
      uuid,
      wasRepaired: false
    };
  }

  const sanitized = sanitizeUUID(uuid);
  const isValid = isValidUUID(sanitized);

  return {
    isValid,
    uuid: sanitized,
    wasRepaired: isValid && sanitized !== uuid
  };
};
