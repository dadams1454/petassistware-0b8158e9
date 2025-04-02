
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import VaccinationForm from './VaccinationForm';
import { saveVaccinationSchedule, getVaccinationSchedules } from '@/services/vaccinationService';
import { toast } from '@/hooks/use-toast';
import { LoadingState, ErrorState } from '@/components/ui/standardized';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from 'date-fns';

interface VaccinationSchedule {
  id: string;
  puppy_id: string;
  vaccine_name: string;
  due_date: string;
  administered: boolean;
  administered_date?: string;
}

const VaccinationDashboard: React.FC = () => {
  const { puppyId } = useParams<{ puppyId: string }>();
  const navigate = useNavigate();
  const [vaccinationSchedules, setVaccinationSchedules] = useState<VaccinationSchedule[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (puppyId) {
      fetchVaccinationSchedules(puppyId);
    }
  }, [puppyId]);

  const fetchVaccinationSchedules = async (puppyId: string) => {
    setIsLoading(true);
    try {
      const schedules = await getVaccinationSchedules(puppyId);
      // Make sure we cast the result to the correct type
      setVaccinationSchedules(schedules as VaccinationSchedule[]);
    } catch (err: any) {
      setError(err.message || 'Failed to load vaccination schedules');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddVaccination = () => {
    setIsAdding(true);
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
  };

  const handleVaccinationSaved = () => {
    setIsAdding(false);
    if (puppyId) {
      fetchVaccinationSchedules(puppyId);
    }
  };

  const handleSaveVaccination = async (data: any): Promise<boolean> => {
    try {
      await saveVaccinationSchedule(data);
      return true;
    } catch (error) {
      console.error("Error saving vaccination schedule", error);
      return false;
    }
  };

  if (isLoading) {
    return <LoadingState message="Loading vaccination schedules..." />;
  }

  if (error) {
    return <ErrorState title="Error" message={error} />;
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Vaccination Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          {isAdding ? (
            <VaccinationForm
              onSave={handleVaccinationSaved}
              onCancel={handleCancelAdd}
              onSubmit={handleSaveVaccination}
              puppyId={puppyId}
            />
          ) : (
            <div>
              <div className="mb-4 flex justify-end">
                <Button onClick={handleAddVaccination}>
                  <Plus className="h-5 w-5 mr-2" />
                  Add Vaccination
                </Button>
              </div>
              {vaccinationSchedules.length > 0 ? (
                <Table>
                  <TableCaption>List of scheduled vaccinations.</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Vaccine</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Administered</TableHead>
                      <TableHead>Administered Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vaccinationSchedules.map((schedule) => (
                      <TableRow key={schedule.id}>
                        <TableCell className="font-medium">{schedule.vaccine_name}</TableCell>
                        <TableCell>{format(new Date(schedule.due_date), 'MMM d, yyyy')}</TableCell>
                        <TableCell>{schedule.administered ? 'Yes' : 'No'}</TableCell>
                        <TableCell>{schedule.administered_date ? format(new Date(schedule.administered_date), 'MMM d, yyyy') : 'N/A'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center">No vaccination schedules found.</div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VaccinationDashboard;
