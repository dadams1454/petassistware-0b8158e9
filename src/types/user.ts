
export interface UserWithProfile {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  first_name: string | null;
  last_name: string | null;
  profile_image_url: string | null;
  role: string | null;
  tenant_id: string | null;
  // Adding name property to support UserTableRow component
  name?: string; 
}
