
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import PuppyStatusBadge from './PuppyStatusBadge';
import PuppyActions from './PuppyActions';

interface PuppiesTableProps {
  puppies: Puppy[];
  onEditPuppy: (puppy: Puppy) => void;
  onDeletePuppy: (puppy: Puppy) => void;
}

const PuppiesTable: React.FC<PuppiesTableProps> = ({ 
  puppies, 
  onEditPuppy, 
  onDeletePuppy 
}) => {
  if (puppies.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          No puppies have been added to this litter yet.
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID/Name</TableHead>
          <TableHead>Gender</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Microchip #</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {puppies.map((puppy) => (
          <TableRow key={puppy.id}>
            <TableCell className="font-medium">
              {puppy.name || `Puppy ${puppy.id.substring(0, 4)}`}
            </TableCell>
            <TableCell>{puppy.gender || 'Unknown'}</TableCell>
            <TableCell>
              <PuppyStatusBadge status={puppy.status} />
            </TableCell>
            <TableCell>{puppy.microchip_number || 'Not chipped'}</TableCell>
            <TableCell className="text-right">
              <PuppyActions 
                puppy={puppy} 
                onEdit={onEditPuppy} 
                onDelete={onDeletePuppy} 
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default PuppiesTable;
