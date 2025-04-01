
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { KennelUnit } from '@/types/kennel';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Pencil, Trash } from 'lucide-react';

interface KennelUnitsTableProps {
  kennelUnits: KennelUnit[];
  onEdit: (kennelUnit: KennelUnit) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

const KennelUnitsTable: React.FC<KennelUnitsTableProps> = ({ kennelUnits, onEdit, onDelete, isLoading = false }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'occupied':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'cleaning':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }

  if (kennelUnits.length === 0) {
    return (
      <div className="text-center p-4">
        <p className="text-muted-foreground">No kennel units available.</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Capacity</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {kennelUnits.map((unit) => (
          <TableRow key={unit.id}>
            <TableCell className="font-medium">{unit.name}</TableCell>
            <TableCell>{unit.unit_type}</TableCell>
            <TableCell>{unit.location || 'N/A'}</TableCell>
            <TableCell>{unit.capacity}</TableCell>
            <TableCell>
              <Badge className={getStatusColor(unit.status)}>
                {unit.status.charAt(0).toUpperCase() + unit.status.slice(1)}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default KennelUnitsTable;
