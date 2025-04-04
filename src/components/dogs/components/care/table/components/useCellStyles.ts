
import { DogFlag } from '@/types/dailyCare';

export const useCellStyles = () => {
  // Get text color based on day of week
  const getDayTextColor = (dayOfWeek: number) => {
    if (dayOfWeek === 0) return 'text-red-600 dark:text-red-400'; // Sunday
    if (dayOfWeek === 6) return 'text-blue-600 dark:text-blue-400'; // Saturday
    return 'text-gray-900 dark:text-white'; // Weekdays
  };
  
  // Get background color based on day of week
  const getDayBackgroundColor = (dayOfWeek: number) => {
    if (dayOfWeek === 0) return 'bg-red-50 dark:bg-red-950/20'; // Sunday
    if (dayOfWeek === 6) return 'bg-blue-50 dark:bg-blue-950/20'; // Saturday
    return 'bg-white dark:bg-gray-800'; // Weekdays
  };
  
  // Get border styles
  const getBorderStyles = (isFirst: boolean, isLast: boolean) => {
    let styles = 'border-gray-200 dark:border-gray-700 ';
    
    if (isFirst) {
      styles += 'border-l ';
    }
    
    if (isLast) {
      styles += 'border-r ';
    }
    
    return styles;
  };
  
  // Handle hover styles
  const getRowHoverClass = (isMobile: boolean) => {
    return isMobile 
      ? 'hover:bg-gray-100 dark:hover:bg-gray-700' 
      : 'group-hover:bg-gray-50 dark:group-hover:bg-gray-700';
  };
  
  // Handle status flags
  const getFlagStyles = (flags: DogFlag[] = []) => {
    let baseClass = '';
    
    // Check for in heat flag
    const inHeatFlag = flags.find(flag => flag.type === 'in_heat');
    if (inHeatFlag) {
      baseClass = 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/50';
    }
    
    // Check for pregnant flag - note that type checks are now string comparisons
    const pregnantFlag = flags.find(flag => flag.type === 'pregnant');
    if (pregnantFlag) {
      baseClass = 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800/50';
    }
    
    // Check for special attention flag
    const specialAttentionFlag = flags.find(flag => flag.type === 'special_attention');
    if (specialAttentionFlag) {
      baseClass = 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800/50';
    }
    
    // Check for incompatible dogs flag
    const incompatibleFlag = flags.find(flag => flag.type === 'incompatible');
    if (incompatibleFlag) {
      baseClass = 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800/50';
    }
    
    return baseClass;
  };
  
  return {
    getDayTextColor,
    getDayBackgroundColor,
    getBorderStyles,
    getRowHoverClass,
    getFlagStyles
  };
};
