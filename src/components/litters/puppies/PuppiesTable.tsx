
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import PuppyStatusBadge from './PuppyStatusBadge';
import PuppyActions from './PuppyActions';
import { format } from 'date-fns';
import { Dog, DollarSign } from 'lucide-react';

interface PuppiesTableProps {
  puppies: Puppy[];
  onEditPuppy: (puppy: Puppy) => void;
  onDeletePuppy: (puppy: Puppy) => void;
  onViewPuppy: (puppy: Puppy) => void;
}

const PuppiesTable: React.FC<PuppiesTableProps> = ({ 
  puppies, 
  onEditPuppy, 
  onDeletePuppy,
  onViewPuppy
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
            <TableHead>Puppy</TableHead>
            <TableHead>Details</TableHead>
            <TableHead>Weight</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {puppies.map((puppy) => (
            <TableRow key={puppy.id} className="cursor-pointer hover:bg-muted/50" onClick={() => onViewPuppy(puppy)}>
              <TableCell className="font-medium" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10 border">
                    <AvatarImage src={puppy.photo_url || ''} alt={puppy.name || ''} />
                    <AvatarFallback className="bg-muted">
                      <Dog className="h-5 w-5 text-muted-foreground" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{puppy.name || `Puppy ${puppy.id.substring(0, 4)}`}</p>
                    <p className="text-xs text-muted-foreground">{puppy.gender || 'Unknown'} • {puppy.color || 'Not specified'}</p>
                  </div>
                </div>
              </TableCell>
              
              <TableCell>
                <div className="text-sm">
                  <p>Born: {puppy.birth_date ? format(new Date(puppy.birth_date), 'MMM d, yyyy') : 'N/A'}</p>
                  {puppy.microchip_number && (
                    <p className="text-xs text-muted-foreground">
                      Microchip: {puppy.microchip_number}
                    </p>
                  )}
                </div>
              </TableCell>
              
              <TableCell>
                <div className="text-sm">
                  {puppy.birth_weight && <p>Birth: {puppy.birth_weight} oz</p>}
                  {puppy.current_weight && <p>Current: {puppy.current_weight} oz</p>}
                  {!puppy.birth_weight && !puppy.current_weight && <p>Not recorded</p>}
                </div>
              </TableCell>
              
              <TableCell>
                <div className="space-y-1">
                  <PuppyStatusBadge status={puppy.status} />
                  {puppy.sale_price && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <DollarSign className="h-3 w-3 mr-1" />
                      {puppy.sale_price}
                    </div>
                  )}
                </div>
              </TableCell>
              
              <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                <PuppyActions 
                  puppy={puppy} 
                  onEdit={onEditPuppy} 
                  onDelete={onDeletePuppy}
                  onView={onViewPuppy}
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
