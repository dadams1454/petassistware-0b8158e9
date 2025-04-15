
import { UserRole } from '@/contexts/AuthProvider';

export interface MockUser {
  id: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  tenantId: string;
  created_at: string;
  profileImageUrl?: string;
}

// Sample users for testing
export const mockUsers: MockUser[] = [
  {
    id: '1',
    email: 'admin@example.com',
    name: 'Admin User',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    tenantId: '00000000-0000-0000-0000-000000000000',
    created_at: '2023-01-01T00:00:00.000Z',
    profileImageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin'
  },
  {
    id: '2',
    email: 'manager@example.com',
    name: 'Kennel Manager',
    firstName: 'Kennel',
    lastName: 'Manager',
    role: 'manager',
    tenantId: '00000000-0000-0000-0000-000000000000',
    created_at: '2023-01-02T00:00:00.000Z',
    profileImageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=manager'
  },
  {
    id: '3',
    email: 'staff@example.com',
    name: 'Staff Member',
    firstName: 'Staff',
    lastName: 'Member',
    role: 'staff',
    tenantId: '00000000-0000-0000-0000-000000000000',
    created_at: '2023-01-03T00:00:00.000Z',
    profileImageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=staff'
  },
  {
    id: '4',
    email: 'vet@example.com',
    name: 'Veterinarian',
    firstName: 'Vet',
    lastName: 'Doctor',
    role: 'veterinarian',
    tenantId: '00000000-0000-0000-0000-000000000000',
    created_at: '2023-01-04T00:00:00.000Z',
    profileImageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=vet'
  },
  {
    id: '5',
    email: 'viewer@example.com',
    name: 'Limited Viewer',
    firstName: 'Limited',
    lastName: 'Viewer',
    role: 'viewer',
    tenantId: '00000000-0000-0000-0000-000000000000',
    created_at: '2023-01-05T00:00:00.000Z',
    profileImageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=viewer'
  }
];

// Function to find a user by email (for login)
export const findUserByEmail = (email: string): MockUser | undefined => {
  return mockUsers.find(user => user.email.toLowerCase() === email.toLowerCase());
};

// Function to find a user by ID
export const findUserById = (id: string): MockUser | undefined => {
  return mockUsers.find(user => user.id === id);
};
