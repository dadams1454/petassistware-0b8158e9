
// Care utilities for dog management

/**
 * Get the display name for a care category
 */
export const getCareCategory = (category: string): string => {
  switch (category) {
    case 'pottybreaks':
      return 'Potty Breaks';
    case 'feeding':
      return 'Feeding';
    case 'medication':
      return 'Medication';
    case 'grooming':
      return 'Grooming';
    case 'training':
      return 'Training';
    case 'exercise':
      return 'Exercise';
    case 'health':
      return 'Health Check';
    case 'observation':
      return 'Observation';
    default:
      return category.charAt(0).toUpperCase() + category.slice(1);
  }
};

/**
 * Get the icon name for a care category
 */
export const getCategoryIcon = (category: string): string => {
  switch (category) {
    case 'pottybreaks':
      return 'paw-print';
    case 'feeding':
      return 'utensils';
    case 'medication':
      return 'pill';
    case 'grooming':
      return 'scissors';
    case 'training':
      return 'dumbbell';
    case 'exercise':
      return 'activity';
    case 'health':
      return 'stethoscope';
    case 'observation':
      return 'eye';
    default:
      return 'check-circle';
  }
};

/**
 * Format a date for display in care logs
 */
export const formatCareDate = (dateString: string | Date): string => {
  const date = new Date(dateString);
  
  // If invalid date, return the original string
  if (isNaN(date.getTime())) {
    return String(dateString);
  }
  
  const now = new Date();
  const isToday = date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();
  
  if (isToday) {
    return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }
  
  return date.toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Calculate time since last activity
 */
export const getTimeSince = (dateString: string | null | undefined): string => {
  if (!dateString) return 'Never';
  
  const date = new Date(dateString);
  
  // If invalid date, return "Unknown"
  if (isNaN(date.getTime())) {
    return 'Unknown';
  }
  
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
};

/**
 * Get care type icon name (string only, not React component)
 * This returns the icon name, not the actual JSX element
 */
export const getCareTypeIconName = (category: string): string => {
  return getCategoryIcon(category);
};

/**
 * Get care type color based on category
 */
export const getCareTypeColor = (category: string): string => {
  switch (category) {
    case 'pottybreaks':
    case 'potty':
      return 'green';
    case 'feeding':
      return 'orange';
    case 'medication':
      return 'blue';
    case 'grooming':
      return 'purple';
    case 'training':
      return 'yellow';
    case 'exercise':
      return 'red';
    case 'health':
      return 'blue';
    case 'observation':
      return 'gray';
    default:
      return 'slate';
  }
};

/**
 * Format relative time string
 */
export const getRelativeTimeString = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minutes ago`;
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hours ago`;
  
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};
