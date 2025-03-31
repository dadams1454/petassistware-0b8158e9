
import { format } from 'date-fns';

export const formatDate = (dateString: string) => {
  try {
    return format(new Date(dateString), 'MMM d, yyyy');
  } catch (e) {
    return 'Invalid date';
  }
};
