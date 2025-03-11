
import React from 'react';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import PuppyStatusBadge from '@/components/litters/puppies/PuppyStatusBadge';
import PuppyActions from '@/components/litters/puppies/PuppyActions';
import { renderGenderIcon } from '@/components/litters/puppies/utils/puppyUtils';

interface WelpingPuppiesTableProps {
  puppies: Puppy[];
  onEditPuppy: (puppy: Puppy) => void;
  onDeletePuppy: (puppy: Puppy) => void;
}

const WelpingPuppiesTable: React.FC<WelpingPuppiesTableProps> = ({ 
  puppies, 
  onEditPuppy, 
  onDeletePuppy 
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Time</TableHead>
          <TableHead>ID/Color</TableHead>
          <TableHead>Gender</TableHead>
          <TableHead>Weight</TableHead>
          <TableHead>Notes</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {puppies.map((puppy, index) => (
          <TableRow key={puppy.id}>
            {/* Birth Time */}
            <TableCell className="font-medium whitespace-nowrap">
              {(puppy as any).birth_time 
                ? (puppy as any).birth_time 
                : puppy.created_at 
                  ? format(new Date(puppy.created_at), 'h:mm a') 
                  : 'Unknown'}
            </TableCell>
            
            {/* ID/Color */}
            <TableCell>
              <div className="font-medium">
                {puppy.name || `#${index + 1}`}
              </div>
              {puppy.color && (
                <div className="text-sm text-muted-foreground">{puppy.color}</div>
              )}
            </TableCell>
            
            {/* Gender */}
            <TableCell>
              <div className="flex items-center gap-1.5">
                {renderGenderIcon(puppy.gender)}
                <span>{puppy.gender || 'Unknown'}</span>
              </div>
            </TableCell>
            
            {/* Weight */}
            <TableCell>
              {puppy.birth_weight 
                ? `${puppy.birth_weight} oz` 
                : 'Not recorded'}
            </TableCell>
            
            {/* Notes */}
            <TableCell className="max-w-[200px] truncate">
              {puppy.notes || '-'}
            </TableCell>
            
            {/* Status */}
            <TableCell>
              <PuppyStatusBadge status={puppy.status} />
            </TableCell>
            
            {/* Actions */}
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

export default WelpingPuppiesTable;
