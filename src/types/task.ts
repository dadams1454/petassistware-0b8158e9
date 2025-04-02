
// Task-related types

export interface Task {
  id: string;
  name: string;
  description?: string;
  status: 'pending' | 'in-progress' | 'completed' | 'canceled';
  priority: 'low' | 'medium' | 'high';
  due_date?: string;
  assigned_to?: string;
  notes?: string;
  created_at: string;
  updated_at?: string;
}

export interface TaskLog {
  id: string;
  task_id: string;
  completed_by: string;
  completed_at: string;
  notes?: string;
  status: string;
}

export interface TaskCategory {
  id: string;
  name: string;
  color: string;
  description?: string;
}
