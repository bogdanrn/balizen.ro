import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge Tailwind CSS classes intelligently.
 * Handles conflicting classes by keeping the last one (rightmost wins).
 *
 * @example
 * cn('px-2 py-1', 'px-4') // => 'py-1 px-4'
 */
export function cn(...inputs: (string | undefined | null | false)[]): string {
  return twMerge(...inputs.filter(Boolean));
}
