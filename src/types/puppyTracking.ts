
// Puppy tracking and management types

// Represents a puppy with age calculation
export interface PuppyWithAge {
  id: string;
  name?: string;
  birth_date: string;
  gender?: string;
  color?: string;
  status?: string;
  litter_id?: string;
  litter_name?: string;
  ageInDays: number;
  ageInWeeks: number;
  photo_url?: string;
}

// Defines an age group for puppies
export interface PuppyAgeGroupData {
  id: string;
  name: string;      // Required name for the age group
  startDay: number;  // Starting day for this age group
  endDay: number;    // Ending day for this age group
  description?: string;
  color?: string;
  milestones?: string[]; // Important milestones to track in this age group
  careChecks?: string[]; // Care checks relevant for this age group
}

// Comprehensive puppy management statistics
export interface PuppyManagementStats {
  puppies: PuppyWithAge[];
  ageGroups: PuppyAgeGroupData[];
  puppiesByAgeGroup: { [groupId: string]: PuppyWithAge[] };
  totalPuppies: number;
  availablePuppies: number;
  reservedPuppies: number;
  soldPuppies: number;
  isLoading: boolean;
  error?: Error | null;
  total: {
    count: number;
    male: number;
    female: number;
  };
  byGender: {
    male: number;
    female: number;
    unknown: number;
  };
  byStatus: Record<string, number>;
  byAgeGroup: Record<string, number>;
}

// Puppy weight record
export interface PuppyWeightRecord {
  id: string;
  puppy_id: string;
  weight: number;
  weight_unit: string;
  date: string;
  age_days?: number;
  notes?: string;
  created_at?: string;
}
