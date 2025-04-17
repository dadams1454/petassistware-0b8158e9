
/**
 * Process medication logs to extract useful information
 * @param logs Medication logs from the database
 * @param options Additional processing options
 * @returns Processed logs with additional computed data
 */
export const processMedicationLogs = (logs: any[], options: any = {}) => {
  if (!logs || logs.length === 0) {
    return {
      lastAdministered: null,
      medications: [],
      medicationStats: {
        total: 0,
        completed: 0,
        due: 0,
        upcoming: 0,
      }
    };
  }

  // Sort logs by timestamp, most recent first
  const sortedLogs = [...logs].sort((a, b) => {
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  // Get the most recent medication log
  const lastAdministered = sortedLogs[0];

  // Group logs by medication name
  const medicationMap = new Map();
  sortedLogs.forEach(log => {
    if (!log.task_name) return;
    
    if (!medicationMap.has(log.task_name)) {
      medicationMap.set(log.task_name, []);
    }
    medicationMap.get(log.task_name).push(log);
  });

  // Create medication records with their administration history
  const medications = Array.from(medicationMap.entries()).map(([medicationName, logs]) => {
    const lastLog = logs[0];
    const status = determineMedicationStatus(logs);
    
    return {
      name: medicationName,
      lastAdministered: lastLog.timestamp,
      logs: logs,
      status,
      notes: lastLog.notes || '',
      frequency: extractFrequencyFromNotes(lastLog.notes || '')
    };
  });

  // Calculate statistics
  const medicationStats = {
    total: medications.length,
    completed: medications.filter(med => med.status === 'completed').length,
    due: medications.filter(med => med.status === 'due').length,
    upcoming: medications.filter(med => med.status === 'upcoming').length
  };

  return {
    lastAdministered,
    medications,
    medicationStats
  };
};

/**
 * Determine the status of a medication based on its logs
 */
const determineMedicationStatus = (logs: any[]): 'due' | 'completed' | 'upcoming' => {
  if (!logs || logs.length === 0) return 'due';
  
  const lastLog = logs[0];
  const lastAdminTime = new Date(lastLog.timestamp).getTime();
  const now = new Date().getTime();
  const daysSinceLastAdmin = Math.floor((now - lastAdminTime) / (1000 * 60 * 60 * 24));
  
  // Extract frequency from notes if possible
  const frequency = extractFrequencyFromNotes(lastLog.notes || '');
  
  if (frequency === 'daily' && daysSinceLastAdmin >= 1) {
    return 'due';
  } else if (frequency === 'twice-daily' && daysSinceLastAdmin >= 0.5) {
    return 'due';
  } else if (frequency === 'weekly' && daysSinceLastAdmin >= 7) {
    return 'due';
  } else if (frequency === 'monthly' && daysSinceLastAdmin >= 30) {
    return 'due';
  } else if (daysSinceLastAdmin >= 3) { // Default case if we can't determine frequency
    return 'due';
  } else if (daysSinceLastAdmin <= 0.5) {
    return 'completed';
  } else {
    return 'upcoming';
  }
};

/**
 * Extract medication frequency from notes
 */
const extractFrequencyFromNotes = (notes: string): string => {
  const lowerNotes = notes.toLowerCase();
  
  if (lowerNotes.includes('daily')) return 'daily';
  if (lowerNotes.includes('twice daily') || lowerNotes.includes('twice-daily') || lowerNotes.includes('twice a day')) return 'twice-daily';
  if (lowerNotes.includes('weekly') || lowerNotes.includes('once a week')) return 'weekly';
  if (lowerNotes.includes('monthly') || lowerNotes.includes('once a month')) return 'monthly';
  
  // Default to daily if we can't determine
  return 'daily';
};

/**
 * Constants for medication frequencies
 */
export const MedicationFrequencyConstants = {
  DAILY: 'daily',
  TWICE_DAILY: 'twice-daily',
  WEEKLY: 'weekly',
  BIWEEKLY: 'biweekly',
  MONTHLY: 'monthly',
  AS_NEEDED: 'as-needed'
};
