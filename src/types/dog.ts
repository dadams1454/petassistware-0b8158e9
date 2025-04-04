
export interface Dog {
  id: string;
  name: string;
  breed?: string;
  gender?: string;
  color?: string;
  birthdate?: string;
  weight?: number;
  microchip_number?: string;
  registration_number?: string;
  owner_id?: string;
  photo_url?: string;
  notes?: string;
  created_at?: string;
  is_pregnant?: boolean;
  last_heat_date?: string;
  tie_date?: string;
  pedigree?: boolean;
  litter_number?: number;
  last_vaccination_date?: string;
  vaccination_notes?: string;
  vaccination_type?: string;
  tenant_id?: string;
  requires_special_handling?: boolean;
  potty_alert_threshold?: number;
  max_time_between_breaks?: number;
}

// Compatible with Dog but with potentially different field names
export interface DogProfile extends Dog {
  // Additional fields or overrides can be added here if needed
}
