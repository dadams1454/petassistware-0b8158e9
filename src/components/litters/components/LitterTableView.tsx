
import React from 'react';
import { format, differenceInWeeks } from 'date-fns';
import { Eye, Edit, Trash2, Users, Archive } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface LitterTableViewProps {
  litters: Litter[];
  onEditLitter: (litter: Litter) => void;
  onDeleteLitter: (litter: Litter) => void;
  onArchiveLitter: (litter: Litter) => void;
}

const LitterTableView: React.FC<LitterTableViewProps> = ({
  litters,
  onEditLitter,
  onDeleteLitter,
  onArchiveLitter,
}) => {
  const navigate = useNavigate();

  // Separate active and archived litters
  const activeLitters = litters.filter(litter => litter.status !== 'archived');
  const archivedLitters = litters.filter(litter => litter.status === 'archived');
  
  // Combine with active litters first, then archived ones
  const sortedLitters = [...activeLitters, ...archivedLitters];

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Litter</TableHead>
            <TableHead>Parents</TableHead>
            <TableHead>Details</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedLitters.map((litter) => {
            // Calculate litter age in weeks
            const birthDate = new Date(litter.birth_date);
            const ageInWeeks = differenceInWeeks(new Date(), birthDate);
            
            // Count available puppies and get unique colors
            const availablePuppies = litter.puppies ? litter.puppies.filter(p => p.status === 'Available') : [];
            const colors = [...new Set((litter.puppies || []).map(p => p.color).filter(Boolean))];
            
            const isArchived = litter.status === 'archived';
            
            return (
              <TableRow key={litter.id} className={isArchived ? 'bg-muted/30' : ''}>
                {/* Litter Info */}
                <TableCell className="font-medium">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {litter.litter_name ? (
                        <span className="font-semibold">{litter.litter_name}</span>
                      ) : (
                        <span className="text-muted-foreground italic">Unnamed Litter</span>
                      )}
                      {isArchived && (
                        <Badge variant="outline" className="bg-muted text-muted-foreground">
                          Archived
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        Born: {format(new Date(litter.birth_date), 'MMM d, yyyy')}
                      </span>
                      <Badge variant="outline" className="bg-primary/10 text-primary">
                        {ageInWeeks} weeks
                      </Badge>
                    </div>
                  </div>
                </TableCell>
                
                {/* Parents */}
                <TableCell>
                  <div className="space-y-1.5">
                    <div className="text-sm">
                      <span className="font-medium">Dam:</span>{' '}
                      <span>{litter.dam?.name || 'Unknown'}</span>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Sire:</span>{' '}
                      <span>{litter.sire?.name || 'Unknown'}</span>
                    </div>
                  </div>
                </TableCell>
                
                {/* Details */}
                <TableCell>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-sm">
                        <span className="font-medium">Total:</span> {litter.puppies?.length || 0}{' '}
                        <span className="text-green-600 font-medium">
                          ({availablePuppies.length} available)
                        </span>
                      </span>
                    </div>
                    
                    {colors.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {colors.map((color, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {color}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </TableCell>
                
                {/* Actions */}
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/litters/${litter.id}`)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditLitter(litter)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    {!isArchived && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-amber-600 hover:text-amber-700"
                        onClick={() => onArchiveLitter(litter)}
                      >
                        <Archive className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => onDeleteLitter(litter)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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

export default LitterTableView;
