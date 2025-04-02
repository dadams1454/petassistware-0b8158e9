
export interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
  created_at?: string;
  tenant_id?: string;
  metadata?: any;
}

export interface CustomerWithMeta extends Customer {
  metadata?: {
    lastContact?: string;
    preferredContactMethod?: string;
    source?: string;
    status?: string;
    [key: string]: any;
  };
}

export interface CustomerFilter {
  search?: string;
  status?: string[];
  dateRange?: [Date | null, Date | null];
  type?: string;
  interestedInPuppies?: boolean;
}

export type SortField = 'name' | 'created_at' | 'status';
export type SortOrder = 'asc' | 'desc';

export interface ReservationListProps {
  customerId?: string;
}

export interface CustomerPreference {
  size?: 'tiny' | 'small' | 'medium' | 'large' | 'giant';
  temperament?: string[];
  sex?: 'male' | 'female' | 'any';
  coatColor?: string[];
  activityLevel?: 'low' | 'moderate' | 'high';
}
