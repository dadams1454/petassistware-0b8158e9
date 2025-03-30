
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Calendar, Activity } from 'lucide-react';
import { EmptyState } from '@/components/ui/standardized';
import HealthSummaryCard from '../../health/HealthSummaryCard';
import HealthRecordsList from '../../health/HealthRecordsList';
import { useHealthTabContext } from './HealthTabContext';

const SummaryTabContent: React.FC = () => {
  const {
    dogId,
    healthRecords,
    weightHistory,
    getUpcomingVaccinations,
    getOverdueVaccinations,
    getRecordsByType,
    handleAddRecord,
    handleEditRecord,
    deleteHealthRecord,
    growthStats
  } = useHealthTabContext();

  if (!healthRecords || healthRecords.length === 0) {
    return (
      <EmptyState
        title="No health records yet"
        description="Start tracking this dog's health by adding records for vaccinations, examinations, or medications."
        action={{
          label: "Add First Record",
          onClick: () => handleAddRecord('examination')
        }}
      />
    );
  }

  return (
    <>
      <HealthSummaryCard 
        dogId={dogId}
        upcomingVaccinations={getUpcomingVaccinations()}
        overdueVaccinations={getOverdueVaccinations()}
        recentExaminations={getRecordsByType('examination')}
        currentMedications={getRecordsByType('medication')}
        latestWeight={weightHistory[0]}
        growthStats={growthStats}
        isLoading={false}
      />
      
      {getOverdueVaccinations().length > 0 && (
        <Card className="border-red-200 bg-red-50 dark:bg-red-950/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-red-600 flex items-center text-lg">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Overdue Vaccinations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <HealthRecordsList 
              records={getOverdueVaccinations()}
              onEdit={handleEditRecord}
              onDelete={deleteHealthRecord}
              emptyMessage="No overdue vaccinations"
            />
          </CardContent>
        </Card>
      )}
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-lg">
            <Calendar className="h-5 w-5 mr-2" />
            Upcoming Health Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          <HealthRecordsList 
            records={getUpcomingVaccinations()}
            onEdit={handleEditRecord}
            onDelete={deleteHealthRecord}
            emptyMessage="No upcoming health events"
          />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-lg">
            <Activity className="h-5 w-5 mr-2" />
            Recent Health Activities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <HealthRecordsList 
            records={healthRecords.slice(0, 5)}
            onEdit={handleEditRecord}
            onDelete={deleteHealthRecord}
            emptyMessage="No recent health activities"
          />
        </CardContent>
      </Card>
    </>
  );
};

export default SummaryTabContent;
