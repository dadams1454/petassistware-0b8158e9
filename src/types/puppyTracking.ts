
// Puppy Growth and Health Tracking Types
export interface PuppyWithAge {
  id: string;
  litter_id: string;
  name: string | null;
  gender: 'Male' | 'Female' | null;
  color: string | null;
  status: string | null;
  birth_date: string | null;
  current_weight: string | null; 
  photo_url: string | null;
  microchip_number: string | null;
  ageInDays: number;
  litters?: {
    id: string;
    name: string;
    birth_date: string;
  };
}

export interface WeightRecord {
  id: string;
  puppy_id: string;
  date: string;
  weight: number;
  weight_unit: string;
  notes?: string;
  birth_date?: string; // For age calculation
  created_at: string;
}

export interface PuppyMilestone {
  id: string;
  puppy_id: string;
  milestone_date: string;  // Database field
  milestone_type: string;  // Database field
  notes?: string;
  created_at: string;
  // Fields we use in the UI but need to map
  title?: string;         // Derived from milestone_type
  description?: string;   // Stored in notes
  category?: string;      // Part of milestone_type (e.g., "physical:eyes_open")
  expected_age_days?: number; // Derived or stored elsewhere
  target_date?: string;   // Same as milestone_date
  completion_date?: string; // Set when a milestone is completed
}

export interface VaccinationScheduleItem {
  id: string;
  puppy_id: string;
  vaccination_type: string;
  due_date: string;
  notes?: string;
  created_at: string;
  is_completed?: boolean; // Derived field (true if there's a matching vaccination record)
  vaccination_date?: string; // Added for display purposes when completed
}

export interface VaccinationRecord {
  id: string;
  puppy_id: string;
  vaccination_type: string;
  vaccination_date: string;
  lot_number?: string;
  administered_by?: string;
  notes?: string;
  created_at: string;
}

// Puppy management and statistics
export interface PuppyManagementStats {
  totalPuppies: number;
  availablePuppies: number;
  reservedPuppies: number;
  soldPuppies: number;
  maleCount: number;
  femaleCount: number;
  averageWeight: number;
  puppiesByColor: Record<string, number>;
  puppiesByAge: Record<string, number>;
  // Adding missing properties
  activeLitters: number;
  upcomingVaccinations: number;
  recentWeightChecks: number;
}

// Age group definitions for puppy management
export interface PuppyAgeGroupData {
  id: string;
  name: string;
  description: string;
  startDay: number;
  endDay: number;
  color: string;
  priority: number;
  // Adding missing properties
  milestones?: string;
  careChecks?: string[];
}

// Socialization Types
export interface SocializationCategory {
  id: string;
  name: string;
  description?: string;
  color?: string;
  examples?: string[];
}

export interface SocializationExperience {
  id: string;
  puppy_id: string;
  category_id: string;
  experience: string;
  experience_date: string;
  reaction?: string;
  notes?: string;
  created_at: string;
}

export interface SocializationReaction {
  id: string;
  name: string;
  description?: string;
  color: string;
  order?: number;
}

export interface SocializationProgress {
  categoryId: string;
  categoryName: string;
  count: number;
  target: number;
  completionPercentage: number;
}
