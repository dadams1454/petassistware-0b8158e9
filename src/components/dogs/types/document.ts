
export type DocumentType = 
  | 'registration_certificate'
  | 'health_certificate' 
  | 'microchip_registration'
  | 'pedigree'
  | 'dna_test'
  | 'purchase_agreement'
  | 'vaccination_record'
  | 'other';

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  registration_certificate: 'Registration Certificate',
  health_certificate: 'Health Certificate',
  microchip_registration: 'Microchip Registration',
  pedigree: 'Pedigree',
  dna_test: 'DNA Test',
  purchase_agreement: 'Purchase Agreement',
  vaccination_record: 'Vaccination Record',
  other: 'Other'
};

export interface DogDocument {
  id: string;
  dog_id: string;
  document_type: DocumentType;
  title: string;
  file_url: string;
  file_name: string;
  created_at: string;
  notes?: string;
}
