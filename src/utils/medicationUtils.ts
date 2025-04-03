
// Medication status and frequency types
export enum MedicationStatus {
  Active = 'active',
  Pending = 'pending',
  Overdue = 'overdue',
  Completed = 'completed',
  Due = 'due',
}

export enum MedicationFrequency {
  Daily = 'daily',
  TwiceDaily = 'twice-daily',
  Weekly = 'weekly',
  Biweekly = 'biweekly',
  Monthly = 'monthly',
  Quarterly = 'quarterly',
  Annual = 'annually',
  AsNeeded = 'as-needed',
  Custom = 'custom',
}

// Complex status result including color information
export interface MedicationStatusResult {
  status: MedicationStatus | 'incomplete';
  statusLabel: string;
  statusColor: string;
}

export interface StatusWithColor {
  status: string;
  statusColor: string;
}

export function isComplexStatus(
  status: MedicationStatus | MedicationStatusResult | string | StatusWithColor
): status is MedicationStatusResult | StatusWithColor {
  return typeof status === 'object' && 'statusColor' in status;
}

export function getStatusValue(
  status: MedicationStatus | MedicationStatusResult | string | StatusWithColor
): string {
  if (isComplexStatus(status)) {
    return 'status' in status ? status.status : status.toString();
  }
  return status;
}

export function getStatusColor(status: MedicationStatus | string): string {
  switch (status) {
    case MedicationStatus.Active:
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    case MedicationStatus.Pending:
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
    case MedicationStatus.Due:
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    case MedicationStatus.Overdue:
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
    case MedicationStatus.Completed:
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    case 'incomplete':
      return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
    default:
      return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
  }
}

export function getMedicationStatus(
  startDate: string,
  endDate: string | null | undefined,
  lastAdministered: string | undefined,
  frequency: MedicationFrequency | string
): MedicationStatus | MedicationStatusResult {
  const now = new Date();
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : null;

  // Not started yet
  if (start > now) {
    return {
      status: MedicationStatus.Pending,
      statusLabel: 'Pending',
      statusColor: getStatusColor(MedicationStatus.Pending)
    };
  }

  // Ended
  if (end && end < now) {
    return {
      status: MedicationStatus.Completed,
      statusLabel: 'Completed',
      statusColor: getStatusColor(MedicationStatus.Completed)
    };
  }

  // Active but check if it's due
  if (!lastAdministered) {
    return {
      status: MedicationStatus.Due,
      statusLabel: 'Due Now',
      statusColor: getStatusColor(MedicationStatus.Due)
    };
  }

  const lastAdmin = new Date(lastAdministered);
  const nextDueDate = calculateNextDueDate(lastAdmin, frequency);

  // Overdue
  if (nextDueDate < now) {
    return {
      status: MedicationStatus.Overdue,
      statusLabel: 'Overdue',
      statusColor: getStatusColor(MedicationStatus.Overdue)
    };
  }

  // Due today (within 24 hours)
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (nextDueDate <= tomorrow) {
    return {
      status: MedicationStatus.Due,
      statusLabel: 'Due Today',
      statusColor: getStatusColor(MedicationStatus.Due)
    };
  }

  // Active and on schedule
  return {
    status: MedicationStatus.Active,
    statusLabel: 'Active',
    statusColor: getStatusColor(MedicationStatus.Active)
  };
}

export function calculateNextDueDate(
  lastAdministered: Date,
  frequency: MedicationFrequency | string
): Date {
  const nextDue = new Date(lastAdministered);
  
  switch (frequency) {
    case MedicationFrequency.Daily:
    case 'daily':
      nextDue.setDate(nextDue.getDate() + 1);
      break;
    case MedicationFrequency.TwiceDaily:
    case 'twice-daily':
      nextDue.setHours(nextDue.getHours() + 12);
      break;
    case MedicationFrequency.Weekly:
    case 'weekly':
      nextDue.setDate(nextDue.getDate() + 7);
      break;
    case MedicationFrequency.Biweekly:
    case 'biweekly':
      nextDue.setDate(nextDue.getDate() + 14);
      break;
    case MedicationFrequency.Monthly:
    case 'monthly':
      nextDue.setMonth(nextDue.getMonth() + 1);
      break;
    case MedicationFrequency.Quarterly:
    case 'quarterly':
      nextDue.setMonth(nextDue.getMonth() + 3);
      break;
    case MedicationFrequency.Annual:
    case 'annually':
      nextDue.setFullYear(nextDue.getFullYear() + 1);
      break;
    case MedicationFrequency.AsNeeded:
    case 'as-needed':
      // For as-needed, set a far future date
      nextDue.setFullYear(nextDue.getFullYear() + 10);
      break;
    default:
      // Default to daily if unknown
      nextDue.setDate(nextDue.getDate() + 1);
  }
  
  return nextDue;
}

export function getTimeSlotsForFrequency(
  frequency: MedicationFrequency | string
): string[] {
  switch (frequency) {
    case MedicationFrequency.Daily:
    case 'daily':
      return ['Morning'];
    case MedicationFrequency.TwiceDaily:
    case 'twice-daily':
      return ['Morning', 'Evening'];
    case MedicationFrequency.Weekly:
    case 'weekly':
      return ['Weekly'];
    case MedicationFrequency.Biweekly:
    case 'biweekly':
      return ['Biweekly'];
    case MedicationFrequency.Monthly:
    case 'monthly':
      return ['Monthly'];
    case MedicationFrequency.Quarterly:
    case 'quarterly':
      return ['Quarterly'];
    case MedicationFrequency.Annual:
    case 'annually':
      return ['Annually'];
    case MedicationFrequency.AsNeeded:
    case 'as-needed':
      return ['As Needed'];
    default:
      return ['Custom'];
  }
}

