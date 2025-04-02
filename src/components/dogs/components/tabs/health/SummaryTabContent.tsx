
import React, { useContext } from 'react';
import { HealthTabContext } from '../../contexts/HealthTabContext';
import { HealthRecordTable } from '../records/HealthRecordTable';
import { UpcomingAppointments } from './UpcomingAppointments';
import { WeightHistoryPlot } from './WeightHistoryPlot';
import { MedicationSchedule } from './MedicationSchedule';
import { Stethoscope, Activity, Calendar, FileText } from 'lucide-react';
import EmptyState from '@/components/ui/EmptyState';

const SummaryTabContent: React.FC = () => {
  const {
    recentHealthRecords,
    weightRecords,
    medications,
    isLoading,
    refreshData
  } = useContext(HealthTabContext);
  
  const upcomingAppointments = []; // Update this based on your data structure
  const overdueVaccinations = []; // Update this based on your data structure

  if (isLoading) {
    return <div>Loading health summary...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Recent Health Records */}
      <div>
        <h3 className="text-lg font-medium mb-3 flex items-center">
          <FileText className="mr-2 h-5 w-5 text-primary" />
          Recent Health Records
        </h3>
        
        {recentHealthRecords.length > 0 ? (
          <HealthRecordTable 
            records={recentHealthRecords}
            showActions={false}
          />
        ) : (
          <EmptyState 
            message="No recent health records found. Add a health record to get started."
            icon={<FileText className="h-12 w-12 text-muted-foreground/50" />}
          />
        )}
      </div>

      {/* Weight History */}
      <div>
        <h3 className="text-lg font-medium mb-3 flex items-center">
          <Activity className="mr-2 h-5 w-5 text-primary" />
          Weight History
        </h3>
        
        {weightRecords.length > 0 ? (
          <WeightHistoryPlot weightRecords={weightRecords} />
        ) : (
          <EmptyState 
            message="No weight records found. Add weight entries to track your dog's growth."
            icon={<Activity className="h-12 w-12 text-muted-foreground/50" />}
          />
        )}
      </div>

      {/* Medication Schedule */}
      <div>
        <h3 className="text-lg font-medium mb-3 flex items-center">
          <Stethoscope className="mr-2 h-5 w-5 text-primary" />
          Current Medications
        </h3>
        
        {medications.length > 0 ? (
          <MedicationSchedule medications={medications} />
        ) : (
          <EmptyState 
            message="No active medications. Add medications to track treatment schedules."
            icon={<Stethoscope className="h-12 w-12 text-muted-foreground/50" />}
          />
        )}
      </div>

      {/* Upcoming Appointments */}
      <div>
        <h3 className="text-lg font-medium mb-3 flex items-center">
          <Calendar className="mr-2 h-5 w-5 text-primary" />
          Upcoming Appointments
        </h3>
        
        {upcomingAppointments.length > 0 ? (
          <UpcomingAppointments appointments={upcomingAppointments} />
        ) : (
          <EmptyState 
            message="No upcoming appointments scheduled."
            icon={<Calendar className="h-12 w-12 text-muted-foreground/50" />}
          />
        )}
      </div>
    </div>
  );
};

export default SummaryTabContent;
