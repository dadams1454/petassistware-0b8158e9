
import React from 'react';
import { format, differenceInDays } from 'date-fns';
import { Edit, Trash, Archive, Refresh, Eye } from 'lucide-react';
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
import { Litter } from '@/types/litter';
import { Link } from 'react-router-dom';

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
  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (e) {
      return dateString;
    }
  };

  const getStatusBadge = (status?: string) => {
    if (!status) return <Badge variant="outline">Active</Badge>;
    
    switch (status.toLowerCase()) {
      case 'archived':
        return <Badge variant="secondary">Archived</Badge>;
      case 'active':
        return <Badge variant="default">Active</Badge>;
      case 'planned':
        return <Badge variant="outline">Planned</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getAgeBadge = (birthDate?: string) => {
    if (!birthDate) return null;
    
    try {
      const days = differenceInDays(new Date(), new Date(birthDate));
      const weeks = Math.floor(days / 7);
      
      if (days < 0) {
        return <Badge variant="outline">Due in {Math.abs(days)} days</Badge>;
      }
      
      if (weeks < 1) {
        return <Badge variant="success" className="bg-green-100 text-green-800">{days} days</Badge>;
      }
      
      if (weeks < 8) {
        return <Badge variant="success" className="bg-green-100 text-green-800">{weeks} weeks</Badge>;
      }
      
      if (weeks < 12) {
        return <Badge variant="warning" className="bg-amber-100 text-amber-800">{weeks} weeks</Badge>;
      }
      
      return <Badge variant="destructive" className="bg-red-100 text-red-800">{weeks} weeks</Badge>;
    } catch (e) {
      return null;
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Litter Name</TableHead>
            <TableHead>Dam</TableHead>
            <TableHead>Sire</TableHead>
            <TableHead>Birth Date</TableHead>
            <TableHead>Age</TableHead>
            <TableHead>Puppies</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {litters.map((litter) => (
            <TableRow key={litter.id}>
              <TableCell className="font-medium">
                {litter.litter_name || `${litter.dam?.name || 'Unknown'} × ${litter.sire?.name || 'Unknown'}`}
              </TableCell>
              <TableCell>{litter.dam?.name || 'Unknown'}</TableCell>
              <TableCell>{litter.sire?.name || 'Unknown'}</TableCell>
              <TableCell>{formatDate(litter.birth_date)}</TableCell>
              <TableCell>{getAgeBadge(litter.birth_date)}</TableCell>
              <TableCell>
                {(litter.puppies?.length || 0) > 0 ? (
                  <Badge variant="outline" className="bg-blue-50 text-blue-800">
                    {litter.puppies?.length || '0'} puppies
                  </Badge>
                ) : (
                  <Badge variant="outline">No puppies</Badge>
                )}
              </TableCell>
              <TableCell>{getStatusBadge(litter.status)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-1">
                  <Button variant="ghost" size="icon" asChild>
                    <Link to={`/litters/${litter.id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEditLitter(litter)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  {litter.status === 'archived' ? (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onUnarchiveLitter(litter)}
                    >
                      <Refresh className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onArchiveLitter(litter)}
                    >
                      <Archive className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeleteLitter(litter)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default LitterTableView;
