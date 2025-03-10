
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import PuppyStatusBadge from './PuppyStatusBadge';
import PuppyActions from './PuppyActions';
import { format } from 'date-fns';
import { Image, Info, Calendar } from 'lucide-react';

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
    <div className="space-y-4">
      {/* Desktop View - Table */}
      <div className="hidden md:block overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Photo</TableHead>
              <TableHead>ID/Name</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>Weights</TableHead>
              <TableHead>Identification</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {puppies.map((puppy) => (
              <TableRow key={puppy.id}>
                {/* Photo */}
                <TableCell>
                  {puppy.photo_url ? (
                    <div className="relative h-16 w-16 rounded-md overflow-hidden border">
                      <img
                        src={puppy.photo_url}
                        alt={puppy.name || 'Puppy photo'}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-16 w-16 bg-muted rounded-md">
                      <Image className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                </TableCell>
                
                {/* ID/Name */}
                <TableCell>
                  <div className="font-medium">
                    {puppy.name || `Puppy ${puppy.id.substring(0, 4)}`}
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {puppy.birth_date ? format(new Date(puppy.birth_date), 'MMM d, yyyy') : 'N/A'}
                  </div>
                </TableCell>
                
                {/* Details */}
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-sm">
                      <Badge variant={puppy.gender === 'Male' ? 'default' : 'secondary'} className="h-2 w-2 p-0 rounded-full" />
                      <span>{puppy.gender || 'Unknown'}</span>
                    </div>
                    {puppy.color && (
                      <div className="text-sm text-muted-foreground">
                        {puppy.color}
                      </div>
                    )}
                  </div>
                </TableCell>
                
                {/* Weights */}
                <TableCell>
                  <div className="space-y-1">
                    {puppy.birth_weight && (
                      <div className="text-sm">
                        <span className="text-muted-foreground">Birth:</span> {puppy.birth_weight} oz
                      </div>
                    )}
                    {puppy.current_weight && (
                      <div className="text-sm">
                        <span className="text-muted-foreground">Current:</span> {puppy.current_weight} oz
                      </div>
                    )}
                    {!puppy.birth_weight && !puppy.current_weight && (
                      <span className="text-sm text-muted-foreground">No weight data</span>
                    )}
                  </div>
                </TableCell>
                
                {/* Identification */}
                <TableCell>
                  {puppy.microchip_number ? (
                    <div className="text-sm">
                      <div className="text-muted-foreground">Microchip:</div>
                      <div className="font-mono">{puppy.microchip_number}</div>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">Not chipped</span>
                  )}
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
      </div>
      
      {/* Mobile View - Cards */}
      <div className="md:hidden space-y-4">
        {puppies.map((puppy) => (
          <Card key={puppy.id} className="overflow-hidden">
            <div className="flex items-center border-b p-4">
              {/* Photo */}
              {puppy.photo_url ? (
                <div className="relative h-16 w-16 rounded-md overflow-hidden border mr-3">
                  <img
                    src={puppy.photo_url}
                    alt={puppy.name || 'Puppy photo'}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center h-16 w-16 bg-muted rounded-md mr-3">
                  <Image className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
              
              {/* Name and Status */}
              <div className="flex-1">
                <div className="font-medium">
                  {puppy.name || `Puppy ${puppy.id.substring(0, 4)}`}
                </div>
                <div className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {puppy.birth_date ? format(new Date(puppy.birth_date), 'MMM d, yyyy') : 'N/A'}
                </div>
              </div>
              
              <PuppyStatusBadge status={puppy.status} />
            </div>
            
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Details */}
                <div>
                  <div className="flex items-center gap-1 text-sm font-medium mb-1">
                    <Info className="h-4 w-4" />
                    <span>Details</span>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-1.5">
                      <Badge variant={puppy.gender === 'Male' ? 'default' : 'secondary'} className="h-2 w-2 p-0 rounded-full" />
                      <span>{puppy.gender || 'Unknown'}</span>
                    </div>
                    {puppy.color && (
                      <div className="text-muted-foreground">
                        {puppy.color}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Weights */}
                <div>
                  <div className="text-sm font-medium mb-1">Weights</div>
                  <div className="space-y-1">
                    {puppy.birth_weight && (
                      <div className="text-sm">
                        <span className="text-muted-foreground">Birth:</span> {puppy.birth_weight} oz
                      </div>
                    )}
                    {puppy.current_weight && (
                      <div className="text-sm">
                        <span className="text-muted-foreground">Current:</span> {puppy.current_weight} oz
                      </div>
                    )}
                    {!puppy.birth_weight && !puppy.current_weight && (
                      <span className="text-sm text-muted-foreground">No weight data</span>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Identification */}
              {puppy.microchip_number && (
                <div className="mt-3 pt-3 border-t">
                  <div className="text-sm font-medium mb-1">Microchip</div>
                  <div className="text-sm font-mono">{puppy.microchip_number}</div>
                </div>
              )}
              
              {/* Actions */}
              <div className="flex justify-end mt-3 pt-3 border-t">
                <PuppyActions 
                  puppy={puppy} 
                  onEdit={onEditPuppy} 
                  onDelete={onDeletePuppy} 
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PuppiesTable;
