
import React from 'react';
import { format } from 'date-fns';
import { Pill, Stethoscope, Syringe, AlertCircle, Activity, FileText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { HealthRecord, HealthRecordType } from '@/types/dog';

interface HealthRecordCardProps {
  record: HealthRecord;
  onClick: () => void;
}

const HealthRecordCard: React.FC<HealthRecordCardProps> = ({ record, onClick }) => {
  const getIcon = (recordType: HealthRecordType) => {
    switch (recordType) {
      case 'vaccination':
        return <Syringe className="h-5 w-5 text-green-500" />;
      case 'examination':
        return <Stethoscope className="h-5 w-5 text-blue-500" />;
      case 'medication':
        return <Pill className="h-5 w-5 text-purple-500" />;
      case 'surgery':
        return <Activity className="h-5 w-5 text-red-500" />;
      case 'observation':
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };
  
  return (
    <Card className="hover:bg-muted/50 cursor-pointer transition-colors duration-200" onClick={onClick}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 mt-1">
            {getIcon(record.record_type)}
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <h3 className="font-medium">{record.title}</h3>
              <span className="text-sm text-muted-foreground">
                {format(new Date(record.date), 'MMM d, yyyy')}
              </span>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {record.description}
            </p>
            
            {record.next_due_date && (
              <div className="mt-2 text-sm">
                <span className="text-amber-600">
                  Next due: {format(new Date(record.next_due_date), 'MMM d, yyyy')}
                </span>
              </div>
            )}
            
            {record.performed_by && (
              <div className="mt-2 text-xs text-muted-foreground">
                Performed by: {record.performed_by}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HealthRecordCard;
