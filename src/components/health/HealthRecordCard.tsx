
import React from 'react';
import { format } from 'date-fns';
import { 
  Syringe, 
  Stethoscope, 
  Pill, 
  Scissors, 
  FileText, 
  MoreHorizontal 
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { HealthRecord } from '@/types/health-unified';

interface HealthRecordCardProps {
  record: HealthRecord;
  onView?: (record: HealthRecord) => void;
  onEdit?: (record: HealthRecord) => void;
  onDelete?: (recordId: string) => void;
}

const HealthRecordCard: React.FC<HealthRecordCardProps> = ({ 
  record, 
  onView, 
  onEdit, 
  onDelete 
}) => {
  // Get appropriate icon based on record type
  const getIcon = () => {
    switch (record.record_type) {
      case 'VACCINATION':
        return <Syringe className="h-5 w-5 text-green-500" />;
      case 'EXAMINATION':
        return <Stethoscope className="h-5 w-5 text-blue-500" />;
      case 'MEDICATION':
        return <Pill className="h-5 w-5 text-purple-500" />;
      case 'SURGERY':
        return <Scissors className="h-5 w-5 text-red-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <Card className="hover:bg-muted/50 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-1">
            {getIcon()}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <h3 className="font-medium truncate">{record.title}</h3>
              <span className="text-sm text-muted-foreground">
                {format(new Date(record.date), 'MMM d, yyyy')}
              </span>
            </div>
            
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {record.record_notes}
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
                By: {record.performed_by || record.vet_name}
              </div>
            )}
          </div>
          
          {(onView || onEdit || onDelete) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {onView && (
                  <DropdownMenuItem onClick={() => onView(record)}>
                    View
                  </DropdownMenuItem>
                )}
                {onEdit && (
                  <DropdownMenuItem onClick={() => onEdit(record)}>
                    Edit
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <DropdownMenuItem 
                    className="text-destructive"
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this record?')) {
                        onDelete(record.id);
                      }
                    }}
                  >
                    Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default HealthRecordCard;
