
import React from 'react';
import { cn } from '@/lib/utils';
import { RecentActivity } from '@/services/dashboardService';
import { 
  Users, FileText, PawPrint, Calendar, Heart, 
  DollarSign, Activity, CheckCircle
} from 'lucide-react';

interface RecentActivitiesProps {
  activities: RecentActivity[];
  isLoading?: boolean;
  className?: string;
}

const RecentActivities: React.FC<RecentActivitiesProps> = ({ 
  activities, 
  isLoading = false,
  className 
}) => {
  // Function to get icon and background color based on activity type
  const getActivityStyle = (type: string) => {
    switch (type) {
      case 'litter':
        return { 
          icon: <PawPrint size={16} />,
          bg: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
        };
      case 'sale':
        return { 
          icon: <CheckCircle size={16} />,
          bg: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400'
        };
      case 'health':
        return { 
          icon: <Heart size={16} />,
          bg: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
        };
      case 'payment':
        return { 
          icon: <DollarSign size={16} />,
          bg: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400'
        };
      case 'document':
        return { 
          icon: <FileText size={16} />,
          bg: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400'
        };
      default:
        return { 
          icon: <Activity size={16} />,
          bg: 'bg-slate-50 text-slate-600 dark:bg-slate-900/20 dark:text-slate-400'
        };
    }
  };

  // Format the date
  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    
    return new Date(dateString).toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className={cn('space-y-6', className)}>
        <div className="flex items-center justify-between">
          <h3 className="text-base font-medium text-slate-800 dark:text-slate-200">
            Recent Activities
          </h3>
        </div>
        
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex items-start p-3 animate-pulse">
              <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 mr-3"></div>
              <div className="flex-1">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-base font-medium text-slate-800 dark:text-slate-200">
          Recent Activities
        </h3>
        <button className="text-xs font-medium text-primary hover:text-primary/80">
          View all
        </button>
      </div>
      
      <div className="space-y-4">
        {activities.length > 0 ? (
          activities.map((activity) => {
            const { icon, bg } = getActivityStyle(activity.type);
            return (
              <div 
                key={activity.id}
                className="flex items-start p-3 rounded-lg transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50"
              >
                <div className={cn('w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mr-3', bg)}>
                  {icon}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                    {activity.title}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 truncate">
                    {activity.description}
                  </p>
                  <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                    {formatTimeAgo(activity.createdAt)}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-4 text-center">
            <p className="text-slate-500 dark:text-slate-400">No recent activities</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivities;
