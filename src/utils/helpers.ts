/**
 * Utility Functions for Country API
 */

/**
 * Generate a random multiplier between min and max
 */
export const generateRandomMultiplier = (min: number = 1000, max: number = 2000): number => {
  return Math.random() * (max - min) + min;
};

/**
 * Calculate estimated GDP
 */
export const calculateEstimatedGDP = (
  population: number,
  exchangeRate: number,
  multiplier?: number
): number => {
  const multi = multiplier || generateRandomMultiplier();
  return (population * multi) / exchangeRate;
};

/**
 * Format date to ISO string
 */
export const formatDate = (date: Date): string => {
  return date.toISOString();
};

/**
 * Normalize country name for comparison (case-insensitive)
 */
export const normalizeCountryName = (name: string): string => {
  return name.toLowerCase().trim();
};

/**
 * Validate required fields for country
 */
export const validateCountryData = (data: any): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!data.name || typeof data.name !== 'string') {
    errors.push('name is required');
  }

  if (data.population === undefined || typeof data.population !== 'number') {
    errors.push('population is required');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};
