
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Check, Plus, AlertTriangle, Calendar } from 'lucide-react';
import { usePuppyVaccinations } from '@/hooks/usePuppyVaccinations';
import { LoadingState, EmptyState } from '@/components/ui/standardized';

interface VaccinationScheduleProps {
  puppyId: string;
  onAddVaccination: () => void;
}

const VaccinationSchedule: React.FC<VaccinationScheduleProps> = ({ 
  puppyId,
  onAddVaccination
}) => {
  const { 
    vaccinations, 
    isLoading, 
    error,
    addVaccination
  } = usePuppyVaccinations(puppyId);
  
  const handleMarkComplete = (vaccination: any) => {
    addVaccination({
      vaccination_type: vaccination.vaccination_type,
      vaccination_date: new Date().toISOString().split('T')[0],
      notes: vaccination.notes
    });
  };
  
  if (isLoading) {
    return <LoadingState message="Loading vaccination schedule..." />;
  }
  
  if (error) {
    return (
      <div className="text-destructive p-4">
        Error loading vaccination data: {(error as Error).message}
      </div>
    );
  }
  
  if (vaccinations.length === 0) {
    return (
      <EmptyState
        title="No Vaccinations Scheduled"
        description="No vaccinations have been scheduled for this puppy yet."
        onAction={onAddVaccination}
        actionLabel="Add Vaccination"
      />
    );
  }
  
  // Group vaccinations by status
  const overdueVaccinations = vaccinations.filter(vax => 
    !vax.is_completed && 
    new Date(vax.due_date) < new Date()
  );
  
  const upcomingVaccinations = vaccinations.filter(vax => 
    !vax.is_completed && 
    new Date(vax.due_date) >= new Date()
  );
  
  const completedVaccinations = vaccinations.filter(vax => 
    vax.is_completed
  );
  
  return (
    <Card>
      <CardContent className="p-0">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="font-semibold">Vaccination Schedule</h3>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={onAddVaccination}
          >
            <Plus className="h-4 w-4 mr-1" /> 
            Add
          </Button>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vaccination</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Overdue Vaccinations */}
              {overdueVaccinations.map((vax) => (
                <TableRow key={vax.id} className="bg-destructive/5">
                  <TableCell className="font-medium">{vax.vaccination_type}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/30 flex items-center gap-1 w-fit">
                      <AlertTriangle className="h-3 w-3" />
                      Overdue
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(vax.due_date).toLocaleDateString()}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{vax.notes}</TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" onClick={() => handleMarkComplete(vax)}>
                      <Check className="h-4 w-4 mr-1" />
                      Complete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              
              {/* Upcoming Vaccinations */}
              {upcomingVaccinations.map((vax) => (
                <TableRow key={vax.id}>
                  <TableCell className="font-medium">{vax.vaccination_type}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1 w-fit">
                      <Calendar className="h-3 w-3" />
                      Scheduled
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(vax.due_date).toLocaleDateString()}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{vax.notes}</TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="outline" onClick={() => handleMarkComplete(vax)}>
                      <Check className="h-4 w-4 mr-1" />
                      Complete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              
              {/* Completed Vaccinations */}
              {completedVaccinations.map((vax) => (
                <TableRow key={vax.id} className="bg-green-50/30">
                  <TableCell className="font-medium">{vax.vaccination_type}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1 w-fit">
                      <Check className="h-3 w-3" />
                      Complete
                    </Badge>
                  </TableCell>
                  <TableCell>{vax.vaccination_date ? new Date(vax.vaccination_date).toLocaleDateString() : 'N/A'}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{vax.notes}</TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="ghost" disabled>
                      Completed
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              
              {vaccinations.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                    No vaccinations scheduled
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default VaccinationSchedule;
