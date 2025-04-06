
import { HealthRecord, HealthRecordTypeEnum } from '@/types/health';

/**
 * Maps a health record from Supabase DB format to frontend TypeScript format
 * @param record The database record to map
 * @returns A properly typed HealthRecord object
 */
export function mapHealthRecordFromDB(record: any): HealthRecord {
  // Validate record exists
  if (!record) return null as unknown as HealthRecord;

  // Normalize record type
  let recordType: HealthRecordTypeEnum;
  if (Object.values(HealthRecordTypeEnum).includes(record.record_type as HealthRecordTypeEnum)) {
    recordType = record.record_type as HealthRecordTypeEnum;
  } else {
    recordType = HealthRecordTypeEnum.EXAMINATION; // Default
  }

  return {
    id: record.id || '',
    dog_id: record.dog_id || '',
    record_type: recordType,
    title: record.title || '',
    visit_date: record.visit_date || record.date || new Date().toISOString().split('T')[0],
    vet_name: record.vet_name || '',
    description: record.description || '',
    document_url: record.document_url || undefined,
    record_notes: record.record_notes || record.notes || '',
    created_at: record.created_at || new Date().toISOString(),
    next_due_date: record.next_due_date || undefined,
    performed_by: record.performed_by || undefined,
    
    // Vaccination-specific fields
    vaccine_name: record.vaccine_name || undefined,
    manufacturer: record.manufacturer || undefined,
    lot_number: record.lot_number || undefined,
    expiration_date: record.expiration_date || undefined,
    
    // Medication-specific fields
    medication_name: record.medication_name || undefined,
    dosage: record.dosage || undefined,
    dosage_unit: record.dosage_unit || undefined,
    frequency: record.frequency || undefined,
    start_date: record.start_date || undefined,
    end_date: record.end_date || undefined,
    duration: record.duration || undefined,
    duration_unit: record.duration_unit || undefined,
    administration_route: record.administration_route || undefined,
    
    // Examination-specific fields
    examination_type: record.examination_type || undefined,
    findings: record.findings || undefined,
    recommendations: record.recommendations || undefined,
    follow_up_date: record.follow_up_date || undefined,
    
    // Surgery-specific fields
    procedure_name: record.procedure_name || undefined,
    surgeon: record.surgeon || undefined,
    anesthesia_used: record.anesthesia_used || undefined,
    recovery_notes: record.recovery_notes || undefined
  };
}

/**
 * Maps a frontend HealthRecord to Supabase DB format
 * @param record The frontend health record to map to DB format
 * @returns An object formatted for Supabase insertion/update
 */
export function mapHealthRecordToDB(record: Partial<HealthRecord>): any {
  return {
    id: record.id,
    dog_id: record.dog_id,
    record_type: record.record_type,
    title: record.title,
    visit_date: record.visit_date,
    vet_name: record.vet_name,
    description: record.description,
    document_url: record.document_url,
    record_notes: record.record_notes,
    created_at: record.created_at,
    next_due_date: record.next_due_date,
    performed_by: record.performed_by,
    vaccine_name: record.vaccine_name,
    manufacturer: record.manufacturer,
    lot_number: record.lot_number,
    expiration_date: record.expiration_date,
    medication_name: record.medication_name,
    dosage: record.dosage,
    dosage_unit: record.dosage_unit,
    frequency: record.frequency,
    start_date: record.start_date,
    end_date: record.end_date,
    duration: record.duration,
    duration_unit: record.duration_unit,
    administration_route: record.administration_route,
    examination_type: record.examination_type,
    findings: record.findings,
    recommendations: record.recommendations,
    follow_up_date: record.follow_up_date,
    procedure_name: record.procedure_name,
    surgeon: record.surgeon,
    anesthesia_used: record.anesthesia_used,
    recovery_notes: record.recovery_notes
  };
}
