
import React from 'react';
import { cn } from '@/lib/utils';
import { 
  Users, FileText, PawPrint, Calendar, Heart, 
  DollarSign, Activity, CheckCircle
} from 'lucide-react';

// Mock data
const activities = [
  {
    id: 1,
    type: 'litter',
    title: 'New litter registered',
    description: 'Golden Retriever litter with 6 puppies',
    time: '2 hours ago',
    icon: <PawPrint size={16} />,
    iconBg: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
  },
  {
    id: 2,
    type: 'sale',
    title: 'Puppy reservation confirmed',
    description: 'Male puppy #3 reserved by John Smith',
    time: '5 hours ago',
    icon: <CheckCircle size={16} />,
    iconBg: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400',
  },
  {
    id: 3,
    type: 'health',
    title: 'Vaccinations updated',
    description: 'Bella (dam) received annual vaccinations',
    time: '1 day ago',
    icon: <Heart size={16} />,
    iconBg: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400',
  },
  {
    id: 4,
    type: 'payment',
    title: 'Payment received',
    description: '$500 deposit for puppy reservation',
    time: '2 days ago',
    icon: <DollarSign size={16} />,
    iconBg: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400',
  },
  {
    id: 5,
    type: 'document',
    title: 'Contract generated',
    description: 'Sale contract for Max (male, 10 weeks)',
    time: '2 days ago',
    icon: <FileText size={16} />,
    iconBg: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
  }
];

interface RecentActivitiesProps {
  className?: string;
}

const RecentActivities: React.FC<RecentActivitiesProps> = ({ className }) => {
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
        {activities.map((activity) => (
          <div 
            key={activity.id}
            className="flex items-start p-3 rounded-lg transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50"
          >
            <div 
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mr-3',
                activity.iconBg
              )}
            >
              {activity.icon}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                {activity.title}
              </p>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 truncate">
                {activity.description}
              </p>
              <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                {activity.time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivities;
