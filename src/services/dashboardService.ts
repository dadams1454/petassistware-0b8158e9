
// Define the return types for the dashboard data
export interface DashboardStats {
  dogCount: number;
  litterCount: number;
  reservationCount: number;
  recentRevenue: number;
  totalDogs?: number; // For backward compatibility
  activeLitters?: number; // For backward compatibility
  upcomingEvents?: number; // For backward compatibility
  pendingTasks?: number; // For backward compatibility
}

export interface UpcomingEvent {
  id: string;
  title: string;
  date?: string;
  event_date: string; // Updated to match database column
  type?: string;
  event_type: string; // Updated to match database column
  description: string;
  status: string;
}

export interface RecentActivity {
  id: string;
  type: string;
  description: string;
  timestamp?: string;
  createdAt: string;
  dogId?: string;
  dogName?: string;
  title: string;
}

// Export the types
export type DashboardEvent = UpcomingEvent;
export type ActivityItem = RecentActivity;
