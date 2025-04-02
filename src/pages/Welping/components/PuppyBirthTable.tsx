
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Puppy } from '@/types/litter';

interface PuppyBirthTableProps {
  puppies: Puppy[];
}

const PuppyBirthTable: React.FC<PuppyBirthTableProps> = ({ puppies }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Puppies Birth Records</h3>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Gender</TableHead>
            <TableHead>Color</TableHead>
            <TableHead>Weight</TableHead>
            <TableHead>Notes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {puppies.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                No puppies recorded yet
              </TableCell>
            </TableRow>
          ) : (
            puppies.map((puppy, index) => (
              <TableRow key={puppy.id}>
                <TableCell>{puppy.birth_order || index + 1}</TableCell>
                <TableCell>{puppy.birth_time || 'Not recorded'}</TableCell>
                <TableCell>{puppy.gender}</TableCell>
                <TableCell>{puppy.color}</TableCell>
                <TableCell>{puppy.birth_weight || 'Not recorded'}</TableCell>
                <TableCell className="max-w-xs truncate">{puppy.notes || '-'}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default PuppyBirthTable;
