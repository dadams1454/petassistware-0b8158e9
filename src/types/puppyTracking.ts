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

export interface PuppyAgeGroupData {
  id: string;
  name: string;
  startDay: number;
  endDay: number;
  description: string;
  milestones: string;
  careChecks: string[];
}

// Management statistics
export interface PuppyManagementStats {
  totalPuppies: number;
  activeLitters: number;
  upcomingVaccinations: number;
  recentWeightChecks: number;
}
