
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function for merging Tailwind CSS classes
 * This combines clsx and tailwind-merge to allow for conditional classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Truncate a string to a specified length and add an ellipsis.
 * @param text The text to truncate
 * @param length The maximum length (default: 100)
 * @returns The truncated text
 */
export const truncate = (text: string, length: number = 100): string => {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
};
