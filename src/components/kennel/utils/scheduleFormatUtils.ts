
/**
 * Formats an array of day numbers (0-6) to human-readable day names
 */
export const formatDaysOfWeek = (days: number[] | null): string => {
  if (!days || days.length === 0) return '-';
  
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days.map(day => dayNames[day]).join(', ');
};

/**
 * Formats a time string (HH:MM) to 12-hour format with AM/PM
 */
export const formatTime = (time: string | null): string => {
  if (!time) return '-';
  
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  
  return `${hour12}:${minutes} ${ampm}`;
};
