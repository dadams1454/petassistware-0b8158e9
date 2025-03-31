
import { UserWithProfile } from '@/types/user';

export type BreederProfile = {
  id: string;
  email: string;
  created_at: string;
  first_name: string | null;
  last_name: string | null;
  profile_image_url: string | null;
  role: string | null;
  business_name?: string | null;
  business_overview?: string | null;
  business_details?: string | null;
  breeding_experience?: string | null;
  updated_at: string;
  tenant_id?: string | null;
};

export interface UserManagementState {
  users: UserWithProfile[];
  loading: boolean;
  error: string | null;
}

export interface UserManagementActions {
  fetchUsers: () => Promise<void>;
  signOutAllUsers: () => Promise<void>;
}

export interface UserManagementContext extends UserManagementState, UserManagementActions {
  userRole: string | null;
  tenantId: string | null;
}
