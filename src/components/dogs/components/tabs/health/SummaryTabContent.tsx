import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  FileMedical, 
  Pill, 
  Syringe, 
  Clipboard, 
  AlertTriangle,
  Scale
} from 'lucide-react';
import { format } from 'date-fns';

import { useHealthTabContext } from './HealthTabContext';
import EmptyState from '@/components/ui/EmptyState';
import { HealthRecordTypeEnum, WeightUnit } from '@/types/health';

const SummaryTabContent: React.FC = () => {
  const { 
    healthRecords, 
    weightHistory, 
    isLoading, 
    upcomingAppointments,
    getRecordsByType,
    getOverdueVaccinations
  } = useHealthTabContext();
  
  const vaccinations = getRecordsByType(HealthRecordTypeEnum.Vaccination);
  const examinations = getRecordsByType(HealthRecordTypeEnum.Examination);
  const medications = getRecordsByType(HealthRecordTypeEnum.Medication);
  const overdueVaccinations = getOverdueVaccinations();
  
  if (!healthRecords?.length && !weightHistory?.length) {
    return (
      <EmptyState
        icon={<FileMedical className="h-10 w-10" />}
        title="No health records"
        description="Add vaccinations, examinations, medications, and weight records to keep track of your dog's health."
      />
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Other health data, alerts, upcoming appointments */}
      {overdueVaccinations.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-red-700 flex items-center text-base font-medium">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Overdue Vaccinations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {overdueVaccinations.map((vaccine) => (
                <li key={vaccine.id} className="flex justify-between">
                  <div className="flex items-center text-sm">
                    <Syringe className="h-4 w-4 mr-2 text-red-600" />
                    <span>{vaccine.title || vaccine.vaccine_name}</span>
                  </div>
                  <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50">
                    Due {vaccine.next_due_date ? format(new Date(vaccine.next_due_date), 'MMM d, yyyy') : 'Unknown'}
                  </Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
      
      {upcomingAppointments.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Upcoming Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {upcomingAppointments.map((appointment) => (
                <li key={appointment.id} className="flex justify-between">
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                    <span>{appointment.title}</span>
                  </div>
                  <Badge variant="outline">
                    {appointment.next_due_date ? format(new Date(appointment.next_due_date), 'MMM d, yyyy') : 'Unknown'}
                  </Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Vaccinations */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">
              Recent Vaccinations
            </CardTitle>
            <CardDescription>
              {vaccinations.length} vaccinations recorded
            </CardDescription>
          </CardHeader>
          <CardContent>
            {vaccinations.length > 0 ? (
              <ul className="space-y-2">
                {vaccinations.slice(0, 3).map((vaccination) => (
                  <li key={vaccination.id} className="flex justify-between">
                    <div className="flex items-center text-sm">
                      <Syringe className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{vaccination.title || vaccination.vaccine_name}</span>
                    </div>
                    <Badge variant="outline">
                      {vaccination.visit_date ? format(new Date(vaccination.visit_date), 'MMM d, yyyy') : 'Unknown'}
                    </Badge>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No vaccinations recorded yet</p>
            )}
          </CardContent>
        </Card>
        
        {/* Weight Tracking */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">
              Weight History
            </CardTitle>
            <CardDescription>
              {weightHistory?.length || 0} weight records
            </CardDescription>
          </CardHeader>
          <CardContent>
            {weightHistory && weightHistory.length > 0 ? (
              <ul className="space-y-2">
                {weightHistory.slice(0, 3).map((weight) => (
                  <li key={weight.id} className="flex justify-between">
                    <div className="flex items-center text-sm">
                      <Scale className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{weight.weight} {weight.unit || weight.weight_unit}</span>
                    </div>
                    <Badge variant="outline">
                      {weight.date ? format(new Date(weight.date), 'MMM d, yyyy') : 'Unknown'}
                    </Badge>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No weight records yet</p>
            )}
          </CardContent>
        </Card>
        
        {/* Recent Examinations */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">
              Recent Check-ups
            </CardTitle>
            <CardDescription>
              {examinations.length} examinations recorded
            </CardDescription>
          </CardHeader>
          <CardContent>
            {examinations.length > 0 ? (
              <ul className="space-y-2">
                {examinations.slice(0, 3).map((exam) => (
                  <li key={exam.id} className="flex justify-between">
                    <div className="flex items-center text-sm">
                      <Clipboard className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{exam.title || 'Examination'}</span>
                    </div>
                    <Badge variant="outline">
                      {exam.visit_date ? format(new Date(exam.visit_date), 'MMM d, yyyy') : 'Unknown'}
                    </Badge>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No examinations recorded yet</p>
            )}
          </CardContent>
        </Card>
        
        {/* Recent Medications */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">
              Recent Medications
            </CardTitle>
            <CardDescription>
              {medications.length} medications recorded
            </CardDescription>
          </CardHeader>
          <CardContent>
            {medications.length > 0 ? (
              <ul className="space-y-2">
                {medications.slice(0, 3).map((medication) => (
                  <li key={medication.id} className="flex justify-between">
                    <div className="flex items-center text-sm">
                      <Pill className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{medication.title || medication.medication_name}</span>
                    </div>
                    <Badge variant="outline">
                      {medication.start_date ? format(new Date(medication.start_date), 'MMM d, yyyy') : 
                       medication.visit_date ? format(new Date(medication.visit_date), 'MMM d, yyyy') : 'Unknown'}
                    </Badge>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No medications recorded yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SummaryTabContent;
