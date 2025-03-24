
import React from 'react';
import { HealthRecord } from '@/types/health';
import { format, isAfter } from 'date-fns';
import { 
  Syringe, 
  Stethoscope, 
  Pill, 
  Scissors, 
  MessageCircle,
  MoreHorizontal,
  Edit,
  Trash 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';

interface HealthRecordsListProps {
  records: HealthRecord[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  emptyMessage?: string;
  isLoading?: boolean;
}

const HealthRecordsList: React.FC<HealthRecordsListProps> = ({
  records,
  onEdit,
  onDelete,
  emptyMessage = "No records found",
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  if (records.length === 0) {
    return <p className="text-muted-foreground text-sm py-4">{emptyMessage}</p>;
  }
  
  const getRecordIcon = (recordType: string) => {
    switch (recordType) {
      case 'vaccination':
        return <Syringe className="h-5 w-5 text-green-500" />;
      case 'examination':
        return <Stethoscope className="h-5 w-5 text-blue-500" />;
      case 'medication':
        return <Pill className="h-5 w-5 text-purple-500" />;
      case 'surgery':
        return <Scissors className="h-5 w-5 text-red-500" />;
      default:
        return <MessageCircle className="h-5 w-5 text-gray-500" />;
    }
  };
  
  return (
    <div className="space-y-3">
      {records.map((record) => {
        const isPastDue = record.next_due_date && !isAfter(new Date(record.next_due_date), new Date());
        
        return (
          <div key={record.id} className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
            <div className="mt-1">
              {getRecordIcon(record.record_type)}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex justify-between">
                <h4 className="font-medium truncate">{record.title}</h4>
                <span className="text-xs text-muted-foreground">
                  {format(new Date(record.date), 'MMM d, yyyy')}
                </span>
              </div>
              
              {record.description && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {record.description}
                </p>
              )}
              
              {record.next_due_date && (
                <p className={`text-xs mt-2 ${
                  isPastDue ? 'text-red-600 font-medium' : 'text-amber-600'
                }`}>
                  {isPastDue ? 'Past due: ' : 'Next due: '}
                  {format(new Date(record.next_due_date), 'MMM d, yyyy')}
                </p>
              )}
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(record.id)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-red-600"
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this record?')) {
                      onDelete(record.id);
                    }
                  }}
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      })}
    </div>
  );
};

export default HealthRecordsList;
