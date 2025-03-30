
import React from 'react';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import { Archive, ArchiveRestore, Edit, FileEdit, Trash, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Litter } from '@/types/litter';
import { formatDistanceToNow } from 'date-fns';

interface LitterTableViewProps {
  litters: Litter[];
  onEditLitter: (litter: Litter) => void;
  onDeleteLitter: (litter: Litter) => void;
  onArchiveLitter: (litter: Litter) => void;
  onUnarchiveLitter: (litter: Litter) => void;
}

const LitterTableView: React.FC<LitterTableViewProps> = ({
  litters,
  onEditLitter,
  onDeleteLitter,
  onArchiveLitter,
  onUnarchiveLitter
}) => {
  // Correctly format the date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch (e) {
      return 'Invalid date';
    }
  };
  
  const getTimeSince = (dateString?: string) => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (e) {
      return 'Invalid date';
    }
  };
  
  // Get badge props based on litter status
  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'active':
        return {
          variant: 'default' as const,
          label: 'Active'
        };
      case 'complete':
        return {
          variant: 'default' as const,
          label: 'Complete'
        };
      case 'planned':
        return {
          variant: 'outline' as const,
          label: 'Planned'
        };
      case 'archived':
        return {
          variant: 'secondary' as const,
          label: 'Archived'
        };
      default:
        return {
          variant: 'outline' as const,
          label: status || 'Unknown'
        };
    }
  };
  
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Litter Name</TableHead>
            <TableHead>Dam & Sire</TableHead>
            <TableHead>Birth Date</TableHead>
            <TableHead>Puppies</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {litters.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                No litters found
              </TableCell>
            </TableRow>
          ) : (
            litters.map((litter) => {
              const { variant, label } = getStatusBadge(litter.status);
              
              return (
                <TableRow key={litter.id}>
                  <TableCell className="font-medium">
                    {litter.litter_name || 'Unnamed Litter'}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="text-sm">
                        <span className="text-muted-foreground mr-1">Dam:</span> 
                        {litter.dam?.name || 'Unknown'}
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground mr-1">Sire:</span> 
                        {litter.sire?.name || 'Unknown'}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-0">
                      <div>{formatDate(litter.birth_date)}</div>
                      <div className="text-xs text-muted-foreground">
                        {getTimeSince(litter.birth_date)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1">
                        <span className="font-medium">{litter.puppy_count || 0}</span>
                        <span className="text-muted-foreground text-xs">total</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {litter.male_count || 0} male • {litter.female_count || 0} female
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={variant}>{label}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => onEditLitter(litter)}
                        title="Edit litter details"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      
                      {litter.status === 'archived' ? (
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => onUnarchiveLitter(litter)}
                          title="Unarchive litter"
                        >
                          <ArchiveRestore className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => onArchiveLitter(litter)}
                          title="Archive litter"
                        >
                          <Archive className="h-4 w-4" />
                        </Button>
                      )}
                      
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => onDeleteLitter(litter)}
                        className="text-destructive hover:text-destructive/80"
                        title="Delete litter"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default LitterTableView;
