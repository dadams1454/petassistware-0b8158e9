
// Medication frequency constants
export const MedicationFrequencyConstants = {
  DAILY: 'daily',
  TWICE_DAILY: 'twice_daily',
  EVERY_OTHER_DAY: 'every_other_day',
  WEEKLY: 'weekly',
  TWICE_WEEKLY: 'twice_weekly',
  BIWEEKLY: 'biweekly',
  MONTHLY: 'monthly',
  QUARTERLY: 'quarterly',
  ANNUALLY: 'annually',
  AS_NEEDED: 'as_needed'
};

// Process medication logs
export const processMedicationLogs = (logs: any[]) => {
  // Group by medication name
  const groupedLogs = logs.reduce((acc: any, log: any) => {
    const { medication_name, dosage, frequency, timestamp, notes, medication_metadata } = log;
    
    if (!medication_name) return acc;
    
    // Determine if it's a preventative medication
    const isPreventative = medication_metadata?.is_preventative === true;
    const category = isPreventative ? 'preventative' : 'other';
    
    if (!acc[category]) {
      acc[category] = [];
    }
    
    // Find if we already have an entry for this medication
    const existingMedIndex = acc[category].findIndex((item: any) => 
      item.name === medication_name
    );
    
    if (existingMedIndex > -1) {
      // Update if the timestamp is more recent
      const existingTimestamp = new Date(acc[category][existingMedIndex].lastAdministered).getTime();
      const newTimestamp = new Date(timestamp).getTime();
      
      if (newTimestamp > existingTimestamp) {
        acc[category][existingMedIndex].lastAdministered = timestamp;
        acc[category][existingMedIndex].notes = notes;
      }
    } else {
      // Add new medication to the list
      acc[category].push({
        id: medication_name,
        name: medication_name,
        dosage: dosage || 'N/A',
        frequency: frequency || 'N/A',
        lastAdministered: timestamp,
        notes: notes || '',
        isPreventative,
      });
    }
    
    return acc;
  }, { preventative: [], other: [] });
  
  return groupedLogs;
};

// Calculate medication status
export const calculateMedicationStatus = (lastAdministered: string, frequency: string) => {
  if (!lastAdministered || !frequency) {
    return { status: 'unknown', nextDue: null };
  }
  
  const lastAdminDate = new Date(lastAdministered);
  const now = new Date();
  const daysDiff = Math.floor((now.getTime() - lastAdminDate.getTime()) / (1000 * 60 * 60 * 24));
  
  let daysUntilDue = 0;
  
  switch (frequency.toLowerCase()) {
    case MedicationFrequencyConstants.DAILY:
      daysUntilDue = 1;
      break;
    case MedicationFrequencyConstants.TWICE_DAILY:
      daysUntilDue = 0.5;
      break;
    case MedicationFrequencyConstants.EVERY_OTHER_DAY:
      daysUntilDue = 2;
      break;
    case MedicationFrequencyConstants.WEEKLY:
      daysUntilDue = 7;
      break;
    case MedicationFrequencyConstants.TWICE_WEEKLY:
      daysUntilDue = 3.5;
      break;
    case MedicationFrequencyConstants.BIWEEKLY:
      daysUntilDue = 14;
      break;
    case MedicationFrequencyConstants.MONTHLY:
      daysUntilDue = 30;
      break;
    case MedicationFrequencyConstants.QUARTERLY:
      daysUntilDue = 90;
      break;
    case MedicationFrequencyConstants.ANNUALLY:
      daysUntilDue = 365;
      break;
    case MedicationFrequencyConstants.AS_NEEDED:
      return { status: 'as_needed', nextDue: null };
    default:
      return { status: 'unknown', nextDue: null };
  }
  
  const nextDueDate = new Date(lastAdminDate);
  nextDueDate.setDate(lastAdminDate.getDate() + daysUntilDue);
  
  if (daysDiff > daysUntilDue * 1.5) {
    return { status: 'overdue', nextDue: nextDueDate };
  } else if (daysDiff >= daysUntilDue) {
    return { status: 'due', nextDue: nextDueDate };
  } else if (daysDiff >= daysUntilDue * 0.8) {
    return { status: 'upcoming', nextDue: nextDueDate };
  } else {
    return { status: 'active', nextDue: nextDueDate };
  }
};

// Get human-readable frequency label
export const getFrequencyLabel = (frequency: string) => {
  const frequencyMap: Record<string, string> = {
    [MedicationFrequencyConstants.DAILY]: 'Once Daily',
    [MedicationFrequencyConstants.TWICE_DAILY]: 'Twice Daily',
    [MedicationFrequencyConstants.EVERY_OTHER_DAY]: 'Every Other Day',
    [MedicationFrequencyConstants.WEEKLY]: 'Weekly',
    [MedicationFrequencyConstants.TWICE_WEEKLY]: 'Twice Weekly',
    [MedicationFrequencyConstants.BIWEEKLY]: 'Every Two Weeks',
    [MedicationFrequencyConstants.MONTHLY]: 'Monthly',
    [MedicationFrequencyConstants.QUARTERLY]: 'Quarterly',
    [MedicationFrequencyConstants.ANNUALLY]: 'Annually',
    [MedicationFrequencyConstants.AS_NEEDED]: 'As Needed'
  };
  
  return frequencyMap[frequency.toLowerCase()] || frequency;
};
