
// Define types for dashboard data
export interface DashboardData {
  totalDogs: number;
  activeDogs: number;
  totalLitters: number;
  activeLitters: number;
  totalPuppies: number;
  availablePuppies: number;
  totalCustomers: number;
}

export interface UpcomingEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  status: string;
}

export interface RecentActivity {
  id: string;
  type: string;
  title: string;
  description: string;
  createdAt: string;
}
