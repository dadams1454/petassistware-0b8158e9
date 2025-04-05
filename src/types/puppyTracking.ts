
import { WeightUnit } from './common';

// Puppy Weight Record
export interface WeightRecord {
  id: string;
  puppy_id: string;
  weight: number;
  weight_unit: WeightUnit;
  unit?: WeightUnit; // For backward compatibility
  date: string;
  notes?: string;
  percent_change?: number;
  created_at: string;
  age_days?: number;
}

// Vaccination Schedule
export interface VaccinationSchedule {
  id: string;
  puppy_id: string;
  vaccination_type: string;
  vaccine_name: string;
  due_date: string;
  scheduled_date?: string;
  administered: boolean;
  notes?: string;
  created_at?: string;
}

// Socialization Record
export interface SocializationRecord {
  id: string;
  puppy_id: string;
  category: string | SocializationCategory;
  experience: string;
  experience_date: string;
  reaction?: SocializationReactionType;
  notes?: string;
  created_at?: string;
}

// Socialization Category
export interface SocializationCategory {
  id: string;
  name: string;
  color: string;
  description: string;
  targetCount: number;
  examples?: string[];
}

// Socialization Reaction
export type SocializationReactionType = 'positive' | 'neutral' | 'cautious' | 'fearful' | 'aggressive' | 'avoidant';

export interface SocializationReaction {
  id: string;
  type: SocializationReactionType;
  label: string;
  description: string;
  statusColor: string;
  emoji?: string;
  statusLabel: string;
}

// Socialization Progress
export interface SocializationProgress {
  categoryId: string;
  category: string;
  categoryName: string;
  total: number;
  target: number;
  percentage: number;
  color?: string;
  count?: number;
  completion_percentage?: number;
}

// Puppy Milestone
export interface Milestone {
  id: string;
  puppy_id: string;
  milestone_type: string;
  milestone_date: string;
  notes?: string;
  created_at?: string;
  title: string;
  is_completed: boolean;
  expected_age_days?: number;
  completion_date?: string;
  description?: string;
}

// Puppy Age Group
export interface AgeGroup {
  id: string;
  name: string;
  minAge: number;
  maxAge: number;
  color: string;
  description: string;
}

export interface PuppyAgeGroupData {
  [key: string]: {
    name: string;
    puppyCount: number;
    color: string;
    ageRange: string;
    minAge: number;
    maxAge: number;
  };
}

// Puppy Management Statistics
export interface PuppyManagementStats {
  puppies: any[];
  totalPuppies: number;
  availablePuppies: number;
  reservedPuppies: number;
  soldPuppies: number;
  unavailablePuppies: number;
  activeCount: number;
  availableCount: number;
  averageAge: number;
  youngestPuppy: number;
  oldestPuppy: number;
  ageGroups: AgeGroup[];
  puppiesByAgeGroup: PuppyAgeGroupData;
}

// Health Certificate
export interface HealthCertificate {
  id: string;
  dog_id: string;
  puppy_id?: string;
  certificate_type: string;
  issuer: string;
  issue_date: string;
  expiry_date?: string;
  file_url?: string;
  notes?: string;
  created_at: string;
}

// Medication Administration
export interface MedicationAdministration {
  id: string;
  medication_id: string;
  dog_id: string;
  administration_date: string;
  administered_at: string;
  administered_by: string;
  notes?: string;
  created_at: string;
}

// Medication
export interface Medication {
  id: string;
  dog_id: string;
  name: string;
  dosage?: number;
  dosage_unit?: string;
  frequency: string;
  administration_route: string;
  start_date: string;
  end_date?: string;
  last_administered?: string;
  active: boolean;
  notes?: string;
  created_at: string;
  medication_name?: string;
  is_active?: boolean;
}
