
export interface MedicationInfo {
  id: string;
  name: string;
  dosage?: number;
  dosage_unit?: string;
  frequency: string;
  instructions?: string;
  lastAdministered?: string | Date;
  nextDue?: string | Date;
  status: string | {
    status: string;
    message: string;
    nextDue?: string | Date | null;
    daysOverdue?: number;
    daysUntilDue?: number;
  };
  start_date?: string | Date;
  end_date?: string | Date;
  active: boolean;
  dog_id: string;
  vet_id?: string;
  vet_name?: string;
  rx_number?: string;
  notes?: string;
}

export interface MedicationAdministrationInfo {
  id: string;
  medication_id: string;
  administered_by: string;
  administered_at: string | Date;
  dosage?: number;
  dosage_unit?: string;
  notes?: string;
  effectiveness?: 'effective' | 'partially_effective' | 'not_effective' | 'unknown';
  side_effects?: string[];
}

export interface MedicationFormData {
  name: string;
  dosage?: number;
  dosage_unit?: string;
  frequency: string;
  instructions?: string;
  start_date?: string | Date;
  end_date?: string | Date;
  vet_id?: string;
  vet_name?: string;
  rx_number?: string;
  notes?: string;
}
