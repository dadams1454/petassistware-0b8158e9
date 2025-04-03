
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { MedicationInfo } from '../types/medicationTypes';
import { DogCareStatus } from '@/types/dailyCare';
import { getMedicationStatus, isComplexStatus, getStatusValue, getStatusColor } from '@/utils/medicationUtils';
import DogInfo from './DogInfo';
import MedicationStatusDisplay from './MedicationStatus';
import LastMedicationInfo from './LastMedicationInfo';
import MedicationForm from '../MedicationForm';

interface MedicationCardProps {
  dog: DogCareStatus;
  preventativeMeds: MedicationInfo[];
  otherMeds: MedicationInfo[];
  onSuccess: () => void;
}

const MedicationCard: React.FC<MedicationCardProps> = ({ 
  dog, 
  preventativeMeds,
  otherMeds,
  onSuccess
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Look for preventative medications to display status
  const heartwormMed = preventativeMeds.find(med => 
    med.name.toLowerCase().includes('heartworm')
  );
  
  const fleaTickMed = preventativeMeds.find(med => 
    med.name.toLowerCase().includes('flea') || 
    med.name.toLowerCase().includes('tick')
  );
  
  // Get status for display
  const heartwormStatus = heartwormMed 
    ? getMedicationStatus(heartwormMed)
    : { status: 'incomplete', statusColor: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300', statusLabel: 'Not Started' };
    
  const fleaTickStatus = fleaTickMed
    ? getMedicationStatus(fleaTickMed)
    : { status: 'incomplete', statusColor: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300', statusLabel: 'Not Started' };
  
  // Check if any other medications are ongoing
  const hasOtherMeds = otherMeds.length > 0;
  
  // Get most recent medication for display in footer
  const allMeds = [...preventativeMeds, ...otherMeds];
  const mostRecentMed = allMeds.length > 0 ? allMeds[0] : null;
  
  const handleMedicationLogged = () => {
    setDialogOpen(false);
    onSuccess();
  };

  return (
    <Card key={dog.dog_id} className="overflow-hidden">
      <CardContent className="p-3">
        <div className="flex items-center justify-between mb-2">
          <DogInfo 
            dogName={dog.dog_name} 
            dogPhoto={dog.dog_photo} 
            breed={dog.breed} 
          />
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="default" 
                size="sm"
                onClick={() => setDialogOpen(true)}
              >
                Log Medication
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Log Medication for {dog.dog_name}</DialogTitle>
              </DialogHeader>
              <MedicationForm 
                dogId={dog.dog_id} 
                onSuccess={handleMedicationLogged} 
                onCancel={() => setDialogOpen(false)} 
              />
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="mt-2 space-y-2 pt-2 border-t text-sm">
          <div className="flex items-center justify-between">
            <span>Heartworm Prevention:</span>
            <MedicationStatusDisplay
              status={heartwormStatus}
              statusColor={isComplexStatus(heartwormStatus) ? heartwormStatus.statusColor : getStatusColor(heartwormStatus)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <span>Flea/Tick Prevention:</span>
            <MedicationStatusDisplay
              status={fleaTickStatus}
              statusColor={isComplexStatus(fleaTickStatus) ? fleaTickStatus.statusColor : getStatusColor(fleaTickStatus)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <span>Other Medications:</span>
            <Badge className={hasOtherMeds ? 
              'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' : 
              'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'}>
              {hasOtherMeds ? `${otherMeds.length} Active` : 'None'}
            </Badge>
          </div>
        </div>
        
        {/* Show most recent medication */}
        {mostRecentMed && (
          <LastMedicationInfo
            name={mostRecentMed.name}
            lastAdministered={mostRecentMed.lastAdministered}
            frequency={mostRecentMed.frequency}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default MedicationCard;
