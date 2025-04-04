
import React, { useState, useEffect } from 'react';
import { format, differenceInDays } from 'date-fns';
import { Bell, Calendar, AlertTriangle, Check, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { getUpcomingMedications, getExpiringMedications, updateHealthRecord } from '@/services/healthService';
import { HealthRecord, HealthRecordTypeEnum } from '@/types/health';
import { useToast } from '@/hooks/use-toast';
import { MedicationFrequencyConstants } from '@/utils/medicationUtils';

interface MedicationTrackerProps {
  dogId?: string; // Optional: if provided, only shows medications for this dog
}

const MedicationTracker: React.FC<MedicationTrackerProps> = ({ dogId }) => {
  const [upcomingMedications, setUpcomingMedications] = useState<HealthRecord[]>([]);
  const [expiringMedications, setExpiringMedications] = useState<HealthRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchMedications = async () => {
      setIsLoading(true);
      try {
        // Fetch upcoming medications
        const medications = await getUpcomingMedications(dogId);
        setUpcomingMedications(medications);
        
        // Fetch expiring medications
        const expiring = await getExpiringMedications(dogId);
        setExpiringMedications(expiring);
      } catch (error) {
        console.error('Error fetching medications:', error);
        toast({
          title: 'Error',
          description: 'Failed to load medication data.',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchMedications();
  }, [dogId, toast]);

  const markAsAdministered = async (medication: HealthRecord) => {
    try {
      // Calculate next due date based on frequency
      const today = new Date();
      let nextDueDate = new Date();
      
      // Simple frequency handling
      const frequencyStr = medication.frequency || 'monthly';
      
      switch (frequencyStr.toLowerCase()) {
        case MedicationFrequencyConstants.DAILY.toLowerCase():
        case MedicationFrequencyConstants.ONCE_DAILY.toLowerCase():
          nextDueDate.setDate(today.getDate() + 1);
          break;
        case MedicationFrequencyConstants.TWICE_DAILY.toLowerCase():
          nextDueDate.setDate(today.getDate() + 1); // Simplified for now
          break;
        case MedicationFrequencyConstants.WEEKLY.toLowerCase():
          nextDueDate.setDate(today.getDate() + 7);
          break;
        case MedicationFrequencyConstants.BIWEEKLY.toLowerCase():
          nextDueDate.setDate(today.getDate() + 14);
          break;
        case MedicationFrequencyConstants.MONTHLY.toLowerCase():
          nextDueDate.setMonth(today.getMonth() + 1);
          break;
        case MedicationFrequencyConstants.QUARTERLY.toLowerCase():
          nextDueDate.setMonth(today.getMonth() + 3);
          break;
        case MedicationFrequencyConstants.ANNUALLY.toLowerCase():
          nextDueDate.setFullYear(today.getFullYear() + 1);
          break;
        default:
          // Default to 30 days if frequency is unknown
          nextDueDate.setDate(today.getDate() + 30);
      }

      // Update the medication record
      await updateHealthRecord(medication.id, {
        next_due_date: nextDueDate.toISOString().split('T')[0]
      });

      // Update local state
      setUpcomingMedications(prevMeds => 
        prevMeds.map(med => 
          med.id === medication.id 
            ? { ...med, next_due_date: nextDueDate.toISOString() } 
            : med
        )
      );

      toast({
        title: 'Success',
        description: `${medication.title} marked as administered.`,
        variant: 'default'
      });
    } catch (error) {
      console.error('Error updating medication:', error);
      toast({
        title: 'Error',
        description: 'Failed to update medication status.',
        variant: 'destructive'
      });
    }
  };

  const renderMedicationCard = (medication: HealthRecord) => {
    // Calculate days remaining
    const dueDate = medication.next_due_date ? new Date(medication.next_due_date) : null;
    const today = new Date();
    const daysUntilDue = dueDate ? differenceInDays(dueDate, today) : null;
    
    // Determine urgency
    let urgencyClass = 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    if (daysUntilDue !== null) {
      if (daysUntilDue < 0) {
        urgencyClass = 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      } else if (daysUntilDue <= 3) {
        urgencyClass = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      }
    }

    return (
      <Card key={medication.id} className="mb-4">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-base">{medication.title}</CardTitle>
            <Badge className={urgencyClass}>
              {daysUntilDue !== null
                ? daysUntilDue < 0
                  ? `Overdue by ${Math.abs(daysUntilDue)} day${Math.abs(daysUntilDue) !== 1 ? 's' : ''}`
                  : daysUntilDue === 0
                  ? 'Due today'
                  : `Due in ${daysUntilDue} day${daysUntilDue !== 1 ? 's' : ''}`
                : 'No due date'}
            </Badge>
          </div>
          <CardDescription>
            {medication.medication_name && (
              <span className="block">Medication: {medication.medication_name}</span>
            )}
            {medication.dosage && (
              <span className="block">
                Dosage: {medication.dosage} {medication.dosage_unit || ''}
              </span>
            )}
            {medication.frequency && (
              <span className="block">Frequency: {medication.frequency}</span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0 pb-2">
          {medication.description && <p className="text-sm text-muted-foreground">{medication.description}</p>}
          {medication.record_notes && <p className="text-sm text-muted-foreground">{medication.record_notes}</p>}
          {dogId ? null : (
            <p className="text-sm font-medium mt-2">
              For: {medication.dog_id ? 'Dog #' + medication.dog_id.substring(0, 8) : 'Unknown dog'}
            </p>
          )}
        </CardContent>
        <CardFooter className="pt-0">
          <Button 
            size="sm" 
            variant="outline" 
            className="w-full"
            onClick={() => markAsAdministered(medication)}
          >
            <Check className="h-4 w-4 mr-2" />
            Mark as Administered
          </Button>
        </CardFooter>
      </Card>
    );
  };

  const renderExpiringMedicationCard = (medication: HealthRecord) => {
    // Calculate days until expiration
    const expirationDate = medication.expiration_date ? new Date(medication.expiration_date) : null;
    const today = new Date();
    const daysUntilExpiration = expirationDate ? differenceInDays(expirationDate, today) : null;
    
    // Determine urgency
    let urgencyClass = 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    if (daysUntilExpiration !== null) {
      if (daysUntilExpiration < 0) {
        urgencyClass = 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      } else if (daysUntilExpiration <= 14) {
        urgencyClass = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      }
    }

    return (
      <Card key={medication.id} className="mb-4">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-base">{medication.title}</CardTitle>
            <Badge className={urgencyClass}>
              {daysUntilExpiration !== null
                ? daysUntilExpiration < 0
                  ? `Expired ${Math.abs(daysUntilExpiration)} day${Math.abs(daysUntilExpiration) !== 1 ? 's' : ''} ago`
                  : daysUntilExpiration === 0
                  ? 'Expires today'
                  : `Expires in ${daysUntilExpiration} day${daysUntilExpiration !== 1 ? 's' : ''}`
                : 'No expiration date'}
            </Badge>
          </div>
          <CardDescription>
            {medication.medication_name && (
              <span className="block">Medication: {medication.medication_name}</span>
            )}
            {medication.expiration_date && (
              <span className="block">
                Expires on: {format(new Date(medication.expiration_date), 'MMM d, yyyy')}
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0 pb-2">
          {medication.description && <p className="text-sm text-muted-foreground">{medication.description}</p>}
          {medication.record_notes && <p className="text-sm text-muted-foreground">{medication.record_notes}</p>}
          {dogId ? null : (
            <p className="text-sm font-medium mt-2">
              For: {medication.dog_id ? 'Dog #' + medication.dog_id.substring(0, 8) : 'Unknown dog'}
            </p>
          )}
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upcoming">
            <Clock className="h-4 w-4 mr-2" />
            Upcoming Doses
          </TabsTrigger>
          <TabsTrigger value="expiring">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Expiring Medications
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="pt-4">
          {upcomingMedications.length === 0 ? (
            <Alert>
              <Calendar className="h-4 w-4" />
              <AlertTitle>No upcoming medications</AlertTitle>
              <AlertDescription>
                There are no medications due in the next 30 days.
              </AlertDescription>
            </Alert>
          ) : (
            upcomingMedications.map(medication => renderMedicationCard(medication))
          )}
        </TabsContent>
        
        <TabsContent value="expiring" className="pt-4">
          {expiringMedications.length === 0 ? (
            <Alert>
              <Calendar className="h-4 w-4" />
              <AlertTitle>No expiring medications</AlertTitle>
              <AlertDescription>
                There are no medications expiring in the next 30 days.
              </AlertDescription>
            </Alert>
          ) : (
            expiringMedications.map(medication => renderExpiringMedicationCard(medication))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MedicationTracker;
