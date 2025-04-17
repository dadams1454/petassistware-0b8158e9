
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, AlarmClock, Pill } from 'lucide-react';
import { Medication } from '@/types/health';
import { UseMutateAsyncFunction } from '@tanstack/react-query';

export interface MedicationItemProps {
  medication: Medication;
  onUpdate: UseMutateAsyncFunction<Medication, Error, Medication, unknown>;
  onDelete: UseMutateAsyncFunction<void, Error, string, unknown>;
  onLogAdministration: (medicationId: string, notes: string) => Promise<void>;
  isSubmitting?: boolean;
}

const MedicationItem: React.FC<MedicationItemProps> = ({
  medication,
  onUpdate,
  onDelete,
  onLogAdministration,
  isSubmitting = false
}) => {
  const [isAdministering, setIsAdministering] = useState(false);
  const [notes, setNotes] = useState('');

  const handleLogAdministration = async () => {
    try {
      setIsAdministering(true);
      await onLogAdministration(medication.id, notes);
      setNotes('');
    } finally {
      setIsAdministering(false);
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium">{medication.name}</h3>
            <p className="text-sm text-muted-foreground">
              {medication.dosage && medication.dosage_unit
                ? `${medication.dosage} ${medication.dosage_unit}`
                : 'No dosage specified'}
              {medication.frequency && ` | ${medication.frequency}`}
            </p>
            {medication.notes && (
              <p className="text-sm mt-2">{medication.notes}</p>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => onDelete(medication.id)}
              disabled={isSubmitting}
            >
              Delete
            </Button>
            <Button 
              size="sm" 
              className="bg-green-600 hover:bg-green-700"
              onClick={handleLogAdministration}
              disabled={isSubmitting || isAdministering}
            >
              <PlusCircle className="h-4 w-4 mr-1" />
              Log
            </Button>
          </div>
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <div className="flex items-center text-sm">
            <AlarmClock className="h-4 w-4 mr-1 text-muted-foreground" />
            <span>
              {medication.nextDue 
                ? `Next: ${new Date(medication.nextDue).toLocaleString()}` 
                : 'No schedule set'}
            </span>
          </div>
          
          <div className="flex items-center text-sm">
            <Pill className="h-4 w-4 mr-1 text-muted-foreground" />
            <span>
              Status: {medication.status || 'Unknown'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MedicationItem;
