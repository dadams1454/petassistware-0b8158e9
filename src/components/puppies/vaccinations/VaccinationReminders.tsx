
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Check, AlertTriangle, Bell } from 'lucide-react';
import { usePuppyVaccinationSchedule } from '@/hooks/usePuppyVaccinations';
import { useToast } from '@/hooks/use-toast';

interface VaccinationRemindersProps {
  puppyId: string;
  puppyName?: string;
}

const VaccinationReminders: React.FC<VaccinationRemindersProps> = ({ 
  puppyId,
  puppyName = 'Puppy'
}) => {
  const { 
    schedule, 
    isLoading, 
    updateVaccinationSchedule 
  } = usePuppyVaccinationSchedule(puppyId);
  const { toast } = useToast();

  // Separate scheduled vaccinations into upcoming and overdue
  const today = new Date();
  const upcomingVaccinations = schedule.filter(
    vax => !vax.administered && new Date(vax.scheduled_date) >= today
  ).sort((a, b) => new Date(a.scheduled_date).getTime() - new Date(b.scheduled_date).getTime());
  
  const overdueVaccinations = schedule.filter(
    vax => !vax.administered && new Date(vax.scheduled_date) < today
  ).sort((a, b) => new Date(b.scheduled_date).getTime() - new Date(a.scheduled_date).getTime());
  
  const completedVaccinations = schedule.filter(
    vax => vax.administered
  ).sort((a, b) => new Date(b.administered_date || b.scheduled_date).getTime() - 
                   new Date(a.administered_date || a.scheduled_date).getTime());

  const markAsComplete = async (scheduleId: string, scheduledDate: string) => {
    try {
      await updateVaccinationSchedule(scheduleId, {
        administered: true, 
        administered_date: new Date().toISOString().split('T')[0]
      });
      
      toast({
        title: "Vaccination completed",
        description: "Vaccination has been marked as completed",
      });
    } catch (error) {
      console.error("Error marking vaccination as complete:", error);
      toast({
        title: "Error",
        description: "Could not update vaccination status",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (schedule.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Calendar className="mr-2 h-5 w-5" />
            Vaccination Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-muted-foreground">
              No vaccinations scheduled yet.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <Calendar className="mr-2 h-5 w-5" />
          Vaccination Schedule for {puppyName}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {overdueVaccinations.length > 0 && (
          <div className="space-y-3">
            <h3 className="flex items-center text-sm font-semibold text-red-600 dark:text-red-400">
              <AlertTriangle className="mr-2 h-4 w-4" />
              Overdue
            </h3>
            {overdueVaccinations.map(vax => (
              <div 
                key={vax.id} 
                className="p-3 border border-red-200 rounded bg-red-50 dark:bg-red-900/10 dark:border-red-800"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-medium">{vax.vaccination_type}</span>
                    <p className="text-sm text-muted-foreground">
                      Due {formatDistanceToNow(new Date(vax.scheduled_date))} ago
                    </p>
                  </div>
                  <Button 
                    size="sm" 
                    className="h-8"
                    onClick={() => markAsComplete(vax.id, vax.scheduled_date)}
                  >
                    <Check className="mr-1 h-4 w-4" />
                    Complete
                  </Button>
                </div>
                {vax.notes && (
                  <p className="text-sm mt-2">{vax.notes}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {upcomingVaccinations.length > 0 && (
          <div className="space-y-3">
            <h3 className="flex items-center text-sm font-semibold">
              <Bell className="mr-2 h-4 w-4" />
              Upcoming
            </h3>
            {upcomingVaccinations.map(vax => (
              <div 
                key={vax.id}
                className="p-3 border rounded"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-medium">{vax.vaccination_type}</span>
                    <p className="text-sm text-muted-foreground">
                      Due in {formatDistanceToNow(new Date(vax.scheduled_date))}
                    </p>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="h-8"
                    onClick={() => markAsComplete(vax.id, vax.scheduled_date)}
                  >
                    <Check className="mr-1 h-4 w-4" />
                    Complete
                  </Button>
                </div>
                {vax.notes && (
                  <p className="text-sm mt-2">{vax.notes}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {completedVaccinations.length > 0 && (
          <div className="space-y-3">
            <h3 className="flex items-center text-sm font-semibold text-green-600 dark:text-green-400">
              <Check className="mr-2 h-4 w-4" />
              Completed
            </h3>
            <div className="border rounded divide-y">
              {completedVaccinations.map(vax => (
                <div key={vax.id} className="p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-medium">{vax.vaccination_type}</span>
                      <p className="text-sm text-muted-foreground">
                        Completed on {new Date(vax.administered_date || vax.scheduled_date).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-green-600 bg-green-50 dark:bg-green-900/10">
                      Completed
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VaccinationReminders;
