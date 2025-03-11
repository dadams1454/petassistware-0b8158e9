
export interface Vaccination {
  id?: string;
  dog_id: string;
  vaccination_type: string;
  vaccination_date: Date | string | null;
  vaccination_dateStr?: string;
  notes?: string;
  created_at?: Date | string;
}

export interface VaccinationDisplay {
  type: string;
  date: Date;
  notes?: string;
  id?: string;
}
