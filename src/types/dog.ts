
export interface HealthRecord {
  id: string;
  dog_id: string;
  title: string;
  record_type: string;
  visit_date: string;
  record_notes?: string;
  vet_name?: string;
  document_url?: string;
  next_due_date?: string;
  created_at: string;
}

export interface Dog {
  id: string;
  name: string;
  breed?: string;
  gender?: string;
  birthdate?: string;
  color?: string;
  weight?: number;
  height?: number;
  microchip_id?: string;
  registration_id?: string;
  profile_photo_url?: string;
  owner_id?: string;
  notes?: string;
  created_at: string;
  updated_at?: string;
}
