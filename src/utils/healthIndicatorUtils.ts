
/**
 * Utility functions for working with health indicators
 */

// Get a display label for appetite level
export const getAppetiteLevelLabel = (level: string): string => {
  switch (level) {
    case 'excellent':
      return 'Excellent';
    case 'good':
      return 'Good';
    case 'fair':
      return 'Fair';
    case 'poor':
      return 'Poor';
    case 'none':
      return 'None';
    default:
      return 'Unknown';
  }
};

/**
 * Get a display label for energy level
 */
export const getEnergyLevelLabel = (level: string): string => {
  switch (level) {
    case 'hyperactive':
      return 'Hyperactive';
    case 'high':
      return 'High';
    case 'normal':
      return 'Normal';
    case 'low':
      return 'Low';
    case 'lethargic':
      return 'Lethargic';
    default:
      return 'Unknown';
  }
};

/**
 * Get a display label for stool consistency
 */
export const getStoolConsistencyLabel = (consistency: string): string => {
  switch (consistency) {
    case 'normal':
      return 'Normal';
    case 'soft':
      return 'Soft';
    case 'loose':
      return 'Loose';
    case 'watery':
      return 'Watery';
    case 'hard':
      return 'Hard';
    case 'bloody':
      return 'Bloody';
    case 'mucus':
      return 'Mucus';
    default:
      return 'Unknown';
  }
};

/**
 * Check if an appetite level is concerning
 */
export const isAppetiteConcerning = (level: string): boolean => {
  return level === 'none' || level === 'poor';
};

/**
 * Check if an energy level is concerning
 */
export const isEnergyConcerning = (level: string): boolean => {
  return level === 'lethargic' || level === 'low';
};

/**
 * Check if a stool consistency is concerning
 */
export const isStoolConcerning = (consistency: string): boolean => {
  return (
    consistency === 'watery' ||
    consistency === 'bloody' ||
    consistency === 'mucus'
  );
};

/**
 * Get a color for displaying appetite level
 */
export const getAppetiteColor = (level: string): string => {
  switch (level) {
    case 'excellent':
      return 'text-green-600';
    case 'good':
      return 'text-green-500';
    case 'fair':
      return 'text-yellow-500';
    case 'poor':
      return 'text-orange-500';
    case 'none':
      return 'text-red-500';
    default:
      return 'text-gray-500';
  }
};

/**
 * Get a color for displaying energy level
 */
export const getEnergyColor = (level: string): string => {
  switch (level) {
    case 'hyperactive':
      return 'text-purple-500';
    case 'high':
      return 'text-blue-500';
    case 'normal':
      return 'text-green-500';
    case 'low':
      return 'text-orange-500';
    case 'lethargic':
      return 'text-red-500';
    default:
      return 'text-gray-500';
  }
};

/**
 * Get a color for displaying stool consistency
 */
export const getStoolColor = (consistency: string): string => {
  switch (consistency) {
    case 'normal':
      return 'text-green-500';
    case 'soft':
      return 'text-yellow-500';
    case 'loose':
      return 'text-orange-400';
    case 'watery':
      return 'text-red-500';
    case 'hard':
      return 'text-orange-500';
    case 'bloody':
      return 'text-red-600';
    case 'mucus':
      return 'text-red-500';
    default:
      return 'text-gray-500';
  }
};
