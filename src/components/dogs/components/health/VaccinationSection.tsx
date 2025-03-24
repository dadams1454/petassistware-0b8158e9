
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, AlertTriangle, Calendar } from 'lucide-react';
import { HealthRecord } from '@/types/health';
import HealthRecordsList from './HealthRecordsList';

interface VaccinationSectionProps {
  vaccinations: HealthRecord[];
  upcomingVaccinations: HealthRecord[];
  overdueVaccinations: HealthRecord[];
  onAdd: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

const VaccinationSection: React.FC<VaccinationSectionProps> = ({
  vaccinations,
  upcomingVaccinations,
  overdueVaccinations,
  onAdd,
  onEdit,
  onDelete,
  isLoading = false
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>Vaccination Records</CardTitle>
          <Button size="sm" onClick={onAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Add Vaccination
          </Button>
        </CardHeader>
        <CardContent>
          <HealthRecordsList 
            records={vaccinations}
            onEdit={onEdit}
            onDelete={onDelete}
            emptyMessage="No vaccination records found"
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
      
      {overdueVaccinations.length > 0 && (
        <Card className="border-red-200 bg-red-50 dark:bg-red-950/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-red-600 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Overdue Vaccinations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <HealthRecordsList 
              records={overdueVaccinations}
              onEdit={onEdit}
              onDelete={onDelete}
              emptyMessage="No overdue vaccinations"
            />
          </CardContent>
        </Card>
      )}
      
      {upcomingVaccinations.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Upcoming Vaccinations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <HealthRecordsList 
              records={upcomingVaccinations}
              onEdit={onEdit}
              onDelete={onDelete}
              emptyMessage="No upcoming vaccinations"
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VaccinationSection;
