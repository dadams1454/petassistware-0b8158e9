
import { formatDistanceToNow } from 'date-fns';

export const getCareTypeIcon = (careType: string) => {
  // Maps care type to its icon component name (for dynamic import)
  switch (careType.toLowerCase()) {
    case 'potty':
    case 'pottybreak':
      return 'Droplet';
    case 'feeding':
    case 'food':
      return 'Utensils';
    case 'medication':
    case 'medicine':
      return 'Pill';
    case 'grooming':
      return 'Scissors';
    case 'exercise':
    case 'play':
      return 'Heart';
    case 'training':
      return 'BookOpen';
    case 'vet':
    case 'health':
      return 'Activity';
    default:
      return 'Clipboard';
  }
};

export const getCareTypeColor = (careType: string) => {
  // Maps care type to its color scheme
  switch (careType.toLowerCase()) {
    case 'potty':
    case 'pottybreak':
      return 'blue';
    case 'feeding':
    case 'food':
      return 'green';
    case 'medication':
    case 'medicine':
      return 'purple';
    case 'grooming':
      return 'indigo';
    case 'exercise':
    case 'play':
      return 'pink';
    case 'training':
      return 'amber';
    case 'vet':
    case 'health':
      return 'red';
    default:
      return 'gray';
  }
};

export const getRelativeTimeString = (date: Date) => {
  try {
    return formatDistanceToNow(date, { addSuffix: true });
  } catch (e) {
    return 'recently';
  }
};

export const getCareStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'success':
    case 'complete':
    case 'completed':
      return 'bg-green-100 text-green-700 border-green-300';
    case 'partial':
      return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    case 'missed':
    case 'failed':
      return 'bg-red-100 text-red-700 border-red-300';
    case 'pending':
      return 'bg-blue-100 text-blue-700 border-blue-300';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-300';
  }
};

export const getCareOutcomeLabel = (outcome: string) => {
  switch (outcome.toLowerCase()) {
    case 'success':
      return 'Complete';
    case 'partial':
      return 'Partial';
    case 'missed':
      return 'Missed';
    case 'pending':
      return 'Pending';
    default:
      return outcome;
  }
};
