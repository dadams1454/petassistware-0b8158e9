
import React from 'react';
import { format } from 'date-fns';
import { FileText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { HealthRecordType, HealthRecordTypeEnum } from '@/types/health-enums';
import { getHealthRecordIcon } from '../utils/healthRecordUtils';

interface HealthRecordCardProps {
  record: any; // Using any for simplicity
  onClick: () => void;
}

const HealthRecordCard: React.FC<HealthRecordCardProps> = ({ record, onClick }) => {
  const getIcon = (recordType: string) => {
    // Convert the string record type to the enum value if needed
    let type = recordType.toLowerCase();
    
    // Get the appropriate icon component
    const Icon = getHealthRecordIcon(type);
    
    let iconColor = 'text-gray-500';
    
    switch (type) {
      case 'vaccination':
        iconColor = 'text-green-500';
        break;
      case 'examination':
        iconColor = 'text-blue-500';
        break;
      case 'medication':
        iconColor = 'text-purple-500';
        break;
      case 'surgery':
        iconColor = 'text-red-500';
        break;
      case 'observation':
        iconColor = 'text-amber-500';
        break;
      default:
        iconColor = 'text-gray-500';
        break;
    }
    
    return <Icon className={`h-5 w-5 ${iconColor}`} />;
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
                {format(new Date(record.visit_date || record.date), 'MMM d, yyyy')}
              </span>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {record.description || record.record_notes}
            </p>
            
            {record.next_due_date && (
              <div className="mt-2 text-sm">
                <span className="text-amber-600">
                  Next due: {format(new Date(record.next_due_date), 'MMM d, yyyy')}
                </span>
              </div>
            )}
            
            {(record.performed_by || record.vet_name) && (
              <div className="mt-2 text-xs text-muted-foreground">
                Performed by: {record.performed_by || record.vet_name}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HealthRecordCard;
