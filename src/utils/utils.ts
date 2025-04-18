
/**
 * Create a URL slug from a string
 * @param text Text to convert to a slug
 * @returns The slugified text
 */
export const createSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
};

/**
 * Format a number with commas as thousands separators
 * @param value The number to format
 * @returns The formatted number string
 */
export const formatNumber = (value: number): string => {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * Capitalize the first letter of each word in a string
 * @param text The text to capitalize
 * @returns The capitalized text
 */
export const titleCase = (text: string): string => {
  if (!text) return '';
  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Generate a random alphanumeric string
 * @param length The length of the string to generate
 * @returns Random string
 */
export const randomString = (length: number = 8): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Import truncate from lib/utils to re-export for backward compatibility
export { truncate } from '@/lib/utils';
