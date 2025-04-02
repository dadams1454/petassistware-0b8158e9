
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

interface MedicationScheduleProps {
  medications: any[];
}

const MedicationSchedule: React.FC<MedicationScheduleProps> = ({ medications }) => {
  if (!medications || medications.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Medication Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6 text-center text-muted-foreground">
            <AlertCircle className="mb-2 h-8 w-8" />
            <p>No medications currently scheduled</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Medication Schedule</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {medications.map((med, index) => (
            <div key={index} className="border-b pb-2">
              <p className="font-medium">{med.name}</p>
              <p className="text-sm text-muted-foreground">{med.schedule}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MedicationSchedule;
