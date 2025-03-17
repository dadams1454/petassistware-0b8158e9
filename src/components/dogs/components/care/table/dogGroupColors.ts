
// Updated time slots to run from 5am to midnight as requested
export const timeSlots = [
  '5 AM', '6 AM', '7 AM', '8 AM', '9 AM', '10 AM', '11 AM', '12 PM',
  '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM',
  '8 PM', '9 PM', '10 PM', '11 PM', '12 AM'
];

// Function to determine row color based on index
export const getDogRowColor = (index: number): string => {
  // Alternate between white and very light gray for better readability
  return index % 2 === 0 ? 'bg-white dark:bg-slate-900' : 'bg-slate-50 dark:bg-slate-800/50';
};
