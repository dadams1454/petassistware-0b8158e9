
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Calendar, Check, AlertTriangle, Clock } from 'lucide-react';
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
    upcomingVaccinations,
    completedVaccinations,
    overdueVaccinations,
    isLoading,
    markComplete
  } = usePuppyVaccinations(puppyId);
  
  if (isLoading) {
    return <LoadingState message="Loading vaccination schedule..." />;
  }
  
  if (vaccinations.length === 0) {
    return (
      <EmptyState
        title="No Vaccinations"
        description="No vaccination records found for this puppy."
        action={{
          label: "Add Vaccination",
          onClick: onAddVaccination
        }}
      />
    );
  }
  
  const renderVaccinationList = (list: any[], type: 'overdue' | 'upcoming' | 'completed') => {
    if (list.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center p-6 text-center">
          <p className="text-muted-foreground mb-2">No {type} vaccinations</p>
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        {list.map((vax) => (
          <Card key={vax.id}>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{vax.vaccination_type}</h3>
                    {type === 'overdue' && (
                      <Badge variant="destructive" className="text-xs">Overdue</Badge>
                    )}
                    {type === 'upcoming' && (
                      <Badge variant="outline" className="text-xs">Scheduled</Badge>
                    )}
                    {type === 'completed' && (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">Completed</Badge>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-3 mt-2">
                    {type === 'overdue' && (
                      <div className="text-xs flex items-center gap-1 text-destructive">
                        <AlertTriangle className="h-3 w-3" />
                        Due on {new Date(vax.due_date).toLocaleDateString()}
                      </div>
                    )}
                    
                    {type === 'upcoming' && (
                      <div className="text-xs flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        Due on {new Date(vax.due_date).toLocaleDateString()}
                      </div>
                    )}
                    
                    {type === 'completed' && (
                      <div className="text-xs flex items-center gap-1 text-muted-foreground">
                        <Check className="h-3 w-3 text-green-500" />
                        Given on {new Date(vax.vaccination_date).toLocaleDateString()}
                      </div>
                    )}
                    
                    {vax.administered_by && (
                      <div className="text-xs text-muted-foreground">
                        By: {vax.administered_by}
                      </div>
                    )}
                    
                    {vax.lot_number && (
                      <div className="text-xs text-muted-foreground">
                        Lot: {vax.lot_number}
                      </div>
                    )}
                  </div>
                  
                  {vax.notes && (
                    <p className="text-xs text-muted-foreground mt-2">{vax.notes}</p>
                  )}
                </div>
                
                {(type === 'overdue' || type === 'upcoming') && (
                  <Button
                    size="sm"
                    variant={type === 'overdue' ? 'destructive' : 'default'}
                    onClick={() => markComplete(vax.id)}
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Mark Complete
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };
  
  return (
    <Tabs defaultValue={overdueVaccinations.length > 0 ? "overdue" : "upcoming"}>
      <div className="flex justify-between items-center mb-4">
        <TabsList>
          <TabsTrigger value="overdue" disabled={overdueVaccinations.length === 0}>
            <AlertTriangle className="h-4 w-4 mr-2" />
            Overdue ({overdueVaccinations.length})
          </TabsTrigger>
          <TabsTrigger value="upcoming" disabled={upcomingVaccinations.length === 0}>
            <Calendar className="h-4 w-4 mr-2" />
            Upcoming ({upcomingVaccinations.length})
          </TabsTrigger>
          <TabsTrigger value="completed" disabled={completedVaccinations.length === 0}>
            <Check className="h-4 w-4 mr-2" />
            Completed ({completedVaccinations.length})
          </TabsTrigger>
        </TabsList>
        
        <Button size="sm" onClick={onAddVaccination}>
          <Plus className="h-4 w-4 mr-2" />
          Add Vaccination
        </Button>
      </div>
      
      <TabsContent value="overdue">
        {renderVaccinationList(overdueVaccinations, 'overdue')}
      </TabsContent>
      
      <TabsContent value="upcoming">
        {renderVaccinationList(upcomingVaccinations, 'upcoming')}
      </TabsContent>
      
      <TabsContent value="completed">
        {renderVaccinationList(completedVaccinations, 'completed')}
      </TabsContent>
    </Tabs>
  );
};

export default VaccinationSchedule;
