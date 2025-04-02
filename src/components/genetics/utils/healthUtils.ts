
/**
 * Formats a condition name from snake_case or camelCase to Title Case
 */
export const formatConditionName = (condition: string): string => {
  // Replace underscores with spaces
  let formatted = condition.replace(/_/g, ' ');
  
  // Add spaces before capital letters for camelCase
  formatted = formatted.replace(/([A-Z])/g, ' $1');
  
  // Capitalize first letter of each word
  formatted = formatted
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
    
  // Special case handling for acronyms and medical terms
  const acronyms = ['DM', 'EIC', 'PRA', 'vWD', 'MDR1', 'IVDD', 'CDDY', 'NCL'];
  acronyms.forEach(acronym => {
    const lowercaseAcronym = acronym.toLowerCase();
    const regex = new RegExp(`\\b${lowercaseAcronym}\\b`, 'gi');
    formatted = formatted.replace(regex, acronym);
  });
  
  return formatted.trim();
};

/**
 * Get color-related props based on the test result status
 */
export const getResultWithColorProps = (status: string) => {
  const statusLower = status.toLowerCase();
  
  // Match status to appropriate styling
  switch (statusLower) {
    case 'clear':
    case 'normal':
    case 'negative':
      return { 
        color: 'text-green-700', 
        bgColor: 'bg-green-100',
        textColor: 'text-green-700',
        borderColor: 'border-green-200'
      };
      
    case 'carrier':
    case 'abnormal':
    case 'suspicious':
      return { 
        color: 'text-yellow-700', 
        bgColor: 'bg-yellow-100',
        textColor: 'text-yellow-700',
        borderColor: 'border-yellow-200' 
      };
      
    case 'at_risk':
    case 'at risk':
    case 'affected':
    case 'positive':
      return { 
        color: 'text-red-700', 
        bgColor: 'bg-red-100',
        textColor: 'text-red-700',
        borderColor: 'border-red-200'
      };
      
    case 'likely_clear':
    case 'likely clear':
      return { 
        color: 'text-emerald-700', 
        bgColor: 'bg-emerald-100',
        textColor: 'text-emerald-700',
        borderColor: 'border-emerald-200'
      };
      
    case 'likely_carrier':
    case 'likely carrier':
      return { 
        color: 'text-amber-700', 
        bgColor: 'bg-amber-100',
        textColor: 'text-amber-700',
        borderColor: 'border-amber-200'
      };
      
    case 'inconclusive':
    case 'pending':
      return { 
        color: 'text-purple-700', 
        bgColor: 'bg-purple-100',
        textColor: 'text-purple-700',
        borderColor: 'border-purple-200' 
      };
      
    default:
      return { 
        color: 'text-gray-700', 
        bgColor: 'bg-gray-100',
        textColor: 'text-gray-700',
        borderColor: 'border-gray-200'
      };
  }
};

/**
 * Format a date for display
 */
export const formatDate = (dateStr: string): string => {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (error) {
    return dateStr;
  }
};
