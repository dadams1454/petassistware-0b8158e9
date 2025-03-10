
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
import { format } from 'date-fns';

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
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID/Name</TableHead>
            <TableHead>Birth Date</TableHead>
            <TableHead>Sex</TableHead>
            <TableHead>Color</TableHead>
            <TableHead>Birth Weight</TableHead>
            <TableHead>Current Weight</TableHead>
            <TableHead>Microchip #</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {puppies.map((puppy) => (
            <TableRow key={puppy.id}>
              <TableCell className="font-medium">
                {puppy.name || `Puppy ${puppy.id.substring(0, 4)}`}
              </TableCell>
              <TableCell>
                {puppy.birth_date ? format(new Date(puppy.birth_date), 'MMM d, yyyy') : 'N/A'}
              </TableCell>
              <TableCell>{puppy.gender || 'Unknown'}</TableCell>
              <TableCell>{puppy.color || 'Not specified'}</TableCell>
              <TableCell>{puppy.birth_weight ? `${puppy.birth_weight} oz` : 'N/A'}</TableCell>
              <TableCell>{puppy.current_weight ? `${puppy.current_weight} oz` : 'N/A'}</TableCell>
              <TableCell>{puppy.microchip_number || 'Not chipped'}</TableCell>
              <TableCell>
                <PuppyStatusBadge status={puppy.status} />
              </TableCell>
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
    </div>
  );
};

export default PuppiesTable;
