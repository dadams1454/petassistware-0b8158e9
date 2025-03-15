
import React from 'react';
import { Puppy } from '@/components/litters/puppies/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { Edit, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WelpingPuppiesTableProps {
  puppies: Puppy[];
  onRefresh: () => Promise<void>;
}

export const WelpingPuppiesTable: React.FC<WelpingPuppiesTableProps> = ({ 
  puppies,
  onRefresh
}) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Gender</TableHead>
            <TableHead>Color</TableHead>
            <TableHead>Birth Time</TableHead>
            <TableHead>Birth Weight</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {puppies.map((puppy) => (
            <TableRow key={puppy.id}>
              <TableCell className="font-medium">{puppy.id.substring(0, 6)}</TableCell>
              <TableCell>{puppy.name || 'Unnamed'}</TableCell>
              <TableCell>{puppy.gender || 'Unknown'}</TableCell>
              <TableCell>{puppy.color || 'Not specified'}</TableCell>
              <TableCell>{puppy.birth_time || 'Not recorded'}</TableCell>
              <TableCell>{puppy.birth_weight || 'Not recorded'}</TableCell>
              <TableCell className="flex gap-2">
                <Button variant="ghost" size="icon">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-destructive">
                  <Trash className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
