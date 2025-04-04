
import { parseFrequency } from './dateUtils';
import { MedicationStatus, MedicationStatusEnum, MedicationStatusResult } from '@/types/health';
import { formatDistance, addHours, addDays, parseISO, isAfter, isBefore, isToday } from 'date-fns';

export const MedicationFrequencyConstants = {
  TWICE_DAILY: 'twice daily',
  THREE_TIMES_DAILY: 'three times daily',
  FOUR_TIMES_DAILY: 'four times daily',
  ONCE_DAILY: 'once daily',
  EVERY_OTHER_DAY: 'every other day',
  WEEKLY: 'weekly',
  TWICE_WEEKLY: 'twice weekly',
  MONTHLY: 'monthly'
};

// Calculate the next due date based on frequency and last administration
export const calculateNextDueDate = (lastAdminDate: string, frequency: string): Date => {
  const { interval, unit } = parseFrequency(frequency);
  const lastDate = parseISO(lastAdminDate);
  
  if (unit === 'hour') {
    return addHours(lastDate, interval);
  } else if (unit === 'day') {
    return addDays(lastDate, interval);
  } else if (unit === 'week') {
    return addDays(lastDate, interval * 7);
  } else if (unit === 'month') {
    return addDays(lastDate, interval * 30);
  }
  
  // Default fallback
  return addDays(lastDate, 1);
};

// Get the status of a medication
export const getMedicationStatus = (medication: any, logs: any[]): MedicationStatusResult => {
  const now = new Date();
  const startDate = medication.start_date ? parseISO(medication.start_date) : null;
  const endDate = medication.end_date ? parseISO(medication.end_date) : null;
  
  // Sort logs by administration date in descending order
  const sortedLogs = [...logs].sort((a, b) => 
    new Date(b.administered_at).getTime() - new Date(a.administered_at).getTime()
  );
  
  const lastAdministeredLog = sortedLogs.length > 0 ? sortedLogs[0] : null;
  const lastAdministered = lastAdministeredLog?.administered_at;
  
  // If medication hasn't started yet
  if (startDate && isAfter(startDate, now)) {
    return { 
      status: MedicationStatusEnum.Scheduled,
      nextDue: startDate.toISOString()
    };
  }
  
  // If medication has ended
  if (endDate && isBefore(endDate, now)) {
    return { 
      status: MedicationStatusEnum.Completed,
      lastAdministered
    };
  }
  
  // If medication has a "completed" status explicitly set
  if (medication.status === MedicationStatusEnum.Completed) {
    return { 
      status: MedicationStatusEnum.Completed,
      lastAdministered
    };
  }
  
  // If medication is on hold
  if (medication.status === MedicationStatusEnum.OnHold) {
    return { 
      status: MedicationStatusEnum.OnHold,
      lastAdministered
    };
  }
  
  // If medication has been discontinued
  if (medication.status === MedicationStatusEnum.Discontinued) {
    return { 
      status: MedicationStatusEnum.Discontinued,
      lastAdministered
    };
  }
  
  // If there are no logs yet but the medication should be active
  if (logs.length === 0 && startDate && !isAfter(startDate, now)) {
    return {
      status: MedicationStatusEnum.Active,
      nextDue: startDate.toISOString()
    };
  }
  
  // Calculate next due date based on last administration and frequency
  if (lastAdministered) {
    const nextDue = calculateNextDueDate(lastAdministered, medication.frequency);
    
    // Check if next dose is overdue
    if (isAfter(now, nextDue)) {
      return {
        status: MedicationStatusEnum.Active,
        nextDue: nextDue.toISOString(),
        lastAdministered
      };
    }
    
    // If next dose is today
    if (isToday(nextDue)) {
      return {
        status: MedicationStatusEnum.Active,
        nextDue: nextDue.toISOString(),
        lastAdministered
      };
    }
    
    // If next dose is in the future
    return {
      status: MedicationStatusEnum.Active,
      nextDue: nextDue.toISOString(),
      lastAdministered
    };
  }
  
  // Default case
  return {
    status: MedicationStatusEnum.Active,
    nextDue: startDate?.toISOString()
  };
};

// Process medication logs to get a summary
export function processMedicationLogs(logs: any[], frequency: string): any {
  if (!logs || logs.length === 0) {
    return {
      totalDoses: 0,
      missedDoses: 0,
      adherenceRate: 0,
      lastAdministered: null,
      recentLogs: []
    };
  }
  
  // Calculate the total number of expected doses based on start date, end date, and frequency
  const sortedLogs = [...logs].sort((a, b) => 
    new Date(a.administered_at).getTime() - new Date(b.administered_at).getTime()
  );
  
  const firstDose = new Date(sortedLogs[0].administered_at);
  const lastDose = new Date(sortedLogs[sortedLogs.length - 1].administered_at);
  const today = new Date();
  
  const { interval, unit } = parseFrequency(frequency);
  
  let expectedDoses = 0;
  if (unit === 'hour') {
    const hoursElapsed = (today.getTime() - firstDose.getTime()) / (60 * 60 * 1000);
    expectedDoses = Math.floor(hoursElapsed / interval);
  } else if (unit === 'day') {
    const daysElapsed = (today.getTime() - firstDose.getTime()) / (24 * 60 * 60 * 1000);
    expectedDoses = Math.floor(daysElapsed / interval);
  } else if (unit === 'week') {
    const weeksElapsed = (today.getTime() - firstDose.getTime()) / (7 * 24 * 60 * 60 * 1000);
    expectedDoses = Math.floor(weeksElapsed / interval);
  } else if (unit === 'month') {
    const monthsElapsed = (today.getTime() - firstDose.getTime()) / (30 * 24 * 60 * 60 * 1000);
    expectedDoses = Math.floor(monthsElapsed / interval);
  }
  
  // Ensure we have at least 1 expected dose
  expectedDoses = Math.max(1, expectedDoses);
  
  // Calculate missed doses and adherence rate
  const actualDoses = logs.filter(log => !log.skipped).length;
  const missedDoses = expectedDoses - actualDoses;
  const adherenceRate = Math.min(100, Math.round((actualDoses / expectedDoses) * 100));
  
  // Get recent logs (last 5)
  const recentLogs = [...logs]
    .sort((a, b) => new Date(b.administered_at).getTime() - new Date(a.administered_at).getTime())
    .slice(0, 5);
  
  return {
    totalDoses: actualDoses,
    missedDoses: Math.max(0, missedDoses),
    adherenceRate,
    lastAdministered: sortedLogs[sortedLogs.length - 1].administered_at,
    recentLogs
  };
}
