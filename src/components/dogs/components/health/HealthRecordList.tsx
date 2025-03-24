
import React from 'react';
import { format, isAfter, isBefore, parseISO } from 'date-fns';
import { 
  Edit, 
  Trash2, 
  Calendar, 
  Syringe, 
  Stethoscope, 
  Pill,
  Activity,
  AlertCircle,
  FileText
} from 'lucide-react';
import { 
  Card, 
  CardContent, A
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { HealthRecord } from '../../types/healthRecord';

interface HealthRecordListProps {
  records: HealthRecord[];
  onEdit: (record: HealthRecord) => void;
  onDelete: (recordId: string) => void;
}

const HealthRecordList: React.FC<HealthRecordListProps> = ({ 
  records, 
  onEdit, 
  onDelete 
}) => {
  const getRecordTypeIcon = (type: string) => {
    switch (type) {
      case 'vaccination':
        return <Syringe className="h-5 w-5" />;
      case 'examination':
        return <Stethoscope className="h-5 w-5" />;
      case 'medication':
        return <Pill className="h-5 w-5" />;
      case 'surgery':
        return <Activity className="h-5 w-5" />;
      case 'observation':
        return <AlertCircle className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const getRecordTypeColor = (type: string) => {
    switch (type) {
      case 'vaccination':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'examination':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'medication':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'surgery':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'observation':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getFormattedDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return format(parseISO(dateString), 'MMM d, yyyy');
    } catch (e) {
      return dateString;
    }
  };

  const getNextDueStatus = (nextDueDate?: string) => {
    if (!nextDueDate) return null;
    
    try {
      const dueDate = parseISO(nextDueDate);
      const today = new Date();
      
      if (isBefore(dueDate, today)) {
        return (
          <Badge variant="destructive">
            Overdue: {getFormattedDate(nextDueDate)}
          </Badge>
        );
      }
      
      const inTwoWeeks = new Date();
      inTwoWeeks.setDate(today.getDate() + 14);
      
      if (isBefore(dueDate, inTwoWeeks)) {
        return (
          <Badge variant="warning" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300">
            Due soon: {getFormattedDate(nextDueDate)}
          </Badge>
        );
      }
      
      return (
        <Badge variant="outline">
          Next due: {getFormattedDate(nextDueDate)}
        </Badge>
      );
    } catch (e) {
      return null;
    }
  };

  return (
    <div className="space-y-4">
      {records.map((record) => (
        <Card key={record.id}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <Badge className={getRecordTypeColor(record.record_type)}>
                  <span className="flex items-center gap-1">
                    {getRecordTypeIcon(record.record_type)}
                    <span className="capitalize">{record.record_type}</span>
                  </span>
                </Badge>
                <CardTitle className="text-lg">{record.title}</CardTitle>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={() => onEdit(record)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onDelete(record.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <CardDescription className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {getFormattedDate(record.visit_date)}
              {record.performed_by && ` • ${record.performed_by}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {record.description && (
              <p className="text-sm mb-2">{record.description}</p>
            )}
            {record.notes && (
              <div className="text-sm text-muted-foreground mt-2">
                <p className="font-medium">Notes:</p>
                <p>{record.notes}</p>
              </div>
            )}
          </CardContent>
          {record.next_due_date && (
            <CardFooter className="pt-0 border-t">
              <div className="flex items-center gap-2">
                {getNextDueStatus(record.next_due_date)}
              </div>
            </CardFooter>
          )}
        </Card>
      ))}
    </div>
  );
};

export default HealthRecordList;
