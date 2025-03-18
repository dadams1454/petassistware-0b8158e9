
// Function to generate time slots dynamically based on current time
export const generateTimeSlots = (currentTime = new Date()): string[] => {
  const slots: string[] = [];
  const currentHour = currentTime.getHours();
  
  // Start 6 hours before current hour (showing 8 hours total including current hour)
  let startHour = currentHour - 6;
  
  // Generate 8 hours (current hour + 1 hour after + 6 hours before)
  for (let i = 0; i < 8; i++) {
    // Normalize hour (handle wrapping around 24-hour clock)
    const hour = (startHour + i + 24) % 24;
    
    // Format hour to 12-hour format with AM/PM
    const formattedHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    const period = hour >= 12 ? 'PM' : 'AM';
    
    slots.push(`${formattedHour}:00 ${period}`);
  }
  
  return slots;
};

// Function to determine row color based on index
export const getDogRowColor = (index: number): string => {
  // Alternate between white and very light gray for better readability
  return index % 2 === 0 ? 'bg-white dark:bg-slate-900' : 'bg-slate-50 dark:bg-slate-800/50';
};
