
import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { 
  Users, FileText, PawPrint, Calendar, Heart, 
  DollarSign, Activity, CheckCircle
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Activity {
  id: string;
  title: string;
  description: string;
  activity_type: string;
  created_at: string;
}

interface RecentActivitiesProps {
  className?: string;
  activities?: Activity[];
  isLoading?: boolean;
}

const ActivityIcon = ({ type }: { type: string }) => {
  switch (type.toLowerCase()) {
    case 'litter':
      return <PawPrint size={16} />;
    case 'sale':
    case 'reservation':
      return <CheckCircle size={16} />;
    case 'health':
      return <Heart size={16} />;
    case 'payment':
      return <DollarSign size={16} />;
    case 'document':
      return <FileText size={16} />;
    case 'customer':
      return <Users size={16} />;
    case 'event':
      return <Calendar size={16} />;
    default:
      return <Activity size={16} />;
  }
};

const ActivityIconBg = ({ type }: { type: string }) => {
  switch (type.toLowerCase()) {
    case 'litter':
      return 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400';
    case 'sale':
    case 'reservation':
      return 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400';
    case 'health':
      return 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400';
    case 'payment':
      return 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400';
    case 'document':
      return 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400';
    case 'customer':
      return 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400';
    case 'event':
      return 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400';
    default:
      return 'bg-slate-50 text-slate-600 dark:bg-slate-700/20 dark:text-slate-400';
  }
};

const RecentActivities: React.FC<RecentActivitiesProps> = ({ 
  className, 
  activities = [], 
  isLoading = false 
}) => {
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
      
      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-6 w-6 text-primary animate-spin" />
        </div>
      ) : activities.length === 0 ? (
        <div className="text-center py-8 text-slate-500 dark:text-slate-400">
          <p>No recent activities</p>
          <p className="text-sm mt-1">Activities will appear here as you use the system</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => (
            <div 
              key={activity.id}
              className="flex items-start p-3 rounded-lg transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50"
            >
              <div 
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mr-3',
                  ActivityIconBg({ type: activity.activity_type })
                )}
              >
                <ActivityIcon type={activity.activity_type} />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                  {activity.title}
                </p>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 truncate">
                  {activity.description}
                </p>
                <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                  {activity.created_at ? formatDistanceToNow(new Date(activity.created_at), { addSuffix: true }) : 'Just now'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentActivities;
