
// Dog Group Types
export interface DogGroup {
  id: string;
  name: string;
  description?: string;
  color?: string;
  dogIds: string[]; // Required property for dog IDs
  members?: string[];
  created_at?: string;
}

export interface DogGroupMember {
  id: string;
  group_id: string;
  dog_id: string;
  created_at?: string;
}
