
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { HealthRecord } from '@/types/health';
import { formatDateForDisplay } from '@/utils/dateUtils';
import { getHealthRecordIcon, getHealthRecordColor } from '@/components/dogs/components/utils/healthRecordUtils';
import { Button } from '@/components/ui/button';
import { Edit, Trash } from 'lucide-react';

interface HealthRecordTableProps {
  records: HealthRecord[];
  onEdit?: (record: HealthRecord) => void;
  onDelete?: (id: string) => void;
  onView?: (record: HealthRecord) => void;
}

const HealthRecordTable: React.FC<HealthRecordTableProps> = ({
  records,
  onEdit,
  onDelete,
  onView
}) => {
  if (!records || records.length === 0) {
    return <p className="text-sm text-muted-foreground py-4">No health records found.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Veterinarian</TableHead>
            <TableHead>Next Due</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((record) => {
            const Icon = getHealthRecordIcon(record.record_type);
            const iconColor = getHealthRecordColor(record.record_type);
            
            return (
              <TableRow 
                key={record.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => onView && onView(record)}
              >
                <TableCell>
                  <div className="flex items-center">
                    <Icon className={`h-4 w-4 mr-1.5 ${iconColor}`} />
                    <span className="capitalize">{record.record_type}</span>
                  </div>
                </TableCell>
                <TableCell>{record.title}</TableCell>
                <TableCell>{formatDateForDisplay(record.visit_date)}</TableCell>
                <TableCell>{record.vet_name}</TableCell>
                <TableCell>
                  {record.next_due_date ? formatDateForDisplay(record.next_due_date) : '-'}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1">
                    {onEdit && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(record);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(record.id);
                        }}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default HealthRecordTable;
