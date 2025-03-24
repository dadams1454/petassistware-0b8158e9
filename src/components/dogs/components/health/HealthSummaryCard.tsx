
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pill, Stethoscope, AlertTriangle, Scale } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { HealthRecord, WeightRecord } from '@/types/health';
import { Skeleton } from '@/components/ui/skeleton';

interface HealthSummaryCardProps {
  dogId: string;
  upcomingVaccinations: HealthRecord[];
  overdueVaccinations: HealthRecord[];
  recentExaminations: HealthRecord[];
  currentMedications: HealthRecord[];
  latestWeight?: WeightRecord;
  growthStats: any;
  isLoading: boolean;
}

const HealthSummaryCard: React.FC<HealthSummaryCardProps> = ({
  upcomingVaccinations,
  overdueVaccinations,
  recentExaminations,
  currentMedications,
  latestWeight,
  growthStats,
  isLoading
}) => {
  const nextVaccination = upcomingVaccinations[0];
  const lastExamination = recentExaminations[0];
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Health Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Health Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={`p-4 rounded-lg ${
            overdueVaccinations.length > 0 
              ? 'bg-red-50 border border-red-200 dark:bg-red-950/10 dark:border-red-800' 
              : 'bg-green-50 border border-green-200 dark:bg-green-950/10 dark:border-green-800'
          }`}>
            <div className="flex items-start">
              {overdueVaccinations.length > 0 ? (
                <AlertTriangle className="h-5 w-5 text-red-600 mr-2 mt-0.5" />
              ) : (
                <Stethoscope className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
              )}
              <div>
                <h3 className={`font-medium ${
                  overdueVaccinations.length > 0 ? 'text-red-600' : 'text-green-600'
                }`}>
                  Vaccination Status
                </h3>
                {overdueVaccinations.length > 0 ? (
                  <p className="text-sm text-red-600 mt-1">
                    {overdueVaccinations.length} vaccination{overdueVaccinations.length !== 1 ? 's' : ''} overdue
                  </p>
                ) : nextVaccination ? (
                  <p className="text-sm text-green-700 mt-1">
                    Next due: {format(new Date(nextVaccination.next_due_date!), 'MMM d, yyyy')} 
                    ({formatDistanceToNow(new Date(nextVaccination.next_due_date!), { addSuffix: true })})
                  </p>
                ) : (
                  <p className="text-sm text-green-700 mt-1">All vaccinations up to date</p>
                )}
              </div>
            </div>
          </div>
          
          <div className="p-4 rounded-lg bg-blue-50 border border-blue-200 dark:bg-blue-950/10 dark:border-blue-800">
            <div className="flex items-start">
              <Stethoscope className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-600">Last Examination</h3>
                {lastExamination ? (
                  <p className="text-sm text-blue-700 mt-1">
                    {lastExamination.title} -{' '}
                    {format(new Date(lastExamination.date), 'MMM d, yyyy')}
                    {' '}({formatDistanceToNow(new Date(lastExamination.date), { addSuffix: true })})
                  </p>
                ) : (
                  <p className="text-sm text-blue-700 mt-1">No examinations recorded</p>
                )}
              </div>
            </div>
          </div>
          
          <div className="p-4 rounded-lg bg-purple-50 border border-purple-200 dark:bg-purple-950/10 dark:border-purple-800">
            <div className="flex items-start">
              <Pill className="h-5 w-5 text-purple-600 mr-2 mt-0.5" />
              <div>
                <h3 className="font-medium text-purple-600">Current Medications</h3>
                {currentMedications.length > 0 ? (
                  <p className="text-sm text-purple-700 mt-1">
                    {currentMedications.length} active medication{currentMedications.length !== 1 ? 's' : ''}
                  </p>
                ) : (
                  <p className="text-sm text-purple-700 mt-1">No current medications</p>
                )}
              </div>
            </div>
          </div>
          
          <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 dark:bg-amber-950/10 dark:border-amber-800">
            <div className="flex items-start">
              <Scale className="h-5 w-5 text-amber-600 mr-2 mt-0.5" />
              <div>
                <h3 className="font-medium text-amber-600">Weight Tracking</h3>
                {latestWeight ? (
                  <div className="text-sm text-amber-700 mt-1">
                    <p>
                      Current: {latestWeight.weight} {latestWeight.weight_unit}
                      {' '}({formatDistanceToNow(new Date(latestWeight.date), { addSuffix: true })})
                    </p>
                    {growthStats && (
                      <p className="mt-1">
                        {growthStats.growthPerWeek > 0 
                          ? `Growing ${growthStats.growthPerWeek.toFixed(2)} kg/week`
                          : 'Weight stable'}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-amber-700 mt-1">No weight records</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HealthSummaryCard;
