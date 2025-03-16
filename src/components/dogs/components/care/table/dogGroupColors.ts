
// Dog group colors for the rotation schedule
export const dogGroupColors = {
  groupA: 'bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/20 dark:hover:bg-blue-800/30',
  groupB: 'bg-cyan-100 hover:bg-cyan-200 dark:bg-cyan-900/20 dark:hover:bg-cyan-800/30',
  groupC: 'bg-amber-100 hover:bg-amber-200 dark:bg-amber-900/20 dark:hover:bg-amber-800/30',
  groupD: 'bg-red-100 hover:bg-red-200 dark:bg-red-900/20 dark:hover:bg-red-800/30',
  groupE: 'bg-green-100 hover:bg-green-200 dark:bg-green-900/20 dark:hover:bg-green-800/30',
  groupF: 'bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/20 dark:hover:bg-purple-800/30',
};

// Function to get color for a dog based on its position in the list
export const getDogRowColor = (index: number) => {
  if (index < 3) return dogGroupColors.groupA;
  if (index < 6) return dogGroupColors.groupB;
  if (index < 9) return dogGroupColors.groupC;
  if (index < 12) return dogGroupColors.groupD;
  if (index < 15) return dogGroupColors.groupE;
  return dogGroupColors.groupF;
};

// Time slots for the table columns
export const timeSlots = [
  '6 AM', '7 AM', '8 AM', '9 AM', '10 AM', '11 AM', '12 PM',
  '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM',
  '8 PM', '9 PM', '10 PM', '11 PM', '12 AM'
];
