
import React from 'react';
import { PlusCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import HealthRecordCard from './HealthRecordCard';
import { HealthRecord } from '@/types/health';

interface MedicationsTabContentProps {
  records: HealthRecord[];
  onAddRecord: () => void;
  onEditRecord: (record: HealthRecord) => void;
}

const MedicationsTabContent: React.FC<MedicationsTabContentProps> = ({
  records,
  onAddRecord,
  onEditRecord
}) => {
  if (records.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-6">
            <p className="text-muted-foreground">No medication records found</p>
            <Button variant="outline" className="mt-2" onClick={onAddRecord}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Medication
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {records.map(record => (
        <HealthRecordCard
          key={record.id}
          record={record}
          onClick={() => onEditRecord(record)}
        />
      ))}
    </div>
  );
};

export default MedicationsTabContent;
