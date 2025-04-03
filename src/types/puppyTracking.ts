
export interface PuppyWithAge {
  id: string;
  name?: string;
  color: string;
  birth_date?: string;
  gender?: string;
  litter_id?: string;
  status?: string;
  photo_url?: string;
  ageInDays: number;
  ageInWeeks: number;
  developmentalStage: string;
  weightHistory?: WeightRecord[];
  litter?: any;
}

export interface PuppyManagementStats {
  puppies: PuppyWithAge[];
  ageGroups: AgeGroup[];
  puppiesByAgeGroup: Record<string, PuppyWithAge[]>;
  totalPuppies: number;
  availablePuppies: number;
  reservedPuppies: number;
  soldPuppies: number;
  isLoading: boolean;
  error: Error | null;
  total: {
    count: number;
    male: number;
    female: number;
  };
  byGender: Record<string, number>;
  byStatus: Record<string, number>;
  byAgeGroup: Record<string, number>;
  stats?: {
    totalCount: number;
    byAge: Record<string, number>;
    byStatus: Record<string, number>;
    byGender: Record<string, number>;
  };
}

export interface AgeGroup {
  id: string;
  name: string;
  minAge: number;
  maxAge: number;
  color: string;
  description: string;
  milestones: string;
}

export interface PuppyMilestone {
  id: string;
  puppy_id: string;
  title: string;
  milestone_type: string;
  expected_age_days?: number;
  description?: string;
  is_completed: boolean;
  completion_date?: string;
  category?: string;
  notes?: string;
}

export interface WeightRecord {
  id: string;
  dog_id: string;
  puppy_id?: string;
  weight: number;
  weight_unit: string;
  date: string;
  notes?: string;
  percent_change?: number;
  created_at: string;
  age_days?: number;
  birth_date?: string;
}

export interface SocializationCategoryOption {
  value: string;
  label: string;
  color: string;
  description: string;
}

export interface SocializationReactionOption {
  value: SocializationReactionType;
  label: string;
  emoji: string;
  color: string;
}

export type SocializationReactionType = 'positive' | 'curious' | 'neutral' | 'fearful' | 'negative';

export type SocializationCategory = 'people' | 'animals' | 'environments' | 'surfaces' | 'sounds' | 'objects' | 'handling';

export interface SocializationExperience {
  id: string;
  puppy_id: string;
  category: SocializationCategory;
  categoryName?: string;
  experience: string;
  experience_date: string;
  reaction: SocializationReactionType;
  notes?: string;
}

export interface SocializationProgress {
  category: SocializationCategory;
  categoryName: string;
  total: number;
  completed: number;
  positive: number;
  neutral: number;
  negative: number;
  count?: number;
  target?: number;
  completion_percentage?: number;
}

export interface VaccinationSchedule {
  id: string;
  puppy_id: string;
  vaccination_type: string;
  vaccine_name?: string;
  due_date: string;
  scheduled_date?: string;
  notes?: string;
  administered: boolean;
}

export interface Medication {
  id: string;
  dog_id: string;
  puppy_id?: string;
  name: string;
  medication_name?: string;
  dosage?: number;
  dosage_unit?: string;
  frequency: string;
  administration_route?: string;
  start_date: string;
  end_date?: string;
  notes?: string;
  last_administered?: string;
  active: boolean;
  is_active?: boolean;
}

export interface MedicationAdministration {
  id: string;
  medication_id: string;
  administered_at: string;
  administered_by: string;
  notes?: string;
}

export interface HealthCertificate {
  id: string;
  dog_id: string;
  puppy_id?: string;
  certificate_type: string;
  issue_date: string;
  expiry_date?: string;
  issuer: string;
  file_url?: string;
  notes?: string;
}

export interface VaccinationRecord {
  id: string;
  puppy_id: string;
  vaccination_type: string;
  vaccination_date: string;
  administered_by?: string;
  lot_number?: string;
  notes?: string;
}
