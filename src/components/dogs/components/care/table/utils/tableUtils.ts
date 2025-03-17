
// Color scheme for alternating rows
export const getRowColor = (index: number) => 
  index % 2 === 0 ? 'bg-white dark:bg-slate-800' : 'bg-gray-50 dark:bg-slate-800/60';
